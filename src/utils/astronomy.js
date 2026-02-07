/**
 * Moon Visibility Calculations
 * 
 * Implements the lunar visibility criterion described by Mohammad Odeh (2006).
 * This implementation is based on the scientific algorithms published in:
 * "New Criterion for Lunar Crescent Visibility", Experimental Astronomy, 18, 39-64.
 * 
 */
import * as Astronomy from 'astronomy-engine';

/**
 * Normalize longitude to [-180, +180) range.
 * Ensures +180 maps to -180 to avoid duplication at the seam.
 */
export function normalizeLon(lon) {
    // Normalize to [-180, 180)
    let normalized = ((lon + 180) % 360) - 180;
    if (normalized < -180) normalized += 360;
    if (normalized >= 180) normalized -= 360;
    return normalized;
}

/**
 * Get deterministic longitude-based timezone offset in hours.
 * tz_hours = round(lon / 15)
 */
export function getLongitudeBasedTimezone(lon) {
    // For halves like -0.5, Math.round returns 0.
    // We want -7.5 to round to -1, which is round(-0.5) -> -1.
    // Standard Math.round(-0.5) is 0 in JS.
    // A trick is to use Math.round(x - 0.0000001) for negatives? 
    // Or just use Math.floor(lon / 15 + 0.5) which rounds 0.5 up.
    // Wait, Math.floor(-0.5 + 0.5) = 0.
    // We want:
    // 7.5 / 15 = 0.5 -> 1
    // -7.5 / 15 = -0.5 -> -1
    return Math.sign(lon) * Math.round(Math.abs(lon) / 15);
}

/**
 * Find the New Moon conjunction date before the given date.
 */
export function getPrevNewMoonConjunction(date) {
    const time = new Astronomy.AstroTime(date);
    const nm = Astronomy.SearchMoonPhase(0, time, -40);
    return nm ? nm.date : null;
}

/**
 * Find the New Moon conjunction date after the given date.
 */
export function getNextNewMoonConjunction(date) {
    const time = new Astronomy.AstroTime(date);
    const nm = Astronomy.SearchMoonPhase(0, time, 40);
    return nm ? nm.date : null;
}

/**
 * Find the Next Full Moon date after the given date.
 * Returns a JS Date object (which has the UTC timestamp).
 * 
 * Calculated Topocentrically for the observer's location.
 * @param {Date} date - Start date
 * @param {number} lat - Latitude in degrees (default 0)
 * @param {number} lon - Longitude in degrees (default 0)
 */
export function getNextFullMoon(date, lat = 0, lon = 0) {
    const time = new Astronomy.AstroTime(date);
    const observer = new Astronomy.Observer(lat, lon, 0);
    const fm = Astronomy.SearchMoonPhase(180, time, 40, observer); // 180 degrees is Full Moon
    return fm ? fm.date : null;
}

/**
 * Get geocentric conjunction (new moon) time near the given date.
 * This is used as a reference for the conjunction rule check.
 * For visibility purposes, geocentric is sufficient as topocentric
 * conjunction is within minutes of geocentric for most locations.
 * 
 * Searches bidirectionally and returns the nearest conjunction to the given date.
 */
export function getGeocentricConjunction(date) {
    try {
        const time = new Astronomy.AstroTime(date);

        // Search both forward and backward to find the nearest conjunction
        // ±20 days is sufficient since lunar months are ~29.53 days
        // (max distance to nearest conjunction is ~14.75 days)
        const prevConjunction = Astronomy.SearchMoonPhase(0, time, -20);
        const nextConjunction = Astronomy.SearchMoonPhase(0, time, 20);

        // Handle edge cases
        if (!prevConjunction && !nextConjunction) return null;
        if (!prevConjunction) return nextConjunction.date;
        if (!nextConjunction) return prevConjunction.date;

        // Return whichever conjunction is closer to the input date
        const dateMs = date.getTime();
        const prevDiff = Math.abs(dateMs - prevConjunction.date.getTime());
        const nextDiff = Math.abs(nextConjunction.date.getTime() - dateMs);

        return prevDiff < nextDiff ? prevConjunction.date : nextConjunction.date;
    } catch (err) {
        console.error('Error finding geocentric conjunction:', err);
        return null;
    }
}

/**
 * Find when astronomical twilight ends (sun reaches -18° below horizon).
 * This defines the end of the night window.
 * 
 * @param {Astronomy.Observer} observer - Observer location
 * @param {Date} sunsetTime - The sunset time
 * @returns {Date|null} Time when sun reaches -18° altitude, or null if not found
 */
