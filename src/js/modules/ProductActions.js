// Product Actions module
export const ProductActions = {
    viewDetails: (productId) => {
        console.log('View product details:', productId);
        // Future implementation: show product details modal or navigate to detail page
        alert(`View details for product: ${productId}`);
    },

    addToQuote: (productId) => {
        console.log('Add product to quote:', productId);
        // Future implementation: add product to current quote or create new quote
        alert(`Add product ${productId} to quote`);
        
        // Could integrate with quote management
        // QuoteActions.createFromProduct(productId);
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