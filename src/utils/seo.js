import { MAJOR_CITIES } from '../data/cities';
import { findCityBySlugOrName, getCityPath } from './cityUrls';

export const SITE_URL = 'https://moonvis-app-mauve.vercel.app';
export const SITE_NAME = 'Moon Visibility Explorer';
export const DEFAULT_TITLE = 'Moon Visibility Explorer - Odeh Lunar Calendar & Hijri Moon Sighting Calculator';
export const DEFAULT_DESCRIPTION = 'Global moon visibility calculator using Odeh V-criterion. Generate accurate lunar calendars and Hijri dates with interactive moon sighting predictions for 70+ cities worldwide.';

const ROUTE_SEO = {
    '/': {
        title: DEFAULT_TITLE,
        description: DEFAULT_DESCRIPTION,
        label: 'Home',
    },
    '/about': {
        title: 'About Moon Visibility Explorer',
        description: 'Learn about Moon Visibility Explorer, an Odeh V-criterion moon sighting calculator for Hijri calendar and lunar visibility predictions.',
        label: 'About',
    },
    '/guide': {
        title: 'Moon Visibility Explorer User Guide',
        description: 'Step-by-step guide for using the moon visibility map, calculating Hijri lunar calendars, and exporting moon sighting predictions.',
        label: 'Guide',
    },
    '/faq': {
        title: 'Moon Sighting and Hijri Calendar FAQ',
        description: 'Answers to common questions about crescent visibility, the Odeh criterion, Hijri calendar calculations, and shared night moon sighting.',
        label: 'FAQ',
    },
    '/methodology': {
        title: 'Scientific Methodology for Odeh Moon Visibility Calculations',
        description: 'Technical methodology for Moon Visibility Explorer, including Odeh V-criterion calculations, astronomical models, and Hijri calendar prediction logic.',
        label: 'Methodology',
    },
    '/contact': {
        title: 'Contact Moon Visibility Explorer',
        description: 'Contact Moon Visibility Explorer for feedback, bug reports, collaboration, city requests, and questions about lunar calendar calculations.',
        label: 'Contact',
    },
    '/cities': {
        title: 'Moon Sighting Locations Directory',
        description: 'Browse moon sighting and Hijri calendar prediction pages for major cities worldwide using Odeh V-criterion lunar visibility calculations.',
        label: 'Locations',
    },
    '/privacy': {
        title: 'Privacy Policy - Moon Visibility Explorer',
        description: 'Privacy policy for Moon Visibility Explorer, including how cookies, analytics, and advertising are used on the site.',
        label: 'Privacy',
    },
    '/terms': {
        title: 'Terms of Service - Moon Visibility Explorer',
        description: 'Terms of service for using Moon Visibility Explorer moon sighting, lunar calendar, and Hijri date calculation tools.',
        label: 'Terms',
    },
    '/articles/ramadan-guide': {
        title: 'When Does Ramadan Start? Moon Sighting Predictions',
        description: 'Learn how Ramadan start dates are determined by crescent moon sighting and how to predict Ramadan dates for your location.',
        label: 'Ramadan Guide',
        article: true,
    },
    '/articles/eid-dates-guide': {
        title: 'When Is Eid al-Fitr and Eid al-Adha?',
        description: 'Guide to Eid al-Fitr and Eid al-Adha dates, how moon sighting determines each Eid, and why Eid dates vary by country.',
        label: 'Eid Dates',
        article: true,
    },
    '/articles/hijri-calendar-history': {
        title: 'The History of the Islamic Hijri Calendar',
        description: 'Explore the history of the Islamic Hijri calendar, lunar months, and how moon sighting shaped Muslim calendar systems.',
        label: 'Hijri Calendar History',
        article: true,
    },
    '/articles/moon-sighting-committees': {
        title: 'How Moon Sighting Committees Work Around the World',
        description: 'Country-by-country guide to moon sighting committees, Islamic calendar announcements, and crescent observation methods.',
        label: 'Moon Sighting Committees',
        article: true,
    },
    '/articles/islamic-vs-gregorian-calendar': {
        title: 'Islamic Calendar vs Gregorian Calendar',
        description: 'Compare the Islamic lunar calendar with the Gregorian solar calendar, including month lengths, year drift, and religious date calculation.',
        label: 'Islamic vs Gregorian',
        article: true,
    },
    '/articles/lunar-phases': {
        title: 'Understanding Lunar Phases',
        description: 'A practical guide to lunar phases, new moon visibility, crescent formation, and the astronomy behind Islamic month starts.',
        label: 'Lunar Phases',
        article: true,
    },
    '/articles/moon-sighting-tips': {
        title: 'Moon Sighting Tips for Beginners',
        description: 'Practical moon sighting tips for finding the crescent, choosing an observation location, timing sunset, and using optical aid.',
        label: 'Moon Sighting Tips',
        article: true,
    },
    '/articles/shared-night-explained': {
        title: 'Shared Night Explained for Islamic Moon Sighting',
        description: 'Understand shared night in Islamic moon sighting and how it affects Hijri calendar predictions across different locations.',
        label: 'Shared Night Explained',
        article: true,
    },
};

