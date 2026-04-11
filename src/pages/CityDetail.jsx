import React, { useMemo, useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import MoonMap from '../components/MoonMap';
import { MAJOR_CITIES } from '../data/cities';
import { getMoonIllumination, getMoonTimes, getVisibility } from '../utils/astronomy';

const CityDetail = () => {
    const { cityName } = useParams();
    // Find city case-insensitive to be robust
    const city = MAJOR_CITIES.find(c => c.name.toLowerCase() === cityName?.toLowerCase());

    const [date] = useState(new Date());

    // SEO Content Generation
    const cityContent = useMemo(() => {
        if (!city) return null;

        // Calculate dynamic properties
        let visibilityText = "could not be determined currently";
        let illuminationText = "an unknown";
        
        try {
            const today = new Date();
            const vis = getVisibility(today, city.lat, city.lon, 'odeh');
            if (vis && vis.zoneName) {
                visibilityText = `falls into the "${vis.zoneName}" zone`;
            }
            
            const ill = getMoonIllumination(today);
            if (ill !== undefined && ill !== null) {
                illuminationText = `${(ill * 100).toFixed(1)}%`;
            }
        } catch (e) {
            console.error("Error calculating dynamic city metrics", e);
        }

        return (
            <>
                <h2>Moon Visibility in {city.name}</h2>
                <p>
                    Track the current and future moon phases for <strong>{city.name}</strong> (Coordinates: {city.lat.toFixed(2)}°N, {city.lon.toFixed(2)}°E).
                    The moon visibility forecast for <strong>{city.name}</strong> tonight indicates that the crescent {visibilityText} with an illumination of {illuminationText}.
                </p>
                <p>
                    Our tool provides highly accurate crescent visibility predictions using the Odeh V-criterion algorithms framework, helping you determine the formal start of lunar months in {city.name} and the surrounding regional territories.
                </p>
                <h3>Astronomical Data for {city.name}</h3>
                <p>
                    Located in the {city.timezone} timezone, {city.name} interacts with the lunar cycle in a unique way based on its specific geographical position on the globe.
                    Factors such as standard atmospheric twilight conditions, topocentric altitude, and lunar elongation are actively computed.
                    Use the interactive map above to scroll and see the precise visibility zones affecting {city.name} locally.
                </p>
            </>
        );
    }, [city]);

    if (!city) {
        return (
            <main className="content-page">
                <div className="content-container">
                    <h2>City Not Found</h2>
                    <p>We could not find data for {cityName}. Please check the spelling or select a city from the homepage.</p>
                    <Link to="/">Return to Home</Link>
                </div>
            </main>
        );
    }

    // We reuse the MoonMap but force the selected city
    // Note: We need a valid Date object for the map
    const dateObj = new Date();

    return (
        <main className="content-page">
            <div className="content-container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
                <div className="seo-header" style={{ marginBottom: '20px', color: '#e2e8f0' }}>
                    <h1>Moon Sighting in {city.name}</h1>
                    <p>Real-time moon visibility and lunar calendar for {city.name}.</p>
                </div>

                <div className="map-container" style={{ height: '600px', marginBottom: '40px' }}>
                    {/* We pass the city to pre-select it on the map */}
                    <MoonMap
                        date={dateObj}
                        calculationTrigger={1} // Trigger once on load
                        selectedCity={city}
                        highlightSharedNightCells={null}
                    />
                </div>

                <div className="text-content" style={{ color: '#cbd5e1', maxWidth: '800px' }}>
                    {cityContent}

                    <div style={{ marginTop: '30px' }}>
                        <Link to="/" className="back-link" style={{ color: '#38bdf8' }}>← Back to Global Map</Link>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default CityDetail;
