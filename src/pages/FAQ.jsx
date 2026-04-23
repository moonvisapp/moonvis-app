import React from 'react';

const faqData = [
    {
        question: "What is the Islamic (Hijri) Calendar?",
        questionAr: "ما هو التقويم الهجري (الإسلامي)؟",
        answer: `The Islamic calendar, also known as the Hijri calendar (التقويم الهجري), is a purely lunar calendar consisting of 12 months in a year of 354 or 355 days. It is used by Muslims worldwide to determine the proper days of Islamic holidays, rituals, and events such as Ramadan, Eid al-Fitr, Eid al-Adha, and the Hajj pilgrimage. Unlike the Gregorian solar calendar, the Hijri calendar is not tied to seasons. Each month begins with the sighting of the new crescent moon (hilal), making astronomical observation central to its function. The calendar's epoch begins from the year of the Hijra — Prophet Muhammad's migration from Mecca to Medina in 622 CE.`,
        answerAr: `التقويم الإسلامي، المعروف أيضاً بالتقويم الهجري، هو تقويم قمري بحت يتكون من 12 شهراً في سنة مدتها 354 أو 355 يوماً. يستخدمه المسلمون حول العالم لتحديد أيام العطل والشعائر والمناسبات الإسلامية مثل رمضان وعيد الفطر وعيد الأضحى والحج.`
    },
    {
        question: "How is the start of an Islamic month determined?",
        questionAr: "كيف يتم تحديد بداية الشهر الإسلامي؟",
        answer: `The start of each Islamic month is traditionally determined by the physical sighting of the lunar crescent (hilal) shortly after sunset on the 29th day of the current month. If the crescent is sighted, the new month begins at sunset that evening. If it is not sighted — whether due to atmospheric conditions, the moon's position relative to the sun, or the observer's location — the current month is completed to 30 days, and the new month begins the following evening. This observational method means that the Islamic calendar cannot be precisely predicted years in advance, unlike the Gregorian calendar. Moon Visibility Explorer helps bridge this gap by providing scientifically-grounded predictions of when and where the crescent will likely be visible.`,
        answerAr: `تُحدّد بداية كل شهر إسلامي تقليدياً من خلال الرؤية الفعلية للهلال القمري بعد غروب الشمس بوقت قصير في اليوم التاسع والعشرين من الشهر الحالي. إذا شوهد الهلال، يبدأ الشهر الجديد عند غروب الشمس في ذلك المساء. وإن لم يُشاهد، يُكمل الشهر الحالي ثلاثين يوماً.`
    },
    {
        question: "What is the difference between calculated and sighted calendars?",
        questionAr: "ما الفرق بين التقويمات المحسوبة والمعتمدة على الرؤية؟",
        answer: `There are two main approaches to the Islamic calendar. The "sighted" approach (ru'yah) relies on actual human observation of the crescent moon, following the hadith: "Fast when you see it [the crescent] and break your fast when you see it." This method is practiced by many Sunni communities and most Middle Eastern countries. The "calculated" or "astronomical" approach (hisab) uses mathematical models to predict the moon's position and determine when it would theoretically be visible. Saudi Arabia's Umm al-Qura calendar uses a calculated method, though it has been modified over the years. Turkey, Malaysia, and some other countries also use calculated approaches. Moon Visibility Explorer supports both perspectives: it predicts scientifically when the crescent would be visible, helping both those who rely on calculated methods and those who use sighting — by showing them the best conditions and locations for observation.`,
        answerAr: `هناك نهجان رئيسيان للتقويم الإسلامي. نهج "الرؤية" يعتمد على المشاهدة الفعلية للهلال. أما النهج "الحسابي" أو "الفلكي" فيستخدم النماذج الرياضية للتنبؤ بموقع القمر. يدعم مستكشف رؤية القمر كلا المنهجين.`
    },
    {
        question: "Why do different countries start Ramadan on different days?",
        questionAr: "لماذا تبدأ دول مختلفة رمضان في أيام مختلفة؟",
        answer: `This is one of the most frequently asked questions in the Muslim world. The discrepancy arises from several factors. First, the curvature of the earth means the crescent moon may be visible in western regions (like North Africa or the Americas) but not yet visible in eastern regions (like Southeast Asia) on the same evening. Second, different countries and religious authorities follow different methodologies — some require local sighting, others accept sighting from anywhere in the world (global sighting), and some use calculated astronomical data. Third, political and organizational factors play a role: Saudi Arabia's Supreme Court may announce Ramadan based on testimony of sighters, while other countries await their own local Moon Sighting Committee's decision. The Moon Visibility Explorer helps clarify these discrepancies by showing exactly where on the globe the crescent is scientifically predicted to be visible on any given date, using the rigorously validated Odeh V-criterion.`,
        answerAr: `ينشأ هذا الاختلاف من عدة عوامل: انحناء الأرض يعني أن الهلال قد يكون مرئياً في المناطق الغربية ولكن ليس بعد في المناطق الشرقية. كما تتبع الدول المختلفة منهجيات مختلفة — بعضها يتطلب الرؤية المحلية وبعضها يقبل الرؤية العالمية، وبعضها يستخدم البيانات الفلكية المحسوبة.`
    },
    {
        question: "What is the Odeh V-criterion?",
        questionAr: "ما هو معيار أوده (V-criterion)؟",
        answer: `The Odeh V-criterion (also written as Odeh's criterion or the Odeh visibility criterion) is a scientifically-validated empirical model for predicting lunar crescent visibility, developed by Palestinian-Jordanian astronomer Mohammad Shawkat Odeh in 2004. It is based on the analysis of 737 crescent observation records — both positive (crescent seen) and negative (crescent not seen) — collected from observers worldwide. The model calculates a visibility parameter (V) using two key astronomical variables: (1) the topocentric crescent width (W), which represents how thick the illuminated portion of the moon appears, and (2) the topocentric arc of vision (ARCV), which is the angular difference between the moon's altitude and the sun's altitude at the time of observation. Based on these values, the criterion classifies visibility into zones: Easily Visible (V ≥ 5.65), Visible under Perfect Conditions (2 ≤ V < 5.65), Visible with Optical Aid (−0.96 ≤ V < 2), and Not Visible (V < −0.96). The Odeh criterion is widely regarded as one of the most accurate and comprehensive visibility models available, and is used by many national and international Islamic organizations.`,
        answerAr: `معيار أوده هو نموذج تجريبي تم التحقق من صحته علمياً للتنبؤ برؤية الهلال، طوّره الفلكي الفلسطيني-الأردني محمد شوكت أوده عام 2004. يعتمد على تحليل 737 تسجيلاً لمشاهدات الهلال من مراقبين حول العالم.`
    },
    {
        question: "How accurate are Moon Visibility Explorer's predictions?",
        questionAr: "ما مدى دقة تنبؤات مستكشف رؤية القمر؟",
        answer: `Moon Visibility Explorer uses the astronomy-engine library for precise ephemeris calculations — computing the exact positions of the Sun and Moon at any given time and location on Earth. Combined with the Odeh V-criterion's empirically-derived thresholds, the tool provides highly reliable visibility predictions. Our calculations are performed on a 2°×2° global grid (approximately 222 km × 222 km at the equator), which provides continent-level resolution suitable for determining visibility zones. For city-specific predictions, we interpolate to the exact coordinates of over 70 major cities worldwide. However, it is important to note that actual crescent visibility can be affected by local atmospheric conditions (humidity, air pollution, cloud cover, altitude), the observer's visual acuity, and horizon obstructions. These factors are inherently unpredictable and cannot be modeled by any astronomical tool. As such, our predictions represent theoretical "best case" visibility under ideal atmospheric conditions.`,
        answerAr: `يستخدم مستكشف رؤية القمر مكتبة astronomy-engine لحسابات الأفلاك الدقيقة. يتم إجراء حساباتنا على شبكة عالمية بدقة 2°×2° (حوالي 222 كم × 222 كم عند خط الاستواء). ومع ذلك، يمكن أن تتأثر الرؤية الفعلية بالظروف الجوية المحلية.`
    },
    {
        question: "What does \"Shared Night\" mean in this context?",
        questionAr: "ماذا يعني \"اشتراك الليل\" في هذا السياق؟",
        answer: `"Shared Night" (اشتراك الليل / Ishtirak al-Layl) is an important concept in Islamic jurisprudence (fiqh) regarding the lunar calendar. The principle states that if the crescent moon is sighted in one location, the new month should also begin for other locations that share a significant portion of the night with the sighting location. For example, if the crescent is sighted in Mecca at sunset, other cities that are still experiencing nighttime at that moment may also start the new month, even though the crescent was not directly visible from their position. Different scholars have varying opinions on how much of the night must be shared (some say any overlap counts, others require a majority). Moon Visibility Explorer implements a practical shared-night analysis: for each city, it checks whether any cells on the global visibility map where the crescent IS visible share at least a certain number of nighttime hours with the target city. This is particularly useful for communities in the eastern hemisphere who want to know if western sightings could affect their calendar.`,
        answerAr: `"اشتراك الليل" هو مفهوم مهم في الفقه الإسلامي المتعلق بالتقويم القمري. ينص المبدأ على أنه إذا شوهد الهلال في موقع ما، فإن الشهر الجديد يجب أن يبدأ أيضاً للمواقع الأخرى التي تشترك في جزء كبير من الليل مع موقع الرؤية.`
    },
    {
        question: "Can I use this tool for Ramadan, Eid, and Hajj planning?",
        questionAr: "هل يمكنني استخدام هذه الأداة للتخطيط لرمضان والعيد والحج؟",
        answer: `Yes! Moon Visibility Explorer is specifically designed to help with Islamic calendar planning. By using the "Calculate Lunar Calendar" feature, you can predict the start dates of all 12 Islamic months for an entire year, based on the Odeh V-criterion visibility analysis at your specific city. This includes predicting the start of Ramadan (the 9th month), Shawwal (Eid al-Fitr, the 10th month), and Dhul Hijjah (Hajj and Eid al-Adha, the 12th month). You can also export these predictions as a PDF or add them to your Google Calendar. Keep in mind that these are scientific predictions — actual month-start announcements by religious authorities in your country may differ based on their specific methodology and sighting reports. We recommend using Moon Visibility Explorer as a planning guide and following your local authority's official announcements for religious observance.`,
        answerAr: `نعم! تم تصميم مستكشف رؤية القمر خصيصاً للمساعدة في التخطيط للتقويم الإسلامي. باستخدام ميزة "حساب التقويم القمري"، يمكنك التنبؤ بتواريخ بداية جميع الأشهر الإسلامية الاثني عشر لسنة كاملة. يشمل ذلك التنبؤ ببداية رمضان وشوال (عيد الفطر) وذو الحجة (الحج وعيد الأضحى).`
    },
    {
        question: "How do I export a lunar calendar?",
        questionAr: "كيف أصدّر التقويم القمري؟",
        answer: `Moon Visibility Explorer offers multiple export options for your convenience. After generating a lunar calendar for your selected city, you can: (1) Export as PDF — this creates a beautifully formatted document with all 12 months, including Night 1 dates, visibility classifications, and shared night indicators. The PDF is suitable for printing and distribution to your local community. (2) Export to Google Calendar — this generates ICS calendar events that you can import directly into Google Calendar, Apple Calendar, or Microsoft Outlook. Each Islamic month's start date is added as an all-day event with details about the visibility conditions. (3) Export as CSV — for data analysis, you can export the raw calendar data in comma-separated values format, compatible with Excel and Google Sheets. To access these options, click the "Calculate Lunar Calendar" button, wait for the calculation to complete, and then look for the export buttons at the bottom of the calendar modal.`,
        answerAr: `يقدم مستكشف رؤية القمر خيارات تصدير متعددة: تصدير كملف PDF، أو التصدير إلى تقويم Google، أو التصدير كملف CSV. انقر على زر "حساب التقويم القمري" وانتظر اكتمال الحساب، ثم ابحث عن أزرار التصدير أسفل نافذة التقويم.`
    },
    {
        question: "What data sources does this tool use?",
        questionAr: "ما مصادر البيانات التي تستخدمها هذه الأداة؟",
        answer: `Moon Visibility Explorer relies on several high-quality data sources and algorithms: (1) The astronomy-engine library (by Don Cross) provides precise astronomical ephemeris calculations based on the VSOP87 planetary theory for the Sun's position and the ELP2000 lunar theory for the Moon's position. These are the same mathematical models used by professional observatories. (2) The Odeh V-criterion thresholds (Odeh 2004) provide the empirical visibility classification based on published research. (3) Geographic and timezone data for 70+ cities are sourced from the IANA Time Zone Database and verified against multiple geographic references. (4) The global coastline and country border data for the interactive map uses Natural Earth vector data rendered through D3.js and TopoJSON. All calculations are performed client-side in your browser using Web Workers for performance — no data is sent to any server, ensuring your privacy.`,
        answerAr: `يعتمد مستكشف رؤية القمر على عدة مصادر بيانات عالية الجودة: مكتبة astronomy-engine للحسابات الفلكية الدقيقة، ومعايير أوده للتصنيف التجريبي للرؤية، وقاعدة بيانات المناطق الزمنية IANA للبيانات الجغرافية. جميع الحسابات تتم في متصفحك محلياً دون إرسال أي بيانات لأي خادم.`
    }
];

