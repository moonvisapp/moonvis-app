import React from 'react';
import AdBanner from '../../components/AdBanner';
import { Link } from 'react-router-dom';

const IslamicVsGregorianCalendar = () => {
    return (
        <main className="content-page">
            <div className="content-container" style={{ maxWidth: '900px', margin: '0 auto', padding: '20px 20px 60px', color: '#e2e8f0' }}>

                <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Islamic Calendar vs. Gregorian Calendar: Key Differences Explained</h1>
                <p style={{
                    fontFamily: "'Noto Sans Arabic', sans-serif",
                    direction: 'rtl',
                    textAlign: 'right',
                    color: '#64748b',
                    marginBottom: '2rem',
                    fontSize: '0.95rem',
                }}>
                    التقويم الإسلامي مقابل التقويم الميلادي — الفروق الرئيسية
                </p>

                <section style={{ marginBottom: '2.5rem' }}>
                    <h2 style={{ color: '#60a5fa', borderBottom: '2px solid #1e3a5f', paddingBottom: '8px' }}>Overview</h2>
                    <p style={{ lineHeight: '1.8' }}>
                        The Islamic (Hijri) calendar and the Gregorian calendar are two of the most widely used dating systems in the world. While the Gregorian calendar is the international standard for civil use, the Islamic calendar governs the religious life of nearly 2 billion Muslims worldwide. Understanding the key differences between these two systems is essential for anyone planning Islamic events, converting dates, or studying comparative chronology.
                    </p>
                </section>

                <section style={{ marginBottom: '2.5rem' }}>
                    <h2 style={{ color: '#60a5fa', borderBottom: '2px solid #1e3a5f', paddingBottom: '8px' }}>Side-by-Side Comparison</h2>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem', color: '#cbd5e1' }}>
                            <thead>
                                <tr style={{ background: 'rgba(15, 23, 42, 0.8)' }}>
                                    <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #334155', color: '#94a3b8' }}>Feature</th>
                                    <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #334155', color: '#60a5fa' }}>Islamic (Hijri)</th>
                                    <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #334155', color: '#10b981' }}>Gregorian</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[
                                    { f: 'Type', h: 'Purely Lunar', g: 'Solar' },
                                    { f: 'Year Length', h: '354 or 355 days', g: '365 or 366 days' },
                                    { f: 'Months', h: '12 months (29 or 30 days each)', g: '12 months (28-31 days each)' },
                                    { f: 'Month Determined By', h: 'Crescent moon sighting or calculation', g: 'Fixed mathematical formula' },
                                    { f: 'Seasonal Alignment', h: 'No — months rotate through all seasons', g: 'Yes — months aligned with seasons' },
                                    { f: 'Epoch (Year 1)', h: '622 CE (Hijra to Medina)', g: '1 CE (estimated birth of Jesus)' },
                                    { f: 'Current Year (2026 CE)', h: '1447-1448 AH', g: '2026 CE' },
                                    { f: 'Day Begins At', h: 'Sunset', g: 'Midnight' },
                                    { f: 'Leap Year', h: '11 leap days in 30-year cycle (tabular)', g: '1 leap day every 4 years (with exceptions)' },
                                    { f: 'Predictability', h: 'Observational — can vary by 1-2 days', g: 'Fully predictable millennia in advance' },
                                    { f: 'Primary Use', h: 'Religious observances', g: 'Civil and international standard' },
                                ].map((row, i) => (
                                    <tr key={i} style={{ borderBottom: '1px solid #334155' }}>
                                        <td style={{ padding: '8px 10px', fontWeight: '600', color: '#f1f5f9' }}>{row.f}</td>
                                        <td style={{ padding: '8px 10px' }}>{row.h}</td>
                                        <td style={{ padding: '8px 10px' }}>{row.g}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                <section style={{ marginBottom: '2.5rem' }}>
                    <h2 style={{ color: '#60a5fa', borderBottom: '2px solid #1e3a5f', paddingBottom: '8px' }}>Why Islamic Dates "Move" in the Gregorian Calendar</h2>
                    <p style={{ lineHeight: '1.8' }}>
                        Because the Islamic lunar year is approximately 11 days shorter than the Gregorian solar year, every Islamic date occurs about 11 days earlier in the Gregorian calendar each year. This means that over a period of approximately 33 Gregorian years, Islamic dates complete one full cycle through all seasons.
                    </p>
                    <p style={{ lineHeight: '1.8', marginTop: '1rem' }}>
                        For example, the month of Ramadan may fall in the summer heat one decade and in the cool winter another decade. This rotation is considered by many Muslims to be a mercy — the difficulty (or ease) of fasting is distributed equally over a person's lifetime rather than being permanently fixed to one season.
                    </p>
                    <p style={{ lineHeight: '1.8', marginTop: '1rem' }}>
                        This drift also means there is no simple formula to convert between Hijri and Gregorian dates. While approximate conversions exist (such as: Gregorian Year ≈ Hijri Year × 0.97 + 622), precise conversion requires knowing the exact sighting-based start of each Hijri month, which is what <Link to="/" style={{ color: '#38bdf8' }}>Moon Visibility Explorer</Link> helps determine.
                    </p>
                </section>

                <section style={{ marginBottom: '2.5rem' }}>
                    <h2 style={{ color: '#60a5fa', borderBottom: '2px solid #1e3a5f', paddingBottom: '8px' }}>When the Day Begins: Sunset vs. Midnight</h2>
                    <p style={{ lineHeight: '1.8' }}>
                        One of the most practically important differences is when the day begins. In the Gregorian system, the new day starts at midnight (00:00). In the Islamic system, the new day begins at sunset (maghrib). This means that, for example, if 1 Ramadan begins on the evening of March 10 (Gregorian), the Islamic day of 1 Ramadan actually spans from the evening of March 10 to the evening of March 11.
                    </p>
                    <p style={{ lineHeight: '1.8', marginTop: '1rem' }}>
                        This is why you often see Islamic dates reported as "the evening of [Gregorian date]" — because the Islamic date has already begun at sunset, while the Gregorian calendar still considers it the same day until midnight. Moon Visibility Explorer accounts for this by labeling predictions as "Evening of [date]" to avoid confusion.
                    </p>
                </section>

                <section style={{ marginBottom: '2.5rem' }}>
                    <h2 style={{ color: '#60a5fa', borderBottom: '2px solid #1e3a5f', paddingBottom: '8px' }}>Other Calendar Systems in the Islamic World</h2>
                    <p style={{ lineHeight: '1.8' }}>
                        While the Hijri lunar calendar is used universally for religious purposes, several Muslim-majority countries also use solar-based calendars for civil purposes:
                    </p>
                    <ul style={{ paddingLeft: '1.5rem', lineHeight: '2.2' }}>
                        <li><strong style={{ color: '#f1f5f9' }}>Solar Hijri Calendar (Iran & Afghanistan):</strong> A solar calendar with the Hijri epoch. Year lengths match the Gregorian calendar, but month names are Persian (Farvardin, Ordibehesht, etc.). Currently in use as the civil calendar of Iran.</li>
                        <li><strong style={{ color: '#f1f5f9' }}>Umm al-Qura Calendar (Saudi Arabia):</strong> A lunar calendar calculated in advance using astronomical criteria. Used for civil purposes in Saudi Arabia, though religious month starts may differ based on physical sighting.</li>
                        <li><strong style={{ color: '#f1f5f9' }}>Bengali Calendar (Bangladesh):</strong> A modified solar calendar traditionally used alongside the Gregorian calendar. Islamic dates are determined separately using lunar observation.</li>
                    </ul>
                </section>

                <section style={{
                    padding: '1.5rem',
                    background: 'rgba(16, 185, 129, 0.08)',
                    borderRadius: '12px',
                    border: '1px solid rgba(16, 185, 129, 0.2)',
                }}>
                    <h3 style={{ color: '#10b981', margin: '0 0 0.5rem 0' }}>Convert Dates with Moon Visibility Explorer</h3>
                    <p style={{ color: '#cbd5e1', lineHeight: '1.7', margin: '0' }}>
                        Need to know when a specific Islamic month starts in the Gregorian calendar? <Link to="/" style={{ color: '#38bdf8' }}>Moon Visibility Explorer</Link> can generate a complete Hijri-to-Gregorian calendar for your city. Check our <Link to="/faq" style={{ color: '#38bdf8' }}>FAQ</Link> for more details, or read about the <Link to="/articles/hijri-calendar-history" style={{ color: '#38bdf8' }}>history of the Hijri calendar</Link>.
                    </p>
                </section>
                <AdBanner dataAdSlot="5502376796" style={{ marginTop: '40px', marginBottom: '20px', maxWidth: '800px', marginLeft: 'auto', marginRight: 'auto' }} />
            </div>
        </main>
    );
};

export default IslamicVsGregorianCalendar;
