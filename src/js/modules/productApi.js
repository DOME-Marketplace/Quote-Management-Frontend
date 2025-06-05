// Product API module
import { API_CONFIG } from './config.js';

// Product-specific API configuration
//TODO CHANGE THIS URL TO BACKEND
const PRODUCT_API_CONFIG = {
    baseUrl: 'https://api.allorigins.win/get?url=' + encodeURIComponent('https://an-dhub-sbx.dome-project.eu/tmf-api/productCatalogManagement/v4/productSpecification?offset=0&limit=1'),
    timeout: 15000,
    retryDelay: 2000
};

export const ProductAPI = {
    // Fetch products from the catalog API
    async fetchProducts() {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), PRODUCT_API_CONFIG.timeout);

        try {
            console.log('Fetching products via proxy...');

            const response = await fetch(PRODUCT_API_CONFIG.baseUrl, {
                signal: controller.signal,
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                }
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const proxyData = await response.json();
            console.log('Product proxy response:', proxyData);

            // Handle proxy response format
            let products;
            if (proxyData.contents) {
                products = JSON.parse(proxyData.contents);
            } else {
                products = proxyData;
            }

            // Validate response data
            if (!Array.isArray(products)) {
                throw new Error('Invalid response format: expected array');
            }

            console.log(`Successfully loaded ${products.length} products`);
            return products;

        } catch (error) {
            clearTimeout(timeoutId);

            if (error.name === 'AbortError') {
                throw new Error('Request timeout - please try again');
            }

            console.error('Product API Error:', error);
            throw error;
        }
    },

    // Future product operations
    async fetchProductById(id) {
        // Implementation for fetching single product
        throw new Error('Not implemented yet');
    },

    async searchProducts(query) {
        // Implementation for product search
        throw new Error('Not implemented yet');
    },

    async filterProducts(filters) {
        // Implementation for product filtering
        throw new Error('Not implemented yet');
    }
}; 