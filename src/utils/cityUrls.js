export function createCitySlug(name) {
    return name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/&/g, ' and ')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

export function getCityPath(city) {
    return `/city/${createCitySlug(city.name)}`;
}

export function findCityBySlugOrName(value, cities) {
    if (!value) return null;

    let decoded = value;
    try {
        decoded = decodeURIComponent(value);
    } catch {
        // React Router usually decodes params already; keep the original value if decoding fails.
    }

    const normalized = decoded.toLowerCase();
    return cities.find((city) => (
        createCitySlug(city.name) === normalized ||
        city.name.toLowerCase() === normalized
    )) || null;
}