const FAQ = () => {
    return (
        <main className="content-page">
            <div className="content-container" style={{ maxWidth: '900px', margin: '0 auto', padding: '20px 20px 60px', color: '#e2e8f0' }}>
                <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Frequently Asked Questions</h1>
                <p style={{ color: '#94a3b8', marginBottom: '2rem', fontSize: '1.05rem' }}>
                    Comprehensive answers about moon sighting, the Islamic calendar, and how Moon Visibility Explorer works.
                    <br />
                    <span style={{ fontFamily: "'Noto Sans Arabic', sans-serif", direction: 'rtl', display: 'inline-block', marginTop: '4px' }}>
                        أجوبة شاملة حول رؤية الهلال والتقويم الإسلامي وكيفية عمل مستكشف رؤية القمر
                    </span>
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {faqData.map((faq, index) => (
                        <details
                            key={index}
                            style={{
                                background: 'rgba(30, 41, 59, 0.6)',
                                border: '1px solid #334155',
                                borderRadius: '12px',
                                overflow: 'hidden',
                                transition: 'border-color 0.2s',
                            }}
                        >
                            <summary
                                style={{
                                    padding: '1.25rem 1.5rem',
                                    cursor: 'pointer',
                                    fontWeight: '600',
                                    fontSize: '1.05rem',
                                    color: '#f1f5f9',
                                    listStyle: 'none',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.75rem',
                                    userSelect: 'none',
                                }}
                            >
                                <span style={{ color: '#60a5fa', fontSize: '1.2rem', flexShrink: 0 }}>Q{index + 1}.</span>
                                <span style={{ flex: 1 }}>
                                    {faq.question}
                                    {faq.questionAr && (
                                        <span style={{
                                            display: 'block',
                                            fontFamily: "'Noto Sans Arabic', sans-serif",
                                            direction: 'rtl',
                                            textAlign: 'right',
                                            color: '#94a3b8',
                                            fontSize: '0.95rem',
                                            fontWeight: '500',
                                            marginTop: '4px',
                                        }}>
                                            {faq.questionAr}
                                        </span>
                                    )}
                                </span>
                            </summary>
                            <div style={{
                                padding: '0 1.5rem 1.5rem',
                                borderTop: '1px solid #334155',
                                paddingTop: '1.25rem',
                            }}>
                                <p style={{
                                    lineHeight: '1.8',
                                    color: '#cbd5e1',
                                    margin: '0 0 1rem 0',
                                    fontSize: '0.95rem',
                                }}>
                                    {faq.answer}
                                </p>
                                {faq.answerAr && (
                                    <div style={{
                                        background: 'rgba(96, 165, 250, 0.05)',
                                        border: '1px solid rgba(96, 165, 250, 0.15)',
                                        borderRadius: '8px',
                                        padding: '1rem 1.25rem',
                                        fontFamily: "'Noto Sans Arabic', sans-serif",
                                        direction: 'rtl',
                                        textAlign: 'right',
                                        lineHeight: '2',
                                        color: '#94a3b8',
                                        fontSize: '0.9rem',
                                    }}>
                                        {faq.answerAr}
                                    </div>
                                )}
                            </div>
                        </details>
                    ))}
                </div>

                <section style={{ marginTop: '3rem', padding: '1.5rem', background: 'rgba(16, 185, 129, 0.08)', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                    <h2 style={{ color: '#10b981', fontSize: '1.3rem', margin: '0 0 0.75rem 0' }}>Still Have Questions?</h2>
                    <p style={{ color: '#cbd5e1', lineHeight: '1.7', margin: '0' }}>
                        If your question isn't answered above, please reach out to us at{' '}
                        <a href="mailto:moonvisapp@gmail.com" style={{ color: '#38bdf8' }}>moonvisapp@gmail.com</a>.
                        We are continually improving Moon Visibility Explorer based on community feedback and welcome all inquiries about our methodology, data sources, or feature requests.
                    </p>
                    <p style={{
                        fontFamily: "'Noto Sans Arabic', sans-serif",
                        direction: 'rtl',
                        textAlign: 'right',
                        color: '#94a3b8',
                        marginTop: '0.75rem',
                        lineHeight: '1.8',
                    }}>
                        إذا لم تجد إجابة سؤالك أعلاه، يرجى التواصل معنا على moonvisapp@gmail.com
                    </p>
                </section>
            </div>
        </main>
    );
};

export default FAQ;
