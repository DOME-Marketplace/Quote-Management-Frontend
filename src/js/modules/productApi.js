// Product API module
import { API_CONFIG } from './config.js';

// Product-specific API configuration
//TODO CHANGE THIS URL TO BACKEND
const PRODUCT_API_CONFIG = {
    baseUrl: 'https://api.allorigins.win/get?url=' + encodeURIComponent('https://an-dhub-sbx.dome-project.eu/tmf-api/productCatalogManagement/v4/productOffering?limit=1&offset=280'),
    baseUrlProductSpec: 'https://an-dhub-sbx.dome-project.eu/tmf-api/productCatalogManagement/v4/productSpecification/',
    timeout: 15000,
    retryDelay: 2000
};

export const ProductAPI = {
    // Fetch products from the catalog API with chained calls
    async fetchProducts() {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), PRODUCT_API_CONFIG.timeout);

        try {
            console.log('Fetching product offerings via proxy...');

            // Step 1: Fetch Product Offerings
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
            console.log('Product offering proxy response:', proxyData);

            // Handle proxy response format
            let productOfferings;
            if (proxyData.contents) {
                productOfferings = JSON.parse(proxyData.contents);
            } else {
                productOfferings = proxyData;
            }

            // Validate response data
            if (!Array.isArray(productOfferings)) {
                throw new Error('Invalid response format: expected array');
            }

            console.log(`Successfully loaded ${productOfferings.length} product offerings`);

            // Step 2: For each product offering, fetch its product specification
            const enrichedProducts = await Promise.all(
                productOfferings.map(async (productOffering) => {
                    try {
                        // Extract product specification ID from product offering
                        const productSpecId = productOffering.productSpecification?.id;
                        if (!productSpecId) {
                            console.warn('Product offering missing productSpecification.id:', productOffering.id);
                            return {
                                ...productOffering,
                                productSpecification: null
                            };
                        }

                        console.log(`Fetching product specification: ${productSpecId}`);

                        // Fetch product specification details via proxy
                        const specUrl = 'https://api.allorigins.win/get?url=' + 
                            encodeURIComponent(PRODUCT_API_CONFIG.baseUrlProductSpec + encodeURIComponent(productSpecId));
                        
                        const specResponse = await fetch(specUrl, {
                            method: 'GET',
                            headers: {
                                'Accept': 'application/json'
                            }
                        });

                        if (!specResponse.ok) {
                            console.warn(`Failed to fetch product specification ${productSpecId}:`, specResponse.status);
                            return {
                                ...productOffering,
                                productSpecification: null
                            };
                        }

                        const specProxyData = await specResponse.json();
                        let productSpecification;
                        
                        if (specProxyData.contents) {
                            productSpecification = JSON.parse(specProxyData.contents);
                        } else {
                            productSpecification = specProxyData;
                        }

                        console.log(`Successfully loaded product specification for: ${productOffering.name}`);

                        // Merge product offering with full product specification
                        return {
                            ...productOffering,
                            productSpecification: productSpecification
                        };

                    } catch (error) {
                        console.error(`Error fetching product specification for ${productOffering.id}:`, error);
                        return {
                            ...productOffering,
                            productSpecification: null
                        };
                    }
                })
            );

            console.log('All products enriched with specifications');
            return enrichedProducts;

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