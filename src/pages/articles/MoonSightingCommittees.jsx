import React from 'react';
import { Link } from 'react-router-dom';

const MoonSightingCommittees = () => {
    return (
        <main className="content-page">
            <div className="content-container" style={{ maxWidth: '900px', margin: '0 auto', padding: '20px 20px 60px', color: '#e2e8f0' }}>

                <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>How Moon Sighting Committees Work Around the World</h1>
                <p style={{
                    fontFamily: "'Noto Sans Arabic', sans-serif",
                    direction: 'rtl',
                    textAlign: 'right',
                    color: '#64748b',
                    marginBottom: '2rem',
                    fontSize: '0.95rem',
                }}>
                    كيف تعمل لجان رؤية الهلال حول العالم
                </p>

                <section style={{ marginBottom: '2.5rem' }}>
                    <h2 style={{ color: '#60a5fa', borderBottom: '2px solid #1e3a5f', paddingBottom: '8px' }}>What Is a Moon Sighting Committee?</h2>
                    <p style={{ lineHeight: '1.8' }}>
                        A moon sighting committee (لجنة رؤية الهلال / lajnat ru'yat al-hilal) is an official or semi-official body responsible for determining the start of each Islamic (Hijri) month. These committees coordinate the observation of the lunar crescent (hilal) on the 29th evening of each Islamic month and issue an announcement about whether the new month has begun or whether the current month will be extended to 30 days.
                    </p>
                    <p style={{ lineHeight: '1.8', marginTop: '1rem' }}>
                        The practice is rooted in the prophetic tradition (hadith): <em>"Fast when you see it [the crescent] and break your fast when you see it. If the sky is cloudy, then complete thirty days."</em> (Sahih Bukhari). This instruction established crescent observation as the primary method for determining the Islamic calendar.
                    </p>
                </section>

                <section style={{ marginBottom: '2.5rem' }}>
                    <h2 style={{ color: '#60a5fa', borderBottom: '2px solid #1e3a5f', paddingBottom: '8px' }}>How the Process Works</h2>
                    <p style={{ lineHeight: '1.8' }}>
                        The typical moon sighting process follows these steps:
                    </p>
                    <ol style={{ paddingLeft: '1.5rem', lineHeight: '2.2' }}>
                        <li><strong style={{ color: '#f1f5f9' }}>Preparation:</strong> On the 29th evening of the current Islamic month, designated observers are dispatched to elevated locations with clear views of the western horizon. In many countries, the government coordinates these observers through official committees.</li>
                        <li><strong style={{ color: '#f1f5f9' }}>Observation Window:</strong> Observers watch the western sky in the 20-40 minutes between sunset and moonset. The crescent, if visible, appears as a thin sliver of light near the point where the sun set.</li>
                        <li><strong style={{ color: '#f1f5f9' }}>Testimony:</strong> If observers claim to have sighted the crescent, their testimony is reported to the committee. The committee evaluates the credibility of the witnesses, often considering their reputation, experience, and whether their report is consistent with astronomical calculations.</li>
                        <li><strong style={{ color: '#f1f5f9' }}>Decision:</strong> Based on the testimony (and, in some countries, astronomical data), the committee announces whether the new month begins that evening or the following evening.</li>
                        <li><strong style={{ color: '#f1f5f9' }}>Public Announcement:</strong> The decision is broadcast through national media, often within hours of sunset. In the age of social media, announcements now spread globally within minutes.</li>
                    </ol>
                </section>

                <section style={{ marginBottom: '2.5rem' }}>
                    <h2 style={{ color: '#60a5fa', borderBottom: '2px solid #1e3a5f', paddingBottom: '8px' }}>Major Moon Sighting Bodies Worldwide</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {[
                            { country: 'Saudi Arabia', body: 'Supreme Court of Saudi Arabia', ar: 'المحكمة العليا', method: 'Physical sighting testimony. The Supreme Court convenes and evaluates witness reports. Their decision affects Hajj dates globally.', highlight: true },
                            { country: 'Pakistan', body: 'Central Ruet-e-Hilal Committee', ar: 'لجنة رؤية الهلال المركزية', method: 'Physical sighting with zonal committees across the country. Known for occasional disagreements between the central and provincial committees.' },
                            { country: 'Turkey', body: 'Diyanet (Presidency of Religious Affairs)', ar: 'ديانت', method: 'Calculated calendar. Turkey uses astronomical computation, not physical sighting, making it one of the most predictable Islamic calendars.' },
                            { country: 'Indonesia', body: 'Ministry of Religious Affairs (Kemenag)', ar: 'وزارة الشؤون الدينية', method: 'Sidang Isbat (verification session). Combines physical sighting with the "imkanur rukyat" criterion — the crescent must be astronomically possible to see.' },
                            { country: 'Malaysia', body: 'Keeper of the Rulers\' Seal / JAKIM', ar: 'حارس أختام الحكام', method: 'Calculated calendar with physical verification. Uses a mathematical criterion (elongation ≥ 8°, altitude ≥ 2°, age ≥ 8 hours).' },
                            { country: 'Egypt', body: 'Dar al-Ifta al-Misriyya', ar: 'دار الإفتاء المصرية', method: 'Combination of astronomical calculation and physical observation from the Qattamia Astronomical Observatory.' },
                            { country: 'United Kingdom', body: 'Multiple bodies (no single authority)', ar: 'هيئات متعددة', method: 'Communities follow different authorities — some follow Saudi announcements, others follow Morocco, and some attempt local sighting despite frequent cloud cover.' },
                            { country: 'United States', body: 'ISNA / Fiqh Council of North America', ar: 'الجمعية الإسلامية لأمريكا الشمالية', method: 'ISNA uses a calculated method based on astronomical conjunction. Other organizations (like ICNA) prefer physical sighting.' },
                        ].map((item, i) => (
                            <div key={i} style={{
                                background: item.highlight ? 'rgba(96, 165, 250, 0.08)' : 'rgba(30, 41, 59, 0.4)',
                                border: '1px solid #334155',
                                borderRadius: '10px',
                                padding: '1.25rem',
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '4px' }}>
                                    <strong style={{ color: '#60a5fa', fontSize: '1.05rem' }}>{item.country}</strong>
                                    <span style={{ color: '#64748b', fontFamily: "'Noto Sans Arabic', sans-serif", fontSize: '0.85rem' }}>{item.ar}</span>
                                </div>
                                <p style={{ color: '#f1f5f9', margin: '0.25rem 0 0.5rem', fontSize: '0.95rem' }}>{item.body}</p>
                                <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.85rem', lineHeight: '1.6' }}>{item.method}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <section style={{ marginBottom: '2.5rem' }}>
                    <h2 style={{ color: '#60a5fa', borderBottom: '2px solid #1e3a5f', paddingBottom: '8px' }}>Common Controversies and Challenges</h2>
                    <p style={{ lineHeight: '1.8' }}>
                        Moon sighting committees frequently face challenges that lead to public debate:
                    </p>
                    <ul style={{ paddingLeft: '1.5rem', lineHeight: '2.2' }}>
                        <li><strong style={{ color: '#f1f5f9' }}>False sighting claims:</strong> Occasionally, witnesses report seeing the crescent when astronomical calculations indicate it was impossible. This can happen due to misidentification of a star or planet, atmospheric refraction effects, or outright fabrication.</li>
                        <li><strong style={{ color: '#f1f5f9' }}>Regional vs. global sighting:</strong> Should a country follow its own local sighting, or can it adopt the sighting of another country? Scholars have debated this for centuries, with strong arguments on both sides.</li>
                        <li><strong style={{ color: '#f1f5f9' }}>Telescope vs. naked eye:</strong> Is a sighting with binoculars or a telescope valid? Traditional scholars often require naked-eye observation, while modernists argue that optical aids are permissible.</li>
                        <li><strong style={{ color: '#f1f5f9' }}>One-day differences:</strong> It is common for neighboring countries (e.g., Saudi Arabia and Pakistan, or Malaysia and Indonesia) to start Ramadan on different days, causing confusion for the global Muslim community.</li>
                    </ul>
                </section>

                <section style={{
                    padding: '1.5rem',
                    background: 'rgba(16, 185, 129, 0.08)',
                    borderRadius: '12px',
                    border: '1px solid rgba(16, 185, 129, 0.2)',
                }}>
                    <h3 style={{ color: '#10b981', margin: '0 0 0.5rem 0' }}>How Moon Visibility Explorer Helps</h3>
                    <p style={{ color: '#cbd5e1', lineHeight: '1.7', margin: '0' }}>
                        Our tool provides the scientific data that moon sighting committees need. By showing <Link to="/" style={{ color: '#38bdf8' }}>exactly where the crescent is predicted to be visible</Link> on any given date, committees can plan their observation efforts more effectively, validate witness testimonies against astronomical reality, and communicate their decisions to the public with scientific backing. Visit our <Link to="/methodology" style={{ color: '#38bdf8' }}>Methodology page</Link> to learn about the Odeh V-criterion that powers these predictions.
                    </p>
                </section>
            </div>
        </main>
    );
};

export default MoonSightingCommittees;
