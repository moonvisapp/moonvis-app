import React from 'react';
import AdBanner from '../../components/AdBanner';
import { Link } from 'react-router-dom';

const RamadanGuide = () => {
    const currentYear = new Date().getFullYear();

    return (
        <main className="content-page">
            <div className="content-container" style={{ maxWidth: '900px', margin: '0 auto', padding: '20px 20px 60px', color: '#e2e8f0' }}>

                <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>When Does Ramadan {currentYear} Start? Moon Sighting Predictions</h1>
                <p style={{
                    fontFamily: "'Noto Sans Arabic', sans-serif",
                    direction: 'rtl',
                    textAlign: 'right',
                    color: '#64748b',
                    marginBottom: '2rem',
                    fontSize: '0.95rem',
                }}>
                    متى يبدأ رمضان {currentYear}؟ تنبؤات رؤية الهلال
                </p>

                <section style={{ marginBottom: '2.5rem' }}>
                    <h2 style={{ color: '#60a5fa', borderBottom: '2px solid #1e3a5f', paddingBottom: '8px' }}>How Is the Start of Ramadan Determined?</h2>
                    <p style={{ lineHeight: '1.8' }}>
                        Ramadan is the ninth month of the Islamic (Hijri) calendar. Its start is determined by the sighting of the new crescent moon (hilal) on the evening of the 29th of Sha'ban (the month preceding Ramadan). If the crescent is sighted, Ramadan begins the following day. If the crescent is not sighted, Sha'ban is completed to 30 days, and Ramadan begins the day after.
                    </p>
                    <p style={{ lineHeight: '1.8', marginTop: '1rem' }}>
                        Because the Islamic calendar is purely lunar, Ramadan begins approximately 10-12 days earlier in the Gregorian calendar each year. This means the expected start date shifts through all seasons over a 33-year cycle. In {currentYear}, Ramadan is expected to begin in late February or early March (Gregorian), though the exact date depends on crescent visibility at your location.
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
                        رمضان هو الشهر التاسع في التقويم الهجري. يتم تحديد بدايته برؤية هلال شهر رمضان مساء التاسع والعشرين من شعبان. إذا ثبتت الرؤية بدأ الصيام، وإلا أُكمل شعبان ثلاثين يوماً.
                    </div>
                </section>

                <section style={{ marginBottom: '2.5rem' }}>
                    <h2 style={{ color: '#60a5fa', borderBottom: '2px solid #1e3a5f', paddingBottom: '8px' }}>Why Different Countries Start Ramadan on Different Days</h2>
                    <p style={{ lineHeight: '1.8' }}>
                        Each year, the Muslim world experiences confusion when some countries announce the start of Ramadan a day before or after others. This discrepancy is caused by several factors:
                    </p>
                    <ul style={{ paddingLeft: '1.5rem', lineHeight: '2.2' }}>
                        <li><strong style={{ color: '#f1f5f9' }}>Geographic differences:</strong> The curvature of the Earth means the crescent moon may be visible in western regions (e.g., Morocco, West Africa, the Americas) but not yet visible in eastern regions (e.g., Southeast Asia, Australia) on the same evening.</li>
                        <li><strong style={{ color: '#f1f5f9' }}>Methodological differences:</strong> Some countries (like Saudi Arabia) use physical sighting committees, while others (like Turkey) use pre-calculated astronomical criteria. Some accept optical-aided sighting while others require naked-eye observation only.</li>
                        <li><strong style={{ color: '#f1f5f9' }}>Shared night debate:</strong> When Saudi Arabia announces Ramadan based on a sighting, other countries must decide whether to follow that announcement or wait for their own local sighting. The scholarly debate about <Link to="/articles/shared-night-explained" style={{ color: '#38bdf8' }}>shared night (ishtirak al-layl)</Link> directly impacts this decision.</li>
                    </ul>
                </section>

                <section style={{ marginBottom: '2.5rem' }}>
                    <h2 style={{ color: '#60a5fa', borderBottom: '2px solid #1e3a5f', paddingBottom: '8px' }}>Predict Ramadan {currentYear} for Your City</h2>
                    <p style={{ lineHeight: '1.8' }}>
                        <Link to="/" style={{ color: '#38bdf8' }}>Moon Visibility Explorer</Link> can predict the exact start date of Ramadan for over 70 major cities worldwide. Here's how:
                    </p>
                    <ol style={{ paddingLeft: '1.5rem', lineHeight: '2.2' }}>
                        <li>Go to the <Link to="/" style={{ color: '#38bdf8' }}>home page</Link> and select your city from the dropdown menu.</li>
                        <li>Set the reference date to any date in late Sha'ban (typically late February for {currentYear}).</li>
                        <li>Click "Calculate Lunar Calendar" to generate a full 12-month Hijri calendar.</li>
                        <li>Find Ramadan in the generated calendar — it will show the predicted Night 1 (first evening of Ramadan) in the Gregorian calendar.</li>
                        <li>The calendar also shows whether the prediction is based on direct visibility or <Link to="/articles/shared-night-explained" style={{ color: '#38bdf8' }}>shared night</Link> inheritance.</li>
                    </ol>
                </section>

                <section style={{ marginBottom: '2.5rem' }}>
                    <h2 style={{ color: '#60a5fa', borderBottom: '2px solid #1e3a5f', paddingBottom: '8px' }}>Ramadan Preparation Checklist</h2>
                    <p style={{ lineHeight: '1.8' }}>
                        Once you know the predicted start date of Ramadan, you can begin preparing:
                    </p>
                    <ul style={{ paddingLeft: '1.5rem', lineHeight: '2.2' }}>
                        <li><strong style={{ color: '#f1f5f9' }}>Add dates to your calendar:</strong> Use our Google Calendar export feature to add Ramadan start and end dates, as well as Eid al-Fitr, directly to your calendar app.</li>
                        <li><strong style={{ color: '#f1f5f9' }}>Inform your workplace or school:</strong> Share the predicted dates with your employer or school so they can plan accommodations for fasting employees or students.</li>
                        <li><strong style={{ color: '#f1f5f9' }}>Plan your moon sighting:</strong> If your community relies on local crescent sighting, use our <Link to="/articles/moon-sighting-tips" style={{ color: '#38bdf8' }}>moon sighting tips</Link> to prepare for the 29th of Sha'ban observation.</li>
                        <li><strong style={{ color: '#f1f5f9' }}>Share with your community:</strong> Export the lunar calendar as a PDF and distribute it to your local mosque or Islamic center.</li>
                    </ul>
                </section>

                <section style={{
                    padding: '1.5rem',
                    background: 'rgba(16, 185, 129, 0.08)',
                    borderRadius: '12px',
                    border: '1px solid rgba(16, 185, 129, 0.2)',
                }}>
                    <h3 style={{ color: '#10b981', margin: '0 0 0.5rem 0' }}>Get the Full Hijri Calendar for {currentYear}</h3>
                    <p style={{ color: '#cbd5e1', lineHeight: '1.7', margin: '0' }}>
                        Don't stop at Ramadan — generate a complete 12-month Hijri calendar for your city including all Islamic months, Eid al-Fitr, Eid al-Adha, and more. <Link to="/" style={{ color: '#38bdf8' }}>Try Moon Visibility Explorer now →</Link>
                    </p>
                </section>
                <AdBanner dataAdSlot="5502376796" style={{ marginTop: '40px', marginBottom: '20px', maxWidth: '800px', marginLeft: 'auto', marginRight: 'auto' }} />
            </div>
        </main>
    );
};

export default RamadanGuide;
