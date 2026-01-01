import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import { getVisibility, getPrevNewMoonConjunction, getNextNewMoonConjunction, getGeocentricConjunction, getNightWindow, calculateSharedNight } from '../utils/astronomy';

// Color Palette

const colors = {
    'EV': '#4ade80',      // Green - Easily visible (Green-400)
    'VP': '#facc15',      // Yellow - Visible under perfect conditions
    'VO': '#ef4444',      // Red - Visible with optical aid
    'NV': '#94a3b8'       // Grey - Not visible
};

// Legend labels
const zoneLabels = {
    'EV': 'Easily Visible',
    'VP': 'Visible Under Perfect Conditions',
    'VO': 'Visible With Optical Aid',
    'NV': 'Not Visible'
};

// Module-level cache for world map data to prevent re-fetching on every remount (crucial for export performance)
let cachedWorldFeatures = null;

// Global calculation tracking - persists across component mount/unmount cycles
export const globalCalculationTracking = {
    inProgress: false,
    instanceCount: 0,
    dataCache: new Map() // Cache full calculation results: dateString -> dataObject
};

// Reset function to clear tracking (call when modal closes to prevent stale cache)
export const resetGlobalCalculationTracking = () => {
    console.log('[MoonMap] Resetting global calculation tracking');
    globalCalculationTracking.inProgress = false;
    globalCalculationTracking.dataCache.clear();
};

