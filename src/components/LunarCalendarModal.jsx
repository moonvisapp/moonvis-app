import React, { useState, useEffect, useRef } from 'react';
import MoonMap, { resetGlobalCalculationTracking, globalCalculationTracking } from './MoonMap';
import { calculateLunarCalendar, getHijriYear } from '../utils/lunarCalendar';
import { MAJOR_CITIES } from '../data/cities';
import { generateLunarCalendarPDF, captureMapAsImage } from '../utils/pdfExport';
import { getNightWindow } from '../utils/astronomy';

/**
 * Modal component for displaying lunar calendar
 */
function LunarCalendarModal({ isOpen, onClose, initialDate, initialLocation, onViewNight1, onCalendarCalculated, preservedCalendarData }) {
    const [modalDate, setModalDate] = useState('');
    const [modalLocationName, setModalLocationName] = useState('');
    const [calendarData, setCalendarData] = useState(null);
    const [isCalculating, setIsCalculating] = useState(false);
    const [calculationProgress, setCalculationProgress] = useState(0);
    const [exportProgressPercentage, setExportProgressPercentage] = useState(0);
    const [error, setError] = useState(null);
    const [lastModalParams, setLastModalParams] = useState({ date: null, location: null });
    const [isExportingPDF, setIsExportingPDF] = useState(false);
    const [exportProgress, setExportProgress] = useState('');

    // State for the hidden export map
    const hiddenMapWrapperRef = useRef(); // Ref for the actual DOM element to capture
    const [exportMapParams, setExportMapParams] = useState(null); // { date, callback }
    const pendingExportResolve = useRef(null);
    const isExportCancelledRef = useRef(false);
    const exportTriggerCounter = useRef(0); // Counter for export map triggers

    const onExportRenderComplete = React.useCallback(() => {
        if (pendingExportResolve.current) {
            console.log('[Modal] Hidden map render complete, resolving promise');
            pendingExportResolve.current();
            pendingExportResolve.current = null;
        }
    }, []);

    // Initialize state when modal opens with passed-through parameters
    useEffect(() => {
        if (isOpen) {
            setModalDate(initialDate?.toISOString().split('T')[0] || '');
            setModalLocationName(initialLocation?.name || '');
            setError(null);

            // If preserved data exists, use it directly
            if (preservedCalendarData) {
                console.log('[Modal] Using preserved calendar data');
                setCalendarData(preservedCalendarData);
                setIsCalculating(false);
            } else {
                // Otherwise reset and auto-calculate if both params provided
                setCalendarData(null);
                if (initialDate && initialLocation) {
                    // Call calculate directly here to avoid dependency issues
                    performCalculation(initialDate, initialLocation);
                }
            }
        }
    }, [isOpen, preservedCalendarData, initialDate, initialLocation]);

    // Ref to track if component is mounted/valid for updates
    const isCancelledRef = useRef(false);

    // Reset cancellation token on mount/update
    useEffect(() => {
        isCancelledRef.current = false;
        return () => {
            console.log('[Modal] Unmounting, setting cancelled ref to true');
            isCancelledRef.current = true;
            resetGlobalCalculationTracking(); // Clear cached grids
        };
    }, []);

    // Also cancel when isOpen becomes false (closing modal)
    useEffect(() => {
        if (!isOpen) {
            console.log('[Modal] Modal closed, cancelling any active operations');
            isCancelledRef.current = true;
            resetGlobalCalculationTracking(); // Clear cached grids
        } else {
            isCancelledRef.current = false;
        }
    }, [isOpen]);

    // Extracted calculation logic to avoid circular dependencies
    const performCalculation = async (dateParam, locationParam) => {
        // Explicitly start fresh
        isCancelledRef.current = false;

        setIsCalculating(true);
        setCalculationProgress(0);
        setError(null);

        try {
            console.log('[Modal] performCalculation called with:', { dateParam, locationParam });

            // Find the selected city
            const location = locationParam;

            if (!location) {
                console.error('[Modal] No location found');
                if (!isCancelledRef.current) {
                    setError('Please select a valid location');
                    setIsCalculating(false);
                }
                return;
            }

            // Ensure we have a valid Date object
            const date = dateParam instanceof Date ? dateParam : new Date(dateParam);
            console.log('[Modal] Date object:', date, 'Valid:', !isNaN(date.getTime()));

            if (isNaN(date.getTime())) {
                console.error('[Modal] Invalid date');
                if (!isCancelledRef.current) {
                    setError('Please select a valid date');
                    setIsCalculating(false);
                }
                return;
            }

            console.log('[Modal] Starting calculation for:', date.toDateString(), location.name);

            // Calculate lunar calendar asynchronously
            try {
                console.log('[Modal] Calling calculateLunarCalendar...');
                const result = await calculateLunarCalendar(
                    date,
                    location,
                    12,
                    (percentage) => {
                        // Only update state if not cancelled
                        if (!isCancelledRef.current) {
                            setCalculationProgress(Math.round(percentage));
                        }
                    },
                    () => isCancelledRef.current // Pass cancellation checker
                );

                // If result is null, it means it was cancelled
                if (!result) {
                    console.log('[Modal] Calculation returned null (cancelled)');
                    return;
                }

                console.log('[Modal] Calculation successful, months:', result.months.length);

                if (!isCancelledRef.current) {
                    setCalendarData(result);
                    setIsCalculating(false);

                    // Track the parameters after successful calculation
                    const calculatedDate = dateParam instanceof Date ? dateParam.toISOString().split('T')[0] : dateParam;
                    setLastModalParams({
                        date: calculatedDate,
                        location: locationParam.name
                    });

                    // Notify parent that calculation completed successfully
                    if (onCalendarCalculated) {
                        onCalendarCalculated(calculatedDate, locationParam.name);
                    }
                }
            } catch (err) {
                // If cancelled, don't show error
                if (isCancelledRef.current) return;

                console.error('[Modal] Error in calculateLunarCalendar:', err);
                console.error('[Modal] Error stack:', err.stack);
                setError('Failed to calculate lunar calendar. Please try different inputs.');
                setIsCalculating(false);
            }

        } catch (err) {
            if (isCancelledRef.current) return;

            console.error('[Modal] Error in performCalculation:', err);
            console.error('[Modal] Error stack:', err.stack);
            setError('An error occurred. Please try again.');
            setIsCalculating(false);
        }
    };

    // Close handler that ensures export cancellation
    const handleClose = () => {
        isExportCancelledRef.current = true;
        onClose(modalDate, modalLocationName);
    };

    const handleCalculate = async () => {
        // Use the current modal state values
        const location = MAJOR_CITIES.find(c => c.name === modalLocationName);

        if (!modalDate || !location) {
            setError('Please select both a date and location');
            return;
        }

        await performCalculation(modalDate, location);
    };

    const handleExportPDF = async () => {
        try {
            // Reset cancellation flag and trigger counter
            isExportCancelledRef.current = false;
            exportTriggerCounter.current = 0;

            setIsExportingPDF(true);
            setExportProgress('Preparing export...');
            setExportProgressPercentage(0);
            setError(null);

            if (!calendarData || !calendarData.months || calendarData.months.length === 0) {
                setError('No calendar data available to export');
                setIsExportingPDF(false);
                return;
            }

            console.log('--- STARTING TWO-PHASE PDF EXPORT ---');

            // ====== PHASE 1: PRE-CALCULATE ALL MAPS ======
            setExportProgress('Phase 1: Pre-calculating maps...');


            // Collect all months that need maps
            const mapsToCalculate = [];

            try {
                calendarData.months.forEach((month, idx) => {
                    console.log(`[Phase 1 Setup] Processing month ${idx + 1}:`, month.monthName);

                    // Calculate the three dates needed for each month
                    const night1Date = new Date(month.night1Date);
                    const nightBefore = new Date(night1Date);
                    nightBefore.setDate(nightBefore.getDate() - 1);
                    const nightAfter = new Date(night1Date);
                    nightAfter.setDate(nightAfter.getDate() + 1);

                    // Night before
                    mapsToCalculate.push({
                        date: nightBefore,
                        label: `${month.monthName} - Night Before`
                    });

                    // Night 1 (with highlighting if applicable)
                    const night1Options = {};
                    if (month.night1Method === 'shared_night' && month.night1Details?.inheritedFromCells) {
                        night1Options.highlightSharedNightCells = month.night1Details.inheritedFromCells;
                    }
                    mapsToCalculate.push({
                        date: night1Date,
                        label: `${month.monthName} - Night 1`,
                        options: night1Options
                    });

                    // Night after
                    mapsToCalculate.push({
                        date: nightAfter,
                        label: `${month.monthName} - Night After`
                    });
                });
            } catch (setupErr) {
                console.error('[Phase 1 Setup] Error collecting maps:', setupErr);
                throw new Error('Failed to prepare map list: ' + setupErr.message);
            }

            const totalMaps = mapsToCalculate.length;
            console.log(`[Phase 1] Will pre-calculate ${totalMaps} maps`);

            // Pre-calculate all maps in PARALLEL using Web Workers
            // Determine concurrency based on hardware (min 4, max 16)
            const concurrency = Math.max(4, Math.min(16, navigator.hardwareConcurrency || 4));
            console.log(`[Phase 1] Using ${concurrency} workers for ${totalMaps} maps`);

            // Initialize workers
            const workers = [];
            for (let i = 0; i < concurrency; i++) {
                workers.push(new Worker(new URL('../workers/mapCalculation.worker.js', import.meta.url), { type: 'module' }));
            }

            // Parallel Execution Logic
            await new Promise((resolve, reject) => {
                let tasksCompleted = 0;
                let nextTaskIndex = 0;
                let hasError = false;

                // Function to assign next task to a worker
                const assignTask = (worker) => {
                    if (hasError) return;

                    if (isExportCancelledRef.current) {
                        reject(new Error('Export cancelled'));
                        return;
                    }

                    if (nextTaskIndex >= mapsToCalculate.length) {
                        return; // No more tasks
                    }

                    const index = nextTaskIndex++;
                    const mapInfo = mapsToCalculate[index];

                    // Setup listener for this specific task
                    worker.onmessage = (e) => {
                        const { status, data, error } = e.data;

                        if (status === 'success') {
                            // CACHE THE RESULT GLOBALLY
                            // This ensures MoonMap will find it instantly in Phase 2
                            const dateKey = mapInfo.date.toISOString();
                            globalCalculationTracking.dataCache.set(dateKey, data);

                            tasksCompleted++;
                            const progressPct = Math.round((tasksCompleted / totalMaps) * 50); // Phase 1 = 0-50%

                            setExportProgress(`Calculating map ${tasksCompleted}/${totalMaps}: ${mapInfo.label}`);
                            setExportProgressPercentage(progressPct);

                            if (tasksCompleted === totalMaps) {
                                resolve();
                            } else {
                                assignTask(worker); // Get next task
                            }
                        } else {
                            hasError = true;
                            reject(new Error(error || 'Worker error'));
                        }
                    };

                    worker.onerror = (err) => {
                        hasError = true;
                        reject(err);
                    };

                    // Send task to worker - INCLUDE cityParams for integrated shared night calc
                    worker.postMessage({
                        dateStr: mapInfo.date.toISOString(),
                        workId: index,
                        params: {
                            cityParams: {
                                lat: Math.floor(calendarData.location.lat / 2) * 2 + 1.0,
                                lon: Math.floor(calendarData.location.lon / 2) * 2 + 1.0,
                                // Pre-calculate user's night window for this map's date
                                nightStart: getNightWindow(calendarData.location.lat, calendarData.location.lon, mapInfo.date)?.nightStart,
                                nightEnd: getNightWindow(calendarData.location.lat, calendarData.location.lon, mapInfo.date)?.nightEnd
                            }
                        }
                    });
                };

                // Start all workers
                workers.forEach(w => assignTask(w));
            }).finally(() => {
                // Terminate all workers when done or if error occurs
                workers.forEach(w => w.terminate());
            });

            console.log(`[Phase 1] Complete! Pre-calculated ${totalMaps} maps`);

            // ====== PHASE 2: CAPTURE AND ADD TO PDF ======
            // CRITICAL: Reset trigger counter to reuse cached calculations from Phase 1
            // Phase 1 used triggers 1-36, so Phase 2 should also use 1-36 (not 37-72)
            exportTriggerCounter.current = 0;
            console.log('[Phase 2] Reset trigger counter to reuse cached grids');

            setExportProgress('Phase 2: Generating PDF...');
            setExportProgressPercentage(50);

            // Callback for capturing already-calculated maps
            const captureMapCallback = async (date, options = {}) => {
                return new Promise((resolve) => {
                    let timeoutId;

                    const completeWithTimeout = (result) => {
                        if (timeoutId) clearTimeout(timeoutId);
                        resolve(result);
                    };

                    timeoutId = setTimeout(() => {
                        console.warn('[Phase 2] Map capture timed out for', date);
                        pendingExportResolve.current = null;
                        completeWithTimeout(null);
                    }, 30000);

                    // Capture the rendered map
                    pendingExportResolve.current = async () => {
                        try {
                            const mapWrapper = hiddenMapWrapperRef.current;
                            if (mapWrapper) {
                                setTimeout(async () => {
                                    try {
                                        const imageData = await captureMapAsImage(mapWrapper);
                                        completeWithTimeout(imageData);
                                    } catch (err) {
                                        console.error('Error in captureMapAsImage:', err);
                                        completeWithTimeout(null);
                                    }
                                }, 50);
                            } else {
                                completeWithTimeout(null);
                            }
                        } catch (e) {
                            console.error('Error capturing map', e);
                            completeWithTimeout(null);
                        }
                    };

                    // Trigger render (should use cached calculation)
                    setExportMapParams({
                        date: date,
                        location: calendarData.location,
                        trigger: ++exportTriggerCounter.current,
                        highlightSharedNightCells: options.highlightSharedNightCells || null
                    });
                });
            };

            await generateLunarCalendarPDF(
                calendarData,
                captureMapCallback,
                (percentage) => {
                    // Map 0-100% from PDF generation to 50-100% overall
                    const overallPct = 50 + Math.round(percentage / 2);
                    setExportProgressPercentage(overallPct);
                    setExportProgress(`Adding to PDF: ${percentage}%`);
                },
                () => isExportCancelledRef.current
            );

            setExportProgress('PDF generated successfully!');
            setExportProgressPercentage(100);
            console.log('--- PDF EXPORT COMPLETE ---');

            setTimeout(() => {
                setIsExportingPDF(false);
                setExportProgress('');
            }, 2000);
        } catch (err) {
            if (err.message === 'Export cancelled' || isExportCancelledRef.current) {
                console.log('PDF export was cancelled');
                setExportProgress('');
                setIsExportingPDF(false);
                return;
            }

            console.error('Error exporting PDF:', err);
            setError('Failed to export PDF. Please try again.');
            setIsExportingPDF(false);
            setExportProgress('');
        }
    };

    // Check if modal parameters have changed from last calculation
    const modalParamsChanged =
        lastModalParams.date !== modalDate ||
        lastModalParams.location !== modalLocationName;

    if (!isOpen) return null;

    return (
        <div className="lunar-calendar-modal-overlay" onClick={handleClose}>
            <div className="lunar-calendar-modal" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="modal-header">
                    <h2>Lunar Calendar</h2>
                    <button className="modal-close-button" onClick={handleClose}>
                        ×
                    </button>
                </div>

                {/* Input Controls */}
                <div className="modal-controls">
                    <div className="modal-input-group">
                        <label htmlFor="modal-date-picker">Start Date (Sunset of):</label>
                        <input
                            id="modal-date-picker"
                            type="date"
                            value={modalDate}
                            onChange={(e) => setModalDate(e.target.value)}
                            disabled={isCalculating}
                        />
                    </div>

                    <div className="modal-input-group">
                        <label htmlFor="modal-location-selector">Location:</label>
                        <select
                            id="modal-location-selector"
                            value={modalLocationName}
                            onChange={(e) => setModalLocationName(e.target.value)}
                            disabled={isCalculating}
                        >
                            <option value="">Select a location</option>
                            {MAJOR_CITIES.map((city, idx) => (
                                <option key={idx} value={city.name}>
                                    {city.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="modal-input-group">
                        <button
                            onClick={handleCalculate}
                            disabled={isCalculating || !modalDate || !modalLocationName || !modalParamsChanged}
                            className="recalculate-button"
                            style={{
                                padding: '10px 20px',
                                fontSize: '16px',
                                fontWeight: '600',
                                backgroundColor: (!isCalculating && modalDate && modalLocationName && modalParamsChanged) ? '#10b981' : '#9ca3af',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: (!isCalculating && modalDate && modalLocationName && modalParamsChanged) ? 'pointer' : 'not-allowed',
                                transition: 'background-color 0.2s',
                                opacity: (!isCalculating && modalDate && modalLocationName && modalParamsChanged) ? 1 : 0.6
                            }}
                            onMouseOver={(e) => {
                                if (!isCalculating && modalDate && modalLocationName && modalParamsChanged) {
                                    e.target.style.backgroundColor = '#059669';
                                }
                            }}
                            onMouseOut={(e) => {
                                if (!isCalculating && modalDate && modalLocationName && modalParamsChanged) {
                                    e.target.style.backgroundColor = '#10b981';
                                }
                            }}
                            title={!modalParamsChanged ? 'Calendar already calculated for this date and location' : ''}
                        >
                            {isCalculating ? 'Calculating...' : 'Calculate Lunar Calendar'}
                        </button>

                        {!isCalculating && calendarData && (
                            <button
                                onClick={handleExportPDF}
                                disabled={isExportingPDF}
                                className="export-pdf-button"
                                style={{
                                    padding: '10px 20px',
                                    fontSize: '16px',
                                    fontWeight: '600',
                                    backgroundColor: isExportingPDF ? '#9ca3af' : '#f59e0b',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '6px',
                                    cursor: isExportingPDF ? 'not-allowed' : 'pointer',
                                    transition: 'background-color 0.2s',
                                    marginLeft: '10px',
                                    opacity: isExportingPDF ? 0.6 : 1
                                }}
                                onMouseOver={(e) => {
                                    if (!isExportingPDF) {
                                        e.target.style.backgroundColor = '#d97706';
                                    }
                                }}
                                onMouseOut={(e) => {
                                    if (!isExportingPDF) {
                                        e.target.style.backgroundColor = '#f59e0b';
                                    }
                                }}
                            >
                                {isExportingPDF ? 'Exporting...' : 'Export to PDF'}
                            </button>
                        )}
                    </div>
                </div>

                {/* Content */}
                <div className="modal-content">
                    {error && (
                        <div className="modal-error">
                            {error}
                        </div>
                    )}

                    {isCalculating && (
                        <div className="modal-loading">
                            <p style={{ marginBottom: '16px', fontSize: '16px', fontWeight: '600' }}>
                                Calculating lunar calendar: {calculationProgress}% complete
                            </p>
                            <div style={{
                                width: '100%',
                                height: '24px',
                                backgroundColor: '#e5e7eb',
                                borderRadius: '12px',
                                overflow: 'hidden',
                                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)',
                                position: 'relative',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <div style={{
                                    position: 'absolute',
                                    left: 0,
                                    top: 0,
                                    width: `${calculationProgress}%`,
                                    height: '100%',
                                    backgroundColor: '#10b981',
                                    transition: 'width 0.3s ease'
                                }}>
                                </div>
                                <span style={{
                                    position: 'relative',
                                    zIndex: 1,
                                    color: 'black',
                                    fontSize: '12px',
                                    fontWeight: '600'
                                }}>
                                    {calculationProgress}%
                                </span>
                            </div>
                            <p style={{ marginTop: '12px', fontSize: '14px', color: '#6b7280' }}>
                                Calculating month {Math.min(12, Math.ceil(calculationProgress * 12 / 100))} of 12...
                            </p>
                        </div>
                    )}

                    {isExportingPDF && (
                        <div className="modal-loading">
                            <p style={{ marginBottom: '16px', fontSize: '16px', fontWeight: '600', color: '#f59e0b' }}>
                                {exportProgress}
                            </p>
                            {exportProgressPercentage > 0 ? (
                                <>
                                    <div style={{
                                        position: 'relative',
                                        width: '100%',
                                        height: '24px',
                                        backgroundColor: '#e5e7eb',
                                        borderRadius: '12px',
                                        overflow: 'hidden',
                                        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <div style={{
                                            position: 'absolute',
                                            left: 0,
                                            top: 0,
                                            width: `${exportProgressPercentage}%`,
                                            height: '100%',
                                            backgroundColor: '#f59e0b',
                                            transition: 'width 0.3s ease'
                                        }}>
                                        </div>
                                        <span style={{
                                            position: 'relative',
                                            zIndex: 1,
                                            color: 'black',
                                            fontSize: '12px',
                                            fontWeight: '600'
                                        }}>
                                            {exportProgressPercentage}%
                                        </span>
                                    </div>
                                </>
                            ) : (
                                <div style={{
                                    width: '100%',
                                    height: '4px',
                                    backgroundColor: '#e5e7eb',
                                    borderRadius: '2px',
                                    overflow: 'hidden'
                                }}>
                                    <div style={{
                                        width: '100%',
                                        height: '100%',
                                        backgroundColor: '#f59e0b',
                                        animation: 'pulse 1.5s ease-in-out infinite'
                                    }}>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {!isCalculating && !error && calendarData && (
                        <div className="calendar-display">
                            <div className="calendar-info">
                                <p><strong>Location:</strong> {calendarData.location.name}</p>
                                <p><strong>Geographic Coordinates:</strong> Lat: {Math.abs(calendarData.location.lat).toFixed(1)}°{calendarData.location.lat >= 0 ? 'N' : 'S'}, Long: {Math.abs(calendarData.location.lon).toFixed(1)}°{calendarData.location.lon >= 0 ? 'E' : 'W'}</p>
                                <p className="calendar-note">
                                    <em>Calendar generated based on moon visibility at this location</em>
                                </p>
                            </div>

                            {calendarData.months.map((month, monthIndex) => {
                                const tenthDayIndex = Math.min(9, month.days.length - 1);
                                const refDateForYear = month.days[tenthDayIndex]?.gregorianDate || month.night1Date;
                                const hijriYear = getHijriYear(refDateForYear);

                                return (
                                    <div key={monthIndex} className="lunar-month">
                                        <div className="month-header">
                                            <h3>{month.monthName} {hijriYear}</h3>
                                            <p className="month-details">
                                                Night 1: {month.night1Date.toLocaleDateString()}
                                                ({month.night1Method === 'direct' ? 'Direct visibility' : 'Shared Night inheritance'})
                                            </p>
                                        </div>

                                        <table className="lunar-calendar-table">
                                            <thead>
                                                <tr>
                                                    <th>Night #</th>
                                                    <th>Lunar Month</th>
                                                    <th>Hijri Year</th>
                                                    <th>Gregorian Date - Evening of</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {month.days.map((day, dayIndex) => (
                                                    <tr key={dayIndex}>
                                                        <td>
                                                            {day.nightNumber === 1 ? (
                                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                                    <span>{day.nightNumber}</span>
                                                                    <button
                                                                        onClick={(e) => {
                                                                            e.preventDefault();
                                                                            if (onViewNight1) {
                                                                                onViewNight1(month.night1Date, calendarData.location.name, calendarData);
                                                                            }
                                                                        }}
                                                                        style={{
                                                                            padding: '2px 8px',
                                                                            fontSize: '11px',
                                                                            backgroundColor: '#3b82f6',
                                                                            color: 'white',
                                                                            border: 'none',
                                                                            borderRadius: '4px',
                                                                            cursor: 'pointer',
                                                                            fontWeight: '500'
                                                                        }}
                                                                        title="View visibility map for Night 1"
                                                                    >
                                                                        View Map
                                                                    </button>
                                                                </div>
                                                            ) : (
                                                                day.nightNumber
                                                            )}
                                                        </td>
                                                        <td>{month.monthName}</td>
                                                        <td>{hijriYear}</td>
                                                        <td>{day.gregorianDate.toLocaleDateString('en-US', {
                                                            weekday: 'short',
                                                            year: 'numeric',
                                                            month: 'short',
                                                            day: 'numeric'
                                                        })}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>


            {/* Hidden Map for Export - Rendered behind modal but physically present for html2canvas */}
            <div
                id="hidden-export-map-container"
                style={{
                    position: 'absolute',
                    top: '-9999px',
                    left: '-9999px',
                    width: '870px',
                    height: 'auto',
                    overflow: 'visible',
                    visibility: 'visible' // Must be visible for html2canvas
                }}
            >
                {/* Only render if we have valid params to avoid errors on init */}
                {exportMapParams && (
                    <MoonMap
                        wrapperRef={hiddenMapWrapperRef}
                        date={exportMapParams.date}
                        selectedCity={exportMapParams.location}
                        calculationTrigger={exportMapParams.trigger} // Trigger re-calculation on change
                        highlightSharedNightCells={exportMapParams.highlightSharedNightCells}
                        onRenderComplete={onExportRenderComplete}
                        enableYielding={false}
                    />
                )}
            </div>
        </div >
    );
}

export default LunarCalendarModal;
