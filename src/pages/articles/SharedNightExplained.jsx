import React from 'react';
import { Link } from 'react-router-dom';

const SharedNightExplained = () => {
    return (
        <main className="content-page">
            <div className="content-container" style={{ maxWidth: '900px', margin: '0 auto', padding: '20px 20px 60px', color: '#e2e8f0' }}>

                <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Shared Night (Ikhtilaf al-Matali') in the Islamic Calendar</h1>
                <p style={{
                    fontFamily: "'Noto Sans Arabic', sans-serif",
                    direction: 'rtl',
                    textAlign: 'right',
                    color: '#64748b',
                    marginBottom: '2rem',
                    fontSize: '0.95rem',
                }}>
                    اشتراك الليل واختلاف المطالع في التقويم الإسلامي — شرح مفصل
                </p>

                <section style={{ marginBottom: '2.5rem' }}>
                    <h2 style={{ color: '#60a5fa', borderBottom: '2px solid #1e3a5f', paddingBottom: '8px' }}>The Fundamental Question</h2>
                    <p style={{ lineHeight: '1.8' }}>
                        One of the most debated questions in Islamic jurisprudence regarding the lunar calendar is this: <strong style={{ color: '#f1f5f9' }}>If the crescent moon is sighted in one location, does the new month begin for the entire world, or only for the location where it was sighted?</strong>
                    </p>
                    <p style={{ lineHeight: '1.8', marginTop: '1rem' }}>
                        This question, known in Arabic as the issue of <em>ikhtilaf al-matali'</em> (اختلاف المطالع, "difference of horizons"), has been debated by Islamic scholars for over a millennium. The answer has profound practical implications — it determines whether Muslim communities around the world begin Ramadan on the same day or on different days.
                    </p>
                </section>

                <section style={{ marginBottom: '2.5rem' }}>
                    <h2 style={{ color: '#60a5fa', borderBottom: '2px solid #1e3a5f', paddingBottom: '8px' }}>The Three Major Scholarly Positions</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {[
                            {
                                position: "Global Sighting (itti\u2019had al-matali\u2019)",
                                ar: '\u0627\u062a\u062d\u0627\u062f \u0627\u0644\u0645\u0637\u0627\u0644\u0639',
                                school: 'Hanafi school (majority view)',
                                desc: 'A crescent sighted anywhere in the world is valid for all Muslims everywhere. This position argues that the hadith "Fast when you see it" addresses the entire Muslim community collectively, not individual localities. Proponents point out that the Prophet did not specify "Fast when YOU see it in YOUR land," but used the collective pronoun.',
                                color: '#4ade80',
                            },
                            {
                                position: "Local Sighting (ikhtilaf al-matali\u2019)",
                                ar: 'اختلاف المطالع',
                                school: "Shafi'i school (majority view)",
                                desc: "Each region must rely on its own local crescent sighting. Different geographic regions may start Ramadan on different days. This position argues that the Earth is spherical and different locations have different horizons (matali\u2019), so the crescent visible in Morocco is irrelevant to Muslims in Indonesia because it has not been sighted from their horizon.",
                                color: '#f97316',
                            },
                            {
                                position: 'Shared Night (ishtirak al-layl)',
                                ar: 'اشتراك الليل',
                                school: 'Compromise view (many contemporary scholars)',
                                desc: 'A crescent sighting is valid for all locations that "share the night" with the sighting location. If it is nighttime in both Casablanca and Mecca when the crescent is sighted in Casablanca, then Mecca can adopt that sighting. But if it is daytime in Jakarta when the sighting occurs, Jakarta cannot adopt it because they do not share the same night.',
                                color: '#60a5fa',
                            },
                        ].map((item, i) => (
                            <div key={i} style={{
                                background: 'rgba(30, 41, 59, 0.5)',
                                border: '1px solid #334155',
                                borderRadius: '10px',
                                padding: '1.5rem',
                                borderLeft: `4px solid ${item.color}`,
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '4px', marginBottom: '0.25rem' }}>
                                    <strong style={{ color: item.color, fontSize: '1.1rem' }}>{item.position}</strong>
                                    <span style={{ color: '#64748b', fontFamily: "'Noto Sans Arabic', sans-serif", fontSize: '0.9rem' }}>{item.ar}</span>
                                </div>
                                <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '0.25rem 0 0.75rem', fontStyle: 'italic' }}>Favored by: {item.school}</p>
                                <p style={{ margin: 0, color: '#cbd5e1', lineHeight: '1.7', fontSize: '0.93rem' }}>{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <section style={{ marginBottom: '2.5rem' }}>
                    <h2 style={{ color: '#60a5fa', borderBottom: '2px solid #1e3a5f', paddingBottom: '8px' }}>How Shared Night Works in Practice</h2>
                    <p style={{ lineHeight: '1.8' }}>
                        The "shared night" principle works by checking whether two locations experience nighttime simultaneously. Consider this example:
                    </p>
                    <div style={{
                        background: 'rgba(15, 23, 42, 0.8)',
                        border: '1px solid #334155',
                        borderRadius: '10px',
                        padding: '1.5rem',
                        margin: '1.5rem 0',
                        lineHeight: '2',
                    }}>
                        <p style={{ margin: '0 0 1rem', color: '#f1f5f9', fontWeight: '600' }}>Example Scenario:</p>
                        <p style={{ margin: '0 0 0.5rem' }}>📍 <strong style={{ color: '#4ade80' }}>Casablanca, Morocco</strong> — Sunset at 19:30 UTC. The crescent is sighted at 19:50 UTC.</p>
                        <p style={{ margin: '0 0 0.5rem' }}>📍 <strong style={{ color: '#60a5fa' }}>Mecca, Saudi Arabia</strong> — Sunset at 16:00 UTC (already nighttime at 19:50 UTC). <span style={{ color: '#4ade80' }}>✓ Shares the night → can adopt the sighting.</span></p>
                        <p style={{ margin: '0 0 0.5rem' }}>📍 <strong style={{ color: '#f97316' }}>Jakarta, Indonesia</strong> — Sunset at 10:30 UTC. At 19:50 UTC, it is 02:50 local time (already the next day's early morning). <span style={{ color: '#facc15' }}>⚠ Shares part of the night → scholars differ.</span></p>
                        <p style={{ margin: 0 }}>📍 <strong style={{ color: '#ef4444' }}>Auckland, New Zealand</strong> — Sunset at 05:30 UTC. At 19:50 UTC, it is 07:50 the next morning. <span style={{ color: '#ef4444' }}>✗ Daytime — does not share the night.</span></p>
                    </div>
                </section>

                <section style={{ marginBottom: '2.5rem' }}>
                    <h2 style={{ color: '#60a5fa', borderBottom: '2px solid #1e3a5f', paddingBottom: '8px' }}>How Moon Visibility Explorer Implements Shared Night</h2>
                    <p style={{ lineHeight: '1.8' }}>
                        <Link to="/" style={{ color: '#38bdf8' }}>Moon Visibility Explorer</Link> implements the shared night concept computationally. When generating a <Link to="/guide" style={{ color: '#38bdf8' }}>lunar calendar</Link> for a specific city, the tool performs the following analysis for each month:
                    </p>
                    <ol style={{ paddingLeft: '1.5rem', lineHeight: '2.2' }}>
                        <li>First, it checks whether the crescent is directly visible (Easily Visible or Visible under Perfect Conditions) at the selected city's coordinates.</li>
                        <li>If the crescent is NOT directly visible, it scans the global 2°×2° visibility grid to find cells where the crescent IS visible.</li>
                        <li>For each cell where the crescent is visible, it calculates the overlap of nighttime hours between that cell and the selected city.</li>
                        <li>If sufficient nighttime overlap is found, the month start is marked as "Shared Night" and the source region is identified.</li>
                    </ol>
                    <p style={{ lineHeight: '1.8', marginTop: '1rem' }}>
                        When viewing Night 1 on the map, cells that contributed to the shared night inheritance are highlighted in orange, making it visually clear why the month started on that date even though the crescent was not locally visible.
                    </p>
                </section>

                <section style={{ marginBottom: '2.5rem' }}>
                    <h2 style={{ color: '#60a5fa', borderBottom: '2px solid #1e3a5f', paddingBottom: '8px' }}>Which Countries Follow Which Approach?</h2>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem', color: '#cbd5e1' }}>
                            <thead>
                                <tr style={{ background: 'rgba(15, 23, 42, 0.8)' }}>
                                    <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #334155', color: '#94a3b8' }}>Approach</th>
                                    <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #334155', color: '#94a3b8' }}>Countries</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr style={{ borderBottom: '1px solid #334155' }}>
                                    <td style={{ padding: '10px', color: '#4ade80', fontWeight: '600' }}>Global Sighting</td>
                                    <td style={{ padding: '10px' }}>Libya, some communities in Western countries</td>
                                </tr>
                                <tr style={{ borderBottom: '1px solid #334155' }}>
                                    <td style={{ padding: '10px', color: '#f97316', fontWeight: '600' }}>Local Sighting</td>
                                    <td style={{ padding: '10px' }}>Indonesia, Malaysia, Brunei, most of Southeast Asia</td>
                                </tr>
                                <tr style={{ borderBottom: '1px solid #334155' }}>
                                    <td style={{ padding: '10px', color: '#60a5fa', fontWeight: '600' }}>Shared Night / Regional</td>
                                    <td style={{ padding: '10px' }}>Saudi Arabia (often de facto), most Arab countries, Pakistan, many Sub-Saharan African countries</td>
                                </tr>
                                <tr style={{ borderBottom: '1px solid #334155' }}>
                                    <td style={{ padding: '10px', color: '#facc15', fontWeight: '600' }}>Calculated (no sighting)</td>
                                    <td style={{ padding: '10px' }}>Turkey, some European Islamic organizations, ISNA (North America)</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                <section style={{
                    padding: '1.5rem',
                    background: 'rgba(16, 185, 129, 0.08)',
                    borderRadius: '12px',
                    border: '1px solid rgba(16, 185, 129, 0.2)',
                }}>
                    <h3 style={{ color: '#10b981', margin: '0 0 0.5rem 0' }}>Explore Shared Night Analysis</h3>
                    <p style={{ color: '#cbd5e1', lineHeight: '1.7', margin: '0' }}>
                        To see shared night in action, <Link to="/" style={{ color: '#38bdf8' }}>generate a lunar calendar</Link> for any city and look for months marked with the shared night indicator. For more on the science behind visibility prediction, visit our <Link to="/methodology" style={{ color: '#38bdf8' }}>Methodology</Link> page.
                    </p>
                </section>
            </div>
        </main>
    );
};

export default SharedNightExplained;
