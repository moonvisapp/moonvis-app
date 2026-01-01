/* eslint-disable no-restricted-globals */
import {
    getVisibility,
    getPrevNewMoonConjunction,
    getNextNewMoonConjunction,
    getGeocentricConjunction,
    getNightWindow
} from '../utils/astronomy';

// Listen for messages from the main thread
self.onmessage = async (e) => {
    const { type = 'full_grid', dateStr, workId, params } = e.data;

    try {
        if (!dateStr) {
            throw new Error('No date provided to worker');
        }

        const date = new Date(dateStr);
        if (isNaN(date.getTime())) {
            throw new Error('Invalid date provided to worker');
        }

        // Pre-compute conjunction time once
        const conjunctionTime = getGeocentricConjunction(date);
        const prevConjunction = getPrevNewMoonConjunction(date);
        const nextConjunction = getNextNewMoonConjunction(date);

        if (type === 'search_shared') {
            // --- SEARCH SHARED NIGHT MODE ---
            // Efficiently search for cells that share night with user and have visibility
            // Returns only matching cells, or empty array

            const { latStart, latEnd, userNightStart, userNightEnd } = params;
            const userSunsetTime = new Date(userNightStart).getTime();
            const matchingCells = [];

            const stepLon = 2;
            const stepLat = 2;

            for (let lat = latStart; lat <= latEnd; lat += stepLat) {
                for (let lon = -179.0; lon <= 179.0; lon += stepLon) {
                    try {
                        const res = getVisibility(date, lat, lon, 'odeh', conjunctionTime);

                        // optimization: check visibility code first before heavy night window calc?
                        // actually getVisibility is heavy part. 
                        // But we need night window to check shared night.

                        // Wait, spec logic says:
                        // 1. Check Night Window
                        // 2. Check Shared Night
                        // 3. Check Visibility
                        // We should follow that order for performance if possible, 
                        // BUT getVisibility calculates sunset internally faster than getNightWindow which does it again.
                        // However, let's stick to the efficient order: 
                        // Calculate Night Window -> Check Shared -> Check Visibility.
                        // We need a lightweight "getNightWindow" that doesn't do full visibility physics if possible.
                        // But getNightWindow uses Astronomy Engine which is fast enough.

                        const nightWindow = getNightWindow(lat, lon, date, conjunctionTime, res.sunsetUTC); // pass sunset if we have it?
                        // Actually, let's reverse:
                        // 1. Get Night Window (relatively cheap)
                        // 2. Check overlap
                        // 3. ONLY THEN calc visibility (heavy)

                        // Re-implementing optimized loop:

                        // 1. Night Window
                        // We need to calculate sunset for this cell. 
                        // getNightWindow does this.
                        // Optimization: pass known sunset? accessing res.sunsetUTC implies we ran getVisibility.
                        // We want to avoid running getVisibility if not needed.

                        const nw = getNightWindow(lat, lon, date, conjunctionTime);
                        if (!nw) continue;

                        // 2. Shared Night Check
                        // overlap_start = max(userStart, cellStart)
                        // overlap_end = min(userEnd, cellEnd)
                        const A_start = userNightStart; // timestamp numbers passed in
                        const A_end = userNightEnd;
                        const B_start = nw.nightStart.getTime();
                        const B_end = nw.nightEnd.getTime();

                        const overlap_start = Math.max(A_start, B_start);
                        const overlap_end = Math.min(A_end, B_end);

                        if (overlap_start >= overlap_end) continue; // No overlap

                        // 3. Sunset Order Check (User must be later/West or overlap logic handled?)
                        // "User sunset must be AFTER cell sunset"?? 
                        // Logic in lunarCalendar.js: if (userSunset < cellSunset) continue;
                        // Wait, userSunset < cellSunset means User sunset is EARLIER. 
                        // So we want User Sunset >= Cell Sunset ??
                        // Let's copy the logic exactly:
                        // const cellSunset = cellNightWindow.nightStart.getTime();
                        // if (userSunset < cellSunset) continue; 

                        if (userSunsetTime < B_start) continue;

                        // 4. Heavy Visibility Check
                        const vis = getVisibility(date, lat, lon, 'odeh', conjunctionTime);

                        if (vis.code === 'VO' || vis.code === 'VP' || vis.code === 'EV') {
                            matchingCells.push({
                                lat,
                                lon,
                                classification: vis.code,
                                overlapDuration: (overlap_end - overlap_start) / 60000
                            });

                            // Optimization: If we just need to find "is it visible anywhere", 
                            // we could stop here? 
                            // BUT: The original code returns ALL matching cells for highlighting.
                            // So we must continue finding all of them in this chunk.
                        }

                    } catch (err) {
                        // ignore
                    }
                }
            }

            self.postMessage({
                status: 'success',
                workId,
                dateStr,
                data: matchingCells // Array of matching cells
            });

        } else if (type === 'check_shared_for_location') {
            // --- CHECK SHARED NIGHT FOR SPECIFIC LOCATION ---
            // Replicates the interactive "double click" logic from MoonMap.jsx
            // Recalculates shared night for all cells relative to a selected cell

            const { selectedCellLon, selectedCellLat, selectedNightStart, selectedNightEnd } = params;
            const selectedStart = new Date(selectedNightStart).getTime();
            const selectedEnd = new Date(selectedNightEnd).getTime();

            const sharedCellsEarlier = [];
            const sharedCellsLater = [];

            // We need to iterate over the FULL grid logic again
            // optimization: assuming we just recalculate properties needed for shared check (night window)
            // BUT we also need the cell coordinates. 
            // Since we don't persist the grid in the worker (stateless), we must re-iterate loops.

            const stepLon = 2;
            const stepLat = 2;
            const lats = [];
            for (let lat = -59; lat <= 59; lat += stepLat) lats.push(lat);

            for (let i = 0; i < lats.length; i++) {
                const lat = lats[i];
                for (let lon = -179.0; lon <= 179.0; lon += stepLon) {
                    // Skip the selected cell itself (approximate match)
                    // Target matching logic from MoonMap:
                    // const targetLat = Math.floor(selectedCity.lat / 2) * 2 + 1.0;
                    // const targetLon = Math.floor(selectedCity.lon / 3) * 3 + 1.5;

                    // We can just check rough equality
                    if (Math.abs(lat - selectedCellLat) < 0.1 && Math.abs(lon - selectedCellLon) < 0.1) continue;

                    try {
                        // We need night window for this cell
                        // Optimization: Try to get night window without full visibility calc if possible?
                        // getNightWindow needs: lat, lon, date, conjunctionTime. (Sunset is optional optimization)
                        const nightWindow = getNightWindow(lat, lon, date, conjunctionTime);

                        if (nightWindow && nightWindow.nightStart && nightWindow.nightEnd) {
                            // Copied logic from calculateSharedNight(cell A, cell B)
                            // Re-implementing logic here to avoid importing circular deps or heavy utils if possible
                            // But we can import calculateSharedNight? Yes, it is imported at top.

                            // Construct a minimal cell object for calculateSharedNight
                            const currentCell = {
                                lat, lon,
                                nightStart: nightWindow.nightStart,
                                nightEnd: nightWindow.nightEnd
                            };

                            const selectedCellObj = {
                                lat: selectedCellLat,
                                lon: selectedCellLon,
                                nightStart: new Date(selectedNightStart),
                                nightEnd: new Date(selectedNightEnd)
                            };

                            // Actually, calculateSharedNight is not exported from mapCalculation.worker.js imports?
                            // Check imports... yes it is imported: import { ..., calculateSharedNight } 
                            // Wait, line 2 imports: getVisibility, ..., getNightWindow. 
                            // I need to add calculateSharedNight to the import list first!

                            // Let's assume I will fix the import in a separate edit or this one if range allows. 
                            // The range I see is 1-185. I am editing the message block. 
                            // I should assume calculateSharedNight IS NOT imported yet based on what I saw (lines 2-8).
                            // Lines 2-8: 
                            // import {
                            //    getVisibility, ...
                            //    getNightWindow
                            // } from '../utils/astronomy';

                            // So I cannot use calculateSharedNight unless I import it.
                            // I will implement the logic inline or use a separate tool call to fix imports.
                            // Inline logic is safer to avoid breaking if I forget to update imports.

                            // Logic from `calculateSharedNight(A, B)`:
                            // START Inline
                            const A = selectedCellObj;
                            const B = currentCell;

                            const aStart = A.nightStart.getTime();
                            const aEnd = A.nightEnd.getTime();
                            const bStart = B.nightStart.getTime();
                            const bEnd = B.nightEnd.getTime();

                            // Check overlap
                            const overlapStart = Math.max(aStart, bStart);
                            const overlapEnd = Math.min(aEnd, bEnd);
                            const hasOverlay = overlapStart < overlapEnd;
                            // END Inline

                            if (hasOverlay) {
                                if (bStart > aStart) {
                                    sharedCellsLater.push(currentCell);
                                } else {
                                    sharedCellsEarlier.push(currentCell);
                                }
                            }
                        }
                    } catch (e) {
                        // ignore
                    }
                }
            }

            // Construct partial selected cell for response (enough for UI)
            const selectedCell = {
                lat: selectedCellLat,
                lon: selectedCellLon,
                nightStart: new Date(selectedNightStart),
                nightEnd: new Date(selectedNightEnd)
            };

            self.postMessage({
                status: 'success',
                type: 'shared_result', // Explicit type match
                workId,
                dateStr,
                data: {
                    sharedCellsEarlier,
                    sharedCellsLater,
                    selectedCell
                }
            });

        } else {
            // --- FULL GRID MODE (Default) ---
            const { cityParams } = params || {};

            const grid = [];
            const sharedCellsEarlier = [];
            const sharedCellsLater = [];

            let selectedCellObj = null;
            if (cityParams) {
                selectedCellObj = {
                    lat: cityParams.lat,
                    lon: cityParams.lon,
                    nightStart: new Date(cityParams.nightStart).getTime(),
                    nightEnd: new Date(cityParams.nightEnd).getTime()
                };
            }

            const stepLon = 2;
            const stepLat = 2;

            const lats = [];
            // Limit to ±60° latitude range
            for (let lat = -59; lat <= 59; lat += stepLat) lats.push(lat);

            for (let i = 0; i < lats.length; i++) {
                const lat = lats[i];
                for (let lon = -179.0; lon <= 179.0; lon += stepLon) {
                    try {
                        const res = getVisibility(date, lat, lon, 'odeh', conjunctionTime);
                        const nightWindow = getNightWindow(lat, lon, date, conjunctionTime, res.sunsetUTC);

                        const cellData = {
                            lat, lon,
                            code: res.code, value: res.value, color: res.color, reason: res.reason || null, zoneName: res.zoneName,
                            tzHours: res.tzHours, sunsetUTC: res.sunsetUTC, moonsetUTC: res.moonsetUTC, bestTimeUTC: res.bestTimeUTC,
                            sunsetLocal: res.sunsetLocal, moonsetLocal: res.moonsetLocal, bestTimeLocal: res.bestTimeLocal,
                            conjunctionTime: res.conjunctionTime, conjunctionTriggered: res.conjunctionTriggered, arcv: res.arcv, w: res.w, lag: res.lag,
                            nightStart: nightWindow?.nightStart || null, nightEnd: nightWindow?.nightEnd || null
                        };

                        grid.push(cellData);

                        // --- SHARED NIGHT CALCULATION (Integrated) ---
                        if (selectedCellObj && nightWindow && nightWindow.nightStart && nightWindow.nightEnd) {
                            // Check if this is the selected cell itself
                            const isSelected = Math.abs(lat - selectedCellObj.lat) < 0.1 && Math.abs(lon - selectedCellObj.lon) < 0.1;

                            if (!isSelected) {
                                const aStart = selectedCellObj.nightStart;
                                const aEnd = selectedCellObj.nightEnd;
                                const bStart = nightWindow.nightStart.getTime();
                                const bEnd = nightWindow.nightEnd.getTime();

                                // Overlap logic
                                const overlapStart = Math.max(aStart, bStart);
                                const overlapEnd = Math.min(aEnd, bEnd);

                                if (overlapStart < overlapEnd) {
                                    if (bStart > aStart) {
                                        sharedCellsLater.push({ lat, lon, nightStart: nightWindow.nightStart, nightEnd: nightWindow.nightEnd });
                                    } else {
                                        sharedCellsEarlier.push({ lat, lon, nightStart: nightWindow.nightStart, nightEnd: nightWindow.nightEnd });
                                    }
                                }
                            }
                        }

                    } catch (err) {
                        // Ignore individual cell errors
                    }
                }
            }

            // Calculate max shared latitude for the response
            let maxLat = null;
            let maxCount = 0;
            if (cityParams) {
                const allShared = [...sharedCellsEarlier, ...sharedCellsLater];
                const counts = {};
                allShared.forEach(c => counts[c.lat] = (counts[c.lat] || 0) + 1);
                Object.entries(counts).forEach(([l, c]) => {
                    if (c > maxCount) { maxCount = c; maxLat = parseFloat(l); }
                });
            }

            self.postMessage({
                status: 'success',
                workId,
                dateStr,
                data: {
                    grid,
                    conjunctionTime,
                    prevConjunction,
                    nextConjunction,
                    // Integrated shared night results
                    sharedNightResult: cityParams ? {
                        sharedCellsEarlier,
                        sharedCellsLater,
                        selectedCell: {
                            lat: selectedCellObj.lat,
                            lon: selectedCellObj.lon,
                            nightStart: new Date(selectedCellObj.nightStart),
                            nightEnd: new Date(selectedCellObj.nightEnd)
                        },
                        maxSharedLatitude: maxLat,
                        maxSharedCount: maxCount
                    } : null
                }
            });
        }

    } catch (error) {
        self.postMessage({
            status: 'error',
            workId,
            dateStr,
            error: error.message
        });
    }
};
