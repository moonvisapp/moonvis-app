import React, { useState, useMemo } from 'react';
import MoonMap from './components/MoonMap';
import LunarCalendarModal from './components/LunarCalendarModal';
import { MAJOR_CITIES } from './data/cities';
import './App.css';

function App() {
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

    // Extract the month data to check if Night 1 was via shared night inheritance
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
    <div className="app-container">
      <header className="app-header">
        <h1>Moon Visibility Explorer</h1>
        <p>Global Moon Visibility Explorer</p>
      </header>

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

      <footer className="app-footer">
        <p>Built with React + D3 + Astronomy-Engine | Contact: <a href="mailto:moonvisapp@gmail.com" style={{ color: 'inherit' }}>moonvisapp@gmail.com</a></p>
      </footer>

      <LunarCalendarModal
        isOpen={showCalendarModal}
        onClose={handleCloseCalendar}
        initialDate={initialDateObj}
        initialLocation={selectedCity}
        onViewNight1={handleViewNight1}
        onCalendarCalculated={handleCalendarCalculated}
        preservedCalendarData={preservedCalendarData}
      />
    </div>
  );
}

export default App;
