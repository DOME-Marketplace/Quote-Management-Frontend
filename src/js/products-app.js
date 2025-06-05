// Products application file
import { ProductAPI } from './modules/productApi.js';
import { ProductCard } from './components/ProductCard.js';
import { ProductActions } from './modules/ProductActions.js';
import { Modal } from './components/Modal.js';
import { Auth } from './modules/auth.js';
import { DOM } from './modules/dom.js';

// Application state
const ProductAppState = {
    allProducts: [],
    filteredProducts: [],
    isLoading: false
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
            onAuth: (user) => {
                Auth.updateUserDisplay();
                console.log(`Product catalog loaded for user: ${user.displayName} (${user.userType})`);
                
                // Customize UI based on user type
                this.customizeUIForUserType(user.userType);
            }
        });

        if (!authResult) return; // Redirected to login

        // Set up event listeners
        this.setupEventListeners();

        // Make ProductActions available globally for onclick handlers
        window.ProductActions = ProductActions;

        // Make ProductAppState available globally for ProductActions
        window.ProductAppState = ProductAppState;

        // Make Modal available globally for onclick handlers
        window.Modal = Modal;

        // Make Auth available globally for ProductActions
        window.Auth = Auth;

        // Load initial data
        await this.loadProducts();

        console.log('Product catalog initialized successfully');
    }

    // Set up event listeners
    setupEventListeners() {
        // No interactive elements to set up - keeping method for future use
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

        // Always render in card view
        container.className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6';
        const productsHTML = ProductAppState.filteredProducts
            .map(product => ProductCard.create(product))
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



    // Customize UI based on user type
    customizeUIForUserType(userType) {
        console.log(`Customizing UI for user type: ${userType}`);
        
        // Hide/show features based on user type
        const customerOnlyElements = document.querySelectorAll('.customer-only');
        const providerOnlyElements = document.querySelectorAll('.provider-only');
        
        if (userType === 'customer') {
            // Show customer features, hide provider features
            customerOnlyElements.forEach(el => el.style.display = 'block');
            providerOnlyElements.forEach(el => el.style.display = 'none');
            
            // Update page title or header
            const pageTitle = document.querySelector('h1');
            if (pageTitle) {
                pageTitle.innerHTML = '<i class="bi bi-shop me-2"></i>Product Catalog - Customer View';
            }
        } else if (userType === 'provider') {
            // Show provider features, hide customer features
            providerOnlyElements.forEach(el => el.style.display = 'block');
            customerOnlyElements.forEach(el => el.style.display = 'none');
            
            // Update page title or header
            const pageTitle = document.querySelector('h1');
            if (pageTitle) {
                pageTitle.innerHTML = '<i class="bi bi-gear me-2"></i>Product Management - Provider View';
            }
        }
        
        // Add user type class to body for CSS targeting
        document.body.classList.add(`user-${userType}`);
    }
}

// Global functions for HTML onclick handlers
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