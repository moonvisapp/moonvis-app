import puppeteer from 'puppeteer';
import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs/promises';
import { MAJOR_CITIES } from '../src/data/cities.js';
import { getCityPath } from '../src/utils/cityUrls.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DIST_DIR = path.resolve(__dirname, '../dist');
const PORT = 3050; // Random unused port

// Routes to prerender - these are the pages with substantial content
const ROUTES_TO_PRERENDER = [
    '/',
    '/about',
    '/guide',
    '/faq',
    '/methodology',
    '/contact',
    '/cities',
    '/privacy',
    '/terms',
    '/articles/hijri-calendar-history',
    '/articles/moon-sighting-committees',
    '/articles/islamic-vs-gregorian-calendar',
    '/articles/lunar-phases',
    '/articles/moon-sighting-tips',
    '/articles/shared-night-explained',
    '/articles/ramadan-guide',
    '/articles/eid-dates-guide',
    ...MAJOR_CITIES.map(city => getCityPath(city))
];

async function startServer() {
    return new Promise((resolve) => {
        const app = express();
        app.use(express.static(DIST_DIR));
        // Fallback for SPA routing
        app.get('*', (req, res) => {
            res.sendFile(path.join(DIST_DIR, 'index.html'));
        });
        const server = app.listen(PORT, () => resolve(server));
    });
}

async function runPrerender() {
    console.log('[Prerender] Starting static server...');
    const server = await startServer();

    console.log('[Prerender] Launching Puppeteer...');
    let browser;
    if (process.env.VERCEL) {
        console.log('[Prerender] Vercel environment detected. Using @sparticuz/chromium v147...');
        const sparticuzModule = await import('@sparticuz/chromium');
        const sparticuz = sparticuzModule.default || sparticuzModule;
        const puppeteerCoreModule = await import('puppeteer-core');
        const puppeteerCore = puppeteerCoreModule.default || puppeteerCoreModule;
        
        browser = await puppeteerCore.launch({
            args: sparticuz.args,
            defaultViewport: sparticuz.defaultViewport,
            executablePath: await sparticuz.executablePath(),
            headless: sparticuz.headless === true ? "new" : sparticuz.headless,
        });
    } else {
        // Default execution using standard puppeteer
        browser = await puppeteer.launch({
            headless: "new",
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
    }

    const page = await browser.newPage();
    await page.setRequestInterception(true);
    page.on('request', (request) => {
        const url = request.url();
        if (
            url.includes('pagead2.googlesyndication.com') ||
            url.includes('googleads.g.doubleclick.net') ||
            url.includes('googlesyndication.com/pagead') ||
            url.includes('googletagservices.com') ||
            url.includes('google.com/recaptcha')
        ) {
            request.abort();
            return;
        }
        request.continue();
    });

    async function getCleanHtml() {
        await page.evaluate(() => {
            document
                .querySelectorAll('script[src*="pagead2.googlesyndication.com/pagead/managed"], iframe[src*="googleads.g.doubleclick.net"], iframe[src*="google.com/recaptcha"], iframe#google_esf, ins.adsbygoogle-noablate, meta[http-equiv="origin-trial"]')
                .forEach((element) => element.remove());

            document.querySelectorAll('script[src*="pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"]').forEach((script) => {
                script.removeAttribute('data-checked-head');
            });

            document.querySelectorAll('ins.adsbygoogle').forEach((slot) => {
                slot.removeAttribute('data-adsbygoogle-status');
                slot.removeAttribute('data-ad-status');
                slot.removeAttribute('data-ad-hi');
                slot.querySelectorAll('iframe, [id^="aswift_"]').forEach((element) => element.remove());
            });
        });

        return page.evaluate(() => document.documentElement.outerHTML);
    }

    // First, prerender the home page (which has the SEO content)
    console.log(`[Prerender] Visiting home page http://localhost:${PORT}/ ...`);
    await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle0', timeout: 30000 });

    // Wait specifically for the SEO content to ensure React has fully rendered the tree
    try {
        await page.waitForSelector('.seo-publisher-content', { timeout: 10000 });
        console.log('[Prerender] Found .seo-publisher-content on home page');
    } catch (e) {
        console.warn('[Prerender] Warning: .seo-publisher-content not found, continuing anyway');
    }

    console.log('[Prerender] Capturing home page HTML snapshot...');
    const homeHtml = await getCleanHtml();
    const homeFile = path.join(DIST_DIR, 'index.html');
    const finalHomeHtml = `<!DOCTYPE html>\n${homeHtml}`;
    await fs.writeFile(homeFile, finalHomeHtml, 'utf8');
    console.log('[Prerender] Wrote home page to dist/index.html');

    // Now prerender all other content routes
    for (const route of ROUTES_TO_PRERENDER) {
        if (route === '/') continue; // Already done

        const routePath = route.slice(1); // Remove leading slash
        const dirPath = path.join(DIST_DIR, routePath);
        const filePath = path.join(dirPath, 'index.html');

        console.log(`[Prerender] Visiting http://localhost:${PORT}${route} ...`);
        
        try {
            await page.goto(`http://localhost:${PORT}${route}`, { waitUntil: 'networkidle0', timeout: 15000 });
            
            // Wait for content to render
            await page.waitForSelector('.content-page, .app-main', { timeout: 8000 });

            const html = await getCleanHtml();
            const finalHtml = `<!DOCTYPE html>\n${html}`;

            // Create directory if it doesn't exist
            await fs.mkdir(dirPath, { recursive: true });
            await fs.writeFile(filePath, finalHtml, 'utf8');
            console.log(`[Prerender] Wrote ${route} to dist/${routePath}/index.html`);
        } catch (err) {
            console.error(`[Prerender] Failed to prerender ${route}:`, err.message);
            // Don't fail the entire build for non-critical routes
        }
    }

    console.log('[Prerender] Cleaning up...');
    await browser.close();
    server.close();
    console.log(`[Prerender] Finished successfully! Prerendered ${ROUTES_TO_PRERENDER.length} routes.`);
}

runPrerender().catch(err => {
    console.error('[Prerender] Failed!', err);
    process.exit(1);
});
