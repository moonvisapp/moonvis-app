import puppeteer from 'puppeteer';
import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DIST_DIR = path.resolve(__dirname, '../dist');
const TARGET_FILE = path.join(DIST_DIR, 'index.html');
const PORT = 3050; // Random unused port

async function startServer() {
    return new Promise((resolve) => {
        const app = express();
        app.use(express.static(DIST_DIR));
        // Fallback for SPA routing
        app.get('*', (req, res) => {
            res.sendFile(TARGET_FILE);
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
        console.log('[Prerender] Vercel environment detected. Using @sparticuz/chromium...');
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
    
    console.log(`[Prerender] Visiting http://localhost:${PORT}/ ...`);
    await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle0' });

    // Wait specifically for the SEO content to ensure React has fully rendered the tree
    await page.waitForSelector('.seo-publisher-content', { timeout: 10000 });

    console.log('[Prerender] Capturing raw HTML snapshot...');
    const html = await page.evaluate(() => document.documentElement.outerHTML);

    // Re-construct doctype which gets stripped by outerHTML
    const finalHtml = `<!DOCTYPE html>\n<html>\n${html}\n</html>`;

    console.log('[Prerender] Writing to dist/index.html...');
    await fs.writeFile(TARGET_FILE, finalHtml, 'utf8');

    console.log('[Prerender] Cleaning up...');
    await browser.close();
    server.close();
    console.log('[Prerender] Finished successfully!');
}

runPrerender().catch(err => {
    console.error('[Prerender] Failed!', err);
    process.exit(1);
});
