// ProductCard component
import { Utils } from '../modules/utils.js';

export const ProductCard = {
    // Create a Tailwind card for a product
    create: (product) => {
        const lastUpdate = product.lastUpdate ? 
            Utils.formatDate(product.lastUpdate) : 
            'No update date';
        
        const description = product.description || 'No description available';
        const status = product.lifecycleStatus || 'Unknown';
        const name = product.name || 'Unnamed Product';

        return `
            <div class="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden product-card" data-product-id="${product.id || ''}">
                <div class="p-6">
                    <h3 class="text-lg font-semibold text-gray-900 mb-2">${name}</h3>
                    <p class="text-gray-600 text-sm mb-4 line-clamp-3">${description}</p>
                    
                    <div class="flex items-center justify-between mb-4">
                        <div class="flex items-center space-x-2">
                            <span class="text-sm text-gray-500">Status:</span>
                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${ProductCard.getStatusBadgeClass(status)}">${status}</span>
                        </div>
                    </div>
                    
                    <p class="text-xs text-gray-500 mb-4">
                        Last Update: ${lastUpdate}
                    </p>
                    
                    <div class="flex space-x-2">
                        <button 
                            type="button" 
                            class="flex-1 px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 hover:border-blue-300 transition-colors"
                            onclick="ProductActions.viewDetails('${product.id || ''}')"
                        >
                            View Details
                        </button>
                        <button 
                            type="button" 
                            class="flex-1 px-3 py-2 text-sm font-medium text-gray-600 bg-gray-50 border border-gray-200 rounded-md hover:bg-gray-100 hover:border-gray-300 transition-colors"
                            onclick="ProductActions.addToQuote('${product.id || ''}')"
                        >
                            Add to Quote
                        </button>
                    </div>
                </div>
            </div>
        `;
    },

    // Create a list item for compact view
    createListItem: (product) => {
        const lastUpdate = product.lastUpdate ? 
            Utils.formatDate(product.lastUpdate) : 
            'No update date';
        
        const description = product.description || 'No description available';
        const status = product.lifecycleStatus || 'Unknown';
        const name = product.name || 'Unnamed Product';

        return `
            <div class="bg-white border border-gray-200 rounded-md p-4 product-list-item" data-product-id="${product.id || ''}">
                <div class="flex justify-between items-start mb-2">
                    <h4 class="text-lg font-medium text-gray-900">${name}</h4>
                    <span class="text-sm text-gray-500">${lastUpdate}</span>
                </div>
                <p class="text-gray-600 text-sm mb-3">${description}</p>
                <div class="flex justify-between items-center">
                    <div class="flex items-center space-x-2">
                        <span class="text-sm text-gray-500">Status:</span>
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${ProductCard.getStatusBadgeClass(status)}">${status}</span>
                    </div>
                    <div class="flex space-x-2">
                        <button 
                            type="button" 
                            class="px-3 py-1 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded hover:bg-blue-100 transition-colors"
                            onclick="ProductActions.viewDetails('${product.id || ''}')"
                        >
                            Details
                        </button>
                        <button 
                            type="button" 
                            class="px-3 py-1 text-sm font-medium text-gray-600 bg-gray-50 border border-gray-200 rounded hover:bg-gray-100 transition-colors"
                            onclick="ProductActions.addToQuote('${product.id || ''}')"
                        >
                            Quote
                        </button>
                    </div>
                </div>
            </div>
        `;
    },

    // Get appropriate Tailwind badge class for status
    getStatusBadgeClass: (status) => {
        const statusLower = (status || '').toLowerCase();
        
        switch (statusLower) {
            case 'active':
            case 'launched':
                return 'bg-green-100 text-green-800';
            case 'retired':
            case 'obsolete':
                return 'bg-red-100 text-red-800';
            case 'in study':
            case 'in design':
                return 'bg-yellow-100 text-yellow-800';
            case 'in test':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    },

    // Create empty state for no products
    createEmptyState: () => {
        return `
            <div class="text-center py-12">
                <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                </svg>
                <h3 class="text-lg font-medium text-gray-900 mb-2">No Products Found</h3>
                <p class="text-gray-500 mb-4">There are no products available in the catalog at the moment.</p>
                <button class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors" onclick="window.location.reload()">
                    Refresh Page
                </button>
            </div>
        `;
    },

    // Create loading state
    createLoadingState: () => {
        return `
            <div class="text-center py-12">
                <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
                <h3 class="text-lg font-medium text-gray-900 mb-2">Loading Products...</h3>
                <p class="text-gray-500">Please wait while we fetch the product catalog.</p>
            </div>
        `;
    },

    // Create error state
    createErrorState: (errorMessage) => {
        return `
            <div class="bg-red-50 border border-red-200 rounded-lg p-6">
                <div class="flex items-center mb-4">
                    <svg class="h-6 w-6 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                    </svg>
                    <h3 class="text-lg font-medium text-red-800">Error Loading Products</h3>
                </div>
                <p class="text-red-700 mb-4">${errorMessage}</p>
                <button class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors" onclick="window.location.reload()">
                    Try Again
                </button>
            </div>
        `;
    }
}; 