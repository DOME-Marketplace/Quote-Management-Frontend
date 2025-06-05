// Filter module
import { DOM } from './dom.js';

export class Filter {
    constructor(onFilterChange) {
        this.allQuotes = [];
        this.filteredQuotes = [];
        this.onFilterChange = onFilterChange;
        this.currentFilters = {
            status: '',
            search: '',
            dateRange: null
        };
    }

    // Set all quotes data
    setQuotes(quotes) {
        this.allQuotes = quotes;
        this.apply();
    }

    // Apply current filters
    apply() {
        let filtered = [...this.allQuotes];

        // Apply status filter
        if (this.currentFilters.status) {
            filtered = this.filterByStatus(filtered, this.currentFilters.status);
        }

        // Apply search filter
        if (this.currentFilters.search) {
            filtered = this.filterBySearch(filtered, this.currentFilters.search);
        }

        // Apply date range filter
        if (this.currentFilters.dateRange) {
            filtered = this.filterByDateRange(filtered, this.currentFilters.dateRange);
        }

        this.filteredQuotes = filtered;
        
        // Notify parent component of filter change
        if (this.onFilterChange) {
            this.onFilterChange(this.filteredQuotes);
        }
    }

    // Filter by status
    filterByStatus(quotes, status) {
        if (!status) return quotes;

        return quotes.filter(quote => {
            if (status === 'pending') {
                return quote.quoteItem && quote.quoteItem.some(item => item.state === 'pending');
            }
            return quote.state === status;
        });
    }

    // Filter by search term
    filterBySearch(quotes, searchTerm) {
        if (!searchTerm) return quotes;

        const term = searchTerm.toLowerCase();
        return quotes.filter(quote => {
            const description = (quote.description || '').toLowerCase();
            const id = (quote.id || '').toLowerCase();
            
            return description.includes(term) || id.includes(term);
        });
    }

    // Filter by date range
    filterByDateRange(quotes, dateRange) {
        if (!dateRange || !dateRange.start || !dateRange.end) return quotes;

        return quotes.filter(quote => {
            if (!quote.quoteDate) return false;
            
            const quoteDate = new Date(quote.quoteDate);
            return quoteDate >= dateRange.start && quoteDate <= dateRange.end;
        });
    }

    // Set status filter
    setStatusFilter(status) {
        this.currentFilters.status = status;
        this.apply();
    }

    // Set search filter
    setSearchFilter(searchTerm) {
        this.currentFilters.search = searchTerm;
        this.apply();
    }

    // Set date range filter
    setDateRangeFilter(startDate, endDate) {
        this.currentFilters.dateRange = { start: startDate, end: endDate };
        this.apply();
    }

    // Clear all filters
    clearAll() {
        this.currentFilters = {
            status: '',
            search: '',
            dateRange: null
        };
        
        // Reset UI elements
        const statusFilter = DOM.getElementById('statusFilter');
        if (statusFilter) statusFilter.value = '';
        
        this.apply();
    }

    // Get current filter summary
    getFilterSummary() {
        const activeFilters = [];
        
        if (this.currentFilters.status) {
            activeFilters.push(`Status: ${this.currentFilters.status}`);
        }
        
        if (this.currentFilters.search) {
            activeFilters.push(`Search: "${this.currentFilters.search}"`);
        }
        
        if (this.currentFilters.dateRange) {
            activeFilters.push('Date Range: Applied');
        }
        
        return activeFilters.length > 0 ? activeFilters.join(', ') : 'No filters applied';
    }

    // Get filtered quotes
    getFilteredQuotes() {
        return this.filteredQuotes;
    }

    // Get filter statistics
    getStats() {
        return {
            total: this.allQuotes.length,
            filtered: this.filteredQuotes.length,
            percentage: this.allQuotes.length > 0 ? 
                Math.round((this.filteredQuotes.length / this.allQuotes.length) * 100) : 0
        };
    }
} 