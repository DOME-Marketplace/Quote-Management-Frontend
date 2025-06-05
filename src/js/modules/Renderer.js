// Renderer module
import { DOM } from './dom.js';
import { QuoteRow } from '../components/QuoteRow.js';

export const Renderer = {
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
        DOM.hideElement('loadingState');
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

    renderQuotes: (quotes) => {
        if (!Array.isArray(quotes) || quotes.length === 0) {
            Renderer.showEmptyState();
            return;
        }

        DOM.hideElement('emptyState');
        DOM.hideElement('errorState');
        DOM.hideElement('loadingState');
        DOM.showElement('quotesContainer');

        const quotesHTML = quotes.map(quote => QuoteRow.create(quote)).join('');
        DOM.updateHTML('quotesTableBody', quotesHTML);
    },

    // Render quotes in card view (for future use)
    renderQuotesAsCards: (quotes) => {
        if (!Array.isArray(quotes) || quotes.length === 0) {
            Renderer.showEmptyState();
            return;
        }

        DOM.hideElement('emptyState');
        DOM.hideElement('errorState');
        DOM.hideElement('loadingState');
        DOM.showElement('quotesContainer');

        const quotesHTML = quotes.map(quote => QuoteRow.createCard(quote)).join('');
        DOM.updateHTML('quotesTableBody', quotesHTML);
    },

    // Update view mode (table vs cards)
    setViewMode: (mode) => {
        const container = DOM.getElementById('quotesContainer');
        if (container) {
            container.setAttribute('data-view-mode', mode);
            // Add CSS classes based on mode
            if (mode === 'cards') {
                DOM.addClass('quotesTableBody', 'grid-view');
                DOM.removeClass('quotesTableBody', 'table-view');
            } else {
                DOM.addClass('quotesTableBody', 'table-view');
                DOM.removeClass('quotesTableBody', 'grid-view');
            }
        }
    },

    // Show loading indicator on specific element
    showElementLoading: (elementId) => {
        const element = DOM.getElementById(elementId);
        if (element) {
            element.classList.add('loading');
            element.setAttribute('aria-busy', 'true');
        }
    },

    // Hide loading indicator on specific element
    hideElementLoading: (elementId) => {
        const element = DOM.getElementById(elementId);
        if (element) {
            element.classList.remove('loading');
            element.setAttribute('aria-busy', 'false');
        }
    },

    // Show success message
    showSuccessMessage: (message, duration = 3000) => {
        const successElement = document.createElement('div');
        successElement.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg z-50';
        successElement.textContent = message;
        
        document.body.appendChild(successElement);
        
        setTimeout(() => {
            if (successElement.parentNode) {
                successElement.parentNode.removeChild(successElement);
            }
        }, duration);
    },

    // Show error message
    showErrorMessage: (message, duration = 5000) => {
        const errorElement = document.createElement('div');
        errorElement.className = 'fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-md shadow-lg z-50';
        errorElement.textContent = message;
        
        document.body.appendChild(errorElement);
        
        setTimeout(() => {
            if (errorElement.parentNode) {
                errorElement.parentNode.removeChild(errorElement);
            }
        }, duration);
    },

    // Show info message
    showInfoMessage: (message, duration = 3000) => {
        const infoElement = document.createElement('div');
        infoElement.className = 'fixed top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-md shadow-lg z-50';
        infoElement.textContent = message;
        
        document.body.appendChild(infoElement);
        
        setTimeout(() => {
            if (infoElement.parentNode) {
                infoElement.parentNode.removeChild(infoElement);
            }
        }, duration);
    }
}; 