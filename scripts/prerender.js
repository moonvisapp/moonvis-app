import puppeteer from 'puppeteer';
import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs/promises';

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
    '/privacy',
    '/terms',
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
    const homeHtml = await page.evaluate(() => document.documentElement.outerHTML);
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

            const html = await page.evaluate(() => document.documentElement.outerHTML);
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
