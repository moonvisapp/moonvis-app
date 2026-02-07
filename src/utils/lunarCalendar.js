import { getVisibility, getNextNewMoonConjunction, getPrevNewMoonConjunction, getNightWindow, calculateSharedNight } from './astronomy';

/**
 * Islamic month names in standard transliteration
 */
const ISLAMIC_MONTHS = [
    'Muharram',
    'Safar',
    'Rabi al-Awwal',
    'Rabi al-Thani',
    'Jumada al-Awwal',
    'Jumada al-Thani',
    'Rajab',
    'Shaban',
    'Ramadan',
    'Shawwal',
    'Dhul-Qidah',
    'Dhul-Hijjah'
];

/**
 * Simple Gregorian to Hijri conversion
 * Based on mathematical approximation algorithm
 * @param {Date} gregorianDate - Gregorian date
 * @returns {Object} { year, month, day }
 */
function gregorianToHijri(gregorianDate) {
    // Julian day calculation
    const year = gregorianDate.getFullYear();
    const month = gregorianDate.getMonth() + 1;
    const day = gregorianDate.getDate();

    let a = Math.floor((14 - month) / 12);
    let y = year + 4800 - a;
    let m = month + (12 * a) - 3;

    let jd = day + Math.floor((153 * m + 2) / 5) + (365 * y) +
        Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;

    // Convert Julian day to Hijri
    let l = jd - 1948440 + 10632;
    let n = Math.floor((l - 1) / 10631);
    l = l - 10631 * n + 354;
    let j = (Math.floor((10985 - l) / 5316)) * (Math.floor((50 * l) / 17719)) +
        (Math.floor(l / 5670)) * (Math.floor((43 * l) / 15238));
    l = l - (Math.floor((30 - j) / 15)) * (Math.floor((17719 * j) / 50)) -
        (Math.floor(j / 16)) * (Math.floor((15238 * j) / 43)) + 29;

    const hijriMonth = Math.floor((24 * l) / 709);
    const hijriDay = l - Math.floor((709 * hijriMonth) / 24);
    const hijriYear = 30 * n + j - 30;

    return { year: hijriYear, month: hijriMonth, day: hijriDay };
}

/**
 * Get Islamic month name for a Gregorian date
 * @param {Date} gregorianDate - Gregorian date
 * @returns {string} Islamic month name
 */
export function getIslamicMonthName(gregorianDate) {
    try {
        const hijriDate = gregorianToHijri(gregorianDate);
        const monthIndex = hijriDate.month - 1; // Convert to 0-indexed

        return ISLAMIC_MONTHS[monthIndex] || 'Unknown';
    } catch (error) {
        console.error('Error converting to Hijri date:', error);
        return 'Unknown';
    }
}

/**
 * Get Islamic year for a Gregorian date
 * @param {Date} gregorianDate - Gregorian date
 * @returns {string} Islamic year
 */
export function getHijriYear(gregorianDate) {
    try {
        // Use standard Intl API for Islamic calendar year
        // We use 'islamic-umalqura' as it is a common standard, though app calculations are astronomical
        const formatter = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura', {
            year: 'numeric'
        });

        const parts = formatter.formatToParts(gregorianDate);
        const yearPart = parts.find(part => part.type === 'year');

        return yearPart ? yearPart.value : '';
    } catch (error) {
        console.error('Error getting Hijri year:', error);
        return '';
    }
}

/**
 * Check if moon is directly visible at a location (C, B, or A classification)
 * @param {Date} date - Date to check
 * @param {Object} location - Location with lat and lon properties
 * @param {Date} conjunctionTime - Pre-computed conjunction time for performance
 * @returns {Object} { visible: boolean, classification: string }
 */
export function checkDirectVisibility(date, location, conjunctionTime) {
    try {
        const { lat, lon } = location;
        const visibility = getVisibility(date, lat, lon, 'odeh', conjunctionTime);

        // Check if classification is C, B, or A
        const isVisible = visibility.code === 'VO' ||
            visibility.code === 'VP' ||
            visibility.code === 'EV';

        return {
            visible: isVisible,
            classification: visibility.code,
            details: visibility
        };
    } catch (error) {
        console.error('Error checking direct visibility:', error);
        return { visible: false, classification: 'Unknown', details: null };
    }
}

/**
 * Generate visibility grid for a given date
 * @param {Date} date - Date to generate grid for
 * @param {Date} conjunctionTime - Pre-computed conjunction time
 * @param {number} stepLat - Latitude step size (default: 2)
 * @param {number} stepLon - Longitude step size (default: 3)
 * @returns {Array} Array of grid cells with visibility data
 */
// generateVisibilityGrid function removed as it is now inlined and optimized within checkSharedNightVisibility
// to prevent calculating visibility for cells that don't share the night.

/**
 * Check if moon is visible via Shared Night inheritance (Parallelized)
 * @param {Date} date - Date to check
 * @param {Object} location - Location with lat and lon properties
 * @param {Date} conjunctionTime - Pre-computed conjunction time
 * @param {Array} workers - Pool of Web Workers
 * @returns {Object} { visible: boolean, inheritedFromCells: Array }
 */
