// Product Actions module
import { Modal } from '../components/Modal.js';
import { QuoteAPI } from './quoteApi.js';

export const ProductActions = {
    viewDetails: (productId) => {
        console.log('View product details:', productId);
        
        // Find product in global state
        let product = null;
        if (window.ProductAppState && window.ProductAppState.allProducts) {
            product = window.ProductAppState.allProducts.find(p => p.id === productId);
        }
        
        if (!product) {
            // Fallback: search in DOM data attributes if state not available
            const productCard = document.querySelector(`[data-product-id="${productId}"]`);
            if (productCard) {
                // Try to reconstruct basic product info from card
                const name = productCard.querySelector('h3, h4')?.textContent || 'Unknown Product';
                const description = productCard.querySelector('p')?.textContent || 'No description available';
                product = {
                    id: productId,
                    name: name,
                    description: description,
                    lifecycleStatus: 'Unknown',
                    lastUpdate: null
                };
            }
        }
        
        if (product) {
            const content = Modal.createProductDetailsContent(product);
            Modal.show(content, {
                title: `Product Details - ${product.name}`,
                size: '4xl'
            });
        } else {
            // Fallback alert if product not found
            alert(`Product details not available for ID: ${productId}`);
        }
    },

    addToQuote: (productId) => {
        console.log('Add product to quote:', productId);
        
        // Find product in global state
        let product = null;
        if (window.ProductAppState && window.ProductAppState.allProducts) {
            product = window.ProductAppState.allProducts.find(p => p.id === productId);
        }
        
        if (!product) {
            // Fallback: search in DOM data attributes if state not available
            const productCard = document.querySelector(`[data-product-id="${productId}"]`);
            if (productCard) {
                // Try to reconstruct basic product info from card
                const name = productCard.querySelector('h3, h4')?.textContent || 'Unknown Product';
                const description = productCard.querySelector('p')?.textContent || 'No description available';
                product = {
                    id: productId,
                    name: name,
                    description: description
                };
            }
        }
        
        if (product) {
            const content = Modal.createQuoteRequestContent(product);
            const footerContent = Modal.createQuoteRequestFooter(productId);
            Modal.show(content, {
                title: 'Request Quote',
                size: 'lg',
                footerContent: footerContent
            });
        } else {
            // Fallback alert if product not found
            alert(`Product not found for quote request: ${productId}`);
        }
    },

    // Handle quote request form submission
    submitQuoteRequest: async (event, productId) => {
        event.preventDefault();
        
        const form = event.target;
        const formData = new FormData(form);
        
        // Get customer ID from authenticated user
        const customerIdRef = window.Auth?.getCurrentUserId() || sessionStorage.getItem('userId');
        if (!customerIdRef) {
            alert('Please log in to request a quote.');
            return false;
        }
        
        // Find product to get provider ID
        let product = null;
        if (window.ProductAppState && window.ProductAppState.allProducts) {
            product = window.ProductAppState.allProducts.find(p => p.id === productId);
        }
        
        if (!product) {
            alert('Product information not found. Please try again.');
            return false;
        }
        
        // Extract provider ID from product's related party
        // Provider ID comes from productSpecification.relatedParty (from the chained API call)
        const relatedParty = product.productSpecification?.relatedParty?.find(party => party.role === 'owner');
        const providerIdRef = relatedParty?.id;

        if (!providerIdRef) {
            showMessage('Error: Unable to find provider information for this product', 'error');
            return;
        }

        console.log('Provider ID (from productSpecification.relatedParty):', providerIdRef);
        
        // Create the payload according to backend requirements
        const quoteRequest = {
            customerMessage: formData.get('message'),
            customerIdRef: customerIdRef,
            providerIdRef: providerIdRef,
            productOfferingId: productId // Now this will be a product offering ID
        };
        
        // Disable the submit button to prevent double submission
        const submitBtn = document.getElementById('send-request-btn');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';
        }
        
        try {
            const result = await QuoteAPI.createQuote(quoteRequest);
            
            // Close modal and show success message
            Modal.hide();
            alert('Quote request sent successfully! We will contact you soon.');
            
        } catch (error) {
            console.error('Error submitting quote request:', error);
            
            // Re-enable button on error
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Send Request';
            }
            
            // Show error message
            alert('Failed to send quote request. Please try again or contact support.');
        }
        
        return false; // Prevent default form submission
    },

    compareProducts: (productIds) => {
        console.log('Compare products:', productIds);
        // Future implementation: product comparison view
        alert(`Compare ${productIds.length} products`);
    },

    downloadCatalog: (products) => {
        console.log('Download product catalog');
        // Export products as JSON
        const dataStr = JSON.stringify(products, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const exportFileDefaultName = `product-catalog-${new Date().toISOString().split('T')[0]}.json`;
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    },

    // Search and filter actions
    search: (query, products) => {
        const searchTerm = query.toLowerCase();
        return products.filter(product => {
            const name = (product.name || '').toLowerCase();
            const description = (product.description || '').toLowerCase();
            const status = (product.lifecycleStatus || '').toLowerCase();
            
            return name.includes(searchTerm) || 
                   description.includes(searchTerm) || 
                   status.includes(searchTerm);
        });
    },

    filterByStatus: (status, products) => {
        if (!status) return products;
        return products.filter(product => 
            (product.lifecycleStatus || '').toLowerCase() === status.toLowerCase()
        );
    },

    sortProducts: (products, sortBy = 'name', order = 'asc') => {
        return [...products].sort((a, b) => {
            let aValue, bValue;
            
            switch (sortBy) {
                case 'name':
                    aValue = (a.name || '').toLowerCase();
                    bValue = (b.name || '').toLowerCase();
                    break;
                case 'status':
                    aValue = (a.lifecycleStatus || '').toLowerCase();
                    bValue = (b.lifecycleStatus || '').toLowerCase();
                    break;
                case 'lastUpdate':
                    aValue = new Date(a.lastUpdate || 0);
                    bValue = new Date(b.lastUpdate || 0);
                    break;
                default:
                    aValue = a[sortBy] || '';
                    bValue = b[sortBy] || '';
            }
            
            if (aValue < bValue) return order === 'asc' ? -1 : 1;
            if (aValue > bValue) return order === 'asc' ? 1 : -1;
            return 0;
        });
    },

    // Bulk actions
    bulkActions: {
        addToQuote: (productIds) => {
            console.log('Bulk add to quote:', productIds);
            alert(`Adding ${productIds.length} products to quote`);
        },

        export: (productIds, products) => {
            const selectedProducts = products.filter(p => productIds.includes(p.id));
            ProductActions.downloadCatalog(selectedProducts);
        },

        compare: (productIds) => {
            if (productIds.length < 2) {
                alert('Please select at least 2 products to compare');
                return;
            }
            ProductActions.compareProducts(productIds);
        }
    }
}; 