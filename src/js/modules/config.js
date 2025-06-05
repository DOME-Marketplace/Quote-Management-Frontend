// Configuration module
//TODO CHANGE THIS URL TO BACKEND
export const API_CONFIG = {
    baseUrl: 'https://api.allorigins.win/get?url=' + encodeURIComponent('https://an-dhub-sbx.dome-project.eu/tmf-api/quoteManagement/v4/quote'),
    timeout: 15000, // 15 seconds
    retryDelay: 2000 // 2 seconds
};

export const APP_CONFIG = {
    autoRefreshInterval: 30000, // 30 seconds
    maxRetries: 3
}; 