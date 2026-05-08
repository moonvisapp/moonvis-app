import { MAJOR_CITIES } from '../src/data/cities.js';
import { findCityBySlugOrName, getCityPath } from '../src/utils/cityUrls.js';

export default function handler(request, response) {
    const cityName = request.query?.cityName;
    const city = findCityBySlugOrName(cityName, MAJOR_CITIES);

    if (!city) {
        response.status(404).json({ error: 'City not found' });
        return;
    }

    response.setHeader('Location', getCityPath(city));
    response.status(301).end();
}
