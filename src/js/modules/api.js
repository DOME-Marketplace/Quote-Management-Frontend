// API module for handling external requests
import { API_CONFIG } from './config.js';
import { Auth } from './auth.js';

export const API = {
    // Fetch quotes with CORS bypass
    async fetchQuotes() {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout);

        try {
            // Get the current customerId from session
            const customerId = Auth.getCurrentUserId();
            if (!customerId) {
                throw new Error('No customerId found in session');
            }

            // Build the backend URL
            const url = `http://localhost:8080/quoteManagement/quoteByUser/${encodeURIComponent(customerId)}`;
            console.log('Fetching quotes from backend:', url);

            const response = await fetch(url, {
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
            console.log('Proxy response:', proxyData);

            // The allorigins proxy returns data in .contents
            let data;
            if (proxyData.contents) {
                data = JSON.parse(proxyData.contents);
            } else {
                data = proxyData;
            }

            // Validate response data
            if (!Array.isArray(data)) {
                throw new Error('Invalid response format: expected array');
            }

            console.log(`Successfully loaded ${data.length} quotes`);
            return data;

        } catch (error) {
            clearTimeout(timeoutId);

            if (error.name === 'AbortError') {
                throw new Error('Request timeout - please try again');
            }

            console.error('API Error:', error);
            throw error;
        }
    },

    // Future API methods can be added here
    // async updateQuote(id, data) { ... },
    // async deleteQuote(id) { ... },
    // async createQuote(data) { ... }
}; 