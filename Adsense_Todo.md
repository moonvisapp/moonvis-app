# AdSense Compliance: Next Steps & Todo

> [!WARNING]
> Your site is currently under a review cooldown until **May 25, 2026** due to reaching the limit for site review attempts. Do not attempt to request another review until this date.

## 1. Why the Site was Rejected ("Low Value Content")

Despite the recent technical fixes (prerendering, routing, and adding articles), Google AdSense continues to reject the application. This is caused by three overlapping factors:

1. **The `.vercel.app` Subdomain (Critical):** AdSense notoriously rejects free subdomains provided by hosting platforms (like Vercel, Netlify, Github Pages). Because you don't own the root domain, Google's automated systems treat the site with extreme strictness and usually issue generic "Low value content" or "Site behavior" rejections.
2. **Indexing Delay:** The AdSense bot relies heavily on the main Google Search Index. If you requested a review immediately after deploying the new articles and prerendering, Google Search hadn't had time to crawl your `sitemap.xml`. The AdSense bot likely saw the old, single-page version of the site.
3. **Review Cooldown:** Submitting the site for review multiple times in a short window triggered a temporary lockout.

## 2. Action Plan & Todo List

The technical foundation of the site is now solid. The remaining steps are procedural and focus on domain ownership and Google Search indexing.

- [ ] **Purchase a Custom Domain**
  - Buy a domain (e.g., `moonvis.com` or `moonvis.net`) from a registrar (Namecheap, Cloudflare, GoDaddy, etc.).
  - *Note: You do NOT need to switch hosts. Vercel allows you to link custom domains for free.*
- [ ] **Connect Domain to Vercel**
  - In your Vercel project dashboard, go to Settings > Domains.
  - Add your purchased domain.
  - Add the provided DNS records (A Record / CNAME) to your domain registrar's settings.
- [ ] **Update Site URLs**
  - Once the custom domain is live, update any hardcoded `https://moonvis-app-mauve.vercel.app` URLs in your codebase to your new domain (e.g., in `sitemap.xml` generation, canonical meta tags, or Open Graph tags).
- [ ] **Submit to Google Search Console**
  - Add your new custom domain as a property in Google Search Console.
  - Submit your new `sitemap.xml` URL.
- [ ] **Wait for Indexing**
  - Wait 1-2 weeks for Google to crawl and index your new articles.
  - Verify indexing by searching `site:your-custom-domain.com` in Google.
- [ ] **Re-apply for AdSense (After May 25, 2026)**
  - Delete the `.vercel.app` property from your AdSense dashboard.
  - Add your new custom domain as a brand new site.
  - Submit for review once the cooldown has expired.
