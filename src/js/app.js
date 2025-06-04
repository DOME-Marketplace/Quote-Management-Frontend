// Main application file
import { API } from './modules/api.js';
import { DOM } from './modules/dom.js';
import { Stats } from './modules/stats.js';
import { Renderer } from './modules/Renderer.js';
import { Filter } from './modules/Filter.js';
import { QuoteActions } from './modules/QuoteActions.js';
import { Auth } from './modules/auth.js';
import { APP_CONFIG } from './modules/config.js';

// Application state
const AppState = {
    allQuotes: [],
    isLoading: false,
    filter: null,
    autoRefreshInterval: null
};

// Main application class
class QuoteManagementApp {
    constructor() {
        this.init();
    }

    // Initialize the application
    async init() {
        console.log('Initializing Quotes Dashboard...');

        // Check authentication
        const authResult = Auth.initPage({
            requireAuth: true,
            onAuth: (username) => {
                Auth.updateUserDisplay();
                console.log(`Quotes dashboard loaded for user: ${username}`);
            }
        });

        if (!authResult) return; // Redirected to login

        // Initialize filter with callback
        AppState.filter = new Filter((filteredQuotes) => {
            this.handleFilterChange(filteredQuotes);
        });

        // Set up event listeners
        this.setupEventListeners();

        // Make QuoteActions available globally for onclick handlers
        window.QuoteActions = QuoteActions;

        // Load initial data
        await this.loadQuotes();

        // Set up auto-refresh
        this.setupAutoRefresh();

        console.log('Dashboard initialized successfully');
    }

    // Set up event listeners
    setupEventListeners() {
        // Status filter change
        DOM.addEventListener('statusFilter', 'change', (event) => {
            AppState.filter.setStatusFilter(event.target.value);
        });

        // Handle page visibility changes
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                this.loadQuotes();
            }
        });

        // Handle online/offline events
        window.addEventListener('online', () => {
            console.log('Connection restored, refreshing data...');
            Renderer.showInfoMessage('Connection restored');
            this.loadQuotes();
        });

        window.addEventListener('offline', () => {
            console.log('Connection lost');
            Renderer.showErrorMessage('Connection lost. Data may not be up to date.');
        });

        // Handle window beforeunload for cleanup
        window.addEventListener('beforeunload', () => {
            this.cleanup();
        });
    }

    // Load quotes from API
    async loadQuotes() {
        if (AppState.isLoading) {
            console.log('Already loading quotes...');
            return;
        }

        AppState.isLoading = true;

        try {
            Renderer.showLoadingState();

            const quotes = await API.fetchQuotes();

            AppState.allQuotes = quotes;
            AppState.filter.setQuotes(quotes);

            Stats.update(quotes);
            Renderer.hideLoadingState();

            console.log(`Dashboard updated with ${quotes.length} quotes`);

        } catch (error) {
            console.error('Error loading quotes:', error);
            this.handleLoadError(error);
        } finally {
            AppState.isLoading = false;
        }
    }

    // Handle filter changes
    handleFilterChange(filteredQuotes) {
        Renderer.renderQuotes(filteredQuotes);
        Stats.update(filteredQuotes);
        
        // Log filter activity
        const filterStats = AppState.filter.getStats();
        console.log(`Filter applied: ${filterStats.filtered}/${filterStats.total} quotes displayed`);
    }

    // Handle load errors
    handleLoadError(error) {
        let errorMessage = 'Unable to load quotes. Please try again.';

        if (error.message.includes('timeout')) {
            errorMessage = 'Request timeout. Please check your internet connection.';
        } else if (error.message.includes('Failed to fetch')) {
            errorMessage = 'Network error. Please check your connection.';
        }

        Renderer.showErrorState(errorMessage);
    }

    // Set up auto-refresh
    setupAutoRefresh() {
        if (AppState.autoRefreshInterval) {
            clearInterval(AppState.autoRefreshInterval);
        }

        AppState.autoRefreshInterval = setInterval(() => {
            // Only auto-refresh if page is visible and not already loading
            if (!document.hidden && !AppState.isLoading) {
                console.log('Auto-refreshing quotes...');
                this.loadQuotes();
            }
        }, APP_CONFIG.autoRefreshInterval);
    }

    // Refresh data manually
    async refresh() {
        await this.loadQuotes();
        Renderer.showSuccessMessage('Data refreshed successfully');
    }

    // Clear all filters
    clearFilters() {
        AppState.filter.clearAll();
        Renderer.showInfoMessage('Filters cleared');
    }

    // Get application statistics
    getAppStats() {
        return {
            totalQuotes: AppState.allQuotes.length,
            filterStats: AppState.filter.getStats(),
            isLoading: AppState.isLoading,
            lastRefresh: new Date().toISOString()
        };
    }

    // Export data (future implementation)
    exportData(format = 'json') {
        const filteredQuotes = AppState.filter.getFilteredQuotes();
        console.log(`Exporting ${filteredQuotes.length} quotes in ${format} format`);
        
        // Future implementation for different export formats
        if (format === 'json') {
            const dataStr = JSON.stringify(filteredQuotes, null, 2);
            const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
            
            const exportFileDefaultName = `quotes-export-${new Date().toISOString().split('T')[0]}.json`;
            
            const linkElement = document.createElement('a');
            linkElement.setAttribute('href', dataUri);
            linkElement.setAttribute('download', exportFileDefaultName);
            linkElement.click();
        }
    }

    // Cleanup resources
    cleanup() {
        if (AppState.autoRefreshInterval) {
            clearInterval(AppState.autoRefreshInterval);
            AppState.autoRefreshInterval = null;
        }
        console.log('Application cleanup completed');
    }
}

// Global functions for HTML onclick handlers
window.loadQuotes = () => app.loadQuotes();
window.refreshData = () => app.refresh();
window.clearFilters = () => app.clearFilters();
window.exportData = (format) => app.exportData(format);
window.handleLogout = () => {
    Auth.logout();
    window.location.href = 'login.html';
};

// Initialize application when DOM is ready
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new QuoteManagementApp();
});

// Export for potential external use
export { QuoteManagementApp }; 