import { useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { MAJOR_CITIES } from '../data/cities';
import { findCityBySlugOrName, getCityPath } from '../utils/cityUrls';

const SITE_URL = 'https://moonvis-app-mauve.vercel.app';
const SITE_NAME = 'Moon Visibility Explorer';
const DEFAULT_TITLE = 'Moon Visibility Explorer - Odeh Lunar Calendar & Hijri Moon Sighting Calculator';
const DEFAULT_DESCRIPTION = 'Global moon visibility calculator using Odeh V-criterion. Generate accurate lunar calendars and Hijri dates with interactive moon sighting predictions for 70+ cities worldwide.';

const ROUTE_SEO = {
    '/': {
        title: DEFAULT_TITLE,
        description: DEFAULT_DESCRIPTION,
    },
    '/about': {
        title: 'About Moon Visibility Explorer',
        description: 'Learn about Moon Visibility Explorer, an Odeh V-criterion moon sighting calculator for Hijri calendar and lunar visibility predictions.',
    },
    '/guide': {
        title: 'Moon Visibility Explorer User Guide',
        description: 'Step-by-step guide for using the moon visibility map, calculating Hijri lunar calendars, and exporting moon sighting predictions.',
    },
    '/faq': {
        title: 'Moon Sighting and Hijri Calendar FAQ',
        description: 'Answers to common questions about crescent visibility, the Odeh criterion, Hijri calendar calculations, and shared night moon sighting.',
    },
    '/methodology': {
        title: 'Scientific Methodology for Odeh Moon Visibility Calculations',
        description: 'Technical methodology for Moon Visibility Explorer, including Odeh V-criterion calculations, astronomical models, and Hijri calendar prediction logic.',
    },
    '/contact': {
        title: 'Contact Moon Visibility Explorer',
        description: 'Contact Moon Visibility Explorer for feedback, bug reports, collaboration, city requests, and questions about lunar calendar calculations.',
    },
    '/cities': {
        title: 'Moon Sighting Locations Directory',
        description: 'Browse moon sighting and Hijri calendar prediction pages for major cities worldwide using Odeh V-criterion lunar visibility calculations.',
    },
    '/privacy': {
        title: 'Privacy Policy - Moon Visibility Explorer',
        description: 'Privacy policy for Moon Visibility Explorer, including how cookies, analytics, and advertising are used on the site.',
    },
    '/terms': {
        title: 'Terms of Service - Moon Visibility Explorer',
        description: 'Terms of service for using Moon Visibility Explorer moon sighting, lunar calendar, and Hijri date calculation tools.',
    },
    '/articles/ramadan-guide': {
        title: 'When Does Ramadan Start? Moon Sighting Predictions',
        description: 'Learn how Ramadan start dates are determined by crescent moon sighting and how to predict Ramadan dates for your location.',
    },
    '/articles/eid-dates-guide': {
        title: 'When Is Eid al-Fitr and Eid al-Adha?',
        description: 'Guide to Eid al-Fitr and Eid al-Adha dates, how moon sighting determines each Eid, and why Eid dates vary by country.',
    },
    '/articles/hijri-calendar-history': {
        title: 'The History of the Islamic Hijri Calendar',
        description: 'Explore the history of the Islamic Hijri calendar, lunar months, and how moon sighting shaped Muslim calendar systems.',
    },
    '/articles/moon-sighting-committees': {
        title: 'How Moon Sighting Committees Work Around the World',
        description: 'Country-by-country guide to moon sighting committees, Islamic calendar announcements, and crescent observation methods.',
    },
    '/articles/islamic-vs-gregorian-calendar': {
        title: 'Islamic Calendar vs Gregorian Calendar',
        description: 'Compare the Islamic lunar calendar with the Gregorian solar calendar, including month lengths, year drift, and religious date calculation.',
    },
    '/articles/lunar-phases': {
        title: 'Understanding Lunar Phases',
        description: 'A practical guide to lunar phases, new moon visibility, crescent formation, and the astronomy behind Islamic month starts.',
    },
    '/articles/moon-sighting-tips': {
        title: 'Moon Sighting Tips for Beginners',
        description: 'Practical moon sighting tips for finding the crescent, choosing an observation location, timing sunset, and using optical aid.',
    },
    '/articles/shared-night-explained': {
        title: 'Shared Night Explained for Islamic Moon Sighting',
        description: 'Understand shared night in Islamic moon sighting and how it affects Hijri calendar predictions across different locations.',
    },
};

function setMeta(selector, attr, value) {
    const element = document.head.querySelector(selector);
    if (element) {
        element.setAttribute(attr, value);
    }
}

function setCanonical(url) {
    let link = document.head.querySelector('link[rel="canonical"]');
    if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', 'canonical');
        document.head.appendChild(link);
    }
    link.setAttribute('href', url);
}

function getSeoForPath(pathname) {
    if (pathname.startsWith('/city/')) {
        const cityParam = pathname.slice('/city/'.length);
        const city = findCityBySlugOrName(cityParam, MAJOR_CITIES);

        if (city) {
            const canonicalPath = getCityPath(city);
            return {
                title: `Moon Sighting in ${city.name}`,
                description: `Real-time moon visibility and Hijri lunar calendar predictions for ${city.name}, powered by the Odeh V-criterion.`,
                canonicalPath,
            };
        }
    }

    const normalizedPath = pathname === '' ? '/' : pathname.replace(/\/$/, '') || '/';
    return {
        ...(ROUTE_SEO[normalizedPath] || ROUTE_SEO['/']),
        canonicalPath: normalizedPath,
    };
}

export function SEOManager() {
    const { pathname } = useLocation();
    const seo = useMemo(() => getSeoForPath(pathname), [pathname]);

    useEffect(() => {
        const canonicalUrl = `${SITE_URL}${seo.canonicalPath === '/' ? '/' : seo.canonicalPath}`;
        const title = seo.title === DEFAULT_TITLE ? seo.title : `${seo.title} | ${SITE_NAME}`;

        document.title = title;
        setMeta('meta[name="title"]', 'content', title);
        setMeta('meta[name="description"]', 'content', seo.description);
        setMeta('meta[property="og:url"]', 'content', canonicalUrl);
        setMeta('meta[property="og:title"]', 'content', title);
        setMeta('meta[property="og:description"]', 'content', seo.description);
        setMeta('meta[property="twitter:url"]', 'content', canonicalUrl);
        setMeta('meta[property="twitter:title"]', 'content', title);
        setMeta('meta[property="twitter:description"]', 'content', seo.description);
        setCanonical(canonicalUrl);
    }, [seo]);

    return null;
}
