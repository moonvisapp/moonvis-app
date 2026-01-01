import { getVisibility, getNightWindow } from '../utils/astronomy';
import * as d3 from 'd3';

/**
 * Generate a visibility map as a data URL for a specific date and location
 * @param {Date} date - The date to generate the map for
 * @param {Object} location - Location object with lat, lon, name
 * @returns {Promise<string>} Data URL of the generated map image
 */
export async function generateMapDataURL(date, location) {
    return new Promise(async (resolve, reject) => {
        try {
            // Generate visibility grid for this date (same logic as MoonMap)
            const grid = [];
            for (let lat = -59; lat <= 59; lat += 2) {
                for (let lon = -179.0; lon <= 179.0; lon += 2) {
                    try {
                        const res = getVisibility(date, lat + 1, lon + 1.5, lon);
                        const nightWindow = getNightWindow(date, lat + 1, lon + 1.5);

                        grid.push({
                            lat: lat + 1,
                            lon: lon + 1.5,
                            classification: res.code,
                            nightStart: nightWindow?.nightStart || null,
                            nightEnd: nightWindow?.nightEnd || null
                        });
                    } catch (err) {
                        // Skip cells with errors
                    }
                }
            }

            // Create a temporary container for rendering
            const container = document.createElement('div');
            container.style.position = 'absolute';
            container.style.left = '-9999px';
            container.style.width = '870px';
            container.style.height = '450px';
            document.body.appendChild(container);

            // Set up D3 projection and path generator
            const width = 870;
            const height = 450;

            const projection = d3.geoEquirectangular()
                .scale(width / (2 * Math.PI))
                .translate([width / 2, height / 2]);

            // Create SVG
            const svg = d3.select(container)
                .append('svg')
                .attr('width', width)
                .attr('height', height)
                .style('background-color', '#0f172a');

            // Add ocean/background
            svg.append('rect')
                .attr('width', width)
                .attr('height', height)
                .attr('fill', '#1e293b');

            // Color scale for visibility
            const colorScale = (classification) => {
                const colors = {
                    'A': '#22c55e',
                    'B': '#a855f7',
                    'C': '#3b82f6',
                    'D': '#dc2626',
                    'E': '#06b6d4'
                };
                return colors[classification] || '#6b7280';
            };

            // Draw grid cells
            const cellWidth = (width / 360) * 3;
            const cellHeight = (height / 180) * 2;

            grid.forEach(cell => {
                const pos = projection([cell.lon, cell.lat]);

                svg.append('rect')
                    .attr('x', pos[0] - cellWidth / 2)
                    .attr('y', pos[1] - cellHeight / 2)
                    .attr('width', cellWidth)
                    .attr('height', cellHeight)
                    .attr('fill', 'none')
                    .attr('stroke', colorScale(cell.classification))
                    .attr('stroke-width', 0.5)
                    .attr('opacity', 0.7);
            });

            // If location provided, mark it
            if (location) {
                const targetLat = Math.floor(location.lat / 2) * 2 + 1.0;
                const targetLon = Math.floor(location.lon / 2) * 2 + 1.0;
                const pos = projection([targetLon, targetLat]);

                svg.append('circle')
                    .attr('cx', pos[0])
                    .attr('cy', pos[1])
                    .attr('r', 5)
                    .attr('fill', '#fbbf24')
                    .attr('stroke', '#000')
                    .attr('stroke-width', 1);
            }

            // Convert SVG to image
            const svgElement = container.querySelector('svg');
            const svgData = new XMLSerializer().serializeToString(svgElement);
            const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
            const url = URL.createObjectURL(svgBlob);

            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);

                const dataURL = canvas.toDataURL('image/png');

                // Cleanup
                URL.revokeObjectURL(url);
                document.body.removeChild(container);

                resolve(dataURL);
            };

            img.onerror = (err) => {
                document.body.removeChild(container);
                reject(err);
            };

            img.src = url;
        } catch (error) {
            reject(error);
        }
    });
}