function absoluteUrl(path) {
    return `${SITE_URL}${path === '/' ? '/' : path}`;
}

export function normalizePathname(pathname) {
    return pathname === '' ? '/' : pathname.replace(/\/$/, '') || '/';
}

export function getSeoForPath(pathname) {
    if (pathname.startsWith('/city/')) {
        const cityParam = pathname.slice('/city/'.length);
        const city = findCityBySlugOrName(cityParam, MAJOR_CITIES);

        if (city) {
            const canonicalPath = getCityPath(city);
            return {
                title: `Moon Sighting in ${city.name}`,
                description: `Real-time moon visibility and Hijri lunar calendar predictions for ${city.name}, powered by the Odeh V-criterion.`,
                label: city.name,
                canonicalPath,
                city,
            };
        }
    }

    const normalizedPath = normalizePathname(pathname);
    return {
        ...(ROUTE_SEO[normalizedPath] || ROUTE_SEO['/']),
        canonicalPath: normalizedPath,
    };
}

export function formatPageTitle(seo) {
    return seo.title === DEFAULT_TITLE ? seo.title : `${seo.title} | ${SITE_NAME}`;
}

export function getBreadcrumbsForPath(pathname) {
    const seo = getSeoForPath(pathname);
    const breadcrumbs = [
        { label: 'Home', path: '/' },
    ];

    if (seo.canonicalPath === '/') {
        return breadcrumbs;
    }

    if (seo.city) {
        breadcrumbs.push({ label: 'Locations', path: '/cities' });
        breadcrumbs.push({ label: seo.city.name, path: seo.canonicalPath });
        return breadcrumbs;
    }

    breadcrumbs.push({ label: seo.label || seo.title, path: seo.canonicalPath });
    return breadcrumbs;
}

function breadcrumbJsonLd(pathname) {
    return {
        '@type': 'BreadcrumbList',
        itemListElement: getBreadcrumbsForPath(pathname).map((crumb, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: crumb.label,
            item: absoluteUrl(crumb.path),
        })),
    };
}

function homepageJsonLd() {
    return [
        {
            '@type': 'WebApplication',
            name: SITE_NAME,
            alternateName: 'Odeh Lunar Calendar Calculator',
            url: absoluteUrl('/'),
            description: 'Interactive global moon visibility calculator using Odeh V-criterion for accurate lunar calendar generation, Hijri date calculation, and Islamic moon sighting predictions worldwide.',
            applicationCategory: 'UtilitiesApplication',
            operatingSystem: 'Web Browser',
            offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'USD',
            },
            creator: {
                '@type': 'Organization',
                name: SITE_NAME,
                email: 'moonvisapp@gmail.com',
            },
        },
        {
            '@type': 'WebSite',
            name: SITE_NAME,
            url: absoluteUrl('/'),
        },
    ];
}

function faqJsonLd() {
    return {
        '@type': 'FAQPage',
        mainEntity: [
            {
                '@type': 'Question',
                name: 'What is the Odeh criterion for moon visibility?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'The Odeh V-criterion is a scientifically validated empirical model for predicting lunar crescent visibility. It categorizes visibility into easily visible, visible under perfect conditions, visible with optical aid, and not visible zones.',
                },
            },
            {
                '@type': 'Question',
                name: 'Can I use this for Hijri calendar calculations?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Yes. Moon Visibility Explorer generates Hijri calendar predictions from lunar crescent visibility, including direct sighting and shared night inheritance.',
                },
            },
            {
                '@type': 'Question',
                name: 'Why do different countries start Ramadan on different days?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Ramadan dates can differ because countries use different moon sighting methods, local horizons, calculated calendars, and shared night rules.',
                },
            },
        ],
    };
}

export function getJsonLdForPath(pathname) {
    const seo = getSeoForPath(pathname);
    const canonicalUrl = absoluteUrl(seo.canonicalPath);
    const title = formatPageTitle(seo);
    const graph = [];

    if (seo.canonicalPath === '/') {
        graph.push(...homepageJsonLd());
    } else if (seo.article) {
        graph.push({
            '@type': 'Article',
            headline: seo.title,
            description: seo.description,
            url: canonicalUrl,
            mainEntityOfPage: canonicalUrl,
            publisher: {
                '@type': 'Organization',
                name: SITE_NAME,
            },
        });
    } else if (seo.city) {
        graph.push({
            '@type': 'WebPage',
            name: title,
            description: seo.description,
            url: canonicalUrl,
            about: {
                '@type': 'Place',
                name: seo.city.name,
                geo: {
                    '@type': 'GeoCoordinates',
                    latitude: seo.city.lat,
                    longitude: seo.city.lon,
                },
            },
        });
    } else {
        graph.push({
            '@type': 'WebPage',
            name: title,
            description: seo.description,
            url: canonicalUrl,
        });
    }

    if (seo.canonicalPath === '/faq') {
        graph.push(faqJsonLd());
    }

    graph.push(breadcrumbJsonLd(pathname));

    return {
        '@context': 'https://schema.org',
        '@graph': graph,
    };
}
