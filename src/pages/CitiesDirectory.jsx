import React from 'react';
import { Link } from 'react-router-dom';
import { MAJOR_CITIES } from '../data/cities';

function CitiesDirectory() {
    return (
        <main className="content-page">
            <div className="content-container">
                <div className="seo-header">
                    <h1>Moon Sighting Locations Directory</h1>
                    <p>
                        Explore accurate lunar calendar calculations and interactive moon sighting predictions for over 70 major cities worldwide. 
                        Our predictions utilize the scientifically validated Odeh V-criterion to determine the visibility of the crescent moon.
                    </p>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem', marginTop: '2rem' }}>
                    {MAJOR_CITIES.map(city => (
                        <Link 
                            key={city.name} 
                            to={`/city/${encodeURIComponent(city.name)}`}
                            style={{
                                padding: '15px',
                                background: 'rgba(30, 41, 59, 0.5)',
                                borderRadius: '8px',
                                border: '1px solid rgba(51, 65, 85, 0.5)',
                                color: '#38bdf8',
                                textDecoration: 'none',
                                display: 'flex',
                                flexDirection: 'column',
                                transition: 'all 0.2s ease-in-out'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = 'rgba(56, 189, 248, 0.1)';
                                e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.3)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'rgba(30, 41, 59, 0.5)';
                                e.currentTarget.style.borderColor = 'rgba(51, 65, 85, 0.5)';
                            }}
                        >
                            <span style={{ fontWeight: '600', fontSize: '1.1rem' }}>{city.name.split(',')[0]}</span>
                            {city.name.includes(',') && (
                                <span style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '4px' }}>
                                    {city.name.split(',')[1].trim()}
                                </span>
                            )}
                        </Link>
                    ))}
                </div>
            </div>
        </main>
    );
}

export default CitiesDirectory;
