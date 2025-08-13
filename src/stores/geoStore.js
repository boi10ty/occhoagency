import { create } from 'zustand';
import getGeoData from '@/service/get-ip.js';
/**
 * @typedef {import('@/types/geo-type.js').GeoLocation} GeoLocation
 */

const useGeoStore = create((set, get) => ({
    geoData: null,
    error: null,

    /**
     * @returns {Promise<GeoLocation|null>}
     */
    fetchGeoData: async () => {
        const { geoData } = get();

        if (geoData) {
            return geoData;
        }

        set({ error: null });

        try {
            const data = await getGeoData();
            set({ geoData: data });
            return data;
        } catch (error) {
            const errorMessage = error.message || 'Failed to fetch geo data';
            set({ error: errorMessage });
            return null;
        }
    },

    getCountryCode: () => {
        const { geoData } = get();
        return geoData?.country_code || 'US';
    },

    getCountryName: () => {
        const { geoData } = get();
        return geoData?.country || 'United States';
    },

    getCity: () => {
        const { geoData } = get();
        return geoData?.city || 'Unknown';
    },

    getRegion: () => {
        const { geoData } = get();
        return geoData?.region || 'Unknown';
    },

    getIp: () => {
        const { geoData } = get();
        return geoData?.ip || 'Unknown';
    },

    reset: () => {
        set({
            geoData: null,
            error: null
        });
    }
}));

export default useGeoStore;
