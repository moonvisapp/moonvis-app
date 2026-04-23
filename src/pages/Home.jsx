import React, { useState, useMemo } from 'react';
import MoonMap from '../components/MoonMap';
import LunarCalendarModal from '../components/LunarCalendarModal';
import AdBanner from '../components/AdBanner'; // Import AdBanner
import { MAJOR_CITIES } from '../data/cities';
// import '../App.css'; // Removed as styles should still be available globally or we can import if needed

function Home() {
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [selectedCityName, setSelectedCityName] = useState('');
    const [calculationTrigger, setCalculationTrigger] = useState(0);
    const [showCalendarModal, setShowCalendarModal] = useState(false);
    const [preservedCalendarData, setPreservedCalendarData] = useState(null);
    const [cameFromCalendar, setCameFromCalendar] = useState(false);
    const [highlightSharedNightCells, setHighlightSharedNightCells] = useState(null);
    const [lastCalendarParams, setLastCalendarParams] = useState({ date: null, location: null });
    const [lastVisibilityParams, setLastVisibilityParams] = useState({ date: null, location: null });

    const handleCalculate = () => {
        setCalculationTrigger(prev => prev + 1);
        // Track the parameters used for this visibility calculation
        setLastVisibilityParams({
            date: selectedDate,
            location: selectedCityName
        });
    };

    const handleViewNight1 = (night1Date, locationName, calendarData) => {
        // Preserve the calendar data before closing modal
        setPreservedCalendarData(calendarData);
        setCameFromCalendar(true);

        // Extract the monthly data to check if Night 1 was via shared night inheritance
        const month = calendarData.months.find(m =>
            m.night1Date.toISOString().split('T')[0] === night1Date.toISOString().split('T')[0]
        );

        // If Night 1 was detected via shared night, extract the inherited cells
        if (month && month.night1Method === 'shared_night' && month.night1Details?.inheritedFromCells) {
            console.log('[App] Night 1 via shared night, highlighting', month.night1Details.inheritedFromCells.length, 'cells');
            setHighlightSharedNightCells(month.night1Details.inheritedFromCells);
        } else {
            console.log('[App] Night 1 via direct visibility, no cell highlighting');
            setHighlightSharedNightCells(null);
        }

        // Set the date to Night 1 date
        const dateStr = night1Date.toISOString().split('T')[0];
        setSelectedDate(dateStr);
        // Set the location
        setSelectedCityName(locationName);

        // Update both parameter trackers since we're navigating to a specific date/location
        // and we already have the calendar data for these params
        setLastCalendarParams({
            date: dateStr,
            location: locationName
        });

        // Close the modal
        setShowCalendarModal(false);
        // Trigger calculation after a short delay to ensure state is updated
        setTimeout(() => {
            setCalculationTrigger(prev => prev + 1);
            // Also update visibility params after calculation is triggered
            setLastVisibilityParams({
                date: dateStr,
                location: locationName
            });
        }, 100);
    };

    const handleBackToCalendar = () => {
        setShowCalendarModal(true);
    };

    const handleCloseCalendar = (dateFromModal, locationFromModal) => {
        setShowCalendarModal(false);

        // Sync state from modal if provided (user might have changed it)
        if (dateFromModal) {
            setSelectedDate(dateFromModal);
        }
        if (locationFromModal) {
            setSelectedCityName(locationFromModal);
            // We also want to trigger a recalculation on the main map effectively
            // but we'll let the user click "Calculate" or handle it via a layout effect if preferred.
            // For now, updating the inputs is sufficient per the request.
        }

        // Clear preserved data when manually closing (not from Night 1 click)
        if (!cameFromCalendar) {
            setPreservedCalendarData(null);
        }
    };

    const handleOpenCalendar = () => {
        // Clear preserved data when opening fresh
        setPreservedCalendarData(null);
        setCameFromCalendar(false);
        setHighlightSharedNightCells(null);
        setShowCalendarModal(true);
    };

    const handleCalendarCalculated = (date, location) => {
        // Track the parameters after successful calendar calculation
        setLastCalendarParams({
            date: date,
            location: location
        });
    };

    // Get city coordinates from name
    const selectedCity = selectedCityName
        ? MAJOR_CITIES.find(c => c.name === selectedCityName)
        : null;

    // Memoize the initial date object to prevent creating new Date on every render
    // which would trigger modal recalculation
    const initialDateObj = useMemo(() => new Date(selectedDate), [selectedDate]);

    // Validate that selectedDate creates a valid Date object
    const dateObj = useMemo(() => {
        const d = new Date(selectedDate);
        return isNaN(d.getTime()) ? null : d;
    }, [selectedDate]);

    // Check if calendar parameters have changed from last calculation
    const calendarParamsChanged =
        lastCalendarParams.date !== selectedDate ||
        lastCalendarParams.location !== selectedCityName;

    // Check if visibility parameters have changed from last calculation
    const visibilityParamsChanged =
        lastVisibilityParams.date !== selectedDate ||
        lastVisibilityParams.location !== selectedCityName;

    return (
        <>
            <main className="app-main">
                <section className="controls">
                    <div className="input-group">
                        <label htmlFor="date-picker">Reference Date (Evening of):</label>
                        <input
                            id="date-picker"
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="city-selector">City (Optional):</label>
                        <select
                            id="city-selector"
                            value={selectedCityName}
                            onChange={(e) => setSelectedCityName(e.target.value)}
                        >
                            <option value="">None - Show full map</option>
                            {MAJOR_CITIES.map((city, idx) => (
                                <option key={idx} value={city.name}>
                                    {city.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="input-group">
                        <button
                            onClick={handleCalculate}
                            disabled={!visibilityParamsChanged}
                            className="calculate-button"
                            style={{
                                padding: '10px 20px',
                                fontSize: '16px',
                                fontWeight: '600',
                                backgroundColor: visibilityParamsChanged ? '#3b82f6' : '#9ca3af',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: visibilityParamsChanged ? 'pointer' : 'not-allowed',
                                transition: 'background-color 0.2s',
                                marginRight: '10px',
                                opacity: visibilityParamsChanged ? 1 : 0.6
                            }}
                            onMouseOver={(e) => {
                                if (visibilityParamsChanged) {
                                    e.target.style.backgroundColor = '#2563eb';
                                }
                            }}
                            onMouseOut={(e) => {
                                if (visibilityParamsChanged) {
                                    e.target.style.backgroundColor = '#3b82f6';
                                }
                            }}
                            title={!visibilityParamsChanged ? 'Visibility already calculated for this date and location' : ''}
                        >
                            Calculate Visibility
                        </button>

                        <button
                            onClick={handleOpenCalendar}
                            className="lunar-calendar-button"
                            disabled={!selectedDate || !selectedCityName}
                            style={{
                                padding: '10px 20px',
                                fontSize: '16px',
                                fontWeight: '600',
                                backgroundColor: (selectedDate && selectedCityName) ? '#10b981' : '#9ca3af',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: (selectedDate && selectedCityName) ? 'pointer' : 'not-allowed',
                                transition: 'background-color 0.2s',
                                opacity: (selectedDate && selectedCityName) ? 1 : 0.6
                            }}
                            onMouseOver={(e) => {
                                if (selectedDate && selectedCityName) {
                                    e.target.style.backgroundColor = '#059669';
                                }
                            }}
                            onMouseOut={(e) => {
                                if (selectedDate && selectedCityName) {
                                    e.target.style.backgroundColor = '#10b981';
                                }
                            }}
                            title={''}
                        >
                            Calculate Lunar Calendar
                        </button>

                        {cameFromCalendar && preservedCalendarData && (
                            <button
                                onClick={handleBackToCalendar}
                                className="back-to-calendar-button"
                                style={{
                                    padding: '10px 20px',
                                    fontSize: '16px',
                                    fontWeight: '600',
                                    backgroundColor: '#6366f1',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    transition: 'background-color 0.2s',
                                    marginLeft: '10px'
                                }}
                                onMouseOver={(e) => e.target.style.backgroundColor = '#4f46e5'}
                                onMouseOut={(e) => e.target.style.backgroundColor = '#6366f1'}
                            >
                                ← Back to Calendar
                            </button>
                        )}
                    </div>
                </section>

                <section className="visualization-section">
                    {dateObj ? (
                        <MoonMap
                            date={dateObj}
                            calculationTrigger={calculationTrigger}
                            selectedCity={selectedCity}
                            highlightSharedNightCells={highlightSharedNightCells}
                        />
                    ) : (
                        <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
                            <p>Please enter a valid date to view moon visibility</p>
                        </div>
                    )}
                </section>
            </main>

            <article className="seo-publisher-content" style={{
                maxWidth: '800px',
                margin: '40px auto',
                padding: '0 20px',
                color: '#e2e8f0',
                lineHeight: '1.6',
                fontFamily: 'system-ui, -apple-system, sans-serif'
            }}>
                <h2 style={{ color: '#ffffff', borderBottom: '2px solid #334155', paddingBottom: '10px' }}>
                    Welcome to the Moon Visibility Explorer
                </h2>
                <p style={{
                    fontFamily: "'Noto Sans Arabic', sans-serif",
                    direction: 'rtl',
                    textAlign: 'right',
                    color: '#94a3b8',
                    fontSize: '0.9rem',
                    lineHeight: '1.8',
                    marginBottom: '1rem',
                }}>
                    مرحباً بكم في مستكشف رؤية القمر — أداتكم الشاملة للتنبؤ برؤية الهلال وحساب التقويم الهجري
                </p>
                <p>
                    The Moon Visibility Explorer is an advanced astronomical tool designed for individuals, communities, and researchers who need accurate predictions for lunar crescent visibility. By utilizing the well-regarded scientifically-validated <strong style={{ color: '#ffffff' }}>Odeh V-criterion</strong>, our calculator provides high-resolution data on moon sightings and generates reliable Hijri calendars for over 70 major cities globally. Whether you need to determine the start of Ramadan, plan for Eid al-Fitr, or calculate Hajj dates, this tool delivers the scientific data you need.
                </p>

                <h3 style={{ color: '#ffffff', marginTop: '30px' }}>How to Use This Calculator</h3>
                <p>
                    To get started, simply utilize the control panel above to select a <strong style={{ color: '#ffffff' }}>Reference Date</strong>. The interactive global map will immediately calculate the phase of the moon and categorize global visibility into distinct zones:
                </p>
                <ul style={{ paddingLeft: '20px', marginBottom: '20px' }}>
                    <li><strong style={{ color: '#16a34a' }}>Easily Visible (Green) — مرئي بسهولة:</strong> The crescent can be seen with the naked eye even in less-than-ideal conditions.</li>
                    <li><strong style={{ color: '#ca8a04' }}>Visible with Perfect Conditions (Yellow) — مرئي في ظروف مثالية:</strong> Sightings rely on a clear sky and unobstructed horizon.</li>
                    <li><strong style={{ color: '#d97706' }}>Optical Aid Needed (Orange) — مرئي بمساعدة بصرية:</strong> Telescopes or binoculars are required to locate the new moon.</li>
                    <li><strong style={{ color: '#dc2626' }}>Not Visible (Red) — غير مرئي:</strong> Sighting is impossible under any conditions.</li>
                </ul>
                <p>
                    You can also generate an entire 12-month <strong style={{ color: '#ffffff' }}>Lunar Calendar</strong> for your selected city. Click the "Calculate Lunar Calendar" button to predict the start of each month over an entire year layout, taking into account complex shared night calculations. The generated calendar can be exported as a PDF, downloaded as CSV data, or imported directly into Google Calendar.
                </p>

                <h3 style={{ color: '#ffffff', marginTop: '30px' }}>Understanding the Odeh V-Criterion</h3>
                <p>
                    Developed by Palestinian-Jordanian astronomer <strong style={{ color: '#ffffff' }}>Mohammad Shawkat Odeh</strong> in 2004, the V-criterion is an empirical model based on 737 verified crescent observation records collected worldwide. Unlike purely geometric calculations, the Odeh model evaluates the <strong style={{ color: '#ffffff' }}>topocentric crescent width</strong> (how thick the illuminated portion of the moon appears) and the <strong style={{ color: '#ffffff' }}>arc of vision</strong> (how high the moon is above the sun at sunset). This sophisticated mathematical approach ensures that our tool accounts for real-world optical limits, providing one of the most reliable predictors for the Islamic Hijri calendar available today.
                </p>
                <p>
                    The Odeh criterion has been adopted by the Islamic Crescents' Observation Project (ICOP) and is used as a reference by numerous national moon sighting committees. For a detailed examination of the mathematical formula and comparison with other criteria (Yallop, SAAO, Maunder), visit our <a href="/methodology" style={{ color: '#38bdf8' }}>Methodology page</a>.
                </p>

                <h3 style={{ color: '#ffffff', marginTop: '30px' }}>Popular Cities for Moon Sighting</h3>
                <p>
                    Moon Visibility Explorer supports over 70 major cities worldwide. Here are some of the most popular locations used by our community:
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', margin: '15px 0 20px' }}>
                    {[
                        'Mecca, Saudi Arabia', 'Medina, Saudi Arabia', 'Cairo, Egypt',
                        'Istanbul, Turkey', 'Dubai, UAE', 'Karachi, Pakistan',
                        'Jakarta, Indonesia', 'Kuala Lumpur, Malaysia', 'London, UK',
                        'New York, USA', 'Sydney, Australia', 'Casablanca, Morocco'
                    ].map(city => (
                        <a
                            key={city}
                            href={`/city/${encodeURIComponent(city)}`}
                            style={{
                                display: 'inline-block',
                                padding: '4px 12px',
                                background: 'rgba(96, 165, 250, 0.1)',
                                border: '1px solid rgba(96, 165, 250, 0.2)',
                                borderRadius: '16px',
                                color: '#60a5fa',
                                fontSize: '0.85rem',
                                textDecoration: 'none',
                                transition: 'all 0.2s',
                            }}
                        >
                            {city}
                        </a>
                    ))}
                </div>

                <h3 style={{ color: '#ffffff', marginTop: '30px' }}>Why Choose Moon Visibility Explorer?</h3>
                <p>
                    Unlike many Islamic calendar tools that rely on simplified tabular calculations or pre-computed tables, Moon Visibility Explorer performs <strong style={{ color: '#ffffff' }}>real-time astronomical computations</strong> for every query. Our tool calculates the precise positions of the Sun and Moon using professional-grade ephemeris algorithms (VSOP87 for solar position, ELP2000 for lunar position), then applies the Odeh V-criterion to determine visibility at over 16,200 grid points across the globe. This means our predictions are not approximations — they are based on the same mathematical models used by professional observatories.
                </p>
                <p style={{ marginTop: '1rem' }}>
                    All calculations run entirely in your browser using Web Workers, ensuring both fast performance and complete privacy — no personal data is ever sent to a server. The tool is free, requires no account, and works on any modern device.
                </p>
                <p style={{
                    fontFamily: "'Noto Sans Arabic', sans-serif",
                    direction: 'rtl',
                    textAlign: 'right',
                    color: '#94a3b8',
                    fontSize: '0.9rem',
                    lineHeight: '1.8',
                    marginTop: '1rem',
                }}>
                    على عكس أدوات التقويم الإسلامي الأخرى التي تعتمد على حسابات مبسطة أو جداول محسوبة مسبقاً، يقوم مستكشف رؤية القمر بإجراء حسابات فلكية في الوقت الفعلي لكل استعلام. جميع الحسابات تتم في متصفحك محلياً مما يضمن الخصوصية الكاملة.
                </p>

                <p style={{ marginTop: '1.5rem' }}>
                    Ready to learn more? Visit our <a href="/guide" style={{ color: '#38bdf8' }}>User Guide</a> for step-by-step instructions, check the <a href="/faq" style={{ color: '#38bdf8' }}>FAQ</a> for common questions, or explore the <a href="/about" style={{ color: '#38bdf8' }}>About page</a> to learn about the science behind crescent visibility prediction.
                </p>
            </article>

            {/* Bottom Ad Placeholder - Now supported by substantial publisher content! */}
            <AdBanner
                dataAdSlot="5502376796"
                style={{ marginTop: '20px', marginBottom: '40px', maxWidth: '800px', marginLeft: 'auto', marginRight: 'auto' }}
            />

            <LunarCalendarModal
                isOpen={showCalendarModal}
                onClose={handleCloseCalendar}
                initialDate={initialDateObj}
                initialLocation={selectedCity}
                onViewNight1={handleViewNight1}
                onCalendarCalculated={handleCalendarCalculated}
                preservedCalendarData={preservedCalendarData}
            />
        </>
    );
}

export default Home;
