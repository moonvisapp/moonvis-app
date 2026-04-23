import React from 'react';

const About = () => {
    return (
        <main className="content-page">
            <div className="content-container" style={{ maxWidth: '900px', margin: '0 auto', padding: '20px 20px 60px', color: '#e2e8f0' }}>

                <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>About Moon Visibility Explorer</h1>
                <p style={{
                    fontFamily: "'Noto Sans Arabic', sans-serif",
                    direction: 'rtl',
                    textAlign: 'right',
                    color: '#64748b',
                    marginBottom: '2rem',
                    fontSize: '0.95rem',
                }}>
                    حول مستكشف رؤية القمر — أداة فلكية متقدمة للتنبؤ برؤية الهلال
                </p>

                {/* Mission */}
                <section style={{ marginBottom: '2.5rem' }}>
                    <h2 style={{ color: '#60a5fa', borderBottom: '2px solid #1e3a5f', paddingBottom: '8px' }}>Our Mission</h2>
                    <p style={{ lineHeight: '1.8' }}>
                        Moon Visibility Explorer is a free, open-access astronomical tool designed to serve Muslim communities, astronomers, researchers, and anyone interested in the lunar cycle. Our mission is to provide transparent, scientifically rigorous predictions for lunar crescent (hilal) visibility worldwide, empowering individuals and communities to make informed decisions about the Islamic (Hijri) calendar.
                    </p>
                    <p style={{ lineHeight: '1.8', marginTop: '1rem' }}>
                        For over 1,400 years, the sighting of the crescent moon has marked the beginning of each Islamic month. Today, with modern astronomical knowledge, we can predict with remarkable accuracy where and when the crescent will be visible — bridging the gap between traditional observational practice and scientific computation. Moon Visibility Explorer makes these calculations accessible to everyone, not just professional astronomers.
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
                        مستكشف رؤية القمر هو أداة فلكية مجانية ومتاحة للجميع، صُممت لخدمة المجتمعات الإسلامية والفلكيين والباحثين وكل المهتمين بالدورة القمرية. مهمتنا هي تقديم تنبؤات شفافة وعلمية دقيقة لرؤية الهلال حول العالم.
                    </div>
                </section>

                {/* The Odeh V-Criterion */}
                <section style={{ marginBottom: '2.5rem' }}>
                    <h2 style={{ color: '#60a5fa', borderBottom: '2px solid #1e3a5f', paddingBottom: '8px' }}>The Odeh V-Criterion</h2>
                    <p style={{ lineHeight: '1.8' }}>
                        At the heart of Moon Visibility Explorer is the <strong style={{ color: '#f1f5f9' }}>Odeh V-criterion</strong>, a scientifically validated empirical model developed by Palestinian-Jordanian astronomer <strong style={{ color: '#f1f5f9' }}>Mohammad Shawkat Odeh</strong> in 2004. The model is based on a rigorous analysis of 737 lunar crescent observation records — both positive sightings (crescent seen) and negative reports (crescent not seen) — collected from observers across diverse geographic locations and atmospheric conditions worldwide.
                    </p>
                    <p style={{ lineHeight: '1.8', marginTop: '1rem' }}>
                        The Odeh criterion evaluates two critical astronomical parameters: the <strong style={{ color: '#f1f5f9' }}>topocentric arc of vision</strong> (the angular height of the moon above the sun at sunset) and the <strong style={{ color: '#f1f5f9' }}>topocentric crescent width</strong> (how thick the illuminated sliver of the moon appears). Together, these parameters determine whether the crescent has sufficient brightness and angular separation from the sun's glare to be detected by the human eye.
                    </p>
                    <p style={{ lineHeight: '1.8', marginTop: '1rem' }}>
                        The criterion classifies visibility into four zones:
                    </p>
                    <ul style={{ paddingLeft: '1.5rem', lineHeight: '2.2' }}>
                        <li><strong style={{ color: '#4ade80' }}>Easily Visible (EV):</strong> The crescent is thick and bright enough to be seen with the naked eye, even under imperfect atmospheric conditions. Most observers will successfully spot the moon.</li>
                        <li><strong style={{ color: '#facc15' }}>Visible under Perfect Conditions (VP):</strong> Sighting is possible with the naked eye, but requires excellent atmospheric transparency, an unobstructed western horizon, and an experienced observer. Clear desert skies are ideal.</li>
                        <li><strong style={{ color: '#f97316' }}>Visible with Optical Aid (VO):</strong> The crescent is too thin or too low to be seen without magnification. Binoculars (7×50 or larger) or a telescope are required. Some moon sighting committees accept optical-aided reports.</li>
                        <li><strong style={{ color: '#ef4444' }}>Not Visible / Impossible (NV):</strong> The moon is either below the horizon at sunset or so close to the sun that no sighting is possible by any means. The new month cannot begin based on this observation.</li>
                    </ul>
                </section>

                {/* Features */}
                <section style={{ marginBottom: '2.5rem' }}>
                    <h2 style={{ color: '#60a5fa', borderBottom: '2px solid #1e3a5f', paddingBottom: '8px' }}>Features</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                        {[
                            { title: 'Global Visibility Map', desc: 'Interactive D3.js-powered map showing crescent visibility zones for the entire globe on any selected date, with a 2°×2° grid resolution covering 16,200 cells.', titleAr: 'خريطة الرؤية العالمية' },
                            { title: 'Lunar Calendar Generator', desc: 'Calculate a full 12-month Hijri calendar for any of 70+ major cities worldwide, predicting the start of each Islamic month based on actual visibility.', titleAr: 'مولّد التقويم القمري' },
                            { title: 'Shared Night Analysis', desc: 'Implements Islamic jurisprudence (fiqh) concept of shared night inheritance — if the crescent is sighted in one region, nearby regions sharing the night may also start the month.', titleAr: 'تحليل اشتراك الليل' },
                            { title: 'PDF & Calendar Export', desc: 'Export your lunar calendar as a beautifully formatted PDF, import events into Google Calendar, or download raw CSV data for further analysis.', titleAr: 'تصدير PDF والتقويم' },
                            { title: '70+ Cities Worldwide', desc: 'Pre-configured coordinates and timezone data for major cities across the Middle East, South Asia, Southeast Asia, Europe, Africa, the Americas, and Oceania.', titleAr: 'أكثر من 70 مدينة حول العالم' },
                            { title: 'Client-Side Privacy', desc: 'All astronomical calculations run entirely in your browser using Web Workers. No personal data, location information, or usage metrics are sent to any server.', titleAr: 'الخصوصية — حساب محلي بالكامل' },
                        ].map((feature, i) => (
                            <div key={i} style={{
                                background: 'rgba(30, 41, 59, 0.5)',
                                border: '1px solid #334155',
                                borderRadius: '10px',
                                padding: '1.25rem',
                            }}>
                                <h3 style={{ color: '#f1f5f9', margin: '0 0 0.25rem 0', fontSize: '1.05rem' }}>{feature.title}</h3>
                                <p style={{ margin: '0 0 0.5rem 0', color: '#94a3b8', fontSize: '0.85rem', fontFamily: "'Noto Sans Arabic', sans-serif", direction: 'rtl', textAlign: 'right' }}>{feature.titleAr}</p>
                                <p style={{ margin: 0, color: '#cbd5e1', lineHeight: '1.7', fontSize: '0.9rem' }}>{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* History of Lunar Crescent Observation */}
                <section style={{ marginBottom: '2.5rem' }}>
                    <h2 style={{ color: '#60a5fa', borderBottom: '2px solid #1e3a5f', paddingBottom: '8px' }}>The History of Lunar Crescent Observation</h2>
                    <p style={{ lineHeight: '1.8' }}>
                        The practice of observing the new crescent moon dates back thousands of years and spans many civilizations. The ancient Babylonians tracked lunar cycles for agricultural and religious purposes as early as 500 BCE. In the Islamic tradition, crescent observation became a religiously significant practice following the Prophet Muhammad's instruction to sight the moon for determining the start of Ramadan and other months.
                    </p>
                    <p style={{ lineHeight: '1.8', marginTop: '1rem' }}>
                        Throughout Islamic history, dedicated moon sighting committees (lajnat al-ru'yah) have been established in virtually every Muslim-majority country. Professional and amateur astronomers, muftis, and community leaders gather at elevated locations with clear western horizons on the evening of the 29th of each Islamic month to observe the sky. In the modern era, this traditional practice is increasingly supplemented by scientific prediction tools like Moon Visibility Explorer, which help sighting committees know in advance whether the crescent is likely to be visible from their location.
                    </p>
                    <p style={{ lineHeight: '1.8', marginTop: '1rem' }}>
                        The development of mathematical visibility criteria — from the early work of Fotheringham (1910) and Maunder (1911), through Bruin (1977), Ilyas (1988), and Yallop (1997), to the current state-of-the-art Odeh criterion (2004) — represents over a century of scientific effort to quantify what was historically a purely observational practice.
                    </p>
                </section>

                {/* Technology */}
                <section style={{ marginBottom: '2.5rem' }}>
                    <h2 style={{ color: '#60a5fa', borderBottom: '2px solid #1e3a5f', paddingBottom: '8px' }}>Technology Stack</h2>
                    <p style={{ lineHeight: '1.8' }}>
                        Moon Visibility Explorer is built using modern web technologies to ensure fast performance, reliability, and accessibility across all devices:
                    </p>
                    <ul style={{ paddingLeft: '1.5rem', lineHeight: '2.2' }}>
                        <li><strong style={{ color: '#f1f5f9' }}>React 19:</strong> The user interface is built with the latest version of React for component-based architecture and efficient rendering.</li>
                        <li><strong style={{ color: '#f1f5f9' }}>D3.js:</strong> The interactive global map is rendered using D3's powerful geographic projection capabilities with Natural Earth coastline data.</li>
                        <li><strong style={{ color: '#f1f5f9' }}>astronomy-engine:</strong> All astronomical ephemeris calculations (sun/moon positions, conjunction times, moonrise/moonset) are performed using this precise, open-source library.</li>
                        <li><strong style={{ color: '#f1f5f9' }}>Web Workers:</strong> Heavy computation is offloaded to background threads so the UI remains responsive during the 16,200-cell global calculation.</li>
                        <li><strong style={{ color: '#f1f5f9' }}>Vite:</strong> Lightning-fast build tooling for development and production bundling.</li>
                    </ul>
                </section>

                {/* Contact */}
                <section style={{
                    padding: '1.5rem',
                    background: 'rgba(16, 185, 129, 0.08)',
                    borderRadius: '12px',
                    border: '1px solid rgba(16, 185, 129, 0.2)',
                }}>
                    <h2 style={{ color: '#10b981', margin: '0 0 0.75rem 0', fontSize: '1.3rem' }}>Contact Us</h2>
                    <p style={{ color: '#cbd5e1', lineHeight: '1.7', margin: '0 0 0.5rem 0' }}>
                        We welcome feedback, feature requests, bug reports, and collaboration inquiries. Whether you represent a moon sighting committee, an Islamic organization, or are an individual astronomer, we would love to hear from you.
                    </p>
                    <p style={{ color: '#cbd5e1', lineHeight: '1.7', margin: '0' }}>
                        Email: <a href="mailto:moonvisapp@gmail.com" style={{ color: '#38bdf8' }}>moonvisapp@gmail.com</a>
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
                        نرحب بملاحظاتكم واقتراحاتكم واستفساراتكم. سواء كنتم تمثلون لجنة رؤية الهلال أو منظمة إسلامية أو فلكيين هواة، يسعدنا التواصل معكم.
                    </p>
                </section>
            </div>
        </main>
    );
};

export default About;
