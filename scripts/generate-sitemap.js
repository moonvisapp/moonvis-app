import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { MAJOR_CITIES } from '../src/data/cities.js';
import { getCityPath } from '../src/utils/cityUrls.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DOMAIN = 'https://moonvis-app-mauve.vercel.app';
const SITEMAP_PATH = path.resolve(__dirname, '../public/sitemap.xml');

// Base standard routes
const BASE_ROUTES = [
    { url: '/', priority: '1.0', changefreq: 'daily' },
    { url: '/about', priority: '0.8', changefreq: 'monthly' },
    { url: '/guide', priority: '0.8', changefreq: 'monthly' },
    { url: '/faq', priority: '0.8', changefreq: 'monthly' },
    { url: '/methodology', priority: '0.8', changefreq: 'monthly' },
    { url: '/contact', priority: '0.7', changefreq: 'monthly' },
    { url: '/cities', priority: '0.8', changefreq: 'monthly' },
    { url: '/privacy', priority: '0.5', changefreq: 'yearly' },
    { url: '/terms', priority: '0.5', changefreq: 'yearly' },
];

// Article routes
const ARTICLE_ROUTES = [
    { url: '/articles/ramadan-guide', priority: '0.8', changefreq: 'monthly' },
    { url: '/articles/eid-dates-guide', priority: '0.8', changefreq: 'monthly' },
    { url: '/articles/hijri-calendar-history', priority: '0.7', changefreq: 'monthly' },
    { url: '/articles/moon-sighting-committees', priority: '0.7', changefreq: 'monthly' },
    { url: '/articles/islamic-vs-gregorian-calendar', priority: '0.7', changefreq: 'monthly' },
    { url: '/articles/lunar-phases', priority: '0.7', changefreq: 'monthly' },
    { url: '/articles/moon-sighting-tips', priority: '0.7', changefreq: 'monthly' },
    { url: '/articles/shared-night-explained', priority: '0.7', changefreq: 'monthly' },
];

async function generateSitemap() {
    console.log('[Sitemap] Generating sitemap...');
    const today = new Date().toISOString().split('T')[0];
    
    let xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

    const addRoute = (route) => {
        xmlContent += `  <url>
    <loc>${DOMAIN}${route.url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>\n`;
    };

    // Add base routes
    BASE_ROUTES.forEach(addRoute);

    // Add article routes
    ARTICLE_ROUTES.forEach(addRoute);

    // Add city routes dynamically
    MAJOR_CITIES.forEach((city) => {
        addRoute({
            url: getCityPath(city),
            priority: '0.6',
            changefreq: 'weekly'
        });
    });

    xmlContent += `</urlset>`;

    await fs.writeFile(SITEMAP_PATH, xmlContent, 'utf8');
    console.log(`[Sitemap] Successfully generated sitemap.xml with ${BASE_ROUTES.length + ARTICLE_ROUTES.length + MAJOR_CITIES.length} URLs.`);
}

generateSitemap().catch(err => {
    console.error('[Sitemap] Failed to generate sitemap:', err);
    process.exit(1);
});