export function getAstronomicalTwilightEnd(observer, sunsetTime) {
    try {
        // Search for when sun reaches -18° altitude after sunset
        // Astronomical twilight is when sun is between -12° and -18° below horizon
        const sunsetAstroTime = new Astronomy.AstroTime(sunsetTime);

        // Search up to 12 hours after sunset
        // (at high latitudes, twilight can last longer, but we need to avoid finding next day's crossing)
        const result = Astronomy.SearchAltitude('Sun', observer, -1, sunsetAstroTime, 12, -18);

        if (!result) {
            return null; // Sun doesn't reach -18° (high latitude summer)
        }

        // Validate: the result should be BEFORE sunrise to be valid twilight end
        // Find sunrise to check
        const sunriseResult = Astronomy.SearchRiseSet('Sun', observer, 1, sunsetTime, 1);
        if (sunriseResult && result.date > sunriseResult.date) {
            // The -18° crossing is AFTER sunrise, meaning it's the next day's crossing
            // The sun never reached -18° during this night
            return null;
        }

        return result.date;
    } catch (err) {
        console.error('Error calculating astronomical twilight end:', err);
        return null;
    }
}

/**
 * Get the night window for a location on a given date.
 * Night window = [sunset, astronomical twilight end)
 * 
 * @param {number} lat - Latitude in degrees
 * @param {number} lon - Longitude in degrees
 * @param {Date} date - Reference date
 * @param {Date} knownSunset - Optional pre-calculated sunset time (UTC)
 * @returns {Object|null} { nightStart: Date, nightEnd: Date, lat, lon } or null
 */
export function getNightWindow(lat, lon, date, conjunctionTime = null, knownSunset = null) {
    try {
        lon = normalizeLon(lon);
        const observer = new Astronomy.Observer(lat, lon, 0);

        // Get local timezone for this longitude
        const tzHours = getLongitudeBasedTimezone(lon);

        let sunsetTime;

        if (knownSunset) {
            sunsetTime = knownSunset;
        } else {
            // Find sunset (reusing logic from getVisibility)
            // The input 'date' represents a local calendar date (e.g., "Jan 15").
            // We want to find the sunset on the EVENING of Jan 15 in local time.
            const hoursToLocalNoon = 12 - tzHours;
            const localNoonUTC = new Date(date.getTime() + hoursToLocalNoon * 3600 * 1000);
            const searchStartTime = new Astronomy.AstroTime(localNoonUTC);

            const sunsetResult = Astronomy.SearchRiseSet('Sun', observer, -1, searchStartTime, 1);
            if (!sunsetResult) {
                return null; // No sunset (polar regions)
            }
            sunsetTime = sunsetResult.date;
        }

        // Find astronomical twilight end
        const twilightEnd = getAstronomicalTwilightEnd(observer, sunsetTime);
        if (!twilightEnd) {
            // Astronomical twilight doesn't end (sun doesn't reach -18°)
            // This happens at high latitudes in summer
            // Use sunrise as approximation, but search within same night only
            const sunriseResult = Astronomy.SearchRiseSet('Sun', observer, 1, sunsetTime, 1);
            if (!sunriseResult) {
                return null; // Polar night/day
            }

            // Validate: sunrise should be within ~18 hours of sunset for a normal night
            // If it's more than 20 hours, something is wrong with the calculation
            const nightDuration = (sunriseResult.date - sunsetTime) / (1000 * 60 * 60);
            if (nightDuration > 20) {
                console.warn(`Unusually long night at ${lat},${lon}: ${nightDuration.toFixed(2)} hours`);
                // In this case, twilight likely exists but SearchAltitude failed
                // Use a reasonable estimate: sunset + 12 hours
                return {
                    nightStart: sunsetTime,
                    nightEnd: new Date(sunsetTime.getTime() + 12 * 3600 * 1000),
                    lat,
                    lon
                };
            }

            // Use sunrise as night end
            return {
                nightStart: sunsetTime,
                nightEnd: sunriseResult.date,
                lat,
                lon
            };
        }

        return {
            nightStart: sunsetTime,
            nightEnd: twilightEnd,
            lat,
            lon
        };
    } catch (err) {
        console.error(`Error calculating night window at ${lat},${lon}:`, err);
        return null;
    }
}

