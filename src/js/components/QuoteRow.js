// QuoteRow component
import { Utils } from '../modules/utils.js';
import { Auth } from '../modules/auth.js';

export const QuoteRow = {
    create: (quote) => {
        const quoteId = Utils.extractShortId(quote.id);
        const quoteDate = Utils.formatDate(quote.quoteDate);
        const primaryState = quote.state || 'unknown';
        const description = quote.description || 'No description';
        
        // Check if quote has attachment
        const hasAttachment = Array.isArray(quote.quoteItem) && 
                            quote.quoteItem.some(qi => qi.attachment && qi.attachment.length > 0);

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
                        onclick="window.QuoteActions.viewDetails('${quote.id}')"
                        aria-label="View details for quote ${quoteId}"
                    >
                        View Details
                    </button>
                    <button
                        class="px-3 py-1 text-xs font-medium text-gray-600 hover:text-gray-800 transition-colors"
                        onclick="window.QuoteActions.edit('${quote.id}')"
                        aria-label="Edit quote ${quoteId}"
                    >
                        Edit
                    </button>
                    <button
                        class="p-2 text-xs text-blue-500 hover:text-blue-700 transition-colors"
                        title="Open chat"
                        onclick="window.QuoteActions.openChat('${quote.id}')"
                        aria-label="Open chat for quote ${quoteId}"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.77 9.77 0 01-4-.8L3 21l1.8-4A7.96 7.96 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                    </button>
                    ${hasAttachment ? `
                    <button
                        class="p-2 text-xs text-purple-500 hover:text-purple-700 transition-colors"
                        title="Download attachment"
                        onclick="window.QuoteActions.downloadAttachment('${quote.id}')"
                        aria-label="Download attachment for quote ${quoteId}"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </button>
                    ` : ''}
                    ${Auth.isProvider() ? `
                    <button
                        class="p-2 text-xs text-green-500 hover:text-green-700 transition-colors"
                        title="Add attachment"
                        onclick="window.QuoteActions.addAttachment('${quote.id}')"
                        aria-label="Add attachment to quote ${quoteId}"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                        </svg>
                    </button>
                    ` : ''}
                </div>
            </div>
        `;
    },

    // Create a detailed quote card view (for future use)
    createCard: (quote) => {
        const quoteId = Utils.extractShortId(quote.id);
        const quoteDate = Utils.formatDate(quote.quoteDate);
        const primaryState = quote.state || 'unknown';
        const description = quote.description || 'No description';
        const totalQuantity = Utils.calculateTotalQuantity(quote.quoteItem);
        
        // Check if quote has attachment
        const hasAttachment = Array.isArray(quote.quoteItem) && 
                            quote.quoteItem.some(qi => qi.attachment && qi.attachment.length > 0);

        return `
            <div class="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow" data-quote-id="${quote.id}">
                <div class="flex justify-between items-start mb-4">
                    <h3 class="text-lg font-semibold text-gray-900">Quote ${quoteId}</h3>
                    <span class="status-badge status-${primaryState}">${primaryState}</span>
                </div>
                <p class="text-gray-700 mb-3">${description}</p>
                <div class="flex justify-between items-center text-sm text-gray-600">
                    <span>Date: ${quoteDate}</span>
                    <span>Items: ${totalQuantity}</span>
                </div>
                <div class="mt-4 flex space-x-2">
                    <button
                        class="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
                        onclick="window.QuoteActions.viewDetails('${quote.id}')"
                    >
                        View Details
                    </button>
                    <button
                        class="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
                        onclick="window.QuoteActions.edit('${quote.id}')"
                    >
                        Edit
                    </button>
                    <button
                        class="p-2 text-xs text-blue-500 hover:text-blue-700 transition-colors"
                        title="Open chat"
                        onclick="window.QuoteActions.openChat('${quote.id}')"
                        aria-label="Open chat for quote ${quoteId}"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.77 9.77 0 01-4-.8L3 21l1.8-4A7.96 7.96 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                    </button>
                    ${hasAttachment ? `
                    <button
                        class="p-2 text-xs text-purple-500 hover:text-purple-700 transition-colors"
                        title="Download attachment"
                        onclick="window.QuoteActions.downloadAttachment('${quote.id}')"
                        aria-label="Download attachment for quote ${quoteId}"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </button>
                    ` : ''}
                    ${Auth.isProvider() ? `
                    <button
                        class="p-2 text-xs text-green-500 hover:text-green-700 transition-colors"
                        title="Add attachment"
                        onclick="window.QuoteActions.addAttachment('${quote.id}')"
                        aria-label="Add attachment to quote ${quoteId}"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                        </svg>
                    </button>
                    ` : ''}
                </div>
            </div>
        `;
    }
}; 