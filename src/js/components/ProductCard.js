// ProductCard component
import { Utils } from '../modules/utils.js';

export const ProductCard = {
    // Create a Bootstrap card for a product
    create: (product) => {
        const lastUpdate = product.lastUpdate ? 
            Utils.formatDate(product.lastUpdate) : 
            'No update date';
        
        const description = product.description || 'No description available';
        const status = product.lifecycleStatus || 'Unknown';
        const name = product.name || 'Unnamed Product';

        return `
            <div class="col-md-6 col-lg-4 mb-4">
                <div class="card h-100 product-card" data-product-id="${product.id || ''}">
                    <div class="card-body">
                        <h5 class="card-title">${name}</h5>
                        <p class="card-text">${description}</p>
                        <p class="card-text">
                            <small class="text-muted">Status: 
                                <span class="badge ${ProductCard.getStatusBadgeClass(status)}">${status}</span>
                            </small>
                        </p>
                        <p class="card-text">
                            <small class="text-muted">Last Update: ${lastUpdate}</small>
                        </p>
                    </div>
                    <div class="card-footer">
                        <div class="btn-group w-100" role="group">
                            <button 
                                type="button" 
                                class="btn btn-outline-primary btn-sm"
                                onclick="ProductActions.viewDetails('${product.id || ''}')"
                            >
                                View Details
                            </button>
                            <button 
                                type="button" 
                                class="btn btn-outline-secondary btn-sm"
                                onclick="ProductActions.addToQuote('${product.id || ''}')"
                            >
                                Add to Quote
                            </button>
                        </div>
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
            <div class="list-group-item product-list-item" data-product-id="${product.id || ''}">
                <div class="d-flex w-100 justify-content-between">
                    <h6 class="mb-1">${name}</h6>
                    <small class="text-muted">${lastUpdate}</small>
                </div>
                <p class="mb-1">${description}</p>
                <div class="d-flex justify-content-between align-items-center">
                    <small>Status: 
                        <span class="badge ${ProductCard.getStatusBadgeClass(status)}">${status}</span>
                    </small>
                    <div class="btn-group btn-group-sm" role="group">
                        <button 
                            type="button" 
                            class="btn btn-outline-primary"
                            onclick="ProductActions.viewDetails('${product.id || ''}')"
                        >
                            Details
                        </button>
                        <button 
                            type="button" 
                            class="btn btn-outline-secondary"
                            onclick="ProductActions.addToQuote('${product.id || ''}')"
                        >
                            Quote
                        </button>
                    </div>
                </div>
            </div>
        `;
    },

    // Get appropriate Bootstrap badge class for status
    getStatusBadgeClass: (status) => {
        const statusLower = (status || '').toLowerCase();
        
        switch (statusLower) {
            case 'active':
            case 'launched':
                return 'bg-success';
            case 'retired':
            case 'obsolete':
                return 'bg-danger';
            case 'in study':
            case 'in design':
                return 'bg-warning';
            case 'in test':
                return 'bg-info';
            default:
                return 'bg-secondary';
        }
    },

    // Create empty state for no products
    createEmptyState: () => {
        return `
            <div class="col-12">
                <div class="text-center py-5">
                    <svg class="mb-3" width="48" height="48" fill="currentColor" class="text-muted">
                        <use xlink:href="#box-seam"></use>
                    </svg>
                    <h4 class="text-muted">No Products Found</h4>
                    <p class="text-muted">There are no products available in the catalog at the moment.</p>
                    <button class="btn btn-primary" onclick="window.location.reload()">
                        Refresh Page
                    </button>
                </div>
            </div>
        `;
    },

    // Create loading state
    createLoadingState: () => {
        return `
            <div class="col-12">
                <div class="text-center py-5">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                    <div class="mt-3">
                        <h5>Loading Products...</h5>
                        <p class="text-muted">Please wait while we fetch the product catalog.</p>
                    </div>
                </div>
            </div>
        `;
    },

    // Create error state
    createErrorState: (errorMessage) => {
        return `
            <div class="col-12">
                <div class="alert alert-danger" role="alert">
                    <h4 class="alert-heading">Error Loading Products</h4>
                    <p>${errorMessage}</p>
                    <hr>
                    <p class="mb-0">
                        <button class="btn btn-outline-danger" onclick="window.location.reload()">
                            Try Again
                        </button>
                    </p>
                </div>
            </div>
        `;
    }
}; 