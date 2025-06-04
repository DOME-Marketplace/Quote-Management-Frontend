// Legacy Quotes Dashboard JavaScript - DEPRECATED
// This file is kept for backward compatibility only
// The application has been restructured into modular components in src/js/

console.warn('quotes.js is deprecated. Please use the modular structure in src/js/');

// Redirect to the new modular version
if (typeof window !== 'undefined') {
    console.log('Loading modular quote management application...');
    
    // Simple check if we're in the right context
    const currentPage = window.location.pathname;
    
    if (currentPage.includes('index.html') || currentPage === '/') {
        // We're on the main page, the new modular app.js will handle everything
        console.log('Modular quote management will be loaded by src/js/app.js');
    } else {
        console.log('Please use the appropriate modular application for this page');
    }
}

// Legacy global variables for backward compatibility
window.LEGACY_QUOTES_JS_LOADED = true;

// Note: All functionality has been moved to:
// - src/js/app.js (main quotes application)
// - src/js/modules/ (core functionality modules)
// - src/js/components/ (reusable UI components)

/*
 * MIGRATION NOTES:
 * 
 * Old Structure:
 * - quotes.js (386 lines of mixed functionality)
 * 
 * New Modular Structure:
 * - src/js/app.js (main application coordinator)
 * - src/js/modules/api.js (API communication)
 * - src/js/modules/auth.js (authentication)
 * - src/js/modules/utils.js (utility functions)
 * - src/js/modules/dom.js (DOM manipulation)
 * - src/js/modules/stats.js (statistics)
 * - src/js/modules/Filter.js (filtering)
 * - src/js/modules/QuoteActions.js (user actions)
 * - src/js/modules/Renderer.js (UI rendering)
 * - src/js/components/QuoteRow.js (quote display component)
 * 
 * Benefits of new structure:
 * - Separation of concerns
 * - Easier testing and maintenance
 * - Better code organization
 * - Reusable components
 * - Modern ES6 modules
 */