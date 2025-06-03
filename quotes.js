// Quotes Dashboard JavaScript - Versione Funzionante

// Global variables
let allQuotes = [];
let filteredQuotes = [];
let isLoading = false;

// API Configuration - Usa proxy pubblico per evitare CORS
const API_CONFIG = {
    baseUrl: 'https://api.allorigins.win/get?url=' + encodeURIComponent('https://an-dhub-sbx.dome-project.eu/tmf-api/quoteManagement/v4/quote'),
    timeout: 15000, // 15 seconds
    retryDelay: 2000 // 2 seconds
};

// Utility functions
const Utils = {
    // Extract short ID from full URN
    extractShortId: (fullId) => {
        return fullId.split(':').pop().substring(0, 8);
    },

    // Format date to readable string
    formatDate: (dateString) => {
        if (!dateString) return 'Not set';

        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch (error) {
            console.warn('Invalid date:', dateString);
            return 'Invalid date';
        }
    },

    // Calculate total quantity from quote items
    calculateTotalQuantity: (quoteItems) => {
        if (!Array.isArray(quoteItems)) return 0;
        return quoteItems.reduce((total, item) => total + (item.quantity || 0), 0);
    },

    // Get unique states from quote items
    getItemStates: (quoteItems) => {
        if (!Array.isArray(quoteItems)) return [];
        return [...new Set(quoteItems.map(item => item.state).filter(Boolean))];
    }
};