export async function checkSharedNightVisibility(date, location, conjunctionTime, workers) {
    try {
        // Get night window for user's location FIRST
        const userNightWindow = getNightWindow(location.lat, location.lon, date, conjunctionTime);

        if (!userNightWindow) {
            return { visible: false, inheritedFromCells: [] };
        }

        if (!workers || workers.length === 0) {
            console.warn('[checkSharedNightVisibility] No workers available, skipping shared night check');
            return { visible: false, inheritedFromCells: [] };
        }

        // Divide the world (Lat -60 to 60) into chunks for each worker
        // Total range: 120 degrees
        const minLat = -60;
        const maxLat = 60;
        const totalRange = maxLat - minLat;
        const rangePerWorker = totalRange / workers.length;

        const workerPromises = workers.map((worker, index) => {
            const latStart = minLat + (index * rangePerWorker);
            const latEnd = Math.min(maxLat, latStart + rangePerWorker); // overlapping edge is fine, or subtract small epsilon

            return new Promise((resolve, reject) => {
                const workId = `shared_search_${date.getTime()}_${index}`;

                const handleMessage = (e) => {
                    const { workId: returnedId, status, data, error } = e.data;
                    if (returnedId !== workId) return; // Ignore stale messages

                    worker.removeEventListener('message', handleMessage); // Cleanup listener

                    if (status === 'success') {
                        resolve(data);
                    } else {
                        console.error('Worker error:', error);
                        resolve([]); // resolve empty on error to keep other workers going
                    }
                };

                worker.addEventListener('message', handleMessage);

                worker.postMessage({
                    type: 'search_shared',
                    dateStr: date.toISOString(),
                    workId,
                    params: {
                        latStart,
                        latEnd,
                        userNightStart: userNightWindow.nightStart.getTime(),
                        userNightEnd: userNightWindow.nightEnd.getTime()
                    }
                });
            });
        });

        // Wait for all workers to finish their band scan
        const results = await Promise.all(workerPromises);

        // Combine all found cells
        const inheritedFromCells = results.flat();

        return {
            visible: inheritedFromCells.length > 0,
            inheritedFromCells
        };
    } catch (error) {
        console.error('Error checking Shared Night visibility:', error);
        return { visible: false, inheritedFromCells: [] };
    }
}

/**
 * Find Night 1 of a lunar month starting from conjunction date
 */
export async function findNight1(conjunctionDate, location, workers) {
    // Wrapper for backward compatibility if called without progress
    return findNight1WithProgress(conjunctionDate, location, null, () => false, workers);
}

/**
 * Calculate lunar calendar for a given location
 * @param {Date} startDate - Starting date
 * @param {Object} location - Location with lat, lon, and name properties
 * @param {number} numMonths - Number of lunar months to generate (default: 12)
 * @param {Function} onProgress - Optional callback for progress updates (receives completed month count and total months)
 * @returns {Promise<Object>} Promise resolving to { months: Array, location: Object }
 */
