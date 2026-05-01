import React from 'react';
import { Link } from 'react-router-dom';

const Contact = () => {
    return (
        <main className="content-page">
            <div className="content-container" style={{ maxWidth: '900px', margin: '0 auto', padding: '20px 20px 60px', color: '#e2e8f0' }}>

                <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Contact Us</h1>
                <p style={{
                    fontFamily: "'Noto Sans Arabic', sans-serif",
                    direction: 'rtl',
                    textAlign: 'right',
                    color: '#64748b',
                    marginBottom: '2rem',
                    fontSize: '0.95rem',
                }}>
                    تواصل معنا — نرحب بملاحظاتكم واستفساراتكم
                </p>

                <section style={{ marginBottom: '2.5rem' }}>
                    <h2 style={{ color: '#60a5fa', borderBottom: '2px solid #1e3a5f', paddingBottom: '8px' }}>Get in Touch</h2>
                    <p style={{ lineHeight: '1.8' }}>
                        We welcome feedback, questions, bug reports, feature requests, and collaboration inquiries from all users. Whether you are an individual curious about the Islamic calendar, an astronomer working on lunar crescent observation, a representative of a moon sighting committee, or an Islamic organization looking to integrate crescent visibility data into your workflow, we would love to hear from you.
                    </p>
                    <p style={{ lineHeight: '1.8', marginTop: '1rem' }}>
                        Moon Visibility Explorer is a community-driven project, and your input directly shapes the tool's future development. Past community feedback has led to the addition of shared night analysis, PDF export functionality, and expanded city coverage.
                    </p>
                </section>

                <section style={{ marginBottom: '2.5rem' }}>
                    <div style={{
                        background: 'rgba(30, 41, 59, 0.6)',
                        border: '1px solid #334155',
                        borderRadius: '12px',
                        padding: '2rem',
                    }}>
                        <h3 style={{ color: '#f1f5f9', margin: '0 0 1.5rem 0', fontSize: '1.3rem' }}>📧 Email Us</h3>
                        <p style={{ lineHeight: '1.8', marginBottom: '1rem' }}>
                            The best way to reach us is by email. We aim to respond to all inquiries within 48 hours.
                        </p>
                        <a href="mailto:moonvisapp@gmail.com" style={{
                            display: 'inline-block',
                            padding: '12px 28px',
                            background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                            color: '#fff',
                            borderRadius: '8px',
                            textDecoration: 'none',
                            fontWeight: '600',
                            fontSize: '1.1rem',
                            transition: 'transform 0.2s',
                        }}>
                            moonvisapp@gmail.com
                        </a>
                    </div>
                </section>

                <section style={{ marginBottom: '2.5rem' }}>
                    <h2 style={{ color: '#60a5fa', borderBottom: '2px solid #1e3a5f', paddingBottom: '8px' }}>What Can We Help With?</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
                        {[
                            { icon: '🐛', title: 'Bug Reports', desc: 'Found something not working correctly? A calculation that looks wrong? A page that doesn\'t load? Let us know the details and we\'ll investigate.' },
                            { icon: '💡', title: 'Feature Requests', desc: 'Want to see a new city added, a different visibility criterion, or a new export format? We prioritize features based on community demand.' },
                            { icon: '🔬', title: 'Scientific Inquiries', desc: 'Questions about the Odeh V-criterion, our astronomical algorithms, or how we handle edge cases? We\'re happy to discuss the technical details.' },
                            { icon: '🤝', title: 'Collaboration', desc: 'Represent a moon sighting committee, observatory, or Islamic organization? We\'re open to partnerships and data-sharing agreements.' },
                            { icon: '🌍', title: 'City Requests', desc: 'Your city not in our database? Send us the city name, country, and approximate coordinates, and we\'ll add it to a future update.' },
                            { icon: '📰', title: 'Media & Press', desc: 'Journalist or blogger writing about Islamic astronomy or calendar technology? We\'re available for interviews and can provide technical background.' },
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
                    <h2 style={{ color: '#60a5fa', borderBottom: '2px solid #1e3a5f', paddingBottom: '8px' }}>Frequently Asked Questions Before Contacting</h2>
                    <p style={{ lineHeight: '1.8' }}>
                        Before reaching out, you may find your answer in our existing resources:
                    </p>
                    <ul style={{ paddingLeft: '1.5rem', lineHeight: '2.2' }}>
                        <li><Link to="/faq" style={{ color: '#38bdf8' }}>FAQ page</Link> — Answers to the most common questions about the Islamic calendar, the Odeh criterion, shared night, and how to use the tool.</li>
                        <li><Link to="/guide" style={{ color: '#38bdf8' }}>User Guide</Link> — Step-by-step instructions for using the visibility map, generating calendars, and exporting data.</li>
                        <li><Link to="/methodology" style={{ color: '#38bdf8' }}>Methodology page</Link> — Detailed technical documentation about our astronomical algorithms and visibility models.</li>
                        <li><Link to="/about" style={{ color: '#38bdf8' }}>About page</Link> — Background on the project, its mission, and the technology stack.</li>
                    </ul>
                </section>

                <section style={{
                    padding: '1.5rem',
                    background: 'rgba(96, 165, 250, 0.05)',
                    borderRadius: '12px',
                    border: '1px solid rgba(96, 165, 250, 0.15)',
                }}>
                    <p style={{
                        fontFamily: "'Noto Sans Arabic', sans-serif",
                        direction: 'rtl',
                        textAlign: 'right',
                        color: '#94a3b8',
                        lineHeight: '2',
                        fontSize: '0.95rem',
                        margin: 0,
                    }}>
                        نرحب بجميع الملاحظات والأسئلة والاقتراحات وطلبات التعاون. سواء كنتم أفراداً أو تمثلون لجنة رؤية الهلال أو مؤسسة إسلامية أو مرصداً فلكياً، يسعدنا التواصل معكم. يمكنكم مراسلتنا على البريد الإلكتروني أعلاه وسنرد في أقرب وقت ممكن.
                    </p>
                </section>
            </div>
        </main>
    );
};

export default Contact;
