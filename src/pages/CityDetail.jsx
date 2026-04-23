import React, { useMemo, useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import MoonMap from '../components/MoonMap';
import { MAJOR_CITIES } from '../data/cities';
import { getMoonIllumination, getMoonTimes, getVisibility } from '../utils/astronomy';

// Regional context data for enhanced SEO content
const REGION_CONTEXT = {
    'Saudi Arabia': {
        tradition: 'Saudi Arabia is central to Islamic moon sighting, with the Supreme Court of Saudi Arabia making official announcements for the start of Ramadan, Eid al-Fitr, and Eid al-Adha. The Umm al-Qura calendar is used for civil purposes, but religious observances often rely on physical crescent sighting.',
        tradAr: 'المملكة العربية السعودية هي المركز الرئيسي لرؤية الهلال في العالم الإسلامي. تصدر المحكمة العليا الإعلانات الرسمية لبداية رمضان والعيدين.',
        climate: 'Desert climate conditions in much of Saudi Arabia provide excellent visibility for crescent observation due to low humidity and minimal cloud cover, particularly in the Najd plateau and western highlands.'
    },
    'UAE': {
        tradition: 'The UAE relies on its national Moon Sighting Committee, which coordinates sighting observations from multiple locations across the country. The committee works closely with the International Astronomical Center (IAC) based in Abu Dhabi.',
        tradAr: 'تعتمد الإمارات على لجنة رؤية الأهلة الوطنية التي تنسق عمليات الرصد من مواقع متعددة عبر البلاد.',
        climate: 'The UAE benefits from predominantly clear skies, though coastal humidity in Dubai and Abu Dhabi can occasionally affect visibility near the horizon.'
    },
    'Egypt': {
        tradition: 'Egypt follows the decision of Dar al-Ifta al-Misriyya for determining the start of Islamic months. The Grand Mufti of Egypt typically announces the sighting based on a combination of astronomical calculation and physical observation from the Qattamia Observatory.',
        tradAr: 'تتبع مصر قرار دار الإفتاء المصرية لتحديد بداية الأشهر الإسلامية.',
        climate: 'Clear desert skies in inland Egypt provide good sighting conditions, though the Nile Delta region can experience more humidity that impacts horizon visibility.'
    },
    'Turkey': {
        tradition: 'Turkey uses a calculated calendar through the Diyanet (Directorate of Religious Affairs). The Turkish Islamic calendar is determined astronomically in advance, making it one of the more predictable Islamic calendars globally.',
        tradAr: 'تستخدم تركيا تقويماً محسوباً من خلال رئاسة الشؤون الدينية (ديانت).',
        climate: 'Turkey\'s diverse geography means visibility conditions vary greatly — the clear continental climate of central Anatolia offers better conditions than the humid Black Sea coast.'
    },
    'Pakistan': {
        tradition: 'Pakistan\'s Ruet-e-Hilal Committee is one of the most well-known moon sighting bodies in the world. Chaired by the head of the committee, testimonies from sighters across the country are evaluated each month. This often leads to spirited public debate about sighting claims.',
        tradAr: 'لجنة رؤية الهلال الباكستانية (روئت هلال) هي واحدة من أشهر هيئات رؤية الهلال في العالم.',
        climate: 'Pakistan\'s varied terrain from the Karakoram mountains to the Arabian Sea coast creates highly variable sighting conditions. Karachi and the southern coast benefit from clearer western horizons.'
    },
    'Indonesia': {
        tradition: 'Indonesia, the world\'s largest Muslim-majority country, uses a unique "imkanur rukyat" (possibility of sighting) criterion. The Ministry of Religious Affairs coordinates nationwide observations, and the government follows the decision of a national hilal sighting session (sidang isbat).',
        tradAr: 'إندونيسيا، أكبر دولة إسلامية من حيث عدد السكان، تستخدم معيار "إمكان الرؤية" الفريد.',
        climate: 'Tropical humidity and frequent cloud cover in Indonesia can make crescent sighting challenging. Eastern Indonesian locations generally have better conditions during the dry season.'
    },
    'Malaysia': {
        tradition: 'Malaysia uses a calculated calendar with a visibility criterion. The Keeper of the Rulers\' Seal announces the start of Ramadan based on the recommendation of the National Fatwa Committee and official crescent sighting observations.',
        tradAr: 'تستخدم ماليزيا تقويماً محسوباً مع معيار للرؤية.',
        climate: 'Malaysia\'s equatorial climate means consistent tropical conditions year-round. Sighting is best attempted from elevated locations with clear western horizons.'
    },
    'UK': {
        tradition: 'The UK has multiple moon sighting traditions reflecting its diverse Muslim community. Some follow Saudi announcements, others follow Morocco or local sighting. HM Nautical Almanac Office provides astronomical data used by several UK-based Islamic organizations.',
        tradAr: 'لدى المملكة المتحدة تقاليد متعددة لرؤية الهلال تعكس تنوع مجتمعها الإسلامي.',
        climate: 'The British Isles\' famously cloudy weather makes physical crescent sighting extremely difficult. Northern latitudes also shorten the observation window between sunset and moonset.'
    },
    'USA': {
        tradition: 'In the United States, multiple Islamic organizations publish their own calendar recommendations. ISNA (Islamic Society of North America) uses a calculated method, while others like the Fiqh Council follow local sighting. The diversity of approaches reflects the pluralism of the American Muslim community.',
        tradAr: 'في الولايات المتحدة، تنشر منظمات إسلامية متعددة توصياتها الخاصة بالتقويم.',
        climate: 'The vast geography of the United States means sighting conditions vary enormously. The arid southwestern states (Arizona, New Mexico) offer some of the best crescent visibility conditions in the country.'
    },
    'Australia': {
        tradition: 'Australia\'s Muslim community typically follows a combination of local sighting and astronomical calculation. The Australian National Imams Council provides guidance, while some communities follow announcements from Saudi Arabia or their countries of origin.',
        tradAr: 'يتبع المجتمع الإسلامي في أستراليا مزيجاً من الرؤية المحلية والحساب الفلكي.',
        climate: 'Australia\'s generally clear skies and low population density in many areas provide favorable conditions for moon sighting, particularly in the outback and western coastal regions.'
    }
};

function getRegionKey(cityName) {
    for (const key of Object.keys(REGION_CONTEXT)) {
        if (cityName.includes(key)) return key;
    }
    return null;
}

const CityDetail = () => {
    const { cityName } = useParams();
    // Find city case-insensitive to be robust
    const city = MAJOR_CITIES.find(c => c.name.toLowerCase() === cityName?.toLowerCase());

    const [date] = useState(new Date());

    // SEO Content Generation
    const cityContent = useMemo(() => {
        if (!city) return null;

        // Calculate dynamic properties
        let visibilityText = "could not be determined currently";
        let illuminationText = "an unknown";
        
        try {
            const today = new Date();
            const vis = getVisibility(today, city.lat, city.lon, 'odeh');
            if (vis && vis.zoneName) {
                visibilityText = `falls into the "${vis.zoneName}" zone`;
            }
            
            const ill = getMoonIllumination(today);
            if (ill !== undefined && ill !== null) {
                illuminationText = `${(ill * 100).toFixed(1)}%`;
            }
        } catch (e) {
            console.error("Error calculating dynamic city metrics", e);
        }

        const regionKey = getRegionKey(city.name);
        const regionCtx = regionKey ? REGION_CONTEXT[regionKey] : null;

        // Extract just the city short name and country
        const parts = city.name.split(', ');
        const shortName = parts[0];
        const country = parts[1] || '';

        return (
            <>
                <h2 style={{ fontSize: '1.5rem', marginTop: '2rem' }}>Moon Visibility in {city.name}</h2>
                <p style={{ lineHeight: '1.8' }}>
                    Track the current and future moon phases for <strong style={{ color: '#f1f5f9' }}>{city.name}</strong> (Coordinates: {city.lat.toFixed(2)}°{city.lat >= 0 ? 'N' : 'S'}, {Math.abs(city.lon).toFixed(2)}°{city.lon >= 0 ? 'E' : 'W'}).
                    The moon visibility forecast for <strong style={{ color: '#f1f5f9' }}>{city.name}</strong> tonight indicates that the crescent {visibilityText}, with a current lunar illumination of {illuminationText}.
                </p>
                <p style={{ lineHeight: '1.8', marginTop: '1rem' }}>
                    Our tool provides highly accurate crescent visibility predictions using the Odeh V-criterion algorithms framework, helping you determine the formal start of lunar months in {shortName} and the surrounding regional territories. All calculations are performed in real-time using the precise positions of the Sun and Moon via the astronomy-engine library.
                </p>

                <h3 style={{ marginTop: '1.5rem' }}>Astronomical Data for {shortName}</h3>
                <p style={{ lineHeight: '1.8' }}>
                    Located in the <strong style={{ color: '#f1f5f9' }}>{city.timezone}</strong> timezone, {shortName} interacts with the lunar cycle in a unique way based on its specific geographical position on the globe at latitude {city.lat.toFixed(2)}° and longitude {city.lon.toFixed(2)}°.
                    Factors such as standard atmospheric twilight conditions, topocentric altitude, the moon's elongation from the sun, and the crescent width are actively computed for each query.
                    The interactive map above shows the precise visibility zones affecting {shortName} and the surrounding region.
                </p>

                {regionCtx && (
                    <>
                        <h3 style={{ marginTop: '1.5rem' }}>Moon Sighting Traditions in {regionKey}</h3>
                        <p style={{ lineHeight: '1.8' }}>{regionCtx.tradition}</p>
                        <div style={{
                            background: 'rgba(96, 165, 250, 0.05)',
                            border: '1px solid rgba(96, 165, 250, 0.15)',
                            borderRadius: '8px',
                            padding: '0.75rem 1rem',
                            marginTop: '0.75rem',
                            fontFamily: "'Noto Sans Arabic', sans-serif",
                            direction: 'rtl',
                            textAlign: 'right',
                            lineHeight: '2',
                            color: '#94a3b8',
                            fontSize: '0.85rem',
                        }}>
                            {regionCtx.tradAr}
                        </div>

                        <h3 style={{ marginTop: '1.5rem' }}>Climate & Sighting Conditions</h3>
                        <p style={{ lineHeight: '1.8' }}>{regionCtx.climate}</p>
                    </>
                )}

                <h3 style={{ marginTop: '1.5rem' }}>Using the Tool for {shortName}</h3>
                <p style={{ lineHeight: '1.8' }}>
                    To generate a complete Hijri lunar calendar for {shortName}, return to the <Link to="/" style={{ color: '#38bdf8' }}>home page</Link>, select "{city.name}" from the city dropdown, choose your reference date, and click "Calculate Lunar Calendar." The tool will predict the start of each of the next 12 Islamic months, accounting for both direct visibility and shared night inheritance from nearby regions.
                </p>
                <p style={{ lineHeight: '1.8', marginTop: '0.75rem' }}>
                    You can also export your calendar as a PDF for community distribution, add events to Google Calendar, or download the raw data as a CSV file. Visit our <Link to="/guide" style={{ color: '#38bdf8' }}>User Guide</Link> for detailed step-by-step instructions, or check the <Link to="/faq" style={{ color: '#38bdf8' }}>FAQ</Link> for answers to common questions about lunar calendar calculations.
                </p>

                {/* Nearby cities */}
                <h3 style={{ marginTop: '1.5rem' }}>Explore Other Cities</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '0.75rem' }}>
                    {MAJOR_CITIES
                        .filter(c => c.name !== city.name)
                        .sort((a, b) => {
                            // Sort by distance from current city
                            const distA = Math.sqrt(Math.pow(a.lat - city.lat, 2) + Math.pow(a.lon - city.lon, 2));
                            const distB = Math.sqrt(Math.pow(b.lat - city.lat, 2) + Math.pow(b.lon - city.lon, 2));
                            return distA - distB;
                        })
                        .slice(0, 10)
                        .map(c => (
                            <Link
                                key={c.name}
                                to={`/city/${encodeURIComponent(c.name)}`}
                                style={{
                                    display: 'inline-block',
                                    padding: '3px 10px',
                                    background: 'rgba(96, 165, 250, 0.1)',
                                    border: '1px solid rgba(96, 165, 250, 0.2)',
                                    borderRadius: '14px',
                                    color: '#60a5fa',
                                    fontSize: '0.8rem',
                                    textDecoration: 'none',
                                }}
                            >
                                {c.name}
                            </Link>
                        ))
                    }
                </div>
            </>
        );
    }, [city]);

    if (!city) {
        return (
            <main className="content-page">
                <div className="content-container">
                    <h2>City Not Found</h2>
                    <p>We could not find data for {cityName}. Please check the spelling or select a city from the homepage.</p>
                    <Link to="/">Return to Home</Link>
                </div>
            </main>
        );
    }

    // We reuse the MoonMap but force the selected city
    // Note: We need a valid Date object for the map
    const dateObj = new Date();

    return (
        <main className="content-page">
            <div className="content-container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
                <div className="seo-header" style={{ marginBottom: '20px', color: '#e2e8f0' }}>
                    <h1>Moon Sighting in {city.name}</h1>
                    <p>Real-time moon visibility and lunar calendar predictions for {city.name}, powered by the Odeh V-criterion.</p>
                </div>

                <div className="map-container" style={{ height: '600px', marginBottom: '40px' }}>
                    {/* We pass the city to pre-select it on the map */}
                    <MoonMap
                        date={dateObj}
                        calculationTrigger={1} // Trigger once on load
                        selectedCity={city}
                        highlightSharedNightCells={null}
                    />
                </div>

                <div className="text-content" style={{ color: '#cbd5e1', maxWidth: '800px' }}>
                    {cityContent}

                    <div style={{ marginTop: '30px' }}>
                        <Link to="/" className="back-link" style={{ color: '#38bdf8' }}>← Back to Global Map</Link>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default CityDetail;
