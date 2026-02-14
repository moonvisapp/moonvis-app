import React from 'react';

const Guide = () => {
    return (
        <main className="content-page">
            <div className="content-container" style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', color: '#e2e8f0' }}>
                <h2>User Guide: Understanding Moon Visibility</h2>

                <h3>How to Read the Map</h3>
                <p>
                    The Moon Visibility Explorer uses a color-coded map to show where the new crescent moon can be seen on a specific date.
                    Here is what the colors mean:
                </p>
                <div className="legend-grid" style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '10px', margin: '20px 0' }}>
                    <div style={{ width: '20px', height: '20px', backgroundColor: '#4ade80' }}></div>
                    <div><strong>Easily Visible (Green)</strong>: The moon should be visible to the naked eye if clouds do not obstruct the view.</div>

                    <div style={{ width: '20px', height: '20px', backgroundColor: '#facc15' }}></div>
                    <div><strong>Visible under Perfect Conditions (Yellow)</strong>: You might need clear skies and an experienced observer to spot the moon.</div>

                    <div style={{ width: '20px', height: '20px', backgroundColor: '#ef4444' }}></div>
                    <div><strong>Visible with Optical Aid (Red)</strong>: You will likely need binoculars or a telescope to see the crescent.</div>

                    <div style={{ width: '20px', height: '20px', backgroundColor: '#94a3b8' }}></div>
                    <div><strong>Not Visible (Grey)</strong>: The moon is not visible, either because it set before the sun or it is too close to the sun's glare.</div>
                </div>

                <h3>Generating a Lunar Calendar</h3>
                <ol>
                    <li>Click the "Calculate Lunar Calendar" button.</li>
                    <li>A modal will appear showing the predicted start dates for the next 12 Islamic months based on visibility at your selected location.</li>
                    <li>You can click on "Night 1" for any month to see the visibility map for that specific evening.</li>
                </ol>

                <h3>Shared Night Explained</h3>
                <p>
                    In Islamic calendar rules, sometimes a sighting in one location (e.g., west of you) can establish the new month for regions that share a significant portion of the night.
                    Our tool identifies these "Shared Night" possibilities. If your location does not see the moon directly but shares the night with a location that does, this will be indicated in the calendar.
                </p>
            </div>
        </main>
    );
};

export default Guide;
