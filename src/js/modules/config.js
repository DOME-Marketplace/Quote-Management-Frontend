// Configuration module
//TODO CHANGE THIS URL TO BACKEND
export const API_CONFIG = {
    baseUrl: 'https://api.allorigins.win/get?url=' + encodeURIComponent('https://an-dhub-sbx.dome-project.eu/tmf-api/quoteManagement/v4/quote'),
    timeout: 15000, // 15 seconds
    retryDelay: 2000 // 2 seconds
};

// Quote Management API Configuration
export const QUOTE_API_CONFIG = {
    baseUrl: 'http://localhost:8080/quoteManagement',
    endpoints: {
        createQuote: '/createQuote',
        getQuotes: '/quotes',
        getQuoteById: '/quote',
        updateQuote: '/updateQuote',
        deleteQuote: '/deleteQuote'
    },
    timeout: 15000, // 15 seconds
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
};

export const APP_CONFIG = {
    autoRefreshInterval: 30000, // 30 seconds
    maxRetries: 3
}; 