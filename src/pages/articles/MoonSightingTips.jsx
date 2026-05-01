import React from 'react';
import { Link } from 'react-router-dom';

const MoonSightingTips = () => {
    return (
        <main className="content-page">
            <div className="content-container" style={{ maxWidth: '900px', margin: '0 auto', padding: '20px 20px 60px', color: '#e2e8f0' }}>

                <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Moon Sighting Tips: A Practical Guide for Beginners</h1>
                <p style={{
                    fontFamily: "'Noto Sans Arabic', sans-serif",
                    direction: 'rtl',
                    textAlign: 'right',
                    color: '#64748b',
                    marginBottom: '2rem',
                    fontSize: '0.95rem',
                }}>
                    نصائح لرؤية الهلال — دليل عملي للمبتدئين
                </p>

                <section style={{ marginBottom: '2.5rem' }}>
                    <h2 style={{ color: '#60a5fa', borderBottom: '2px solid #1e3a5f', paddingBottom: '8px' }}>Before You Go Out: Preparation</h2>
                    <p style={{ lineHeight: '1.8' }}>
                        Successful crescent sighting begins well before sunset. Proper preparation dramatically increases your chances of spotting the thin new moon. Here is what you need to do:
                    </p>
                    <ol style={{ paddingLeft: '1.5rem', lineHeight: '2.4' }}>
                        <li><strong style={{ color: '#f1f5f9' }}>Check the astronomical predictions first.</strong> Use <Link to="/" style={{ color: '#38bdf8' }}>Moon Visibility Explorer</Link> to see the predicted visibility classification for your city. If the prediction is "Not Visible" (red zone), the crescent will not be visible regardless of conditions, and there is no need to go out.</li>
                        <li><strong style={{ color: '#f1f5f9' }}>Check the weather forecast.</strong> Even if the astronomical conditions are "Easily Visible," clouds on the western horizon will block your view. Look for a forecast with clear skies in the west, low humidity, and good atmospheric transparency.</li>
                        <li><strong style={{ color: '#f1f5f9' }}>Know your sunset time.</strong> Look up the exact sunset time for your location. You need to be at your observation site and ready before the sun goes below the horizon.</li>
                        <li><strong style={{ color: '#f1f5f9' }}>Identify where the sun sets.</strong> The crescent moon will appear near the point on the horizon where the sun has just set, typically slightly to the left (south) in the Northern Hemisphere or slightly to the right (north) in the Southern Hemisphere.</li>
                    </ol>
                </section>

                <section style={{ marginBottom: '2.5rem' }}>
                    <h2 style={{ color: '#60a5fa', borderBottom: '2px solid #1e3a5f', paddingBottom: '8px' }}>Choosing Your Observation Location</h2>
                    <p style={{ lineHeight: '1.8' }}>
                        Location selection is one of the most critical factors in a successful sighting. The ideal location has these characteristics:
                    </p>
                    <ul style={{ paddingLeft: '1.5rem', lineHeight: '2.2' }}>
                        <li><strong style={{ color: '#f1f5f9' }}>Unobstructed western horizon:</strong> This is the single most important requirement. Buildings, trees, hills, or mountains blocking the western sky will prevent you from seeing the crescent. The best locations are hilltops, open fields, coastal areas facing west, or the upper floors of tall buildings.</li>
                        <li><strong style={{ color: '#f1f5f9' }}>Away from light pollution:</strong> City lights create a bright sky glow that washes out the faint crescent. Rural locations with dark skies are ideal, though urban sighting is possible if the crescent is bright enough (Easily Visible zone).</li>
                        <li><strong style={{ color: '#f1f5f9' }}>Higher altitude:</strong> Elevation helps in two ways — it extends the visible horizon and reduces the amount of atmosphere you are looking through. Even a hill 100 meters above the surrounding terrain can make a noticeable difference.</li>
                        <li><strong style={{ color: '#f1f5f9' }}>Stable air:</strong> Heat shimmering from roads, buildings, or sun-baked ground causes atmospheric turbulence that distorts the crescent. Observe from a location with stable, cool air if possible.</li>
                    </ul>
                </section>

                <section style={{ marginBottom: '2.5rem' }}>
                    <h2 style={{ color: '#60a5fa', borderBottom: '2px solid #1e3a5f', paddingBottom: '8px' }}>The Observation Window</h2>
                    <p style={{ lineHeight: '1.8' }}>
                        You typically have a very short window to spot the crescent — usually between <strong style={{ color: '#f1f5f9' }}>15 and 40 minutes after sunset</strong>. This window is bounded by two constraints:
                    </p>
                    <ul style={{ paddingLeft: '1.5rem', lineHeight: '2.2' }}>
                        <li><strong style={{ color: '#f1f5f9' }}>Too early (before ~15 min after sunset):</strong> The sky is still too bright from twilight. The crescent does not have enough contrast against the sky background to be visible.</li>
                        <li><strong style={{ color: '#f1f5f9' }}>Too late (after moonset):</strong> The Moon follows the Sun below the horizon. Once it sets, the crescent is gone. The time between sunset and moonset (called "lag time") is usually 20-60 minutes for a young crescent.</li>
                    </ul>
                    <p style={{ lineHeight: '1.8', marginTop: '1rem' }}>
                        The "sweet spot" is when the sky is dark enough for the crescent to show contrast but the Moon is still above the horizon. This typically occurs 20-30 minutes after sunset.
                    </p>
                </section>

                <section style={{ marginBottom: '2.5rem' }}>
                    <h2 style={{ color: '#60a5fa', borderBottom: '2px solid #1e3a5f', paddingBottom: '8px' }}>Equipment</h2>
                    <p style={{ lineHeight: '1.8' }}>
                        You do not need expensive equipment to spot the crescent, but the right tools can help:
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
                        {[
                            { title: 'Naked Eye', desc: 'The traditional method. Works well when the prediction is "Easily Visible" or "Visible under Perfect Conditions." Allow your eyes 10-15 minutes to adjust. Avoid looking at your phone screen during this time, as bright light reduces night vision.', icon: '👁️' },
                            { title: 'Binoculars (7×50 or 10×50)', desc: 'The most useful tool for crescent sighting. They gather more light than the naked eye and magnify the crescent, making it much easier to spot. After finding the crescent with binoculars, you can often then see it with the naked eye.', icon: '🔭' },
                            { title: 'Telescope', desc: 'Overkill for most sightings, but useful when the crescent is in the "Visible with Optical Aid" zone. Use a low-magnification, wide-field eyepiece. Be extremely careful never to point a telescope at or near the Sun.', icon: '🔬' },
                            { title: 'Compass App', desc: 'Knowing the exact azimuth (compass direction) of where the sun sets helps you point your binoculars in the right direction. Most smartphone compass apps are accurate enough for this purpose.', icon: '🧭' },
                        ].map((item, i) => (
                            <div key={i} style={{
                                background: 'rgba(30, 41, 59, 0.4)',
                                border: '1px solid #334155',
                                borderRadius: '10px',
                                padding: '1.25rem',
                            }}>
                                <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{item.icon}</div>
                                <h4 style={{ color: '#f1f5f9', margin: '0 0 0.5rem 0' }}>{item.title}</h4>
                                <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.85rem', lineHeight: '1.6' }}>{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <section style={{ marginBottom: '2.5rem' }}>
                    <h2 style={{ color: '#60a5fa', borderBottom: '2px solid #1e3a5f', paddingBottom: '8px' }}>Common Mistakes to Avoid</h2>
                    <ul style={{ paddingLeft: '1.5rem', lineHeight: '2.2' }}>
                        <li><strong style={{ color: '#ef4444' }}>Mistaking Venus or another planet for the crescent.</strong> Venus can appear as a bright point near the horizon after sunset. Unlike the crescent, planets appear as points of light, not thin curved lines.</li>
                        <li><strong style={{ color: '#ef4444' }}>Looking too high.</strong> The young crescent is always very close to the horizon — typically less than 10° above it (about the width of your fist at arm's length). Looking too high in the sky is a common error.</li>
                        <li><strong style={{ color: '#ef4444' }}>Giving up too early.</strong> The crescent may not become visible until 20-25 minutes after sunset. Be patient and keep scanning the western sky.</li>
                        <li><strong style={{ color: '#ef4444' }}>Using a phone camera to photograph it.</strong> Standard phone cameras rarely capture the crescent because it is too faint. If you need to document your sighting, a DSLR camera with a telephoto lens (200mm+) is required.</li>
                    </ul>
                </section>

                <section style={{
                    padding: '1.5rem',
                    background: 'rgba(16, 185, 129, 0.08)',
                    borderRadius: '12px',
                    border: '1px solid rgba(16, 185, 129, 0.2)',
                }}>
                    <h3 style={{ color: '#10b981', margin: '0 0 0.5rem 0' }}>Plan Your Next Sighting</h3>
                    <p style={{ color: '#cbd5e1', lineHeight: '1.7', margin: '0' }}>
                        Before heading out, check <Link to="/" style={{ color: '#38bdf8' }}>Moon Visibility Explorer</Link> for the predicted crescent visibility at your location. Learn about <Link to="/articles/lunar-phases" style={{ color: '#38bdf8' }}>lunar phases</Link> to understand the astronomy, or read about how <Link to="/articles/moon-sighting-committees" style={{ color: '#38bdf8' }}>moon sighting committees</Link> coordinate observations worldwide.
                    </p>
                </section>
            </div>
        </main>
    );
};

export default MoonSightingTips;
