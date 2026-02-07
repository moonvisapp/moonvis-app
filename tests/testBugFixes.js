import { getGeocentricConjunction, getVisibility } from '../src/utils/astronomy.js';

async function testBugFixes() {
    console.log('=== Testing Bug Fixes ===\n');

    // Test 1: Conjunction Search Bug (Melbourne Feb 17, 2026)
    console.log('Test 1: Conjunction Search for Feb 17, 2026');
    console.log('Expected: Should find conjunction at ~12:01 UTC on Feb 17, 2026');

    const testDate = new Date('2026-02-17T00:00:00Z');
    const conjunction = getGeocentricConjunction(testDate);

    if (conjunction) {
        console.log(`✓ Conjunction found: ${conjunction.toISOString()}`);
        console.log(`  Time difference from midnight: ${(conjunction.getTime() - testDate.getTime()) / 3600000} hours`);
    } else {
        console.log('✗ ERROR: No conjunction found (bug still exists!)');
    }

    // Test 2: Melbourne Visibility on Feb 17, 2026
    console.log('\nTest 2: Melbourne Visibility Classification');
    console.log('Expected: Code "I" (Impossible) - Moon sets before sunset');

    const melbourne = { lat: -37.8136, lon: 144.9631 };
    const visibility = getVisibility(testDate, melbourne.lat, melbourne.lon, 'odeh', conjunction);

    console.log(`Result: Code "${visibility.code}" - ${visibility.zoneName || visibility.reason}`);

    if (visibility.code === 'I') {
        console.log('✓ Correct: Melbourne shows "I" (Impossible)');
    } else {
        console.log(`✗ WARNING: Expected "I" but got "${visibility.code}"`);
    }

    if (visibility.lag !== undefined) {
        console.log(`  Lag: ${visibility.lag.toFixed(2)} minutes`);
    }

    // Test 3: Verify no color properties in visibility result
    console.log('\nTest 3: Color Property Removal');
    console.log('Expected: No "color" property in visibility result');

    if (visibility.color !== undefined) {
        console.log(`✗ ERROR: "color" property still exists in astronomy.js: ${visibility.color}`);
    } else {
        console.log('✓ Correct: No "color" property in result (clean architecture)');
    }

    console.log('\n=== All Tests Complete ===');
}

testBugFixes().catch(console.error);