// API functions
const API = {
    // Fetch quotes with CORS bypass
    async fetchQuotes() {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout);

        try {
            console.log('Fetching quotes via proxy...');

            const response = await fetch(API_CONFIG.baseUrl, {
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

            // Il proxy allorigins restituisce i dati in .contents
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
    }
};

// DOM manipulation functions
const DOM = {
    // Get element by ID with error handling
    getElementById: (id) => {
        const element = document.getElementById(id);
        if (!element) {
            console.error(`Element with ID '${id}' not found`);
        }
        return element;
    },

    // Show element
    showElement: (id) => {
        const element = DOM.getElementById(id);
        if (element) {
            element.classList.remove('hidden');
        }
    },

    // Hide element
    hideElement: (id) => {
        const element = DOM.getElementById(id);
        if (element) {
            element.classList.add('hidden');
        }
    },

    // Update text content
    updateText: (id, text) => {
        const element = DOM.getElementById(id);
        if (element) {
            element.textContent = text;
        }
    },

    // Update innerHTML
    updateHTML: (id, html) => {
        const element = DOM.getElementById(id);
        if (element) {
            element.innerHTML = html;
        }
    }
};

// Statistics calculator
const Stats = {
    calculate: (quotes) => {
        const total = quotes.length;
        const inProgress = quotes.filter(q => q.state === 'inProgress').length;
        const pending = quotes.filter(q =>
            q.quoteItem && q.quoteItem.some(item => item.state === 'pending')
        ).length;
        const completed = quotes.filter(q => q.state === 'completed').length;

        return { total, inProgress, pending, completed };
    },

    update: (quotes) => {
        const stats = Stats.calculate(quotes);

        DOM.updateText('totalQuotes', stats.total);
        DOM.updateText('inProgressQuotes', stats.inProgress);
        DOM.updateText('pendingQuotes', stats.pending);
        DOM.updateText('completedQuotes', stats.completed);
    }
};

// Quote row generator (invece di card)
const QuoteRow = {
    create: (quote) => {
        const quoteId = Utils.extractShortId(quote.id);
        const quoteDate = Utils.formatDate(quote.quoteDate);
        const primaryState = quote.state || 'unknown';
        const description = quote.description || 'No description';

        return `
            <div class="grid grid-cols-5 gap-4 items-center px-6 py-4 border-b border-gray-100 hover:bg-gray-50 transition-colors" data-quote-id="${quote.id}">
                <div class="text-sm font-medium text-gray-900">
                    Quote ${quoteId}
                </div>
                <div>
                    <span class="status-badge status-${primaryState}">
                        ${primaryState}
                    </span>
                </div>
                <div class="text-sm text-gray-700 truncate" title="${description}">
                    ${description}
                </div>
                <div class="text-sm text-gray-600">
                    ${quoteDate}
                </div>
                <div class="flex space-x-2">
                    <button
                        class="px-3 py-1 text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors"
                        onclick="QuoteActions.viewDetails('${quote.id}')"
                        aria-label="View details for quote ${quoteId}"
                    >
                        View Details
                    </button>
                    <button
                        class="px-3 py-1 text-xs font-medium text-gray-600 hover:text-gray-800 transition-colors"
                        onclick="QuoteActions.edit('${quote.id}')"
                        aria-label="Edit quote ${quoteId}"
                    >
                        Edit
                    </button>
                </div>
            </div>
        `;
    }
};

// Quote actions
const QuoteActions = {
    viewDetails: (quoteId) => {
        console.log('View details for quote:', quoteId);
        alert(`View details for quote: ${Utils.extractShortId(quoteId)}`);
    },

    edit: (quoteId) => {
        console.log('Edit quote:', quoteId);
        alert(`Edit quote: ${Utils.extractShortId(quoteId)}`);
    }
};

// Filter functionality
const Filter = {
    apply: () => {
        const statusFilter = DOM.getElementById('statusFilter')?.value || '';

        if (!statusFilter) {
            filteredQuotes = [...allQuotes];
        } else {
            filteredQuotes = allQuotes.filter(quote => {
                if (statusFilter === 'pending') {
                    return quote.quoteItem && quote.quoteItem.some(item => item.state === 'pending');
                }
                return quote.state === statusFilter;
            });
        }

        Renderer.renderQuotes();
    }
};

// Rendering functions
const Renderer = {
    showLoadingState: () => {
        DOM.showElement('loadingState');
        DOM.hideElement('quotesContainer');
        DOM.hideElement('emptyState');
        DOM.hideElement('errorState');
    },

    hideLoadingState: () => {
        DOM.hideElement('loadingState');
    },

    showEmptyState: () => {
        DOM.showElement('emptyState');
        DOM.hideElement('quotesContainer');
        DOM.hideElement('errorState');
    },

    showErrorState: (errorMessage = '') => {
        DOM.showElement('errorState');
        DOM.hideElement('loadingState');
        DOM.hideElement('quotesContainer');
        DOM.hideElement('emptyState');

        // Update error message if provided
        if (errorMessage) {
            const errorStateElement = DOM.getElementById('errorState');
            if (errorStateElement) {
                const errorP = errorStateElement.querySelector('p');
                if (errorP) {
                    errorP.textContent = errorMessage;
                }
            }
        }
    },

    renderQuotes: () => {
        if (filteredQuotes.length === 0) {
            Renderer.showEmptyState();
            return;
        }

        DOM.hideElement('emptyState');
        DOM.hideElement('errorState');
        DOM.showElement('quotesContainer');

        const quotesHTML = filteredQuotes.map(quote => QuoteRow.create(quote)).join('');
        DOM.updateHTML('quotesTableBody', quotesHTML);
    }
};

// Main application functions
const App = {
    // Load quotes from API
    loadQuotes: async () => {
        if (isLoading) {
            console.log('Already loading quotes...');
            return;
        }

        isLoading = true;

        try {
            Renderer.showLoadingState();

            const quotes = await API.fetchQuotes();

            allQuotes = quotes;
            filteredQuotes = [...allQuotes];

            Stats.update(allQuotes);
            Renderer.renderQuotes();
            Renderer.hideLoadingState();

            console.log(`Dashboard updated with ${quotes.length} quotes`);

        } catch (error) {
            console.error('Error loading quotes:', error);
            let errorMessage = 'Unable to load quotes. Please try again.';

            if (error.message.includes('timeout')) {
                errorMessage = 'Request timeout. Please check your internet connection.';
            } else if (error.message.includes('Failed to fetch')) {
                errorMessage = 'Network error. Please check your connection.';
            }

            Renderer.showErrorState(errorMessage);
        } finally {
            isLoading = false;
        }
    },

    // Initialize the application
    init: () => {
        console.log('Initializing Quotes Dashboard...');

        // Set up event listeners
        const statusFilter = DOM.getElementById('statusFilter');
        if (statusFilter) {
            statusFilter.addEventListener('change', Filter.apply);
        }

        // Load initial data
        App.loadQuotes();

        // Set up auto-refresh (every 30 seconds)
        setInterval(App.loadQuotes, 30000);

        console.log('Dashboard initialized successfully');
    }
};

// Global functions (for HTML onclick handlers)
window.loadQuotes = App.loadQuotes;

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', App.init);

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        App.loadQuotes();
    }
});

// Handle online/offline events
window.addEventListener('online', () => {
    console.log('Connection restored, refreshing data...');
    App.loadQuotes();
});

window.addEventListener('offline', () => {
    console.log('Connection lost');
});