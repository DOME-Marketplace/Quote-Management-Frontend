// Statistics module
import { DOM } from './dom.js';

export const Stats = {
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
    },

    // Get stats by date range (for future use)
    getStatsByDateRange: (quotes, startDate, endDate) => {
        const filteredQuotes = quotes.filter(quote => {
            const quoteDate = new Date(quote.quoteDate);
            return quoteDate >= startDate && quoteDate <= endDate;
        });
        return Stats.calculate(filteredQuotes);
    },

    // Get most active status
    getMostActiveStatus: (quotes) => {
        const stats = Stats.calculate(quotes);
        const statEntries = Object.entries(stats).filter(([key]) => key !== 'total');
        return statEntries.reduce((max, [status, count]) => 
            count > max.count ? { status, count } : max, 
            { status: 'none', count: 0 }
        );
    }
}; 