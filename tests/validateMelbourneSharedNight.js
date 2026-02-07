
import { getNightWindow, calculateSharedNight, getGeocentricConjunction } from '../src/utils/astronomy.js';
import { normalizeLon } from '../src/utils/astronomy.js';

async function validateMelbourne() {
    console.log('--- Validating Melbourne Shared Night (Jan 19, 2026) ---');

    // 1. Setup Melbourne
    const melbourne = { lat: -37.8136, lon: 144.9631, name: 'Melbourne' };
    const date = new Date('2026-01-19T00:00:00Z'); // Local date reference (UTC midnight)

    // Conjunction needed for night window calculation
    const conjunction = getGeocentricConjunction(date);

    // 2. Calculate Melbourne Night Window
    // Note: getNightWindow takes date and finds sunset for that *local* date.
    const melbNW = getNightWindow(melbourne.lat, melbourne.lon, date, conjunction);

    if (!melbNW) {
        console.error('Could not calc Melbourne night window');
        return;
    }

    console.log(`\nMelbourne Night Window (UTC):`);
    console.log(`Start (Sunset): ${melbNW.nightStart.toISOString()}`);
    console.log(`End (Dawn/Sunr): ${melbNW.nightEnd.toISOString()}`);

    // Calculate simple duration
    const durationHrs = (melbNW.nightEnd.getTime() - melbNW.nightStart.getTime()) / (3600 * 1000);
    console.log(`Duration: ${durationHrs.toFixed(2)} hours (Summer - Short Night)`);

    // 3. Sample Global Locations
    // We'll check points every 45 degrees longitude at different latitudes
    // Latitudes: 50N (Winter - Long Night), 0 (Equator), 50S (Summer - Short Night)
    const longitudes = [-180, -135, -90, -45, 0, 45, 90, 135, 179]; // 180/-180 seam
    const latitudes = [50, 0, -50];

    console.log('\n--- global Sampling ---');
    console.log('Lat\tLon\tRegion\t\tShared?\tColor\tOverlap(h)\tNotes');
    console.log('--------------------------------------------------------------------------------');

    for (const lat of latitudes) {
        for (const lon of longitudes) {
            // Get candidate night window
            const candNW = getNightWindow(lat, lon, date, conjunction);

            if (!candNW) {
                console.log(`${lat}\t${lon}\tN/A\t\tError`);
                continue;
            }

            // Calculate Shared Night
            const sharedRes = calculateSharedNight(melbNW, candNW);

            let color = '-';
            let region = 'Unknown';

            // Determine Region approx
            if (lon > 100 && lon < 160 && lat < 0) region = 'Aus/NZ';
            else if (lon > 90 && lat > 0) region = 'Asia';
            else if (lon > -30 && lon < 60) region = 'Eur/Afr';
            else if (lon < -30) region = 'Americas';

            // Determine Color (Yellow/Cyan) logic
            if (sharedRes.sharedNight) {
                // Logic from MoonMap.jsx:
                // Yellow (Earlier): candidate.start <= melbourne.start
                // Cyan (Later): candidate.start > melbourne.start

                const candStart = candNW.nightStart.getTime();
                const melbStart = melbNW.nightStart.getTime();

                if (candStart <= melbStart) {
                    color = 'Yellow'; // Earlier/East
                } else {
                    color = 'Cyan'; // Later/West
                }
            }

            const overlapHrs = sharedRes.overlapDuration / 60;

            console.log(
                `${lat}\t${lon}\t${region.padEnd(8)}\t` +
                `${sharedRes.sharedNight ? 'YES' : 'NO'}\t` +
                `${color.padEnd(6)}\t` +
                `${overlapHrs.toFixed(1)}\t\t` +
                `Cand Night: ${candNW.nightStart.toISOString().substr(11, 5)}-${candNW.nightEnd.toISOString().substr(11, 5)}`
            );
        }
        console.log('--------------------------------------------------------------------------------');
    }
}

validateMelbourne().catch(console.error);
