import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Convert import.meta.url to __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Base URL of the deployed application
const BASE_URL = 'https://moonvis-app-mauve.vercel.app';

// Static routes
const staticRoutes = [
    '/',
    '/about',
    '/guide',
    '/privacy',
    '/terms'
];

// Import cities data
// Note: We need to read the file manually or use a trick because we can't easily import from src in a standalone script without more config
// Let's just read the file content and parse it loosely or duplicate the list if needed. 
// However, to be robust, let's try to import it if it's a module. 
// Since modern Node supports ESM, we can try importing directly if the paths align.
// But src/data/cities.js is not a built file. 
// Simplest approach: Extract the array using regex from the file content.

const citiesPath = path.join(__dirname, '../src/data/cities.js');
const citiesContent = fs.readFileSync(citiesPath, 'utf8');

// Regex to extract city names
// Matches: { name: "Mecca, Saudi Arabia", ... }
const cityRegex = /name:\s*"([^"]+)"/g;
let match;
const cities = [];

while ((match = cityRegex.exec(citiesContent)) !== null) {
    cities.push(match[1]);
}

console.log(`Found ${cities.length} cities.`);

// Generate XML content
const generateSitemap = () => {
    const today = new Date().toISOString().split('T')[0];

    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    // Add static routes
    staticRoutes.forEach(route => {
        xml += '  <url>\n';
        xml += `    <loc>${BASE_URL}${route}</loc>\n`;
        xml += `    <lastmod>${today}</lastmod>\n`;
        xml += '    <changefreq>weekly</changefreq>\n';
        xml += '    <priority>0.8</priority>\n';
        xml += '  </url>\n';
    });

    // Add dynamic city routes
    cities.forEach(city => {
        // Encode city name for URL
        const citySlug = encodeURIComponent(city); // e.g., Mecca%2C%20Saudi%20Arabia
        // Note: In our App, we use the city name directly in the URL param.
        // It's good practice to handle spaces, etc.

        xml += '  <url>\n';
        xml += `    <loc>${BASE_URL}/city/${citySlug}</loc>\n`;
        xml += `    <lastmod>${today}</lastmod>\n`;
        xml += '    <changefreq>monthly</changefreq>\n';
        xml += '    <priority>0.6</priority>\n';
        xml += '  </url>\n';
    });

    xml += '</urlset>';
    return xml;
};

// Write to public/sitemap.xml
const sitemapContent = generateSitemap();
const outputPath = path.join(__dirname, '../public/sitemap.xml');

fs.writeFileSync(outputPath, sitemapContent);
console.log(`Sitemap generated at ${outputPath}`);
