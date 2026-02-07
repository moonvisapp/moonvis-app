
import { getVisibility, getNightWindow, calculateSharedNight, getGeocentricConjunction } from '../src/utils/astronomy.js';

async function runTest() {
    console.log('--- Verifying Shared Night Logic ---');

    // Scenario:
    // User: London (approx 51.5 N, 0.1 W)
    // Candidate 1 (West): New York (40.7 N, 74.0 W) - Should be valid if visible & overlap & time ok
    // Candidate 2 (East): Tokyo (35.7 N, 139.7 E)   - Should be valid if visible & overlap & time ok

    const date = new Date('2026-02-17T00:00:00Z'); // Start of day for reference
    // Actually let's pick a date where we know visibility is tricky or we can simulate it.
    // Or just rely on the logic check function we will write that mimics the worker.

    const conjunction = getGeocentricConjunction(date);
    console.log('Conjunction:', conjunction);

    const userLoc = { lat: 51.5, lon: -0.1, name: 'London' };
    const westLoc = { lat: 30.0, lon: -90.0, name: 'New Orleans (West)' }; // Further west
    const eastLoc = { lat: 30.0, lon: 90.0, name: 'Chengdu (East)' }; // Further east

    // 1. Get Night Windows
    console.log('\nCalculated Night Windows:');
    const userNW = getNightWindow(userLoc.lat, userLoc.lon, date, conjunction);
    const westNW = getNightWindow(westLoc.lat, westLoc.lon, date, conjunction);
    const eastNW = getNightWindow(eastLoc.lat, eastLoc.lon, date, conjunction);

    console.log(`${userLoc.name}: ${userNW.nightStart.toISOString()} - ${userNW.nightEnd.toISOString()}`);
    console.log(`${westLoc.name}: ${westNW.nightStart.toISOString()} - ${westNW.nightEnd.toISOString()}`);
    console.log(`${eastLoc.name}: ${eastNW.nightStart.toISOString()} - ${eastNW.nightEnd.toISOString()}`);

    // 2. Check Overlap
    console.log('\nChecking Overlap:');
    const overlapWest = calculateSharedNight(userNW, westNW);
    console.log(`User <-> West: ${overlapWest.sharedNight} (Duration: ${overlapWest.overlapDuration.toFixed(1)} min)`);

    const overlapEast = calculateSharedNight(userNW, eastNW);
    console.log(`User <-> East: ${overlapEast.sharedNight} (Duration: ${overlapEast.overlapDuration.toFixed(1)} min)`);

    // 3. Simulate Visibility Results (Mocking getVisibility to force "Visible")
    // We want to test the LOGIC constraints, not the astronomy engine's actual visibility for this specific date
    // So we will manually construct "Visibility Objects" and run the logic check.

    const validVisWest = {
        code: 'VO',
        bestTimeUTC: new Date(westNW.nightStart.getTime() + 60 * 60 * 1000) // 1 hour after sunset
    };

    const validVisEast = {
        code: 'VO',
        bestTimeUTC: new Date(eastNW.nightStart.getTime() + 60 * 60 * 1000) // 1 hour after sunset
    };

    // 4. Test Logic Constraints (Simulating Worker Logic)
    console.log('\nTesting Inheritance Logic:');

    function checkInheritance(userNW, candidateNW, visibility) {
        // A = User, B = Candidate
        const A_start = userNW.nightStart.getTime();
        const A_end = userNW.nightEnd.getTime();
        const B_start = candidateNW.nightStart.getTime();
        const B_end = candidateNW.nightEnd.getTime();

        // Overlap Check
        const overlap_start = Math.max(A_start, B_start);
        const overlap_end = Math.min(A_end, B_end);

        if (overlap_start >= overlap_end) return { accepted: false, reason: 'No Overlap' };

        // PREVIOUS LOGIC (Sunset Order) - Deleted
        // if (A_start < B_start) return { accepted: false, reason: 'Sunset Order (Old Rule)' };

        // NEW LOGIC (Observation Time)
        // bestTimeUTC must be <= userNightEnd
        if (visibility.bestTimeUTC.getTime() > A_end) {
            console.log(`  Debug: BestTime ${visibility.bestTimeUTC.toISOString()} > UserEnd ${userNW.nightEnd.toISOString()}`);
            return { accepted: false, reason: 'Observation Time Invalid (After User Dawn)' };
        }

        return { accepted: true };
    }

    // Test West
    const resWest = checkInheritance(userNW, westNW, validVisWest);
    console.log(`Inheritance from West (${westLoc.name}): ${resWest.accepted} ${resWest.reason || ''}`);

    // Test East
    const resEast = checkInheritance(userNW, eastNW, validVisEast);
    console.log(`Inheritance from East (${eastLoc.name}): ${resEast.accepted} ${resEast.reason || ''}`);

    // Test Late Observation (East case where sighting is late?)
    // Construct a case where bestTime is AFTER User Dawn
    const tooLateTime = new Date(userNW.nightEnd.getTime() + 10000); // 10s after dawn
    const invalidVis = {
        code: 'VO',
        bestTimeUTC: tooLateTime
    };

    const resLate = checkInheritance(userNW, westNW, invalidVis); // Even from West, if it's too late (unlikely for West but possible if night ends early?)
    console.log(`Inheritance with Late Observation: ${resLate.accepted} ${resLate.reason || ''}`);

    // 5. Test Color Classification (Yellow vs Cyan)
    console.log('\nTesting Color Classification:');

    function checkColor(userNW, candidateNW) {
        const userStart = userNW.nightStart.getTime();
        const candidateStart = candidateNW.nightStart.getTime();

        if (candidateStart <= userStart) {
            return 'Yellow (Earlier/Same)';
        } else {
            return 'Cyan (Later)';
        }
    }

    const colorWest = checkColor(userNW, westNW);
    console.log(`West Location (${westLoc.name}): ${colorWest} - Expect Cyan (Later) because West sunset is later`);

    const colorEast = checkColor(userNW, eastNW);
    console.log(`East Location (${eastLoc.name}): ${colorEast} - Expect Yellow (Earlier) because East sunset is earlier`);

}

runTest().catch(console.error);
