import React from 'react';
import AdBanner from '../../components/AdBanner';
import { Link } from 'react-router-dom';

const HijriCalendarHistory = () => {
    return (
        <main className="content-page">
            <div className="content-container" style={{ maxWidth: '900px', margin: '0 auto', padding: '20px 20px 60px', color: '#e2e8f0' }}>

                <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>The History of the Islamic (Hijri) Calendar</h1>
                <p style={{
                    fontFamily: "'Noto Sans Arabic', sans-serif",
                    direction: 'rtl',
                    textAlign: 'right',
                    color: '#64748b',
                    marginBottom: '2rem',
                    fontSize: '0.95rem',
                }}>
                    تاريخ التقويم الإسلامي (الهجري) — من العصر الجاهلي إلى العصر الحديث
                </p>

                <section style={{ marginBottom: '2.5rem' }}>
                    <h2 style={{ color: '#60a5fa', borderBottom: '2px solid #1e3a5f', paddingBottom: '8px' }}>Pre-Islamic Origins of Lunar Timekeeping</h2>
                    <p style={{ lineHeight: '1.8' }}>
                        Long before the advent of Islam, the Arab peoples of the Arabian Peninsula used a lunisolar calendar to track time. This pre-Islamic calendar (known as the calendar of the Jāhiliyyah) consisted of twelve lunar months, but it included an intercalary month — called Nasī' (النسيء) — that was periodically inserted to keep the calendar roughly aligned with the seasons. This practice of intercalation ensured that the annual pilgrimage to Mecca and the great trade fairs occurred during favorable weather and harvest periods.
                    </p>
                    <p style={{ lineHeight: '1.8', marginTop: '1rem' }}>
                        The pre-Islamic Arabs had already established the names of the twelve months that are still used in the Hijri calendar today: Muharram, Safar, Rabi' al-Awwal, Rabi' al-Thani, Jumada al-Ula, Jumada al-Thania, Rajab, Sha'ban, Ramadan, Shawwal, Dhul Qi'dah, and Dhul Hijjah. Four of these months — Muharram, Rajab, Dhul Qi'dah, and Dhul Hijjah — were considered sacred (الأشهر الحرم), during which warfare was prohibited.
                    </p>
                </section>

                <section style={{ marginBottom: '2.5rem' }}>
                    <h2 style={{ color: '#60a5fa', borderBottom: '2px solid #1e3a5f', paddingBottom: '8px' }}>The Quranic Prohibition of Intercalation</h2>
                    <p style={{ lineHeight: '1.8' }}>
                        The practice of Nasī' (intercalation) was explicitly banned in the Quran in Surah At-Tawbah (9:36-37): <em>"Indeed, the number of months with Allah is twelve months in the register of Allah from the day He created the heavens and the earth; of these, four are sacred."</em> The verse continues to describe the postponement of sacred months as an "increase in disbelief."
                    </p>
                    <p style={{ lineHeight: '1.8', marginTop: '1rem' }}>
                        This prohibition transformed the Arab calendar from a lunisolar system (which stayed roughly aligned with seasons) into a purely lunar calendar. As a result, the Islamic calendar is approximately 11 days shorter than the Gregorian year (354-355 days vs. 365-366 days), and Islamic months rotate through all seasons over a cycle of approximately 33 years. This means that Ramadan, for example, occurs in summer in some decades and in winter in others.
                    </p>
                    <div style={{
                        background: 'rgba(96, 165, 250, 0.05)',
                        border: '1px solid rgba(96, 165, 250, 0.15)',
                        borderRadius: '8px',
                        padding: '1rem 1.25rem',
                        marginTop: '1rem',
                        fontFamily: "'Noto Sans Arabic', sans-serif",
                        direction: 'rtl',
                        textAlign: 'right',
                        lineHeight: '2',
                        color: '#94a3b8',
                        fontSize: '0.9rem',
                    }}>
                        حرّم القرآن الكريم النسيء (إضافة شهر كبيس) في سورة التوبة، مما حوّل التقويم العربي من نظام شمسي-قمري إلى تقويم قمري بحت. ونتيجة لذلك، تدور الأشهر الإسلامية عبر جميع الفصول خلال دورة تمتد حوالي 33 عاماً.
                    </div>
                </section>

                <section style={{ marginBottom: '2.5rem' }}>
                    <h2 style={{ color: '#60a5fa', borderBottom: '2px solid #1e3a5f', paddingBottom: '8px' }}>The Establishment of the Hijri Calendar</h2>
                    <p style={{ lineHeight: '1.8' }}>
                        The Islamic calendar as a formal dating system was established during the caliphate of Umar ibn al-Khattab (رضي الله عنه) in approximately 638 CE (17 AH). According to historical accounts, the caliph recognized the need for a unified dating system after receiving a document dated simply "Sha'ban" with no year indicated, creating confusion about when it was written.
                    </p>
                    <p style={{ lineHeight: '1.8', marginTop: '1rem' }}>
                        After consultation with other companions of the Prophet, Umar decided to begin the calendar from the year of the Hijra — Prophet Muhammad's migration from Mecca to Medina in 622 CE. This event was chosen not because it was the most important event in Islamic history (the first revelation or the Prophet's birth could also have been chosen), but because it represented a clear, well-documented turning point: the establishment of the first Muslim community in Medina.
                    </p>
                    <p style={{ lineHeight: '1.8', marginTop: '1rem' }}>
                        The epoch was set to the first day of Muharram in the year of the Hijra, which corresponds approximately to July 16, 622 CE in the proleptic Julian calendar. This date marks 1 Muharram 1 AH (Anno Hegirae). The calendar has been in continuous use since then, making it one of the oldest continuously used calendars in the world.
                    </p>
                </section>

                <section style={{ marginBottom: '2.5rem' }}>
                    <h2 style={{ color: '#60a5fa', borderBottom: '2px solid #1e3a5f', paddingBottom: '8px' }}>The Twelve Months of the Hijri Calendar</h2>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem', color: '#cbd5e1' }}>
                            <thead>
                                <tr style={{ background: 'rgba(15, 23, 42, 0.8)' }}>
                                    <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #334155', color: '#94a3b8' }}>#</th>
                                    <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #334155', color: '#94a3b8' }}>Name</th>
                                    <th style={{ padding: '10px', textAlign: 'right', borderBottom: '2px solid #334155', color: '#94a3b8', fontFamily: "'Noto Sans Arabic', sans-serif" }}>بالعربية</th>
                                    <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #334155', color: '#94a3b8' }}>Meaning & Significance</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[
                                    { n: 1, name: 'Muharram', ar: 'محرّم', desc: '"Forbidden" — Sacred month, warfare prohibited. 10th Muharram is Ashura.' },
                                    { n: 2, name: 'Safar', ar: 'صفر', desc: '"Void" — Named because pre-Islamic Arabs left homes empty during travel.' },
                                    { n: 3, name: "Rabi' al-Awwal", ar: 'ربيع الأول', desc: '"First Spring" — Month of the Prophet\'s birth (Mawlid).' },
                                    { n: 4, name: "Rabi' al-Thani", ar: 'ربيع الثاني', desc: '"Second Spring" — Continuation of the spring period.' },
                                    { n: 5, name: 'Jumada al-Ula', ar: 'جمادى الأولى', desc: '"First of Parched Land" — Originally a dry/winter month.' },
                                    { n: 6, name: 'Jumada al-Thania', ar: 'جمادى الثانية', desc: '"Second of Parched Land" — Continuation.' },
                                    { n: 7, name: 'Rajab', ar: 'رجب', desc: '"Respect" — Sacred month. Night Journey (Isra\' and Mi\'raj) on 27th Rajab.' },
                                    { n: 8, name: "Sha'ban", ar: 'شعبان', desc: '"Scattered" — Month before Ramadan. 15th Sha\'ban (Laylat al-Bara\'ah).' },
                                    { n: 9, name: 'Ramadan', ar: 'رمضان', desc: '"Burning Heat" — Month of fasting. Laylat al-Qadr in last 10 nights.' },
                                    { n: 10, name: 'Shawwal', ar: 'شوّال', desc: '"Raised" — Eid al-Fitr on 1st Shawwal. Six days of optional fasting.' },
                                    { n: 11, name: "Dhul Qi'dah", ar: 'ذو القعدة', desc: '"Master of Rest" — Sacred month, preparation for Hajj.' },
                                    { n: 12, name: 'Dhul Hijjah', ar: 'ذو الحجة', desc: '"Master of Pilgrimage" — Sacred month. Hajj on 8-12th. Eid al-Adha on 10th.' },
                                ].map(m => (
                                    <tr key={m.n} style={{ borderBottom: '1px solid #334155' }}>
                                        <td style={{ padding: '8px 10px' }}>{m.n}</td>
                                        <td style={{ padding: '8px 10px', fontWeight: '600', color: '#f1f5f9' }}>{m.name}</td>
                                        <td style={{ padding: '8px 10px', textAlign: 'right', fontFamily: "'Noto Sans Arabic', sans-serif" }}>{m.ar}</td>
                                        <td style={{ padding: '8px 10px', fontSize: '0.85rem' }}>{m.desc}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                <section style={{ marginBottom: '2.5rem' }}>
                    <h2 style={{ color: '#60a5fa', borderBottom: '2px solid #1e3a5f', paddingBottom: '8px' }}>Modern Hijri Calendar Systems</h2>
                    <p style={{ lineHeight: '1.8' }}>
                        Today, multiple systems exist for determining the Hijri calendar, reflecting the diversity of Islamic jurisprudential opinions:
                    </p>
                    <ul style={{ paddingLeft: '1.5rem', lineHeight: '2.2' }}>
                        <li><strong style={{ color: '#f1f5f9' }}>Physical Sighting (Ru'yah):</strong> Most traditionalist approach. The new month begins only when reliable witnesses report seeing the crescent moon. Used by Saudi Arabia's Supreme Court, Pakistan's Ruet-e-Hilal Committee, and many others.</li>
                        <li><strong style={{ color: '#f1f5f9' }}>Calculated Calendar (Hisab):</strong> Uses astronomical formulas to predict when the crescent will be visible. Turkey's Diyanet and some Southeast Asian countries use this approach.</li>
                        <li><strong style={{ color: '#f1f5f9' }}>Umm al-Qura Calendar:</strong> Saudi Arabia's civil calendar. Uses calculated conjunction times with a visibility criterion. Dates may differ from the religious sighting announcement.</li>
                        <li><strong style={{ color: '#f1f5f9' }}>Unified Calendars:</strong> Various attempts have been made to create a single global Islamic calendar (such as the Fiqh Committee of the Organization of Islamic Cooperation), but consensus has not yet been achieved.</li>
                    </ul>
                    <p style={{ lineHeight: '1.8', marginTop: '1rem' }}>
                        <Link to="/" style={{ color: '#38bdf8' }}>Moon Visibility Explorer</Link> supports all perspectives by providing scientifically-grounded visibility predictions using the <Link to="/methodology" style={{ color: '#38bdf8' }}>Odeh V-criterion</Link>, allowing users to make informed decisions regardless of which methodology their community follows.
                    </p>
                </section>

                <section style={{
                    padding: '1.5rem',
                    background: 'rgba(16, 185, 129, 0.08)',
                    borderRadius: '12px',
                    border: '1px solid rgba(16, 185, 129, 0.2)',
                    marginBottom: '2rem',
                }}>
                    <h3 style={{ color: '#10b981', margin: '0 0 0.5rem 0' }}>Explore the Hijri Calendar</h3>
                    <p style={{ color: '#cbd5e1', lineHeight: '1.7', margin: '0' }}>
                        Want to see when each Islamic month begins for your city? Use our <Link to="/" style={{ color: '#38bdf8' }}>Moon Visibility Explorer</Link> to generate a complete 12-month lunar calendar, or read our <Link to="/guide" style={{ color: '#38bdf8' }}>User Guide</Link> to learn how.
                    </p>
                </section>
                <AdBanner dataAdSlot="5502376796" style={{ marginTop: '40px', marginBottom: '20px', maxWidth: '800px', marginLeft: 'auto', marginRight: 'auto' }} />
            </div>
        </main>
    );
};

export default HijriCalendarHistory;