const MoonMap = ({ date, calculationTrigger, selectedCity, highlightSharedNightCells, onRenderComplete, wrapperRef, enableYielding = true }) => {
    const svgRef = useRef();
    const canvasRef = useRef();
    const worldFeaturesRef = useRef([]);
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [data, setData] = useState(null);
    const [selectedCell, setSelectedCell] = useState(null);
    const [showDebugPanel, setShowDebugPanel] = useState(false);
    const [renderKey, setRenderKey] = useState(0);
    const [sharedNightMode, setSharedNightMode] = useState(null); // { selectedCell, sharedCells: [] }

    // Color Palette


    // Debug render
    console.log(`[MoonMap] Rendering instance ${renderKey} for date:`, date?.toISOString(), 'Trigger:', calculationTrigger);

    const workerRef = useRef(null);

    // Use a ref to track instance index for logging
    const instanceId = useRef(globalCalculationTracking.instanceCount++);
    const lastRenderedTrigger = useRef(-1);

    // Initialize Worker
    useEffect(() => {
        if (!workerRef.current) {
            workerRef.current = new Worker(new URL('../workers/mapCalculation.worker.js', import.meta.url), { type: 'module' });

            workerRef.current.onmessage = (e) => {
                const { status, data: result, type, error, workId, dateStr } = e.data;
                console.log(`[MoonMap ${instanceId.current}] Worker message:`, { status, type, workId });

                if (status === 'success') {
                    if (type === 'shared_result') {
                        const { sharedCellsEarlier, sharedCellsLater, selectedCell, maxSharedLatitude, maxSharedCount } = result;
                        setSharedNightMode({
                            selectedCell,
                            sharedCellsEarlier,
                            sharedCellsLater,
                            maxSharedLatitude,
                            maxSharedCount
                        });
                    } else {
                        const dateKey = dateStr;
                        if (dateKey) {
                            globalCalculationTracking.dataCache.set(dateKey, { ...result, dateStr: dateKey });
                            console.log(`[MoonMap ${instanceId.current}] Cached data for ${dateKey}`);
                        }
                        setData(result);
                        if (result.sharedNightResult) {
                            setSharedNightMode(result.sharedNightResult);
                        } else {
                            setSharedNightMode(null);
                        }
                        setLoading(false);
                        globalCalculationTracking.inProgress = false;
                        setProgress(100);
                    }
                } else if (status === 'error') {
                    console.error(`[MoonMap ${instanceId.current}] Worker Error:`, error);
                    setLoading(false);
                    globalCalculationTracking.inProgress = false;
                }
            };
        }

        return () => {
            if (workerRef.current) {
                workerRef.current.terminate();
                workerRef.current = null;
            }
        };
    }, []); // Empty dependency array - only run on mount/unmount

    // Reset lastRenderedTrigger when component mounts or calculationTrigger changes
    // This prevents issues with consecutive PDF exports where trigger counter resets
    useEffect(() => {
        // If we see a calculationTrigger that's less than what we've already rendered,
        // it means we're starting a new export cycle, so reset
        if (calculationTrigger > 0 && calculationTrigger < lastRenderedTrigger.current) {
            console.log(`[MoonMap ${instanceId.current}] Resetting lastRenderedTrigger from ${lastRenderedTrigger.current} to -1 (new export cycle detected)`);
            lastRenderedTrigger.current = -1;
        }
    }, [calculationTrigger]);

    useEffect(() => {
        const calculateGrid = async () => {
            const dateKey = date?.toISOString();

            // 1. Check cache FIRST. Cache hits should NEVER be blocked by inProgress guards.
            if (dateKey && globalCalculationTracking.dataCache.get(dateKey)) {
                const cachedData = globalCalculationTracking.dataCache.get(dateKey);
                console.log(`[MoonMap ${instanceId.current}] Cache hit for ${dateKey}`);
                setData(cachedData);
                if (cachedData.sharedNightResult) {
                    setSharedNightMode(cachedData.sharedNightResult);
                } else {
                    // If cache has no shared night (e.g. from a tool call that didn't provide city)
                    // we'll let the selectedCity effect handle it
                }
                setLoading(false);

                // Signal completion for cache hits (critical for PDF export)
                // SIMPLIFIED: Always signal render complete for cache hits
                // The render effect will handle the actual drawing
                // Note: We don't call onRenderComplete here anymore - let the render effect do it
                // This prevents duplicate/premature calls

                return;
            }

            // 2. Guard for active calculation (after cache check)
            if (globalCalculationTracking.inProgress) {
                console.warn(`[MoonMap ${instanceId.current}] Calculation in progress, skipping trigger ${calculationTrigger}`);
                return;
            }

            globalCalculationTracking.inProgress = true;

            try {
                if (!date || isNaN(date.getTime())) {
                    throw new Error("Invalid date");
                }

                setLoading(true);
                setData(null);
                setProgress(20);

                if (workerRef.current) {
                    workerRef.current.postMessage({
                        type: 'full_grid',
                        dateStr: date.toISOString(),
                        workId: Date.now(),
                        params: {
                            cityParams: selectedCity ? {
                                lat: Math.floor(selectedCity.lat / 2) * 2 + 1.0,
                                lon: Math.floor(selectedCity.lon / 2) * 2 + 1.0,
                                nightStart: getNightWindow(selectedCity.lat, selectedCity.lon, date)?.nightStart,
                                nightEnd: getNightWindow(selectedCity.lat, selectedCity.lon, date)?.nightEnd
                            } : null
                        }
                    });
                }
            } catch (err) {
                console.error(`[MoonMap ${instanceId.current}] Error during grid calculation:`, err);
                // No need to reset inProgress here, it's handled in finally
            } finally {
                // Ensure inProgress is always reset, even on error
                // globalCalculationTracking.inProgress = false; // This is now handled by the worker's onmessage
                // setLoading(false); // This is now handled by the worker's onmessage
            }
        };

        if (calculationTrigger > 0) {
            console.log(`[MoonMap ${instanceId.current}] Triggered calculation #${calculationTrigger} for ${date?.toISOString()}`);
            calculateGrid();
        }
    }, [calculationTrigger, date, selectedCity, onRenderComplete]);

    // Fast effect for interactive city changes
    useEffect(() => {
        if (selectedCity && data && data.grid && data.grid.length > 0) {
            if (sharedNightMode &&
                Math.abs(sharedNightMode.selectedCell.lat - (Math.floor(selectedCity.lat / 2) * 2 + 1.0)) < 0.1 &&
                Math.abs(sharedNightMode.selectedCell.lon - (Math.floor(selectedCity.lon / 2) * 2 + 1.0)) < 0.1) {
                return;
            }

            const grid = data.grid;
            const targetLat = Math.floor(selectedCity.lat / 2) * 2 + 1.0;
            const targetLon = Math.floor(selectedCity.lon / 2) * 2 + 1.0;

            const cityCell = grid.find(c =>
                Math.abs(c.lat - targetLat) < 0.1 && Math.abs(c.lon - targetLon) < 0.1
            );

            if (cityCell && cityCell.nightStart && cityCell.nightEnd) {
                if (workerRef.current) {
                    workerRef.current.postMessage({
                        type: 'check_shared_for_location',
                        dateStr: date.toISOString(),
                        params: {
                            selectedCellLat: cityCell.lat,
                            selectedCellLon: cityCell.lon,
                            selectedNightStart: cityCell.nightStart,
                            selectedNightEnd: cityCell.nightEnd
                        }
                    });
                }
            } else {
                setSharedNightMode(null);
            }
        } else if (!selectedCity) {
            setSharedNightMode(null);
        }
    }, [data, selectedCity, date]);

    useEffect(() => {
        if (!data || !svgRef.current || !canvasRef.current) return;

        console.log(`[MoonMap ${instanceId.current}] Drawing for ${data.dateStr} (Trigger ${calculationTrigger})`);
        // Get the actual rendered size of the SVG for responsive rendering
        const svgElement = svgRef.current;
        const bbox = svgElement.getBoundingClientRect();

        // Use the viewBox as reference but scale based on actual size
        const viewBoxWidth = 870;
        const viewBoxHeight = 820; // Increased to 820 for legend explanations
        const scaleX = bbox.width / viewBoxWidth;
        const scaleY = bbox.height / viewBoxHeight;

        const width = 800;
        const height = 400;
        const padding = { left: 50, right: 20, top: 60, bottom: 360 }; // Increased bottom to 360
        const totalWidth = width + padding.left + padding.right;
        const totalHeight = height + padding.top + padding.bottom;

        // --- CANVAS RENDERING ---
        // We now render EVERYTHING to canvas for instant PDF export
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        // Removed console.time to prevent 'Timer already exists' warnings

        // Set canvas to match the actual rendered size
        canvas.width = bbox.width;
        canvas.height = bbox.height;

        // Scale the canvas context to match the SVG's actual size
        ctx.scale(scaleX, scaleY);

        // Define path generator for Canvas
        const projection = d3.geoEquirectangular()
            .scale(width / (2 * Math.PI))
            .translate([width / 2 + padding.left, height / 2 + padding.top]);

        const path = d3.geoPath().projection(projection).context(ctx);

        // 1. Clear and Draw Background
        ctx.fillStyle = "#0f172a";
        ctx.fillRect(0, 0, totalWidth, totalHeight); // Fill entire canvas

        // 2. Map Area Background (distinct for visual hierarchy)
        ctx.fillStyle = "#0f172a";
        ctx.fillRect(padding.left, padding.top, width, height);

        // 3. Render Visibility Grid
        const cellW = (width / 360) * 2;
        const cellH = (height / 180) * 2;

        data.grid.forEach(cell => {
            const [x, y] = projection([cell.lon, cell.lat]);
            const color = colors[cell.code] || '#00000000';

            ctx.fillStyle = color;
            ctx.globalAlpha = 0.22;
            ctx.fillRect(x - cellW / 2, y - cellH / 2, cellW, cellH);

            // Draw shared night highlight if active (inherited cells)
            // REMOVED inefficient O(N*M) loop from here. Moved to dedicated loop below.
        });

        // DRAW SHARED NIGHT HIGHLIGHTS ON CANVAS (Migrated from SVG)
        if (sharedNightMode) {
            const cellW = (width / 360) * 2;
            const cellH = (height / 180) * 2;

            // 1. Selected Cell (Fluro Yellow)
            const selectedPos = projection([sharedNightMode.selectedCell.lon, sharedNightMode.selectedCell.lat]);
            ctx.strokeStyle = "#CCFF00"; // Fluro Yellow
            ctx.lineWidth = 2.5;
            ctx.globalAlpha = 0.9;
            ctx.strokeRect(selectedPos[0] - cellW / 2, selectedPos[1] - cellH / 2, cellW, cellH);

            // 2. Earlier Shared Cells (Fluro Yellow Thin)
            if (sharedNightMode.sharedCellsEarlier) {
                ctx.strokeStyle = "#CCFF00"; // Fluro Yellow
                ctx.lineWidth = 0.5;
                ctx.globalAlpha = 0.8;
                sharedNightMode.sharedCellsEarlier.forEach(cell => {
                    const pos = projection([cell.lon, cell.lat]);
                    ctx.strokeRect(pos[0] - cellW / 2, pos[1] - cellH / 2, cellW, cellH);
                });
            }

            // 3. Later Shared Cells (Cyan-400 Thin)
            if (sharedNightMode.sharedCellsLater) {
                ctx.strokeStyle = "#22d3ee";
                ctx.lineWidth = 0.5;
                ctx.globalAlpha = 0.8;
                sharedNightMode.sharedCellsLater.forEach(cell => {
                    const pos = projection([cell.lon, cell.lat]);
                    ctx.strokeRect(pos[0] - cellW / 2, pos[1] - cellH / 2, cellW, cellH);
                });
            }
        }

        // Draw Inherited Night Highlights (Orange Borders) - Efficient O(M) Loop
        if (highlightSharedNightCells && highlightSharedNightCells.length > 0) {
            const cellW = (width / 360) * 2;
            const cellH = (height / 180) * 2;
            ctx.globalAlpha = 1.0;
            ctx.strokeStyle = "#ff6600"; // Bright Orange
            ctx.lineWidth = 1.5;

            highlightSharedNightCells.forEach(cell => {
                const [x, y] = projection([cell.lon, cell.lat]);
                ctx.strokeRect(x - cellW / 2, y - cellH / 2, cellW, cellH);
            });
        }

        // Draw Selected City Highlight (Red Border)
        if (selectedCity) {
            const cellW = (width / 360) * 2;
            const cellH = (height / 180) * 2;
            const targetLat = Math.floor(selectedCity.lat / 2) * 2 + 1.0;
            const targetLon = Math.floor(selectedCity.lon / 2) * 2 + 1.0;
            const [x, y] = projection([targetLon, targetLat]);

            ctx.globalAlpha = 1.0;
            ctx.strokeStyle = "#ff0000"; // Bright Red
            ctx.lineWidth = 2.0;
            ctx.strokeRect(x - cellW / 2, y - cellH / 2, cellW, cellH);
        }

        // Reset alpha to ensure subsequent layers (map, graticule) are drawn fully opaque
        ctx.globalAlpha = 1.0;



        // 4. Draw World Map
        if (worldFeaturesRef.current && worldFeaturesRef.current.length > 0) {
            ctx.beginPath();
            path({ type: "FeatureCollection", features: worldFeaturesRef.current });
            ctx.strokeStyle = "#ffffffaa";
            ctx.lineWidth = 0.5;
            ctx.stroke();
        } else if (cachedWorldFeatures) {
            // Use cached data immediately
            worldFeaturesRef.current = cachedWorldFeatures;
            ctx.beginPath();
            path({ type: "FeatureCollection", features: cachedWorldFeatures });
            ctx.strokeStyle = "#ffffffaa";
            ctx.lineWidth = 0.5;
            ctx.stroke();
        } else {
            // Fallback if data not loaded yet - Fetch and Cache
            d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json").then(worldData => {
                const countryColl = topojson.feature(worldData, worldData.objects.countries);
                cachedWorldFeatures = countryColl.features; // Cache it!
                worldFeaturesRef.current = cachedWorldFeatures;
                // Force a re-render once data is loaded so it appears on first load
                setRenderKey(prev => prev + 1);
            });
        }

        // 5. Draw Graticule
        ctx.beginPath();
        path(d3.geoGraticule().step([30, 20])());
        ctx.strokeStyle = "#ffffff77";
        ctx.lineWidth = 0.8;
        ctx.stroke();

        // 6. Draw Coordinate Labels
        ctx.fillStyle = "#cbd5e1";
        ctx.font = "10px sans-serif";

        // Latitude Labels
        ctx.textAlign = "end";
        ctx.textBaseline = "middle";
        d3.range(-80, 81, 20).forEach(lat => {
            const coords = projection([-180, lat]);
            const label = `${Math.abs(lat)}°${lat > 0 ? 'N' : lat < 0 ? 'S' : ''}`;
            ctx.fillText(label, coords[0] - 10, coords[1]);
        });

        // Longitude Labels
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        d3.range(-180, 181, 30).forEach(lon => {
            const coords = projection([lon, -90]);
            const label = `${Math.abs(lon)}°${lon > 0 ? 'E' : lon < 0 ? 'W' : ''}`;
            ctx.fillText(label, coords[0], coords[1] + 15);
        });

        // Axis Titles
        ctx.fillStyle = "#94a3b8";
        ctx.font = "600 13px sans-serif";

        // Draw "Created by" in Top Right
        ctx.save();
        ctx.textAlign = "right";
        ctx.textBaseline = "top";
        ctx.font = "italic 12px sans-serif";
        ctx.fillStyle = "#94a3b8"; // Muted text
        // Position: Top right, taking padding into account. 
        // We want it visually in the top right of the white-ish spacing or map area.
        // Let's put it at the far right edge of the content area, just above the map or inside top-right.
        // inside top right of the map area might be cleaner.
        // width + padding.left is the right edge of the map content.
        ctx.fillText("created by moonvisapp@gmail.com", width + padding.left, padding.top + 10);
        ctx.restore();

        // Latitude Title
        ctx.save();
        const latLabelPos = [projection([-180, 0])[0] - 35, height / 2 + padding.top];
        ctx.translate(latLabelPos[0], latLabelPos[1]);
        ctx.rotate(-Math.PI / 2);
        ctx.textAlign = "center";
        ctx.fillText("LATITUDE", 0, 0);
        ctx.restore();

        // Longitude Title
        const lonLabelPos = [projection([0, -90])[0], projection([0, -90])[1] + 25]; // Raised up from +35 to prevent clipping
        ctx.textAlign = "center";
        ctx.fillText("LONGITUDE", lonLabelPos[0], lonLabelPos[1]);

        // 7. Draw Legend and Info directly on Canvas (in the footer area)

        let footerY = height + padding.top + 60; // Start below the Longitude title
        const footerX = padding.left;

        // -- Info Section (Conjunctions, etc) --
        ctx.fillStyle = "#cbd5e1";
        ctx.textAlign = "left";
        ctx.font = "12px sans-serif";
        const lineHeight = 18;

        // Helper to format local time
        const getLocalTimeStr = (utcDate) => {
            if (!utcDate) return 'N/A';
            let localTimeStr, locationLabel;

            if (selectedCity) {
                const tzOffset = Math.round(selectedCity.lon / 15);
                const localTime = new Date(utcDate.getTime() + tzOffset * 3600 * 1000);
                localTimeStr = localTime.toISOString().replace('T', ' ').substring(0, 19);
                locationLabel = `${selectedCity.name}`;
            } else if (sharedNightMode?.selectedCell) {
                const tzOffset = Math.round(sharedNightMode.selectedCell.lon / 15);
                const localTime = new Date(utcDate.getTime() + tzOffset * 3600 * 1000);
                localTimeStr = localTime.toISOString().replace('T', ' ').substring(0, 19);
                locationLabel = `selected location: Lat: ${Math.abs(sharedNightMode.selectedCell.lat).toFixed(1)}°${sharedNightMode.selectedCell.lat >= 0 ? 'N' : 'S'}, Long: ${Math.abs(sharedNightMode.selectedCell.lon).toFixed(1)}°${sharedNightMode.selectedCell.lon >= 0 ? 'E' : 'W'}`;
            } else {
                localTimeStr = utcDate.toLocaleString('en-US', {
                    year: 'numeric', month: '2-digit', day: '2-digit',
                    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
                });
                locationLabel = "User's local time";
            }
            return { time: localTimeStr, label: locationLabel };
        };

        // Reference Date
        const refDateLabel = "Reference Date (Local Evening): ";
        const refDateValue = date.toISOString().split('T')[0];

        ctx.font = "bold 13px sans-serif";
        ctx.fillStyle = "#38bdf8"; // Bright Blue
        ctx.fillText(refDateLabel, footerX, footerY);
        const refDateLabelWidth = ctx.measureText(refDateLabel).width;

        ctx.font = "12px sans-serif";
        ctx.fillStyle = "#cbd5e1"; // Normal
        ctx.fillText(refDateValue, footerX + refDateLabelWidth, footerY);

        footerY += lineHeight;

        // Previous Conjunction
        if (data.prevConjunction) {
            const { time, label } = getLocalTimeStr(data.prevConjunction);

            const labelText = "Previous Conjunction: ";
            const valueText = data.prevConjunction.toUTCString().replace('GMT', 'UTC');

            ctx.font = "bold 13px sans-serif";
            ctx.fillStyle = "#38bdf8"; // Bright Blue
            ctx.fillText(labelText, footerX, footerY);
            const labelWidth = ctx.measureText(labelText).width;

            ctx.font = "12px sans-serif";
            ctx.fillStyle = "#cbd5e1"; // Normal
            ctx.fillText(valueText, footerX + labelWidth, footerY);

            // Draw secondary gray text
            const firstPartWidth = labelWidth + ctx.measureText(valueText).width;

            ctx.fillStyle = "#94a3b8";
            ctx.fillText(` | Local solar time: ${time} (${label})`, footerX + firstPartWidth, footerY);

            footerY += lineHeight;
        }

        // Next Conjunction
        if (data.nextConjunction) {
            const { time, label } = getLocalTimeStr(data.nextConjunction);

            const labelText = "Next Conjunction: ";
            const valueText = data.nextConjunction.toUTCString().replace('GMT', 'UTC');

            ctx.font = "bold 13px sans-serif";
            ctx.fillStyle = "#38bdf8"; // Bright Blue
            ctx.fillText(labelText, footerX, footerY);
            const labelWidth = ctx.measureText(labelText).width;

            ctx.font = "12px sans-serif";
            ctx.fillStyle = "#cbd5e1"; // Normal
            ctx.fillText(valueText, footerX + labelWidth, footerY);

            const firstPartWidth = labelWidth + ctx.measureText(valueText).width;
            ctx.fillStyle = "#94a3b8";
            ctx.fillText(` | Local solar time: ${time} (${label})`, footerX + firstPartWidth, footerY);

            footerY += lineHeight;
        }


        // Help Text
        footerY += 5;
        ctx.fillStyle = "#94a3b8"; // Muted color
        ctx.font = "italic 11px sans-serif";
        ctx.fillText("ℹ️ Local solar time is based on longitude (15° = 1 hour). It differs from civil time zones.", footerX, footerY);
        footerY += lineHeight;
        ctx.fillText("Criterion: Odeh V-criterion", footerX, footerY);

        footerY += 25; // Gap before legend

        // Legend Title
        ctx.font = "bold 13px sans-serif";
        ctx.fillStyle = "#cbd5e1";
        ctx.textAlign = "left";
        ctx.fillText("Legend:", footerX, footerY);
        footerY += 30; // Increased space after title (was 20)

        // -- Color Legend --
        let currentX = footerX;
        ctx.font = "12px sans-serif";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "#cbd5e1"; // Ensure text color is set

        Object.entries(colors).forEach(([code, color]) => {
            const label = zoneLabels[code];
            if (!label) return;

            // Color Box
            ctx.fillStyle = color;
            ctx.fillRect(currentX, footerY - 6, 12, 12);

            // Text
            ctx.fillStyle = "#cbd5e1";
            ctx.textAlign = "left";
            ctx.fillText(`${code}: ${label}`, currentX + 18, footerY);

            currentX += ctx.measureText(`${code}: ${label}`).width + 30; // Spacing
        });

        // Date Title REMOVED as requested (kept commented out ref)
        // ctx.fillStyle = "#ffffff";
        // ctx.font = "bold 14px sans-serif";
        // ctx.textAlign = "left";
        // ctx.fillText(`Date: ${date.toISOString().split('T')[0]}`, padding.left, 20);

        // -- Shared Night Legend --
        // Starting a new row below the visibility codes
        let sharedLegendX = footerX;
        let sharedLegendY = footerY + 20; // Gap below visibility legend

        ctx.font = "bold 12px sans-serif";
        ctx.fillStyle = "#cbd5e1";
        ctx.textAlign = "left";
        ctx.fillText("Shared Night Highlighting:", sharedLegendX, sharedLegendY);

        sharedLegendY += 18; // Move to items row

        const sharedItems = [
            { label: "Shares Night (Earlier)", color: "#CCFF00", type: "outline", width: 1.0 },
            { label: "Shares Night (Later)", color: "#22d3ee", type: "outline", width: 1.0 },
            { label: "Inherited Visibility Source", color: "#ff6600", type: "outline", width: 1.5 }
        ];

        ctx.font = "12px sans-serif";
        sharedItems.forEach(item => {
            // Draw box outline
            ctx.strokeStyle = item.color;
            ctx.lineWidth = item.width;
            ctx.strokeRect(sharedLegendX, sharedLegendY - 6, 12, 12);

            // Draw label
            ctx.fillStyle = "#cbd5e1";
            ctx.textAlign = "left";
            ctx.fillText(item.label, sharedLegendX + 18, sharedLegendY);

            sharedLegendX += ctx.measureText(item.label).width + 35; // Spacing
        });

        // -- Explanatory Text --
        sharedLegendY += 25; // Gap below items

        ctx.font = "italic 11px sans-serif";
        ctx.fillStyle = "#94a3b8"; // Muted text

        // Explanation 1: Shared Night Band
        const text1 = "The yellow-to-blue band represents the slice of the Earth that shares the night with the chosen location. Blue regions share the night but possess a later sunset.";
        // Simple wrap check (splitting roughly in half for safety on 800px width)
        ctx.fillText("The yellow-to-blue band represents the slice of the Earth that shares the night with the chosen location.", footerX, sharedLegendY);
        sharedLegendY += 16;
        ctx.fillText("Blue regions share the night but possess a later sunset than the chosen location.", footerX, sharedLegendY);

        sharedLegendY += 20; // Gap

        // Explanation 2: Inherited
        const text2 = "Locations outlined in orange are those from which the selected location inherits its visibility status (e.g. for Night 1).";
        ctx.fillText(text2, footerX, sharedLegendY);

        // End canvas drawing timer
        // Removed console.timeEnd (timer removed above)



        // Interaction Handling (using transparent SVG overlay for simplicity)
        // We keep a transparent SVG on top just for maintaining the D3 mouse event logic
        // without rewriting all the click handlers
        const svg = d3.select(svgRef.current);
        const interactiveLayer = svg.selectAll(".interactive-layer").data([null])
            .join("g").attr("class", "interactive-layer");

        const tooltip = d3.select("body").selectAll(".moon-tooltip").data([null]);
        const tooltipDiv = tooltip.enter().append("div").attr("class", "moon-tooltip").merge(tooltip)
            .style("position", "absolute").style("visibility", "hidden").style("background", "rgba(15, 23, 42, 0.95)")
            .style("color", "#e2e8f0").style("padding", "10px 14px").style("border-radius", "8px").style("border", "1px solid #334155")
            .style("font-size", "12px").style("pointer-events", "none").style("z-index", "1000");

        interactiveLayer.append("rect")
            .attr("x", padding.left).attr("y", padding.top).attr("width", width).attr("height", height)
            .attr("fill", "transparent")
            .on("click", (event) => {
                // Single click: clear shared night mode if active
                if (sharedNightMode) {
                    setSharedNightMode(null);
                }
            })
            .on("dblclick", (event) => {
                // Double click: activate shared night mode
                const [lon, lat] = projection.invert(d3.pointer(event, svg.node()));
                const targetLon = Math.floor(lon / 2) * 2 + 1.0;
                const targetLat = Math.floor(lat / 2) * 2 + 1.0;
                const clickedCell = data.grid.find(c => Math.abs(c.lat - targetLat) < 0.1 && Math.abs(c.lon - targetLon) < 0.1);

                if (clickedCell && clickedCell.nightStart && clickedCell.nightEnd) {
                    // Find all cells that share the night with the clicked cell
                    // Categorize by sunset time relative to selected cell
                    const sharedCellsEarlier = []; // Sunset before or at same time as selected
                    const sharedCellsLater = [];   // Sunset after selected

                    data.grid.forEach(cell => {
                        if (cell === clickedCell) return; // Skip the clicked cell

                        const { sharedNight } = calculateSharedNight(clickedCell, cell);
                        if (sharedNight) {
                            // Compare sunset times
                            if (cell.nightStart.getTime() > clickedCell.nightStart.getTime()) {
                                sharedCellsLater.push(cell);  // Sunset is later (west of selected)
                            } else {
                                sharedCellsEarlier.push(cell); // Sunset is earlier or same (east of selected)
                            }
                        }
                    });

                    // Calculate latitude with most shared cells
                    const allSharedCells = [...sharedCellsEarlier, ...sharedCellsLater];
                    const latitudeCounts = {};
                    allSharedCells.forEach(cell => {
                        const lat = cell.lat;
                        latitudeCounts[lat] = (latitudeCounts[lat] || 0) + 1;
                    });

                    let maxLat = null;
                    let maxCount = 0;
                    Object.entries(latitudeCounts).forEach(([lat, count]) => {
                        if (count > maxCount) {
                            maxCount = count;
                            maxLat = parseFloat(lat);
                        }
                    });

                    setSharedNightMode({
                        selectedCell: clickedCell,
                        sharedCellsEarlier,
                        sharedCellsLater,
                        maxSharedLatitude: maxLat,
                        maxSharedCount: maxCount
                    });
                    setShowDebugPanel(false); // Close debug panel if open
                }
            })
            .on("mousemove", (event) => {
                const [lon, lat] = projection.invert(d3.pointer(event, svg.node()));
                const targetLon = Math.floor(lon / 2) * 2 + 1.0;
                const targetLat = Math.floor(lat / 2) * 2 + 1.0;
                const cell = data.grid.find(c => Math.abs(c.lat - targetLat) < 0.1 && Math.abs(c.lon - targetLon) < 0.1);
                if (cell) {
                    let country = 'Open Ocean';
                    if (worldFeaturesRef.current) {
                        const feat = worldFeaturesRef.current.find(f => d3.geoContains(f, [lon, lat]));
                        if (feat) country = feat.properties.name;
                    }
                    tooltipDiv.html(`<strong>${country}</strong><br/>Zone: ${zoneLabels[cell.code]}<br/>Lat: ${Math.abs(cell.lat).toFixed(1)}°${cell.lat >= 0 ? 'N' : 'S'}, Long: ${Math.abs(cell.lon).toFixed(1)}°${cell.lon >= 0 ? 'E' : 'W'}`)
                        .style("visibility", "visible").style("left", (event.pageX + 15) + "px").style("top", (event.pageY - 10) + "px");
                } else { tooltipDiv.style("visibility", "hidden"); }
            })
            .on("mouseout", () => tooltipDiv.style("visibility", "hidden"));

        // Render shared night borders if active
        // SVG Shared Night borders REMOVED - migrated to Canvas above to fix duplicate/painting issues
        if (sharedNightMode) {
            // Keep empty block or remove entirely if cleaning up
        }

        // Notify parent that render is complete - enable PDF export to proceed
        // SIMPLIFIED: Always call onRenderComplete when render effect completes
        if (onRenderComplete) {
            // Only fire if we haven't already fired for this trigger
            if (lastRenderedTrigger.current < calculationTrigger) {
                console.log(`[MoonMap ${instanceId.current}] Signaling render complete for trigger ${calculationTrigger}`);
                // Use a timeout to let the canvas repaint finish
                // Reduced from 100ms to 50ms for faster PDF export
                setTimeout(() => {
                    onRenderComplete();
                    lastRenderedTrigger.current = calculationTrigger;
                }, 50);
            } else {
                console.log(`[MoonMap ${instanceId.current}] Skipping duplicate render complete for trigger ${calculationTrigger}`);
            }
        }

        // SVG Shared Night borders REMOVED - migrated to Canvas for performance (O(N*M) fix)
        // SVG Selected Location border REMOVED - migrated to Canvas

        // Add resize listener to handle fullscreen and window resizing
        const handleResize = () => {
            // Trigger a re-render by incrementing renderKey
            setRenderKey(prev => prev + 1);
        };

        window.addEventListener('resize', handleResize);

        // Cleanup
        return () => {
            window.removeEventListener('resize', handleResize);
        };

    }, [data, selectedCell, renderKey, sharedNightMode, highlightSharedNightCells, calculationTrigger, onRenderComplete]);

    // NOTE: Second onRenderComplete callback removed - was causing duplicate/early calls


    const formatDateTime = (utcDate, localDate) => {
        if (!utcDate) return 'N/A';
        return `${utcDate.toUTCString().replace('GMT', 'UTC')} / ${localDate ? localDate.toLocaleString() : 'N/A'} (Local)`;
    };

    return (
        <div className="moon-map-container" ref={wrapperRef}>
            {loading && (
                <div className="loader">
                    <p>Calculating visibility...</p>
                    <div className="progress-bar-container">
                        <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
                    </div>
                    <span>{progress}%</span>
                </div>
            )}
            <div className="map-wrapper" style={{ position: 'relative' }}>
                {/* Selected Cell Info Display */}
                <div style={{
                    position: 'absolute',
                    top: '40px', // Increased from 10px to avoid map border/padding
                    left: '10px',
                    backgroundColor: 'rgba(15, 23, 42, 0.95)',
                    color: '#e2e8f0',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid #334155',
                    fontSize: '12px',
                    fontWeight: '500',
                    zIndex: 1000,
                    pointerEvents: 'none',
                    lineHeight: '1.6'
                }}>
                    <div><strong>Selected Cell:</strong> {sharedNightMode
                        ? `Lat: ${Math.abs(sharedNightMode.selectedCell.lat).toFixed(1)}°${sharedNightMode.selectedCell.lat >= 0 ? 'N' : 'S'}, Long: ${Math.abs(sharedNightMode.selectedCell.lon).toFixed(1)}°${sharedNightMode.selectedCell.lon >= 0 ? 'E' : 'W'}`
                        : 'None'
                    }</div>
                </div>
                <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}></canvas>
                <svg ref={svgRef} viewBox="0 0 870 820" preserveAspectRatio="xMidYMid meet" style={{ position: 'relative', zIndex: 1 }}></svg>
            </div>
        </div>
    );
};



export default MoonMap;
