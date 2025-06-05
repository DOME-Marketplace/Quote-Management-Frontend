// Utility functions module
export const Utils = {
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
    },

    // Debounce function for performance optimization
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}; 