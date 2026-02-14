import React from 'react';

const About = () => {
    return (
        <main className="content-page">
            <div className="content-container" style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', color: '#e2e8f0' }}>
                <h2>About Moon Visibility Explorer</h2>
                <p>
                    Moon Visibility Explorer is a comprehensive tool designed for astronomers, moon sighters, and anyone interested in the lunar cycle.
                    Our application uses the **Odeh V-criterion**, a scientifically validated method for predicting the visibility of the crescent moon.
                </p>

                <h3>The Odeh V-criterion</h3>
                <p>
                    Developed by Mohammad Odeh in 2006, the V-criterion visualizes moon visibility into distinct zones:
                </p>
                <ul>
                    <li><strong>Easily Visible (EV)</strong>: The crescent can be seen with the naked eye.</li>
                    <li><strong>Visible under Perfect Conditions (VP)</strong>: Requires clear skies and a skilled observer.</li>
                    <li><strong>Visible with Optical Aid (VO)</strong>: Can be seen with binoculars or a telescope.</li>
                    <li><strong>Not Visible / Impossible (NV/I)</strong>: The moon is likely below the horizon or too close to the sun to be seen.</li>
                </ul>

                <h3>Features</h3>
                <ul>
                    <li>Global visibility maps with 2x2 degree resolution.</li>
                    <li>Accurate Hijri date calculations based on actual visibility.</li>
                    <li>Support for over 70 major cities worldwide.</li>
                    <li>Interactive map with zoom and city selection.</li>
                </ul>

                <p>
                    Whether you are planning for the start of a new Islamic month or simply observing the beauty of the night sky,
                    Moon Visibility Explorer provides the data you need.
                </p>
            </div>
        </main>
    );
};

export default About;