export async function calculateLunarCalendar(startDate, location, numMonths = 2, onProgress = null, shouldCancel = () => false) {
    const months = [];
    let currentDate = new Date(startDate);
    const ESTIMATED_DAYS_PER_MONTH = 30;

    // --- WORKER POOL INITIALIZATION ---
    // Determine concurrency: Use hardware concurrency or default to 4, clamped 4-16
    const concurrency = Math.max(4, Math.min(16, navigator.hardwareConcurrency || 4));
    console.log(`[LunarCalendar] Initializing worker pool with ${concurrency} workers`);

    const workers = [];
    try {
        for (let i = 0; i < concurrency; i++) {
            workers.push(new Worker(new URL('../workers/mapCalculation.worker.js', import.meta.url), { type: 'module' }));
        }
    } catch (err) {
        console.error('Failed to initialize workers:', err);
        // Fallback to empty array? Logic handles it by skipping shared night.
        // Ideally should have fallback synchronous logic but for now logging error.
    }

    try {
        for (let monthIndex = 0; monthIndex < numMonths; monthIndex++) {
            // Check for cancellation
            if (shouldCancel()) {
                console.log('Calculation cancelled by user');
                return null;
            }
            // Report start of month calculation
            if (onProgress) {
                const baseProgress = monthIndex / numMonths;
                onProgress(baseProgress * 100, 100);
            }

            // Find next conjunction from current date to advance through months
            const conjunction = getNextNewMoonConjunction(currentDate);

            if (!conjunction) {
                console.error('Failed to find conjunction for date:', currentDate);
                break;
            }

            // Find Night 1 for this lunar month - this is the slow part
            // We'll add progress callbacks during the search
            const night1Result = await findNight1WithProgress(
                conjunction,
                location,
                (dayIndex) => {
                    if (onProgress) {
                        // Calculate sub-progress within this month
                        const baseProgress = monthIndex / numMonths;
                        const monthProgress = (dayIndex / ESTIMATED_DAYS_PER_MONTH) * (1 / numMonths) * 0.5;
                        onProgress((baseProgress + monthProgress) * 100, 100);
                    }
                },
                shouldCancel,
                workers // PASS THE WORKER POOL
            );

            if (!night1Result) {
                // Check if failure was due to cancellation
                if (shouldCancel()) {
                    console.log('Calculation cancelled during Night 1 search');
                    return null;
                }
                console.error('Failed to find Night 1 for conjunction:', conjunction);
                break;
            }

            const night1Date = night1Result.night1Date;

            // Find next conjunction to determine month end
            const nextConjunction = getNextNewMoonConjunction(
                new Date(conjunction.getTime() + 24 * 60 * 60 * 1000) // Start from day after conjunction
            );

            if (!nextConjunction) {
                console.error('Failed to find next conjunction');
                break;
            }

            // Generate all days in this lunar month
            const days = [];
            let dayDate = new Date(night1Date);
            let nightNumber = 1;

            while (dayDate < nextConjunction) {
                days.push({
                    nightNumber,
                    gregorianDate: new Date(dayDate),
                    gregorianDateString: dayDate.toISOString().split('T')[0]
                });

                dayDate.setDate(dayDate.getDate() + 1);
                nightNumber++;
            }

            // Determine Islamic month name based on full moon date (day 14-15)
            const fullMoonIndex = Math.min(13, days.length - 1); // Day 14 (0-indexed)
            const fullMoonDate = days[fullMoonIndex]?.gregorianDate || night1Date;
            const islamicMonthName = getIslamicMonthName(fullMoonDate);

            months.push({
                monthName: islamicMonthName,
                conjunctionDate: conjunction,
                night1Date,
                night1Method: night1Result.method,
                night1Details: night1Result,
                nextConjunctionDate: nextConjunction,
                days
            });

            // Report progress after month is complete
            if (onProgress) {
                const percentage = ((monthIndex + 1) / numMonths) * 100;
                onProgress(percentage, 100);
            }

            // Allow UI to update by yielding control briefly
            await new Promise(resolve => setTimeout(resolve, 0)); // Reduced from 10ms

            // Set current date to next conjunction for next iteration
            currentDate = new Date(nextConjunction);
        }

        return {
            months,
            location,
            generatedAt: new Date()
        };
    } finally {
        // TERMINATE WORKERS
        console.log('[LunarCalendar] Terminating worker pool');
        workers.forEach(w => w.terminate());
    }
}

/**
 * Find Night 1 with progress reporting
 */
async function findNight1WithProgress(conjunctionDate, location, onDayProgress = null, shouldCancel = () => false, workers = []) {
    const MAX_ITERATIONS = 35;
    let currentDate = new Date(conjunctionDate);

    console.log(`[findNight1] Starting search from conjunction: ${conjunctionDate.toISOString()}`);
    console.log(`[findNight1] Location: ${location.name} (${location.lat}, ${location.lon})`);

    for (let i = 0; i < MAX_ITERATIONS; i++) {
        // Check cancellation
        if (shouldCancel()) return null;

        // Report progress for this day
        if (onDayProgress) {
            onDayProgress(i);
            // We can reduce/remove delay here since work is now off-main-thread
            await new Promise(resolve => setTimeout(resolve, 0));
        }

        currentDate.setUTCHours(0, 0, 0, 0);

        console.log(`[findNight1] Day ${i}: Checking ${currentDate.toISOString().split('T')[0]}`);

        // Check direct visibility first
        const directVisibility = checkDirectVisibility(currentDate, location, conjunctionDate);
        console.log(`[findNight1]   Direct visibility: ${directVisibility.visible} (${directVisibility.classification})`);

        if (directVisibility.visible) {
            console.log(`[findNight1] ✓ Found Night 1 via direct visibility on ${currentDate.toDateString()}`);
            return {
                night1Date: new Date(currentDate),
                method: 'direct',
                classification: directVisibility.classification
            };
        }

        // If not directly visible, check Shared Night criteria
        // NOW ASYNC/PARALLEL
        const sharedNightVisibility = await checkSharedNightVisibility(currentDate, location, conjunctionDate, workers);
        console.log(`[findNight1]   Shared Night visibility: ${sharedNightVisibility.visible}`);

        if (sharedNightVisibility.visible) {
            console.log(`[findNight1] ✓ Found Night 1 via Shared Night on ${currentDate.toDateString()}`);
            console.log(`[findNight1]   Inherited from ${sharedNightVisibility.inheritedFromCells.length} cells`);
            return {
                night1Date: new Date(currentDate),
                method: 'shared_night',
                inheritedFromCells: sharedNightVisibility.inheritedFromCells
            };
        }

        // Move to next day
        currentDate.setDate(currentDate.getDate() + 1);
    }

    console.error('[findNight1] ✗ Failed to find Night 1 after', MAX_ITERATIONS, 'iterations');
    return null;
}
