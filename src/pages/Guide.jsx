import React from 'react';

const Guide = () => {
    return (
        <main className="content-page">
            <div className="content-container" style={{ maxWidth: '900px', margin: '0 auto', padding: '20px 20px 60px', color: '#e2e8f0' }}>

                <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>User Guide: How to Use Moon Visibility Explorer</h1>
                <p style={{
                    fontFamily: "'Noto Sans Arabic', sans-serif",
                    direction: 'rtl',
                    textAlign: 'right',
                    color: '#64748b',
                    marginBottom: '2rem',
                    fontSize: '0.95rem',
                }}>
                    دليل المستخدم: كيفية استخدام مستكشف رؤية القمر
                </p>

                {/* Getting Started */}
                <section style={{ marginBottom: '2.5rem' }}>
                    <h2 style={{ color: '#60a5fa', borderBottom: '2px solid #1e3a5f', paddingBottom: '8px' }}>Getting Started</h2>
                    <p style={{ lineHeight: '1.8' }}>
                        Moon Visibility Explorer is designed to be intuitive and easy to use. Whether you are a first-time visitor or an experienced astronomer, this guide will help you understand all the features available to you. The tool operates entirely in your web browser — no downloads, installations, or accounts are needed.
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
                        صُمّم مستكشف رؤية القمر ليكون سهل الاستخدام. سواء كنت زائراً جديداً أو فلكياً متمرساً، سيساعدك هذا الدليل على فهم جميع الميزات المتاحة لك. الأداة تعمل بالكامل في متصفحك — لا حاجة لتنزيل أو تثبيت أو إنشاء حساب.
                    </div>
                </section>

                {/* Step 1: Reading the Map */}
                <section style={{ marginBottom: '2.5rem' }}>
                    <h2 style={{ color: '#60a5fa', borderBottom: '2px solid #1e3a5f', paddingBottom: '8px' }}>Step 1: Reading the Visibility Map</h2>
                    <p style={{ lineHeight: '1.8' }}>
                        When you first load Moon Visibility Explorer, you will see a <strong style={{ color: '#f1f5f9' }}>global map</strong> with a <strong style={{ color: '#f1f5f9' }}>control panel</strong> above it. The map displays the predicted crescent moon visibility for the selected date across the entire world. Each colored rectangle on the map represents a 2°×2° grid cell (approximately 222 km × 222 km at the equator), and its color indicates the predicted visibility classification.
                    </p>
                    <p style={{ lineHeight: '1.8', marginTop: '1rem' }}>
                        Here is what each color represents:
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', margin: '1.5rem 0' }}>
                        {[
                            { color: '#4ade80', label: 'Easily Visible (EV)', labelAr: 'مرئي بسهولة', desc: 'The crescent moon should be visible to the naked eye on this evening. Most observers with a clear view of the western horizon after sunset will be able to spot the moon. This is the most favorable condition for sighting, and moon sighting committees in these regions can confidently declare the new month.' },
                            { color: '#facc15', label: 'Visible under Perfect Conditions (VP)', labelAr: 'مرئي في ظروف مثالية', desc: 'The crescent may be visible, but only if atmospheric conditions are excellent (no clouds, low humidity, clean air) and the observer is experienced. This zone often represents the boundary of naked-eye visibility. In desert regions with clear skies, sightings in this zone are common.' },
                            { color: '#f97316', label: 'Visible with Optical Aid (VO)', labelAr: 'مرئي بمساعدة بصرية', desc: 'The crescent exists above the horizon but is too thin or too close to the sun to be seen without help. Binoculars (at least 7×50 magnification) or a telescope pointed at the correct position will reveal the crescent. Some Islamic authorities accept telescope-aided sighting, while others require naked-eye observation only.' },
                            { color: '#ef4444', label: 'Not Visible (NV)', labelAr: 'غير مرئي', desc: 'The crescent moon cannot be seen from this location on this evening. This may be because the moon sets before the sun, the moon is too close to the sun (below the Danjon limit of about 7° elongation), or the crescent width is insufficient for detection. No valid sighting can be reported from this zone.' },
                        ].map((item, i) => (
                            <div key={i} style={{
                                display: 'flex',
                                gap: '1rem',
                                alignItems: 'flex-start',
                                background: 'rgba(30, 41, 59, 0.4)',
                                padding: '1rem 1.25rem',
                                borderRadius: '10px',
                                borderLeft: `4px solid ${item.color}`,
                            }}>
                                <div style={{ width: '24px', height: '24px', backgroundColor: item.color, borderRadius: '4px', flexShrink: 0, marginTop: '2px' }}></div>
                                <div>
                                    <strong style={{ color: item.color }}>{item.label}</strong>
                                    <span style={{ color: '#64748b', fontFamily: "'Noto Sans Arabic', sans-serif", marginLeft: '8px', fontSize: '0.85rem' }}> — {item.labelAr}</span>
                                    <p style={{ margin: '0.5rem 0 0', lineHeight: '1.7', color: '#cbd5e1', fontSize: '0.93rem' }}>{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Step 2: Selecting a Date */}
                <section style={{ marginBottom: '2.5rem' }}>
                    <h2 style={{ color: '#60a5fa', borderBottom: '2px solid #1e3a5f', paddingBottom: '8px' }}>Step 2: Selecting a Reference Date</h2>
                    <p style={{ lineHeight: '1.8' }}>
                        The <strong style={{ color: '#f1f5f9' }}>Reference Date</strong> picker in the control panel lets you choose which evening to analyze. The label "Evening of" reminds you that in the Islamic calendar tradition, the day begins at sunset — so selecting April 15 means you are asking about the visibility of the crescent moon on the evening of April 15 (after sunset).
                    </p>
                    <p style={{ lineHeight: '1.8', marginTop: '1rem' }}>
                        The date you choose is typically the 29th day of the current Islamic month. If the crescent is visible on this evening, the new month begins. If it is not visible, the current month is extended to 30 days, and the new month begins the following evening.
                    </p>
                    <p style={{ lineHeight: '1.8', marginTop: '1rem' }}>
                        After selecting a date, click the <strong style={{ color: '#3b82f6' }}>"Calculate Visibility"</strong> button. The calculation takes approximately 3-10 seconds as the tool computes the sun and moon positions for all 16,200 grid cells on the planet. A progress bar will show you the computation status.
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
                        يتيح لك منتقي "التاريخ المرجعي" في لوحة التحكم اختيار المساء الذي تريد تحليله. بعد اختيار التاريخ، انقر على زر "حساب الرؤية". يستغرق الحساب حوالي 3 إلى 10 ثوانٍ لحساب مواقع الشمس والقمر لجميع خلايا الشبكة البالغ عددها 16,200 خلية.
                    </div>
                </section>

                {/* Step 3: Selecting a City */}
                <section style={{ marginBottom: '2.5rem' }}>
                    <h2 style={{ color: '#60a5fa', borderBottom: '2px solid #1e3a5f', paddingBottom: '8px' }}>Step 3: Selecting a City</h2>
                    <p style={{ lineHeight: '1.8' }}>
                        The <strong style={{ color: '#f1f5f9' }}>City dropdown</strong> is optional but recommended. When you select a city, the map will highlight its position with a distinctive marker, and the legend will display the specific visibility classification and sunset time for that city's coordinates.
                    </p>
                    <p style={{ lineHeight: '1.8', marginTop: '1rem' }}>
                        Selecting a city also unlocks the <strong style={{ color: '#10b981' }}>"Calculate Lunar Calendar"</strong> button, which generates a full year's worth of Hijri month predictions specifically for that location. The tool currently supports over 70 major cities across the Middle East, South Asia, Southeast Asia, East Asia, Europe, Africa, the Americas, and Oceania — covering the vast majority of the world's Muslim population centers.
                    </p>
                </section>

                {/* Step 4: Lunar Calendar */}
                <section style={{ marginBottom: '2.5rem' }}>
                    <h2 style={{ color: '#60a5fa', borderBottom: '2px solid #1e3a5f', paddingBottom: '8px' }}>Step 4: Generating a Lunar Calendar</h2>
                    <p style={{ lineHeight: '1.8' }}>
                        The Lunar Calendar feature is one of the most powerful tools in Moon Visibility Explorer. After selecting both a date and a city, clicking <strong style={{ color: '#10b981' }}>"Calculate Lunar Calendar"</strong> opens a modal that predicts the start of each of the next 12 Islamic months.
                    </p>
                    <p style={{ lineHeight: '1.8', marginTop: '1rem' }}>
                        For each month, the calendar shows:
                    </p>
                    <ol style={{ paddingLeft: '1.5rem', lineHeight: '2.2' }}>
                        <li><strong style={{ color: '#f1f5f9' }}>Islamic Month Name:</strong> The name of the Hijri month (e.g., Ramadan, Shawwal, Dhul Hijjah) along with the Hijri year.</li>
                        <li><strong style={{ color: '#f1f5f9' }}>Night 1 Date:</strong> The Gregorian date of the first evening of the month — i.e., the evening when the crescent is first visible (or inherited via shared night). Clicking "Night 1" will jump the main map to that date so you can see the global visibility for that specific evening.</li>
                        <li><strong style={{ color: '#f1f5f9' }}>Detection Method:</strong> Whether the month start was determined by direct visibility at the city's location, or via shared night inheritance from another region.</li>
                        <li><strong style={{ color: '#f1f5f9' }}>Visibility Classification:</strong> The Odeh V-criterion zone (EV, VP, VO) for your city on Night 1.</li>
                    </ol>

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
                        ميزة التقويم القمري هي من أقوى أدوات مستكشف رؤية القمر. بعد اختيار التاريخ والمدينة، انقر على "حساب التقويم القمري" لفتح نافذة تتنبأ ببداية كل شهر من الأشهر الإسلامية الاثني عشر القادمة، مع عرض تاريخ الليلة الأولى وطريقة الكشف وتصنيف الرؤية.
                    </div>
                </section>

                {/* Shared Night */}
                <section style={{ marginBottom: '2.5rem' }}>
                    <h2 style={{ color: '#60a5fa', borderBottom: '2px solid #1e3a5f', paddingBottom: '8px' }}>Understanding Shared Night (Ishtirak al-Layl)</h2>
                    <p style={{ lineHeight: '1.8' }}>
                        <strong style={{ color: '#f1f5f9' }}>Shared Night</strong> (اشتراك الليل) is a concept from Islamic jurisprudence (fiqh) that addresses the question: if the crescent is sighted in one location, does it also count for other locations?
                    </p>
                    <p style={{ lineHeight: '1.8', marginTop: '1rem' }}>
                        The principle is that if two locations "share the night" — meaning their nighttime hours overlap — then a sighting in one location can establish the new month for the other. For example, if the crescent is easily visible in Casablanca, Morocco at sunset, and at that same moment it is already nighttime in Mecca, Saudi Arabia, then Mecca may adopt the Casablanca sighting since both cities share a portion of the night.
                    </p>
                    <p style={{ lineHeight: '1.8', marginTop: '1rem' }}>
                        Moon Visibility Explorer implements this concept computationally. For each city, the tool checks whether any grid cells where the crescent is classified as "Easily Visible" or "Visible under Perfect Conditions" share nighttime hours with the target city. If such cells are found, the calendar marks the month start as "Shared Night" and identifies the source region. When viewing Night 1 on the map, cells that contributed to the shared night inheritance are highlighted in orange, making it easy to understand why the month started on that date even though the crescent was not directly visible locally.
                    </p>
                    <p style={{ lineHeight: '1.8', marginTop: '1rem', fontStyle: 'italic', color: '#94a3b8' }}>
                        Note: Different Islamic scholars have varying opinions on the shared night principle. Some require physical sighting within the same geographic region, while others accept sightings from anywhere that shares the night. Moon Visibility Explorer provides the astronomical data — the religious interpretation is left to qualified scholars and the user's own community.
                    </p>
                </section>

                {/* Exporting Data */}
                <section style={{ marginBottom: '2.5rem' }}>
                    <h2 style={{ color: '#60a5fa', borderBottom: '2px solid #1e3a5f', paddingBottom: '8px' }}>Step 5: Exporting Your Calendar</h2>
                    <p style={{ lineHeight: '1.8' }}>
                        After generating a lunar calendar, you can export it in multiple formats for personal use, printing, or sharing with your community:
                    </p>
                    <ul style={{ paddingLeft: '1.5rem', lineHeight: '2.2' }}>
                        <li><strong style={{ color: '#f1f5f9' }}>PDF Export:</strong> Creates a well-formatted document with all month start dates, visibility classifications, and supporting information. This is ideal for printing and distributing to mosque communities or Islamic centers.</li>
                        <li><strong style={{ color: '#f1f5f9' }}>Google Calendar / ICS:</strong> Generates calendar events that can be imported directly into Google Calendar, Apple Calendar, or Microsoft Outlook. Each month's start is added as an event with details about the visibility conditions.</li>
                        <li><strong style={{ color: '#f1f5f9' }}>CSV Data:</strong> For researchers and data analysts, the raw calendar data can be downloaded in comma-separated values format, compatible with Excel, Google Sheets, and other spreadsheet software.</li>
                    </ul>
                </section>

                {/* Tips for Best Results */}
                <section style={{
                    padding: '1.5rem',
                    background: 'rgba(16, 185, 129, 0.08)',
                    borderRadius: '12px',
                    border: '1px solid rgba(16, 185, 129, 0.2)',
                }}>
                    <h2 style={{ color: '#10b981', margin: '0 0 0.75rem 0', fontSize: '1.3rem' }}>Tips for Successful Moon Sighting</h2>
                    <ol style={{ paddingLeft: '1.5rem', lineHeight: '2', color: '#cbd5e1' }}>
                        <li><strong style={{ color: '#f1f5f9' }}>Check the weather forecast.</strong> Even if the Odeh criterion predicts "Easily Visible," clouds on the western horizon will prevent sighting. Plan to observe from a location with a clear view of the western sky.</li>
                        <li><strong style={{ color: '#f1f5f9' }}>Arrive early.</strong> Be at your observation point at least 15-20 minutes before sunset so your eyes can adjust and you know exactly where the sun will set.</li>
                        <li><strong style={{ color: '#f1f5f9' }}>Look in the right direction.</strong> The crescent moon will be near the point where the sun has just set — slightly to the left (south) in the northern hemisphere.</li>
                        <li><strong style={{ color: '#f1f5f9' }}>Use binoculars if available.</strong> Even if naked-eye sighting is expected, binoculars can help you locate the crescent faster. Once found with binoculars, you can often then see it with the naked eye.</li>
                        <li><strong style={{ color: '#f1f5f9' }}>Be aware of the time window.</strong> You typically have only 20-40 minutes between sunset and moonset to spot the crescent. It will be very faint at first and gradually become more visible as the sky darkens.</li>
                        <li><strong style={{ color: '#f1f5f9' }}>Avoid light pollution.</strong> Higher altitudes and locations away from city lights improve your chances significantly.</li>
                    </ol>
                    <p style={{
                        fontFamily: "'Noto Sans Arabic', sans-serif",
                        direction: 'rtl',
                        textAlign: 'right',
                        color: '#94a3b8',
                        marginTop: '0.75rem',
                        lineHeight: '1.8',
                        fontSize: '0.9rem',
                    }}>
                        نصائح لرؤية ناجحة للهلال: تحقق من توقعات الطقس، اصل مبكراً قبل الغروب بـ 15-20 دقيقة، انظر في الاتجاه الصحيح بالقرب من نقطة الغروب، استخدم المنظار إن أمكن، وتجنب التلوث الضوئي.
                    </p>
                </section>
            </div>
        </main>
    );
};

export default Guide;
