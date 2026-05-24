import { useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { SITE_URL, formatPageTitle, getJsonLdForPath, getSeoForPath } from '../utils/seo';

function setMeta(selector, attr, value) {
    let element = document.head.querySelector(selector);
    if (!element) {
        element = document.createElement('meta');
        // Parse the selector to determine what attributes to set (e.g., name or property)
        const match = selector.match(/^meta\[(name|property)="([^"]+)"\]$/);
        if (match) {
            element.setAttribute(match[1], match[2]);
            document.head.appendChild(element);
        } else {
            return; // Fallback if selector is complex
        }
    }
    element.setAttribute(attr, value);
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

export function SEOManager() {
    const { pathname } = useLocation();
    const seo = useMemo(() => getSeoForPath(pathname), [pathname]);

    useEffect(() => {
        const canonicalUrl = `${SITE_URL}${seo.canonicalPath === '/' ? '/' : seo.canonicalPath}`;
        const title = formatPageTitle(seo);

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

        let jsonLd = document.head.querySelector('script[data-route-json-ld="true"]');
        if (!jsonLd) {
            jsonLd = document.createElement('script');
            jsonLd.setAttribute('type', 'application/ld+json');
            jsonLd.setAttribute('data-route-json-ld', 'true');
            document.head.appendChild(jsonLd);
        }
        jsonLd.textContent = JSON.stringify(getJsonLdForPath(pathname));
    }, [pathname, seo]);

    return null;
}