/**
 * Calculate if two cells share the night.
 * Two cells share the night if their night windows overlap by any positive duration.
 * 
 * Efficient implementation: O(1) comparison
 * 
 * @param {Object} cellA - Cell with nightStart and nightEnd (Date objects)
 * @param {Object} cellB - Cell with nightStart and nightEnd (Date objects)
 * @returns {Object} { sharedNight: boolean, overlapDuration: number (minutes) }
 */
export function calculateSharedNight(cellA, cellB) {
    // Handle null or missing night windows
    if (!cellA || !cellB || !cellA.nightStart || !cellA.nightEnd ||
        !cellB.nightStart || !cellB.nightEnd) {
        return { sharedNight: false, overlapDuration: 0 };
    }

    // Convert to timestamps for comparison
    const A_start = cellA.nightStart.getTime();
    const A_end = cellA.nightEnd.getTime();
    const B_start = cellB.nightStart.getTime();
    const B_end = cellB.nightEnd.getTime();

    // Calculate overlap using the spec formula:
    // overlap_start = max(A_start, B_start)
    // overlap_end = min(A_end, B_end)
    // If overlap_start < overlap_end, they share the night
    const overlap_start = Math.max(A_start, B_start);
    const overlap_end = Math.min(A_end, B_end);

    if (overlap_start < overlap_end) {
        const overlapDuration = (overlap_end - overlap_start) / (1000 * 60); // minutes
        return { sharedNight: true, overlapDuration };
    }

    return { sharedNight: false, overlapDuration: 0 };
}

/**
 * Calculate visibility using Odeh criterion.
 * 
 * @param {Date} date - Reference date (interpreted as local date at the longitude)
 * @param {number} lat - Latitude in degrees
 * @param {number} lon - Longitude in degrees [-180, +180)
 * @param {string} algorithm - Algorithm name (currently only 'odeh' supported)
 * @param {Date} conjunctionTime - Pre-computed conjunction time (optional, for performance)
 * @returns {Object} Visibility result with visibility zones
 */
