// Products application file
import { ProductAPI } from './modules/productApi.js';
import { ProductCard } from './components/ProductCard.js';
import { ProductActions } from './modules/ProductActions.js';
import { Auth } from './modules/auth.js';
import { DOM } from './modules/dom.js';

// Application state
const ProductAppState = {
    allProducts: [],
    filteredProducts: [],
    isLoading: false,
    currentView: 'cards', // 'cards' or 'list'
    sortBy: 'name',
    sortOrder: 'asc'
};

// Main Products Application class
class ProductCatalogApp {
    constructor() {
        this.init();
    }

    // Initialize the application
    async init() {
        console.log('Initializing Product Catalog...');

        // Check authentication
        const authResult = Auth.initPage({
            requireAuth: true,
            onAuth: (username) => {
                Auth.updateUserDisplay();
                console.log(`Product catalog loaded for user: ${username}`);
            }
        });

        if (!authResult) return; // Redirected to login

        // Set up event listeners
        this.setupEventListeners();

        // Make ProductActions available globally for onclick handlers
        window.ProductActions = ProductActions;

        // Load initial data
        await this.loadProducts();

        console.log('Product catalog initialized successfully');
    }

    // Set up event listeners
    setupEventListeners() {
        // Search functionality
        const searchInput = document.getElementById('product-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.handleSearch(e.target.value);
            });
        }

        // Status filter
        const statusFilter = document.getElementById('status-filter');
        if (statusFilter) {
            statusFilter.addEventListener('change', (e) => {
                this.handleStatusFilter(e.target.value);
            });
        }

        // Sort controls
        const sortSelect = document.getElementById('sort-select');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                const [sortBy, sortOrder] = e.target.value.split('-');
                this.handleSort(sortBy, sortOrder);
            });
        }

        // View toggle
        const viewToggle = document.getElementById('view-toggle');
        if (viewToggle) {
            viewToggle.addEventListener('click', () => {
                this.toggleView();
            });
        }
    }

    // Load products from API
    async loadProducts() {
        if (ProductAppState.isLoading) {
            console.log('Already loading products...');
            return;
        }

        ProductAppState.isLoading = true;

        try {
            this.showLoadingState();

            const products = await ProductAPI.fetchProducts();

            ProductAppState.allProducts = products;
            ProductAppState.filteredProducts = [...products];

            this.renderProducts();
            this.updateProductCount();

            console.log(`Product catalog updated with ${products.length} products`);

        } catch (error) {
            console.error('Error loading products:', error);
            this.showErrorState(error.message);
        } finally {
            ProductAppState.isLoading = false;
        }
    }

    // Handle search
    handleSearch(query) {
        const searchResults = ProductActions.search(query, ProductAppState.allProducts);
        ProductAppState.filteredProducts = searchResults;
        this.renderProducts();
        this.updateProductCount();
    }

    // Handle status filter
    handleStatusFilter(status) {
        const filteredResults = ProductActions.filterByStatus(status, ProductAppState.allProducts);
        ProductAppState.filteredProducts = filteredResults;
        this.renderProducts();
        this.updateProductCount();
    }

    // Handle sorting
    handleSort(sortBy, sortOrder) {
        ProductAppState.sortBy = sortBy;
        ProductAppState.sortOrder = sortOrder;
        
        const sortedProducts = ProductActions.sortProducts(
            ProductAppState.filteredProducts, 
            sortBy, 
            sortOrder
        );
        ProductAppState.filteredProducts = sortedProducts;
        this.renderProducts();
    }

    // Toggle view between cards and list
    toggleView() {
        ProductAppState.currentView = ProductAppState.currentView === 'cards' ? 'list' : 'cards';
        this.renderProducts();
        
        // Update toggle button text
        const toggleButton = document.getElementById('view-toggle');
        if (toggleButton) {
            toggleButton.textContent = ProductAppState.currentView === 'cards' ? 'List View' : 'Card View';
        }
    }

    // Show loading state
    showLoadingState() {
        const container = document.getElementById('products-container');
        if (container) {
            container.innerHTML = ProductCard.createLoadingState();
        }
    }

    // Show error state
    showErrorState(errorMessage) {
        const container = document.getElementById('products-container');
        if (container) {
            container.innerHTML = ProductCard.createErrorState(errorMessage);
        }
    }

    // Render products
    renderProducts() {
        const container = document.getElementById('products-container');
        if (!container) return;

        if (ProductAppState.filteredProducts.length === 0) {
            container.innerHTML = ProductCard.createEmptyState();
            return;
        }

        // Choose rendering method based on current view
        if (ProductAppState.currentView === 'cards') {
            this.renderCardView(container);
        } else {
            this.renderListView(container);
        }
    }

    // Render card view
    renderCardView(container) {
        container.className = 'row';
        const productsHTML = ProductAppState.filteredProducts
            .map(product => ProductCard.create(product))
            .join('');
        container.innerHTML = productsHTML;
    }

    // Render list view
    renderListView(container) {
        container.className = 'list-group';
        const productsHTML = ProductAppState.filteredProducts
            .map(product => ProductCard.createListItem(product))
            .join('');
        container.innerHTML = productsHTML;
    }

    // Update product count display
    updateProductCount() {
        const countElement = document.getElementById('product-count');
        if (countElement) {
            const total = ProductAppState.allProducts.length;
            const filtered = ProductAppState.filteredProducts.length;
            countElement.textContent = `Showing ${filtered} of ${total} products`;
        }
    }

    // Refresh products
    async refresh() {
        await this.loadProducts();
    }

    // Export products
    exportProducts() {
        ProductActions.downloadCatalog(ProductAppState.filteredProducts);
    }
}

// Global functions for HTML onclick handlers
window.refreshProducts = () => app.refresh();
window.exportProducts = () => app.exportProducts();
window.handleLogout = () => {
    Auth.logout();
    window.location.href = 'login.html';
};

// Initialize application when DOM is ready
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new ProductCatalogApp();
});

// Export for potential external use
export { ProductCatalogApp }; 