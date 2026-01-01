import { normalizeLon, getLongitudeBasedTimezone, getVisibility } from '../src/utils/astronomy.js';

/**
 * Export debug data for a list of test points
 * @param {Date} date - The reference date
 * @param {Array} testPoints - Array of {lat, lon} objects
 * @returns {Array} Array of debug data objects
 */
export function exportDebugData(date, testPoints) {
    const results = [];

    for (const point of testPoints) {
        const { lat, lon } = point;
        const result = getVisibility(date, lat, lon, 'odeh');
        results.push({
            lat,
            lon,
            normalizedLon: normalizeLon(lon),
            tzHours: result.tzHours,
            code: result.code,
            value: result.value,
            color: result.color,
            zoneName: result.zoneName,
            sunsetUTC: result.sunsetUTC ? result.sunsetUTC.toISOString() : null,
            moonsetUTC: result.moonsetUTC ? result.moonsetUTC.toISOString() : null,
            bestTimeUTC: result.bestTimeUTC ? result.bestTimeUTC.toISOString() : null,
            sunsetLocal: result.sunsetLocal ? result.sunsetLocal.toLocaleString() : null,
            moonsetLocal: result.moonsetLocal ? result.moonsetLocal.toLocaleString() : null,
            bestTimeLocal: result.bestTimeLocal ? result.bestTimeLocal.toLocaleString() : null,
            conjunctionTime: result.conjunctionTime ? result.conjunctionTime.toISOString() : null,
            conjunctionTriggered: result.conjunctionTriggered,
            arcv: result.arcv,
            w: result.w,
            lag: result.lag,
            reason: result.reason
        });
    }

    return results;
}

/**
 * Format debug report as human-readable text
 * @param {Array} debugData - Array of debug data objects from exportDebugData
 * @returns {string} Formatted text report
 */
export function formatDebugReport(debugData) {
    let report = 'DEBUG REPORT\n';
    report += '='.repeat(80) + '\n\n';

    for (const data of debugData) {
        report += `Location: ${data.lat.toFixed(1)}°, ${data.lon.toFixed(1)}° (normalized: ${data.normalizedLon.toFixed(1)}°)\n`;
        report += `Timezone: UTC ${data.tzHours >= 0 ? '+' : ''}${data.tzHours}\n`;
        report += `Code: ${data.code} - ${data.zoneName || 'N/A'}\n`;
        report += `V-value: ${data.value !== null && data.value !== undefined ? data.value.toFixed(4) : 'N/A'}\n`;
        report += `ARCV: ${data.arcv !== null && data.arcv !== undefined ? data.arcv.toFixed(4) + '°' : 'N/A'}\n`;
        report += `W (width): ${data.w !== null && data.w !== undefined ? data.w.toFixed(4) + "'" : 'N/A'}\n`;
        report += `Lag: ${data.lag !== null && data.lag !== undefined ? data.lag.toFixed(2) + ' min' : 'N/A'}\n`;
        report += `\nSunset UTC: ${data.sunsetUTC || 'N/A'}\n`;
        report += `Sunset Local: ${data.sunsetLocal || 'N/A'}\n`;
        report += `Moonset UTC: ${data.moonsetUTC || 'N/A'}\n`;
        report += `Moonset Local: ${data.moonsetLocal || 'N/A'}\n`;
        report += `Best Time UTC: ${data.bestTimeUTC || 'N/A'}\n`;
        report += `Best Time Local: ${data.bestTimeLocal || 'N/A'}\n`;
        report += `Conjunction: ${data.conjunctionTime || 'N/A'}\n`;
        report += `Conjunction Triggered: ${data.conjunctionTriggered ? 'Yes (→ Impossible)' : 'No'}\n`;
        if (data.reason) {
            report += `Reason: ${data.reason}\n`;
        }
        report += '-'.repeat(80) + '\n\n';
    }

    return report;
}

/**
 * Format debug report as JSON
 * @param {Array} debugData - Array of debug data objects from exportDebugData
 * @returns {string} JSON string
 */
export function formatDebugReportJSON(debugData) {
    return JSON.stringify(debugData, null, 2);
}