export function getVisibility(date, lat, lon, algorithm = 'odeh', conjunctionTime = null) {
    try {
        // Normalize longitude to [-180, +180)
        lon = normalizeLon(lon);

        const observer = new Astronomy.Observer(lat, lon, 0);

        // 1. Compute longitude-based timezone
        const tzHours = getLongitudeBasedTimezone(lon);

        // 2. Interpret date as local date at this location
        // Convert input date (assumed UTC midnight) to local midnight
        const localMidnight = new Date(date.getTime() - tzHours * 3600 * 1000);

        // 3. Search for sunset starting from local noon of the given date
        const localNoon = new Date(localMidnight.getTime() + 12 * 3600 * 1000);
        const searchStartTime = new Astronomy.AstroTime(localNoon);

        // Find sunset (sun setting)
        const sunsetResult = Astronomy.SearchRiseSet('Sun', observer, -1, searchStartTime, 1);
        if (!sunsetResult) {
            return {
                code: 'U',
                value: null,
                reason: 'No sunset found'
            };
        }

        const sunsetTime = sunsetResult.date;

        // Find moonset after sunset (within next 24 hours)
        const moonsetResult = Astronomy.SearchRiseSet('Moon', observer, -1, sunsetTime, 2);
        if (!moonsetResult) {
            return {
                code: 'U',
                value: null,
                reason: 'No moonset found'
            };
        }

        const moonsetTime = moonsetResult.date;

        // 4. Calculate lag in minutes
        const lagMinutes = (moonsetTime.getTime() - sunsetTime.getTime()) / (1000 * 60);

        // If moon sets before or at sunset → Impossible (red)
        if (lagMinutes <= 0) {
            return {
                code: 'I',
                value: null,
                reason: 'Moon sets before or at sunset',
                lat,
                lon,
                tzHours,
                sunsetUTC: sunsetTime,
                moonsetUTC: moonsetTime,
                sunsetLocal: new Date(sunsetTime.getTime() + tzHours * 3600 * 1000),
                moonsetLocal: new Date(moonsetTime.getTime() + tzHours * 3600 * 1000),
                lag: lagMinutes
            };
        }


        // 5. Check conjunction rule (using pre-computed conjunction time passed as parameter)
        let conjunctionTriggered = false;

        if (conjunctionTime && conjunctionTime.getTime() > sunsetTime.getTime()) {
            // Check if conjunction is on the same "evening" (before next sunrise)
            const nextSunrise = Astronomy.SearchRiseSet('Sun', observer, 1, sunsetTime, 2);
            if (!nextSunrise || conjunctionTime.getTime() < nextSunrise.date.getTime()) {
                conjunctionTriggered = true;
                return {
                    code: 'I',
                    value: null,
                    reason: 'Conjunction occurs after sunset',
                    lat,
                    lon,
                    tzHours,
                    sunsetUTC: sunsetTime,
                    moonsetUTC: moonsetTime,
                    sunsetLocal: new Date(sunsetTime.getTime() + tzHours * 3600 * 1000),
                    moonsetLocal: new Date(moonsetTime.getTime() + tzHours * 3600 * 1000),
                    conjunctionTime,
                    conjunctionTriggered: true,
                    lag: lagMinutes
                };
            }
        }

        // 6. Calculate best time: Tb = Ts + (4/9) * Lag
        const bestTimeDate = new Date(sunsetTime.getTime() + (lagMinutes * (4 / 9)) * 60 * 1000);
        const bestTime = new Astronomy.AstroTime(bestTimeDate);

        // 7. Calculate topocentric positions at best time (NO REFRACTION - airless altitudes)
        const moonEquator = Astronomy.Equator('Moon', bestTime, observer, true, true);
        const sunEquator = Astronomy.Equator('Sun', bestTime, observer, true, true);

        // Convert to horizontal coordinates WITHOUT refraction
        const moonHorizon = Astronomy.Horizon(bestTime, observer, moonEquator.ra, moonEquator.dec, 0); // refraction=0
        const sunHorizon = Astronomy.Horizon(bestTime, observer, sunEquator.ra, sunEquator.dec, 0); // refraction=0

        // 8. Calculate ARCV (topocentric, airless altitude difference in degrees)
        const ARCV = moonHorizon.altitude - sunHorizon.altitude;

        // 9. Calculate W (crescent width in arcminutes)
        const elongationResult = Astronomy.Elongation('Moon', bestTime);
        const arcl = elongationResult.elongation; // degrees

        const moonDistVec = Astronomy.GeoVector('Moon', bestTime, true);
        const moonDistAU = moonDistVec.Length();
        const MOON_RADIUS_KM = 1737.4;
        const AU_KM = 149597870.7;

        // Semi-diameter of moon in arcminutes
        const sdMoon = (MOON_RADIUS_KM / (moonDistAU * AU_KM)) * (180 / Math.PI) * 60;

        // Crescent width in arcminutes
        const W = sdMoon * (1 - Math.cos(arcl * Math.PI / 180));

        // 10. Calculate V using the formula from Odeh (2006)
        // Reference: Odeh, M. (2006). New Criterion for Lunar Crescent Visibility. Experimental Astronomy, 18, 39-64.
        // V = ARCV - (-0.1018*W³ + 0.7319*W² - 6.3226*W + 7.1651)
        // where ARCV is in degrees and W is in arcminutes
        const odehLimit = -0.1018 * Math.pow(W, 3) + 0.7319 * Math.pow(W, 2) - 6.3226 * W + 7.1651;
        const V = ARCV - odehLimit;

        // 11. Map to visibility zones
        let code, zoneName;

        if (V >= 5.65) {
            code = 'EV';
            zoneName = 'Easily Visible';
        } else if (V >= 2) {
            code = 'VP';
            zoneName = 'Visible Under Perfect Conditions';
        } else if (V >= -0.96) {
            code = 'VO';
            zoneName = 'Visible With Optical Aid';
        } else {
            code = 'NV';
            zoneName = 'Not Visible';
        }

        return {
            code,
            value: V,
            zoneName,
            algorithm: 'odeh-criterion',
            lat,
            lon,
            tzHours,
            localDate: new Date(localMidnight.getTime()),
            sunsetUTC: sunsetTime,
            moonsetUTC: moonsetTime,
            bestTimeUTC: bestTimeDate,
            sunsetLocal: new Date(sunsetTime.getTime() + tzHours * 3600 * 1000),
            moonsetLocal: new Date(moonsetTime.getTime() + tzHours * 3600 * 1000),
            bestTimeLocal: new Date(bestTimeDate.getTime() + tzHours * 3600 * 1000),
            conjunctionTime,
            conjunctionTriggered,
            arcv: ARCV,
            w: W,
            lag: lagMinutes,
            arcl,
            sdMoon,
            nightStart: sunsetTime,
            nightEnd: null // Can add sunrise if needed
        };

    } catch (err) {
        console.error(`Error calculating visibility at ${lat},${lon}:`, err);
        return {
            code: 'U',
            value: null,
            reason: err.message,
            lat,
            lon
        };
    }
}
