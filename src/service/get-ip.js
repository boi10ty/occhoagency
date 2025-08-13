import axios from 'axios';
/**
 * @typedef {import('@/types/geo-type.js').GeoLocation} GeoLocation
 */

/**
 * @returns {Promise<GeoLocation>}
 */
const getGeoData = async () => {
    try {
        const response = await axios.get('https://get.geojs.io/v1/ip/geo.json');
        return response.data;
    } catch {
        return {
            country_code: 'US',
            country: 'United States',
            city: 'Unknown',
            region: 'Unknown',
            latitude: '0',
            longitude: '0',
            timezone: 'UTC',
            ip: 'unknown'
        };
    }
};
export default getGeoData;
