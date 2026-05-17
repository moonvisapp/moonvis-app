import React from 'react';
import AdBanner from '../../components/AdBanner';
import { Link } from 'react-router-dom';

const EidDatesGuide = () => {
    const currentYear = new Date().getFullYear();

    return (
        <main className="content-page">
            <div className="content-container" style={{ maxWidth: '900px', margin: '0 auto', padding: '20px 20px 60px', color: '#e2e8f0' }}>

                <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>When Is Eid al-Fitr and Eid al-Adha {currentYear}?</h1>
                <p style={{
                    fontFamily: "'Noto Sans Arabic', sans-serif",
                    direction: 'rtl',
                    textAlign: 'right',
                    color: '#64748b',
                    marginBottom: '2rem',
                    fontSize: '0.95rem',
                }}>
                    متى عيد الفطر وعيد الأضحى {currentYear}؟ — تنبؤات رؤية الهلال
                </p>

                <section style={{ marginBottom: '2.5rem' }}>
                    <h2 style={{ color: '#60a5fa', borderBottom: '2px solid #1e3a5f', paddingBottom: '8px' }}>Understanding the Two Eids</h2>
                    <p style={{ lineHeight: '1.8' }}>
                        Islam has two major holidays (Eids), both determined by the lunar calendar. Because the Islamic calendar is based on actual moon sighting rather than a fixed formula, the Gregorian dates of these holidays shift each year and can vary by 1-2 days between countries.
                    </p>
                </section>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
                    <div style={{
                        background: 'rgba(74, 222, 128, 0.05)',
                        border: '1px solid rgba(74, 222, 128, 0.2)',
                        borderRadius: '12px',
                        padding: '1.5rem',
                    }}>
                        <h3 style={{ color: '#4ade80', margin: '0 0 0.25rem 0', fontSize: '1.3rem' }}>Eid al-Fitr</h3>
                        <p style={{ color: '#94a3b8', margin: '0 0 1rem', fontFamily: "'Noto Sans Arabic', sans-serif", fontSize: '0.9rem' }}>عيد الفطر</p>
                        <p style={{ lineHeight: '1.8', margin: '0 0 0.5rem' }}>
                            <strong style={{ color: '#f1f5f9' }}>When:</strong> 1 Shawwal (the 10th month) — the first day after Ramadan ends.
                        </p>
                        <p style={{ lineHeight: '1.8', margin: '0 0 0.5rem' }}>
                            <strong style={{ color: '#f1f5f9' }}>How determined:</strong> By sighting the crescent moon of Shawwal on the 29th evening of Ramadan. If sighted, Eid is the next day. If not, Ramadan is completed to 30 days and Eid is the day after.
                        </p>
                        <p style={{ lineHeight: '1.8', margin: '0 0 0.5rem' }}>
                            <strong style={{ color: '#f1f5f9' }}>Significance:</strong> "Festival of Breaking the Fast." Marks the end of the month-long Ramadan fast. Celebrations include the Eid prayer (Salat al-Eid), charitable giving (Zakat al-Fitr), family gatherings, feasting, and gift-giving.
                        </p>
                        <p style={{ lineHeight: '1.8', margin: '0' }}>
                            <strong style={{ color: '#f1f5f9' }}>Duration:</strong> Typically celebrated for 1-3 days, depending on the country and local customs.
                        </p>
                    </div>
                    <div style={{
                        background: 'rgba(96, 165, 250, 0.05)',
                        border: '1px solid rgba(96, 165, 250, 0.2)',
                        borderRadius: '12px',
                        padding: '1.5rem',
                    }}>
                        <h3 style={{ color: '#60a5fa', margin: '0 0 0.25rem 0', fontSize: '1.3rem' }}>Eid al-Adha</h3>
                        <p style={{ color: '#94a3b8', margin: '0 0 1rem', fontFamily: "'Noto Sans Arabic', sans-serif", fontSize: '0.9rem' }}>عيد الأضحى</p>
                        <p style={{ lineHeight: '1.8', margin: '0 0 0.5rem' }}>
                            <strong style={{ color: '#f1f5f9' }}>When:</strong> 10 Dhul Hijjah (the 12th month) — during the annual Hajj pilgrimage season.
                        </p>
                        <p style={{ lineHeight: '1.8', margin: '0 0 0.5rem' }}>
                            <strong style={{ color: '#f1f5f9' }}>How determined:</strong> By sighting the crescent moon of Dhul Hijjah on the 29th evening of Dhul Qi'dah. Eid al-Adha follows on the 10th day of the new month.
                        </p>
                        <p style={{ lineHeight: '1.8', margin: '0 0 0.5rem' }}>
                            <strong style={{ color: '#f1f5f9' }}>Significance:</strong> "Festival of the Sacrifice." Commemorates Prophet Ibrahim's willingness to sacrifice his son in obedience to God. Muslims worldwide perform the qurbani (sacrifice) and distribute meat to family, friends, and the poor.
                        </p>
                        <p style={{ lineHeight: '1.8', margin: '0' }}>
                            <strong style={{ color: '#f1f5f9' }}>Duration:</strong> Celebrated for 3-4 days. The 9th of Dhul Hijjah (Day of Arafah) is a day of fasting for non-pilgrims.
                        </p>
                    </div>
                </div>

                <section style={{ marginBottom: '2.5rem' }}>
                    <h2 style={{ color: '#60a5fa', borderBottom: '2px solid #1e3a5f', paddingBottom: '8px' }}>Why Eid Dates Vary by Country</h2>
                    <p style={{ lineHeight: '1.8' }}>
                        It is extremely common for Eid al-Fitr and Eid al-Adha to be celebrated on different days in different countries. This causes practical complications for the global Muslim community — families split across countries may celebrate on different days, and businesses must plan for varying holiday schedules.
                    </p>
                    <p style={{ lineHeight: '1.8', marginTop: '1rem' }}>
                        The reasons for this variation are the same as for the start of any Islamic month: different countries use different methodologies (<Link to="/articles/moon-sighting-committees" style={{ color: '#38bdf8' }}>moon sighting committees</Link> vs. calculated calendars), different scholarly positions on <Link to="/articles/shared-night-explained" style={{ color: '#38bdf8' }}>shared night</Link>, and the physical reality that the crescent moon is visible in different parts of the world at different times.
                    </p>
                </section>

                <section style={{ marginBottom: '2.5rem' }}>
                    <h2 style={{ color: '#60a5fa', borderBottom: '2px solid #1e3a5f', paddingBottom: '8px' }}>Predict Eid Dates for Your City</h2>
                    <p style={{ lineHeight: '1.8' }}>
                        Moon Visibility Explorer predicts both Eid dates as part of its <Link to="/guide" style={{ color: '#38bdf8' }}>lunar calendar generation</Link>:
                    </p>
                    <ul style={{ paddingLeft: '1.5rem', lineHeight: '2.2' }}>
                        <li><strong style={{ color: '#4ade80' }}>Eid al-Fitr:</strong> Look for the start of month 10 (Shawwal) in the generated calendar. The first day of Shawwal IS Eid al-Fitr.</li>
                        <li><strong style={{ color: '#60a5fa' }}>Eid al-Adha:</strong> Find the start of month 12 (Dhul Hijjah), then add 9 days. The 10th of Dhul Hijjah is Eid al-Adha.</li>
                        <li><strong style={{ color: '#facc15' }}>Day of Arafah:</strong> The 9th of Dhul Hijjah — one day before Eid al-Adha — is the Day of Arafah, when fasting is recommended for non-pilgrims.</li>
                    </ul>
                    <p style={{ lineHeight: '1.8', marginTop: '1rem' }}>
                        You can export these dates as a PDF, add them to Google Calendar, or download as CSV data for your community.
                    </p>
                </section>

                <section style={{ marginBottom: '2.5rem' }}>
                    <h2 style={{ color: '#60a5fa', borderBottom: '2px solid #1e3a5f', paddingBottom: '8px' }}>Other Important Islamic Dates</h2>
                    <p style={{ lineHeight: '1.8' }}>
                        Besides the two Eids, the Islamic calendar contains several other significant dates:
                    </p>
                    <ul style={{ paddingLeft: '1.5rem', lineHeight: '2.2' }}>
                        <li><strong style={{ color: '#f1f5f9' }}>1 Muharram</strong> — Islamic New Year (Hijri New Year)</li>
                        <li><strong style={{ color: '#f1f5f9' }}>10 Muharram</strong> — Ashura (day of fasting, commemorating various events)</li>
                        <li><strong style={{ color: '#f1f5f9' }}>12 Rabi' al-Awwal</strong> — Mawlid (Prophet Muhammad's birthday, celebrated by many though not all Muslims)</li>
                        <li><strong style={{ color: '#f1f5f9' }}>27 Rajab</strong> — Isra' and Mi'raj (the Night Journey)</li>
                        <li><strong style={{ color: '#f1f5f9' }}>15 Sha'ban</strong> — Laylat al-Bara'ah (Night of Forgiveness)</li>
                        <li><strong style={{ color: '#f1f5f9' }}>Laylat al-Qadr</strong> — Night of Power (one of the last 10 odd nights of Ramadan)</li>
                    </ul>
                    <p style={{ lineHeight: '1.8', marginTop: '1rem' }}>
                        All of these dates can be determined from the lunar calendar generated by <Link to="/" style={{ color: '#38bdf8' }}>Moon Visibility Explorer</Link>, since they are all defined relative to the start of their respective Islamic months.
                    </p>
                </section>

                <section style={{
                    padding: '1.5rem',
                    background: 'rgba(16, 185, 129, 0.08)',
                    borderRadius: '12px',
                    border: '1px solid rgba(16, 185, 129, 0.2)',
                }}>
                    <h3 style={{ color: '#10b981', margin: '0 0 0.5rem 0' }}>Plan Ahead for {currentYear}</h3>
                    <p style={{ color: '#cbd5e1', lineHeight: '1.7', margin: '0' }}>
                        Generate a complete Hijri calendar for your city now and get predicted dates for both Eids, Ramadan, and all other Islamic months. <Link to="/" style={{ color: '#38bdf8' }}>Open Moon Visibility Explorer →</Link>
                    </p>
                </section>
                <AdBanner dataAdSlot="5502376796" style={{ marginTop: '40px', marginBottom: '20px', maxWidth: '800px', marginLeft: 'auto', marginRight: 'auto' }} />
            </div>
        </main>
    );
};

export default EidDatesGuide;
