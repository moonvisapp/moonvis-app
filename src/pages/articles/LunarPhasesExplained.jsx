import React from 'react';
import { Link } from 'react-router-dom';

const LunarPhasesExplained = () => {
    return (
        <main className="content-page">
            <div className="content-container" style={{ maxWidth: '900px', margin: '0 auto', padding: '20px 20px 60px', color: '#e2e8f0' }}>

                <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Understanding Lunar Phases: A Complete Guide</h1>
                <p style={{
                    fontFamily: "'Noto Sans Arabic', sans-serif",
                    direction: 'rtl',
                    textAlign: 'right',
                    color: '#64748b',
                    marginBottom: '2rem',
                    fontSize: '0.95rem',
                }}>
                    فهم أطوار القمر — دليل شامل لدورة القمر وعلاقتها بالتقويم الإسلامي
                </p>

                <section style={{ marginBottom: '2.5rem' }}>
                    <h2 style={{ color: '#60a5fa', borderBottom: '2px solid #1e3a5f', paddingBottom: '8px' }}>The Lunar Cycle</h2>
                    <p style={{ lineHeight: '1.8' }}>
                        The Moon orbits the Earth approximately once every 29.53 days — a period known as the synodic month. During this orbit, the Moon goes through a predictable series of phases as the relative positions of the Sun, Earth, and Moon change. These phases have been observed and recorded by human civilizations for thousands of years and form the basis of the Islamic (Hijri) calendar.
                    </p>
                    <p style={{ lineHeight: '1.8', marginTop: '1rem' }}>
                        The phases are caused by the changing angle of sunlight illuminating the Moon's surface as seen from Earth. The Moon itself does not produce any light — it only reflects sunlight. As the Moon orbits Earth, we see different portions of its sunlit side, creating the familiar cycle from new moon to full moon and back.
                    </p>
                </section>

                <section style={{ marginBottom: '2.5rem' }}>
                    <h2 style={{ color: '#60a5fa', borderBottom: '2px solid #1e3a5f', paddingBottom: '8px' }}>The Eight Primary Phases</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {[
                            { phase: 'New Moon (Conjunction)', ar: 'القمر الجديد (الاقتران)', emoji: '🌑', desc: 'The Moon is between the Earth and Sun. Its illuminated side faces away from Earth, making it invisible. This astronomical event (called "conjunction" or محاق) is the starting reference point for the Islamic month, though the month does not actually begin until the crescent is sighted after conjunction.', color: '#64748b' },
                            { phase: 'Waxing Crescent (Hilal)', ar: 'الهلال المتزايد', emoji: '🌒', desc: 'A thin sliver of light appears on the Moon\'s right side (in the Northern Hemisphere). This is the hilal (الهلال) — the crescent that marks the beginning of a new Islamic month. The visibility of this crescent is exactly what Moon Visibility Explorer predicts using the Odeh V-criterion.', color: '#4ade80' },
                            { phase: 'First Quarter', ar: 'التربيع الأول', emoji: '🌓', desc: 'Exactly half of the Moon\'s visible surface is illuminated. This occurs approximately 7 days after conjunction. In the Islamic calendar, this typically corresponds to around the 7th of the month.' },
                            { phase: 'Waxing Gibbous', ar: 'الأحدب المتزايد', emoji: '🌔', desc: 'More than half of the Moon is illuminated and growing. The word "gibbous" comes from Latin meaning "humped." This phase occurs between the first quarter and full moon.' },
                            { phase: 'Full Moon (Badr)', ar: 'البدر', emoji: '🌕', desc: 'The entire visible surface of the Moon is illuminated by the Sun. This occurs approximately 14-15 days after conjunction, typically around the middle of the Islamic month. The Arabic word "badr" (بدر) refers to the full moon and has cultural significance.', color: '#facc15' },
                            { phase: 'Waning Gibbous', ar: 'الأحدب المتناقص', emoji: '🌖', desc: 'The illuminated portion begins to decrease after the full moon. More than half is still visible but shrinking each night.' },
                            { phase: 'Last Quarter', ar: 'التربيع الأخير', emoji: '🌗', desc: 'The opposite half is illuminated compared to the first quarter. This occurs approximately 22 days after conjunction, around the 22nd of the Islamic month.' },
                            { phase: 'Waning Crescent', ar: 'الهلال المتناقص', emoji: '🌘', desc: 'A thin crescent appears on the Moon\'s left side before the next conjunction. This is sometimes called the "old moon." When this crescent disappears, the 29th night of the Islamic month arrives, and observers begin watching for the new crescent.' },
                        ].map((item, i) => (
                            <div key={i} style={{
                                background: 'rgba(30, 41, 59, 0.4)',
                                border: '1px solid #334155',
                                borderRadius: '10px',
                                padding: '1.25rem',
                                borderLeft: item.color ? `4px solid ${item.color}` : '4px solid #334155',
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                                    <span style={{ fontSize: '1.5rem' }}>{item.emoji}</span>
                                    <strong style={{ color: '#f1f5f9', fontSize: '1rem' }}>{item.phase}</strong>
                                    <span style={{ color: '#64748b', fontFamily: "'Noto Sans Arabic', sans-serif", fontSize: '0.85rem' }}>{item.ar}</span>
                                </div>
                                <p style={{ margin: 0, color: '#cbd5e1', lineHeight: '1.7', fontSize: '0.9rem' }}>{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <section style={{ marginBottom: '2.5rem' }}>
                    <h2 style={{ color: '#60a5fa', borderBottom: '2px solid #1e3a5f', paddingBottom: '8px' }}>Conjunction vs. Crescent Visibility</h2>
                    <p style={{ lineHeight: '1.8' }}>
                        A critical distinction in Islamic calendar science is the difference between <strong style={{ color: '#f1f5f9' }}>astronomical conjunction</strong> (when the new moon occurs geometrically) and <strong style={{ color: '#f1f5f9' }}>crescent visibility</strong> (when the new crescent can actually be seen by an observer on Earth).
                    </p>
                    <p style={{ lineHeight: '1.8', marginTop: '1rem' }}>
                        Conjunction is a precise, calculable instant when the Moon passes between the Earth and Sun. At this moment, the Moon is completely dark. The crescent only becomes potentially visible 15-24 hours after conjunction, when the Moon has moved far enough from the Sun for a thin sliver of reflected sunlight to be visible against the twilight sky.
                    </p>
                    <p style={{ lineHeight: '1.8', marginTop: '1rem' }}>
                        Several factors determine whether the crescent will be visible after conjunction: the Moon's angular distance from the Sun (elongation), the Moon's altitude above the horizon at sunset, the width of the illuminated crescent, and the brightness of the sky background. The <Link to="/methodology" style={{ color: '#38bdf8' }}>Odeh V-criterion</Link> mathematically models these factors to predict visibility.
                    </p>
                    <p style={{ lineHeight: '1.8', marginTop: '1rem' }}>
                        The minimum conditions for crescent visibility (the "Danjon limit") require the Moon to be at least approximately 7° from the Sun. Below this limit, the crescent is too thin and too close to the Sun's glare to be detected by any means.
                    </p>
                </section>

                <section style={{ marginBottom: '2.5rem' }}>
                    <h2 style={{ color: '#60a5fa', borderBottom: '2px solid #1e3a5f', paddingBottom: '8px' }}>Why the 29th Night Is Critical</h2>
                    <p style={{ lineHeight: '1.8' }}>
                        In the Islamic calendar, the 29th evening of each month is the key decision point. Observers attempt to spot the new crescent after sunset. If the crescent is sighted, the new month begins that evening. If it is not sighted — whether due to atmospheric conditions or the Moon's position — the current month is completed to 30 days, and the new month begins the following evening.
                    </p>
                    <p style={{ lineHeight: '1.8', marginTop: '1rem' }}>
                        This is why an Islamic month is always either 29 or 30 days long (never 28 or 31), and why the exact start date of each month cannot be determined more than a day or two in advance through observation alone. <Link to="/" style={{ color: '#38bdf8' }}>Moon Visibility Explorer</Link> helps bridge this uncertainty by predicting the visibility of the crescent months in advance.
                    </p>
                </section>

                <section style={{
                    padding: '1.5rem',
                    background: 'rgba(16, 185, 129, 0.08)',
                    borderRadius: '12px',
                    border: '1px solid rgba(16, 185, 129, 0.2)',
                }}>
                    <h3 style={{ color: '#10b981', margin: '0 0 0.5rem 0' }}>Predict the Next Crescent</h3>
                    <p style={{ color: '#cbd5e1', lineHeight: '1.7', margin: '0' }}>
                        Use <Link to="/" style={{ color: '#38bdf8' }}>Moon Visibility Explorer</Link> to see where the next lunar crescent will be visible worldwide. Learn more about <Link to="/articles/moon-sighting-tips" style={{ color: '#38bdf8' }}>tips for spotting the crescent</Link> or how <Link to="/articles/moon-sighting-committees" style={{ color: '#38bdf8' }}>sighting committees</Link> use this data.
                    </p>
                </section>
            </div>
        </main>
    );
};

export default LunarPhasesExplained;
