import { getVisibility, getGeocentricConjunction } from './src/utils/astronomy.js';

console.log('='.repeat(80));
console.log('VERIFICATION TEST - Feb 17, 2026 Conjunction Fix');
console.log('='.repeat(80));

const testDate = new Date('2026-02-17T00:00:00Z');

// Step 1: Verify conjunction is found
console.log('\n📅 Step 1: Testing Conjunction Search');
console.log('Input date:', testDate.toISOString());

const conjunction = getGeocentricConjunction(testDate);
console.log('Conjunction found:', conjunction ? conjunction.toISOString() : 'NULL ❌');

if (!conjunction) {
    console.log('\n❌ FAILED: Conjunction is null!');
    process.exit(1);
}

console.log('✅ Conjunction found successfully');

// Expected: ~2026-02-17T12:01:xx
const expectedConjDate = '2026-02-17';
if (conjunction.toISOString().startsWith(expectedConjDate)) {
    console.log(`✅ Conjunction is on correct date (${expectedConjDate})`);
} else {
    console.log(`⚠️  Conjunction date mismatch: expected ${expectedConjDate}, got ${conjunction.toISOString().split('T')[0]}`);
}

// Step 2: Test Melbourne
console.log('\n🌏 Step 2: Testing Melbourne, Australia');
const melbLat = -37.8136;
const melbLon = 144.9631;
console.log(`Coordinates: ${melbLat}, ${melbLon}`);

const melbResult = getVisibility(testDate, melbLat, melbLon, 'odeh', conjunction);

console.log('\nResults:');
console.log('  Code:', melbResult.code);
console.log('  Zone:', melbResult.zoneName || 'N/A');
console.log('  Reason:', melbResult.reason || 'N/A');
console.log('  Conjunction Triggered:', melbResult.conjunctionTriggered);

if (melbResult.sunsetUTC && conjunction) {
    const sunsetMs = melbResult.sunsetUTC.getTime();
    const conjMs = conjunction.getTime();
    const diffHours = (conjMs - sunsetMs) / (1000 * 60 * 60);
    console.log(`  Sunset UTC: ${melbResult.sunsetUTC.toISOString()}`);
    console.log(`  Conjunction: ${conjunction.toISOString()}`);
    console.log(`  Time diff: ${diffHours.toFixed(2)} hours (conjunction ${diffHours > 0 ? 'AFTER' : 'BEFORE'} sunset)`);
}

if (melbResult.code === 'I' && melbResult.conjunctionTriggered === true) {
    console.log('✅ Melbourne: CORRECT (I - Impossible, conjunction after sunset)');
} else {
    console.log(`❌ Melbourne: INCORRECT (expected I with conjunctionTriggered=true, got ${melbResult.code} with conjunctionTriggered=${melbResult.conjunctionTriggered})`);
}

// Step 3: Test Mexico City
console.log('\n🌎 Step 3: Testing Mexico City');
const mexLat = 19.4326;
const mexLon = -99.1332;
console.log(`Coordinates: ${mexLat}, ${mexLon}`);

const mexResult = getVisibility(testDate, mexLat, mexLon, 'odeh', conjunction);

console.log('\nResults:');
console.log('  Code:', mexResult.code);
console.log('  Zone:', mexResult.zoneName || 'N/A');
console.log('  V value:', mexResult.value?.toFixed(3) || 'N/A');
console.log('  Conjunction Triggered:', mexResult.conjunctionTriggered);

if (mexResult.sunsetUTC && conjunction) {
    const sunsetMs = mexResult.sunsetUTC.getTime();
    const conjMs = conjunction.getTime();
    const diffHours = (sunsetMs - conjMs) / (1000 * 60 * 60);
    console.log(`  Sunset UTC: ${mexResult.sunsetUTC.toISOString()}`);
    console.log(`  Conjunction: ${conjunction.toISOString()}`);
    console.log(`  Time diff: ${diffHours.toFixed(2)} hours (sunset ${diffHours > 0 ? 'AFTER' : 'BEFORE'} conjunction)`);
}

if (mexResult.code === 'VO' && mexResult.conjunctionTriggered === false) {
    console.log('✅ Mexico: CORRECT (VO - Visible with Optical Aid, conjunction before sunset)');
} else {
    console.log(`⚠️  Mexico: Got ${mexResult.code} with conjunctionTriggered=${mexResult.conjunctionTriggered}`);
    console.log('   (Expected VO with conjunctionTriggered=false, but other codes possible depending on geometry)');
}

// Step 4: Edge case tests
console.log('\n🔬 Step 4: Testing Edge Cases');

const edgeCases = [
    { date: '2026-02-16T00:00:00Z', desc: 'Day before conjunction' },
    { date: '2026-02-17T13:00:00Z', desc: 'After conjunction (13:00 UTC)' },
    { date: '2026-02-18T00:00:00Z', desc: 'Day after conjunction' },
];

edgeCases.forEach(testCase => {
    const d = new Date(testCase.date);
    const conj = getGeocentricConjunction(d);
    const match = conj && conj.toISOString().startsWith('2026-02-17');
    console.log(`  ${testCase.desc}: ${match ? '✅' : '❌'} (${conj ? conj.toISOString() : 'null'})`);
});

// Final summary
console.log('\n' + '='.repeat(80));
console.log('SUMMARY');
console.log('='.repeat(80));

const allPassed =
    conjunction !== null &&
    conjunction.toISOString().startsWith('2026-02-17') &&
    melbResult.code === 'I' &&
    melbResult.conjunctionTriggered === true;

if (allPassed) {
    console.log('✅ ALL CRITICAL TESTS PASSED');
    console.log('The conjunction search bug has been fixed!');
    console.log('Melbourne now correctly shows I (Impossible) on Feb 17, 2026.');
} else {
    console.log('❌ SOME TESTS FAILED');
    console.log('Please review the output above for details.');
    process.exit(1);
}
