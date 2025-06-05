// Quote API module
import { QUOTE_API_CONFIG } from './config.js';

export const QuoteAPI = {
    // Create a new quote request
    async createQuote(quoteRequest) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), QUOTE_API_CONFIG.timeout);

        try {
            console.log('Sending quote request:', quoteRequest);

            const response = await fetch(`${QUOTE_API_CONFIG.baseUrl}${QUOTE_API_CONFIG.endpoints.createQuote}`, {
                method: 'POST',
                headers: QUOTE_API_CONFIG.headers,
                body: JSON.stringify(quoteRequest),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                // Try to get error details from response
                let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
                try {
                    const errorData = await response.json();
                    console.log('Backend error details:', errorData);
                    if (errorData.message) {
                        errorMessage += ` - ${errorData.message}`;
                    }
                } catch (parseError) {
                    console.log('Could not parse error response as JSON');
                }
                throw new Error(errorMessage);
            }

            const result = await response.json();
            console.log('Quote request successful:', result);
            return result;

        } catch (error) {
            clearTimeout(timeoutId);

            if (error.name === 'AbortError') {
                throw new Error('Request timeout - please try again');
            }

            console.error('Quote API Error:', error);
            throw error;
        }
    },

    // Get all quotes (for future use)
    async getQuotes() {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), QUOTE_API_CONFIG.timeout);

        try {
            const response = await fetch(`${QUOTE_API_CONFIG.baseUrl}${QUOTE_API_CONFIG.endpoints.getQuotes}`, {
                method: 'GET',
                headers: QUOTE_API_CONFIG.headers,
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            return await response.json();

        } catch (error) {
            clearTimeout(timeoutId);

            if (error.name === 'AbortError') {
                throw new Error('Request timeout - please try again');
            }

            throw error;
        }
    },

    // Get quote by ID (for future use)
    async getQuoteById(quoteId) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), QUOTE_API_CONFIG.timeout);

        try {
            const response = await fetch(`${QUOTE_API_CONFIG.baseUrl}${QUOTE_API_CONFIG.endpoints.getQuoteById}/${encodeURIComponent(quoteId)}`, {
                method: 'GET',
                headers: QUOTE_API_CONFIG.headers,
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            return await response.json();

        } catch (error) {
            clearTimeout(timeoutId);

            if (error.name === 'AbortError') {
                throw new Error('Request timeout - please try again');
            }

            throw error;
        }
    },

    // Update quote (for future use)
    async updateQuote(quoteId, updateData) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), QUOTE_API_CONFIG.timeout);

        try {
            const response = await fetch(`${QUOTE_API_CONFIG.baseUrl}${QUOTE_API_CONFIG.endpoints.updateQuote}/${quoteId}`, {
                method: 'PUT',
                headers: QUOTE_API_CONFIG.headers,
                body: JSON.stringify(updateData),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            return await response.json();

        } catch (error) {
            clearTimeout(timeoutId);

            if (error.name === 'AbortError') {
                throw new Error('Request timeout - please try again');
            }

            throw error;
        }
    },

    // Delete quote (for future use)
    async deleteQuote(quoteId) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), QUOTE_API_CONFIG.timeout);

        try {
            const response = await fetch(`${QUOTE_API_CONFIG.baseUrl}${QUOTE_API_CONFIG.endpoints.deleteQuote}/${quoteId}`, {
                method: 'DELETE',
                headers: QUOTE_API_CONFIG.headers,
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            return response.status === 204 ? null : await response.json();

        } catch (error) {
            clearTimeout(timeoutId);

            if (error.name === 'AbortError') {
                throw new Error('Request timeout - please try again');
            }

            throw error;
        }
    },

    // Add note to quote (for chat functionality)
    async addNoteToQuote(quoteId, userId, messageContent) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), QUOTE_API_CONFIG.timeout);

        try {
            const url = `${QUOTE_API_CONFIG.baseUrl}${QUOTE_API_CONFIG.endpoints.addNoteToQuote}/${encodeURIComponent(quoteId)}?userId=${encodeURIComponent(userId)}&messageContent=${encodeURIComponent(messageContent)}`;
            
            const response = await fetch(url, {
                method: 'PATCH',
                headers: QUOTE_API_CONFIG.headers,
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
                try {
                    const errorData = await response.json();
                    console.log('Backend error details:', errorData);
                    if (errorData.message) {
                        errorMessage += ` - ${errorData.message}`;
                    }
                } catch (parseError) {
                    console.log('Could not parse error response as JSON');
                }
                throw new Error(errorMessage);
            }

            return response.status === 204 ? null : await response.json();

        } catch (error) {
            clearTimeout(timeoutId);

            if (error.name === 'AbortError') {
                throw new Error('Request timeout - please try again');
            }

            console.error('Add note API Error:', error);
            throw error;
        }
    },

    // Add attachment to quote (for file upload functionality)
    async addAttachmentToQuote(quoteId, file, description = '') {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), QUOTE_API_CONFIG.timeout);

        try {
            // Create FormData for multipart/form-data upload
            const formData = new FormData();
            formData.append('file', file);
            if (description) {
                formData.append('description', description);
            }

            const url = `${QUOTE_API_CONFIG.baseUrl}${QUOTE_API_CONFIG.endpoints.addAttachmentToQuote}/${encodeURIComponent(quoteId)}`;
            
            // Don't set Content-Type header - let browser set it with boundary for multipart/form-data
            const headers = {
                'Accept': 'application/json'
            };

            const response = await fetch(url, {
                method: 'PATCH',
                headers: headers,
                body: formData,
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
                try {
                    const errorData = await response.json();
                    console.log('Backend error details:', errorData);
                    if (errorData.message) {
                        errorMessage += ` - ${errorData.message}`;
                    }
                } catch (parseError) {
                    console.log('Could not parse error response as JSON');
                }
                throw new Error(errorMessage);
            }

            return response.status === 204 ? null : await response.json();

        } catch (error) {
            clearTimeout(timeoutId);

            if (error.name === 'AbortError') {
                throw new Error('Request timeout - please try again');
            }

            console.error('Add attachment API Error:', error);
            throw error;
        }
    }
}; 