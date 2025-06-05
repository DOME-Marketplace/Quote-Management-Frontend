// QuoteRow component
import { Utils } from '../modules/utils.js';
import { Auth } from '../modules/auth.js';

export const QuoteRow = {
    create: (quote) => {
        const quoteId = Utils.extractShortId(quote.id);
        const quoteDate = Utils.formatDate(quote.quoteDate);
        
        // Get the actual quoteItem status instead of quote.state
        let primaryState = 'unknown';
        if (Array.isArray(quote.quoteItem) && quote.quoteItem.length > 0) {
            primaryState = quote.quoteItem[0].state || 'unknown';
        }
        
        const description = quote.description || 'No description';
        
        // Check if quote has attachment
        const hasAttachment = Array.isArray(quote.quoteItem) && 
                            quote.quoteItem.some(qi => qi.attachment && qi.attachment.length > 0);

        // Check quote status
        const isCancelled = quote.quoteItem && quote.quoteItem.some(item => item.state === 'cancelled');
        const isAccepted = quote.quoteItem && quote.quoteItem.some(item => item.state === 'accepted');
        const isFinalized = isCancelled || isAccepted;
        
        // Style classes for disabled buttons
        const disabledClass = isFinalized ? 'opacity-50 cursor-not-allowed pointer-events-none' : '';
        
        // For accepted quotes: View Details and Chat remain functional
        // For cancelled quotes: all buttons are disabled
        const isButtonDisabled = (buttonType) => {
            if (isCancelled) return true; // All buttons disabled for cancelled quotes
            if (isAccepted && (buttonType === 'viewDetails' || buttonType === 'chat')) return false; // Keep these functional for accepted
            return isFinalized; // Other buttons disabled for both accepted/cancelled
        };
        
        const getButtonClass = (buttonType) => {
            if (isButtonDisabled(buttonType)) {
                return 'px-3 py-1 text-xs font-medium text-gray-400 cursor-not-allowed';
            }
            return 'px-3 py-1 text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors';
        };
        
        const getIconButtonClass = (buttonType, normalColor) => {
            if (isButtonDisabled(buttonType)) {
                return 'p-2 text-xs text-gray-400 cursor-not-allowed';
            }
            return `p-2 text-xs ${normalColor} cursor-pointer`;
        };

        return `
            <div class="grid grid-cols-5 gap-4 items-center px-6 py-4 border-b border-gray-100 ${isFinalized ? 'bg-gray-50' : 'hover:bg-gray-50'} transition-colors" data-quote-id="${quote.id}">
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
                        class="${getButtonClass('viewDetails')}"
                        ${isButtonDisabled('viewDetails') ? 'disabled' : `onclick="window.QuoteActions.viewDetails('${quote.id}')"`}
                        aria-label="View details for quote ${quoteId}"
                        ${isButtonDisabled('viewDetails') ? `title="Action disabled - quote is ${isCancelled ? 'cancelled' : 'accepted'}"` : ''}
                    >
                        View Details
                    </button>
                    <button
                        class="${isButtonDisabled('edit') ? 'px-3 py-1 text-xs font-medium text-gray-400 cursor-not-allowed' : 'px-3 py-1 text-xs font-medium text-gray-600 hover:text-gray-800 transition-colors'}"
                        ${isButtonDisabled('edit') ? 'disabled' : `onclick="window.QuoteActions.edit('${quote.id}')"`}
                        aria-label="Edit quote ${quoteId}"
                        ${isButtonDisabled('edit') ? `title="Action disabled - quote is ${isCancelled ? 'cancelled' : 'accepted'}"` : ''}
                    >
                        Edit
                    </button>
                    <button
                        class="${getIconButtonClass('chat', 'text-blue-500 hover:text-blue-700')}"
                        title="Chat"
                        ${isButtonDisabled('chat') ? 'disabled' : `onclick="window.QuoteActions.openChat('${quote.id}')"`}
                        aria-label="Open chat for quote ${quoteId}"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.77 9.77 0 01-4-.8L3 21l1.8-4A7.96 7.96 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                    </button>
                    
                    ${hasAttachment ? `
                    <button
                        class="${getIconButtonClass('downloadAttachment', 'text-purple-500 hover:text-purple-700')}"
                        title="Download attachment"
                        ${isButtonDisabled('downloadAttachment') ? 'disabled' : `onclick="window.QuoteActions.downloadAttachment('${quote.id}')"`}
                        aria-label="Download attachment for quote ${quoteId}"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </button>
                    ` : ''}
                    ${Auth.isProvider() ? `
                    <button
                        class="${getIconButtonClass('addAttachment', 'text-green-500 hover:text-green-700')}"
                        title="Add attachment"
                        ${isButtonDisabled('addAttachment') ? 'disabled' : `onclick="window.QuoteActions.addAttachment('${quote.id}')"`}
                        aria-label="Add attachment to quote ${quoteId}"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                        </svg>
                    </button>
                    ` : ''}
                    
                    ${!isFinalized ? `
                    <button
                        class="${getIconButtonClass('accept', 'text-emerald-600 hover:text-emerald-700 transition-colors')}"
                        title="Accept quote"
                        ${isButtonDisabled('accept') ? 'disabled' : `onclick="window.QuoteActions.accept('${quote.id}')"`}
                        aria-label="Accept quote ${quoteId}"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                        </svg>
                    </button>
                    <button
                        class="${getIconButtonClass('cancel', 'text-red-500 hover:text-red-700 transition-colors')}"
                        title="Cancel quote"
                        ${isButtonDisabled('cancel') ? 'disabled' : `onclick="window.QuoteActions.cancel('${quote.id}')"`}
                        aria-label="Cancel quote ${quoteId}"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                    ` : `
                    <button
                        class="p-2 text-xs text-gray-400 cursor-not-allowed"
                        title="Quote is already ${isCancelled ? 'cancelled' : 'accepted'}"
                        disabled
                        aria-label="Quote ${quoteId} is ${isCancelled ? 'cancelled' : 'accepted'}"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${isCancelled ? 'M6 18L18 6M6 6l12 12' : 'M5 13l4 4L19 7'}" />
                        </svg>
                    </button>
                    `}
                </div>
            </div>
        `;
    },

    // Create a detailed quote card view (for future use)
    createCard: (quote) => {
        const quoteId = Utils.extractShortId(quote.id);
        const quoteDate = Utils.formatDate(quote.quoteDate);
        
        // Get the actual quoteItem status instead of quote.state
        let primaryState = 'unknown';
        if (Array.isArray(quote.quoteItem) && quote.quoteItem.length > 0) {
            primaryState = quote.quoteItem[0].state || 'unknown';
        }
        
        const description = quote.description || 'No description';
        const totalQuantity = Utils.calculateTotalQuantity(quote.quoteItem);
        
        // Check if quote has attachment
        const hasAttachment = Array.isArray(quote.quoteItem) && 
                            quote.quoteItem.some(qi => qi.attachment && qi.attachment.length > 0);

        // Check quote status
        const isCancelled = quote.quoteItem && quote.quoteItem.some(item => item.state === 'cancelled');
        const isAccepted = quote.quoteItem && quote.quoteItem.some(item => item.state === 'accepted');
        const isFinalized = isCancelled || isAccepted;
        
        // For accepted quotes: View Details and Chat remain functional
        // For cancelled quotes: all buttons are disabled
        const isButtonDisabled = (buttonType) => {
            if (isCancelled) return true; // All buttons disabled for cancelled quotes
            if (isAccepted && (buttonType === 'viewDetails' || buttonType === 'chat')) return false; // Keep these functional for accepted
            return isFinalized; // Other buttons disabled for both accepted/cancelled
        };
        
        const getButtonClass = (buttonType) => {
            if (isButtonDisabled(buttonType)) {
                return 'px-4 py-2 text-sm font-medium text-gray-400 cursor-not-allowed';
            }
            return 'px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors';
        };
        
        const getIconButtonClass = (buttonType, normalColor) => {
            if (isButtonDisabled(buttonType)) {
                return 'p-2 text-xs text-gray-400 cursor-not-allowed';
            }
            return `p-2 text-xs ${normalColor} cursor-pointer`;
        };

        return `
            <div class="bg-white rounded-lg border border-gray-200 p-6 ${isFinalized ? 'opacity-75' : 'hover:shadow-md'} transition-shadow" data-quote-id="${quote.id}">
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
                        class="${getButtonClass('viewDetails')}"
                        ${isButtonDisabled('viewDetails') ? 'disabled' : `onclick="window.QuoteActions.viewDetails('${quote.id}')"`}
                        ${isButtonDisabled('viewDetails') ? `title="Action disabled - quote is ${isCancelled ? 'cancelled' : 'accepted'}"` : ''}
                    >
                        View Details
                    </button>
                    <button
                        class="${getButtonClass('edit')}"
                        ${isButtonDisabled('edit') ? 'disabled' : `onclick="window.QuoteActions.edit('${quote.id}')"`}
                        ${isButtonDisabled('edit') ? `title="Action disabled - quote is ${isCancelled ? 'cancelled' : 'accepted'}"` : ''}
                    >
                        Edit
                    </button>
                    <button
                        class="${getIconButtonClass('chat', 'text-blue-500 hover:text-blue-700')}"
                        title="Chat"
                        ${isButtonDisabled('chat') ? 'disabled' : `onclick="window.QuoteActions.openChat('${quote.id}')"`}
                        aria-label="Open chat for quote ${quoteId}"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.77 9.77 0 01-4-.8L3 21l1.8-4A7.96 7.96 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                    </button>
                    ${hasAttachment ? `
                    <button
                        class="${getIconButtonClass('downloadAttachment', 'text-purple-500 hover:text-purple-700')}"
                        title="Download attachment"
                        ${isButtonDisabled('downloadAttachment') ? 'disabled' : `onclick="window.QuoteActions.downloadAttachment('${quote.id}')"`}
                        aria-label="Download attachment for quote ${quoteId}"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </button>
                    ` : ''}
                    ${Auth.isProvider() ? `
                    <button
                        class="${getIconButtonClass('addAttachment', 'text-green-500 hover:text-green-700')}"
                        title="Add attachment"
                        ${isButtonDisabled('addAttachment') ? 'disabled' : `onclick="window.QuoteActions.addAttachment('${quote.id}')"`}
                        aria-label="Add attachment to quote ${quoteId}"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                        </svg>
                    </button>
                    ` : ''}
                    
                    ${!isFinalized ? `
                    <button
                        class="${getIconButtonClass('accept', 'text-emerald-600 hover:text-emerald-700 transition-colors')}"
                        title="Accept quote"
                        ${isButtonDisabled('accept') ? 'disabled' : `onclick="window.QuoteActions.accept('${quote.id}')"`}
                        aria-label="Accept quote ${quoteId}"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                        </svg>
                    </button>
                    <button
                        class="${getIconButtonClass('cancel', 'text-red-500 hover:text-red-700 transition-colors')}"
                        title="Cancel quote"
                        ${isButtonDisabled('cancel') ? 'disabled' : `onclick="window.QuoteActions.cancel('${quote.id}')"`}
                        aria-label="Cancel quote ${quoteId}"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                    ` : `
                    <button
                        class="p-2 text-xs text-gray-400 cursor-not-allowed"
                        title="Quote is already ${isCancelled ? 'cancelled' : 'accepted'}"
                        disabled
                        aria-label="Quote ${quoteId} is ${isCancelled ? 'cancelled' : 'accepted'}"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${isCancelled ? 'M6 18L18 6M6 6l12 12' : 'M5 13l4 4L19 7'}" />
                        </svg>
                    </button>
                    `}
                </div>
            </div>
        `;
    }
}; 