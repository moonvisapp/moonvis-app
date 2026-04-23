import React from 'react';

const Methodology = () => {
    return (
        <main className="content-page">
            <div className="content-container" style={{ maxWidth: '900px', margin: '0 auto', padding: '20px 20px 60px', color: '#e2e8f0' }}>

                <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Scientific Methodology</h1>
                <p style={{ color: '#94a3b8', marginBottom: '0.5rem', fontSize: '1.05rem' }}>
                    A detailed explanation of the astronomical algorithms and visibility models used by Moon Visibility Explorer.
                </p>
                <p style={{
                    fontFamily: "'Noto Sans Arabic', sans-serif",
                    direction: 'rtl',
                    textAlign: 'right',
                    color: '#64748b',
                    marginBottom: '2rem',
                    fontSize: '0.95rem',
                }}>
                    شرح تفصيلي للخوارزميات الفلكية ونماذج الرؤية المستخدمة في مستكشف رؤية القمر
                </p>

                {/* Section: Overview */}
                <section style={{ marginBottom: '2.5rem' }}>
                    <h2 style={{ color: '#60a5fa', borderBottom: '2px solid #1e3a5f', paddingBottom: '8px', fontSize: '1.4rem' }}>
                        Overview of the Calculation Pipeline
                    </h2>
                    <p style={{ lineHeight: '1.8', color: '#cbd5e1' }}>
                        Moon Visibility Explorer performs a multi-step calculation pipeline for every date and location query. The process begins with determining the exact moment of sunset at the observer's location, followed by computing the topocentric (observer-centered) positions of both the Sun and Moon at that precise instant. From these positions, the tool derives the critical geometric parameters needed by the Odeh V-criterion: the topocentric arc of vision (ARCV), the relative azimuth difference (DAZ), and the topocentric crescent width (W). Finally, these parameters are fed into the Odeh visibility function, which returns a classification for each 2°×2° grid cell on the globe.
                    </p>
                    <p style={{
                        fontFamily: "'Noto Sans Arabic', sans-serif",
                        direction: 'rtl',
                        textAlign: 'right',
                        lineHeight: '2',
                        color: '#94a3b8',
                        fontSize: '0.9rem',
                        marginTop: '0.75rem',
                    }}>
                        يقوم مستكشف رؤية القمر بتنفيذ خط أنابيب حسابي متعدد المراحل لكل استعلام عن تاريخ وموقع. تبدأ العملية بتحديد اللحظة الدقيقة لغروب الشمس في موقع الراصد، يليها حساب المواقع المركزية-الطبوغرافية لكل من الشمس والقمر.
                    </p>
                </section>

                {/* Section: The Odeh V-Criterion */}
                <section style={{ marginBottom: '2.5rem' }}>
                    <h2 style={{ color: '#60a5fa', borderBottom: '2px solid #1e3a5f', paddingBottom: '8px', fontSize: '1.4rem' }}>
                        The Odeh V-Criterion: Mathematical Foundation
                    </h2>
                    <p style={{ lineHeight: '1.8', color: '#cbd5e1' }}>
                        The Odeh V-criterion was published by Mohammad Shawkat Odeh in 2004 in his paper titled "New Criterion for Lunar Crescent Visibility." The model was derived from a statistical analysis of 737 observational records collected from locations spanning the globe, covering diverse atmospheric conditions and observer skill levels. The criterion represents a significant advancement over earlier models such as the Yallop criterion (1997), which was based on a smaller dataset of 295 observations.
                    </p>
                    <p style={{ lineHeight: '1.8', color: '#cbd5e1', marginTop: '1rem' }}>
                        The core of the Odeh criterion is the calculation of a visibility parameter <strong style={{ color: '#f1f5f9' }}>V</strong>, defined by the following polynomial equation:
                    </p>

                    <div style={{
                        background: 'rgba(15, 23, 42, 0.8)',
                        border: '1px solid #334155',
                        borderRadius: '10px',
                        padding: '1.5rem',
                        margin: '1.5rem 0',
                        fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
                        fontSize: '0.95rem',
                        color: '#a5f3fc',
                        textAlign: 'center',
                        lineHeight: '2',
                    }}>
                        <div><strong>V = ARCV − (−0.1018 × W³ + 0.7319 × W² − 6.3226 × W + 7.1814)</strong></div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.5rem' }}>
                            Where ARCV = topocentric arc of vision (degrees), W = topocentric crescent width (arc-minutes)
                        </div>
                    </div>

                    <p style={{ lineHeight: '1.8', color: '#cbd5e1' }}>
                        Based on the computed value of V, crescent visibility is classified into four distinct zones:
                    </p>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr',
                        gap: '0.75rem',
                        margin: '1.5rem 0',
                    }}>
                        {[
                            { zone: 'Easily Visible (EV)', condition: 'V ≥ 5.65', color: '#4ade80', desc: 'The crescent is thick enough and high enough above the horizon to be easily spotted by the naked eye, even under non-ideal atmospheric conditions. This zone represents the highest confidence in sighting.', descAr: 'الهلال سميك وعالٍ بما يكفي فوق الأفق ليُرى بسهولة بالعين المجردة.' },
                            { zone: 'Visible under Perfect Conditions (VP)', condition: '2 ≤ V < 5.65', color: '#facc15', desc: 'The crescent may be visible to the naked eye, but only under excellent atmospheric conditions — clear skies, low humidity, minimal light pollution, and an experienced observer with good eyesight. Many traditional sightings fall into this category.', descAr: 'قد يكون الهلال مرئياً بالعين المجردة، ولكن فقط في ظروف جوية ممتازة.' },
                            { zone: 'Visible with Optical Aid (VO)', condition: '−0.96 ≤ V < 2', color: '#f97316', desc: 'The crescent is present above the horizon but is too thin or too close to the sun\'s glare to be seen without magnification. Binoculars (7×50 or larger) or a telescope are required. This zone is important for committees that accept optical-aided sighting.', descAr: 'الهلال موجود فوق الأفق ولكنه رفيع جداً أو قريب جداً من وهج الشمس. تحتاج مناظير أو تلسكوب.' },
                            { zone: 'Not Visible (NV)', condition: 'V < −0.96', color: '#ef4444', desc: 'The crescent cannot be seen by any means — either the moon is below the horizon at sunset, or it is geometrically impossible for enough sunlight to be reflected off the lunar surface at a visible angle. No sighting claim from this zone would be considered valid.', descAr: 'لا يمكن رؤية الهلال بأي وسيلة — إما أن القمر تحت الأفق عند الغروب، أو أنه من المستحيل هندسياً أن ينعكس ضوء الشمس الكافي.' },
                        ].map((item, i) => (
                            <div key={i} style={{
                                background: 'rgba(30, 41, 59, 0.5)',
                                border: '1px solid #334155',
                                borderRadius: '10px',
                                padding: '1.25rem',
                                borderLeft: `4px solid ${item.color}`,
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                                    <strong style={{ color: item.color, fontSize: '1.05rem' }}>{item.zone}</strong>
                                    <span style={{ fontFamily: 'monospace', fontSize: '0.85rem', color: '#94a3b8', background: 'rgba(0,0,0,0.3)', padding: '2px 8px', borderRadius: '4px' }}>{item.condition}</span>
                                </div>
                                <p style={{ margin: '0 0 0.5rem 0', lineHeight: '1.7', color: '#cbd5e1', fontSize: '0.93rem' }}>{item.desc}</p>
                                <p style={{ margin: 0, fontFamily: "'Noto Sans Arabic', sans-serif", direction: 'rtl', textAlign: 'right', color: '#64748b', fontSize: '0.85rem', lineHeight: '1.8' }}>{item.descAr}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Section: Astronomical Calculations */}
                <section style={{ marginBottom: '2.5rem' }}>
                    <h2 style={{ color: '#60a5fa', borderBottom: '2px solid #1e3a5f', paddingBottom: '8px', fontSize: '1.4rem' }}>
                        Astronomical Ephemeris Calculations
                    </h2>
                    <p style={{ lineHeight: '1.8', color: '#cbd5e1' }}>
                        All astronomical position calculations in Moon Visibility Explorer are performed using the <strong style={{ color: '#f1f5f9' }}>astronomy-engine</strong> library, an open-source implementation of established astronomical algorithms. The library computes solar positions using the VSOP87 theory (Variations Séculaires des Orbites Planétaires) developed by Pierre Bretagnon and Gérard Francou at the Bureau des Longitudes in Paris. Lunar positions are computed using a simplified version of the ELP2000 theory (Ephemeris of the Lunar Position) by Michelle Chapront-Touzé and Jean Chapront.
                    </p>
                    <p style={{ lineHeight: '1.8', color: '#cbd5e1', marginTop: '1rem' }}>
                        For each grid cell on the globe, the following sequence of calculations is performed:
                    </p>
                    <ol style={{ paddingLeft: '1.5rem', color: '#cbd5e1', lineHeight: '2', fontSize: '0.95rem' }}>
                        <li><strong style={{ color: '#f1f5f9' }}>Sunset Time:</strong> The exact moment when the center of the solar disk crosses below the geometric horizon, corrected for atmospheric refraction (standard refraction of 34 arc-minutes) at the grid cell's latitude and longitude.</li>
                        <li><strong style={{ color: '#f1f5f9' }}>Moonset Time:</strong> Similarly computed for the lunar disk. If the moon sets before the sun, the crescent is automatically classified as "Not Visible."</li>
                        <li><strong style={{ color: '#f1f5f9' }}>Lunar Age:</strong> The elapsed time since conjunction (new moon). Crescents younger than approximately 15 hours are generally impossible to see.</li>
                        <li><strong style={{ color: '#f1f5f9' }}>Topocentric Moon Altitude:</strong> The angular height of the moon above the horizon as seen from the observer's specific location, accounting for the Earth's oblateness and the observer's distance from the Earth's center.</li>
                        <li><strong style={{ color: '#f1f5f9' }}>Topocentric Sun Altitude:</strong> At sunset, this should be approximately 0° (at the horizon), but the exact value is important for twilight calculations.</li>
                        <li><strong style={{ color: '#f1f5f9' }}>Arc of Vision (ARCV):</strong> The difference between the moon's altitude and the sun's altitude. This represents how high the moon is above the sun at the time of observation.</li>
                        <li><strong style={{ color: '#f1f5f9' }}>Crescent Width (W):</strong> Calculated from the moon's elongation (angular distance from the sun) and its distance from the Earth. A wider crescent is easier to see.</li>
                    </ol>
                </section>

                {/* Section: Grid Resolution */}
                <section style={{ marginBottom: '2.5rem' }}>
                    <h2 style={{ color: '#60a5fa', borderBottom: '2px solid #1e3a5f', paddingBottom: '8px', fontSize: '1.4rem' }}>
                        Global Grid Resolution and Performance
                    </h2>
                    <p style={{ lineHeight: '1.8', color: '#cbd5e1' }}>
                        Moon Visibility Explorer divides the entire globe into a grid of 2° × 2° cells, resulting in 180 × 90 = 16,200 individual cells. For each cell, the full astronomical calculation pipeline is executed independently. At the equator, each cell covers approximately 222 km × 222 km. At higher latitudes, the east-west dimension shrinks due to the convergence of meridians, while the north-south dimension remains constant.
                    </p>
                    <p style={{ lineHeight: '1.8', color: '#cbd5e1', marginTop: '1rem' }}>
                        To maintain interactive performance, all calculations are offloaded to a dedicated <strong style={{ color: '#f1f5f9' }}>Web Worker</strong> thread, keeping the user interface responsive during the 3-10 second computation time. A progress bar displays the calculation status in real-time. The results are cached so that returning to a previously computed date does not require recalculation.
                    </p>
                </section>

                {/* Section: Comparison with Other Criteria */}
                <section style={{ marginBottom: '2.5rem' }}>
                    <h2 style={{ color: '#60a5fa', borderBottom: '2px solid #1e3a5f', paddingBottom: '8px', fontSize: '1.4rem' }}>
                        Comparison with Other Visibility Criteria
                    </h2>
                    <p style={{ lineHeight: '1.8', color: '#cbd5e1', marginBottom: '1rem' }}>
                        Several lunar crescent visibility criteria have been developed over the decades. Below is a comparison of the most widely used models and their key characteristics:
                    </p>

                    <div style={{ overflowX: 'auto' }}>
                        <table style={{
                            width: '100%',
                            borderCollapse: 'collapse',
                            fontSize: '0.9rem',
                            color: '#cbd5e1',
                        }}>
                            <thead>
                                <tr style={{ background: 'rgba(15, 23, 42, 0.8)' }}>
                                    <th style={{ padding: '10px 12px', textAlign: 'left', borderBottom: '2px solid #334155', color: '#94a3b8', fontWeight: '600' }}>Criterion</th>
                                    <th style={{ padding: '10px 12px', textAlign: 'left', borderBottom: '2px solid #334155', color: '#94a3b8', fontWeight: '600' }}>Author / Year</th>
                                    <th style={{ padding: '10px 12px', textAlign: 'left', borderBottom: '2px solid #334155', color: '#94a3b8', fontWeight: '600' }}>Data Points</th>
                                    <th style={{ padding: '10px 12px', textAlign: 'left', borderBottom: '2px solid #334155', color: '#94a3b8', fontWeight: '600' }}>Primary Variables</th>
                                    <th style={{ padding: '10px 12px', textAlign: 'left', borderBottom: '2px solid #334155', color: '#94a3b8', fontWeight: '600' }}>Zones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[
                                    { name: 'Odeh', author: 'Odeh, 2004', data: '737', vars: 'ARCV, W (crescent width)', zones: '4 (EV, VP, VO, NV)', highlight: true },
                                    { name: 'Yallop', author: 'Yallop, 1997', data: '295', vars: 'ARCV, W', zones: '6 (A through F)' },
                                    { name: 'SAAO', author: 'Caldwell & Laney, 2001', data: '~400', vars: 'Elongation, Altitude, Lag', zones: '2 (Visible, Not Visible)' },
                                    { name: 'Shaukat', author: 'Shaukat, 2001', data: 'Various', vars: 'Elongation, Age, Altitude', zones: '3' },
                                    { name: 'Maunder', author: 'Maunder, 1911', data: '~50', vars: 'ARCV, DAZ', zones: '2 (Visible, Not Visible)' },
                                ].map((row, i) => (
                                    <tr key={i} style={{
                                        borderBottom: '1px solid #334155',
                                        background: row.highlight ? 'rgba(96, 165, 250, 0.08)' : 'transparent',
                                    }}>
                                        <td style={{ padding: '10px 12px', fontWeight: row.highlight ? '700' : '400', color: row.highlight ? '#60a5fa' : '#cbd5e1' }}>{row.name}</td>
                                        <td style={{ padding: '10px 12px' }}>{row.author}</td>
                                        <td style={{ padding: '10px 12px' }}>{row.data}</td>
                                        <td style={{ padding: '10px 12px' }}>{row.vars}</td>
                                        <td style={{ padding: '10px 12px' }}>{row.zones}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <p style={{ lineHeight: '1.8', color: '#cbd5e1', marginTop: '1rem' }}>
                        The Odeh criterion is generally considered the most robust due to its larger dataset and refined polynomial model. It has been adopted by the Islamic Crescents' Observation Project (ICOP) and is used as a reference by many national moon sighting committees.
                    </p>
                </section>

                {/* Section: References */}
                <section style={{ marginBottom: '2rem' }}>
                    <h2 style={{ color: '#60a5fa', borderBottom: '2px solid #1e3a5f', paddingBottom: '8px', fontSize: '1.4rem' }}>
                        References and Further Reading
                    </h2>
                    <ul style={{ paddingLeft: '1.5rem', lineHeight: '2.2', color: '#94a3b8', fontSize: '0.9rem' }}>
                        <li>Odeh, M.Sh. (2004). "New Criterion for Lunar Crescent Visibility." <em>Experimental Astronomy</em>, 18(1-3), 39–64.</li>
                        <li>Yallop, B.D. (1997). "A Method for Predicting the First Sighting of the New Crescent Moon." <em>NAO Technical Note No. 69</em>, Royal Greenwich Observatory.</li>
                        <li>Caldwell, J.A.R. & Laney, C.D. (2001). "First Visibility of the Lunar Crescent." <em>South African Astronomical Observatory</em>.</li>
                        <li>Bretagnon, P. & Francou, G. (1988). "Planetary Theories in Rectangular and Spherical Variables: VSOP87 Solutions." <em>Astronomy & Astrophysics</em>, 202, 309–315.</li>
                        <li>Chapront-Touzé, M. & Chapront, J. (1988). "ELP 2000-85: A Semi-Analytical Lunar Ephemeris Adequate for Historical Times." <em>Astronomy & Astrophysics</em>, 190, 342–352.</li>
                        <li>ICOP — Islamic Crescents' Observation Project: <a href="https://www.icoproject.org" style={{ color: '#38bdf8' }} target="_blank" rel="noopener noreferrer">icoproject.org</a></li>
                    </ul>
                </section>

                <section style={{
                    padding: '1.5rem',
                    background: 'rgba(16, 185, 129, 0.08)',
                    borderRadius: '12px',
                    border: '1px solid rgba(16, 185, 129, 0.2)',
                }}>
                    <h3 style={{ color: '#10b981', margin: '0 0 0.5rem 0' }}>Open-Source Transparency</h3>
                    <p style={{ color: '#cbd5e1', lineHeight: '1.7', margin: '0' }}>
                        Moon Visibility Explorer performs all calculations client-side in your browser. No proprietary algorithms are hidden behind a server. The astronomical library (astronomy-engine) is open-source, and the Odeh V-criterion thresholds are published in peer-reviewed literature. This transparency ensures that our results can be independently verified by any qualified astronomer.
                    </p>
                    <p style={{
                        fontFamily: "'Noto Sans Arabic', sans-serif",
                        direction: 'rtl',
                        textAlign: 'right',
                        color: '#94a3b8',
                        marginTop: '0.75rem',
                        lineHeight: '1.8',
                        fontSize: '0.9rem',
                    }}>
                        يقوم مستكشف رؤية القمر بجميع الحسابات في متصفحك محلياً. لا توجد خوارزميات مخفية خلف أي خادم. يمكن التحقق من نتائجنا بشكل مستقل من قبل أي فلكي مؤهل.
                    </p>
                </section>
            </div>
        </main>
    );
};

export default Methodology;
