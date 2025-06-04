// Login application file
import { Auth } from './modules/auth.js';
import { DOM } from './modules/dom.js';

// Login Application class
class LoginApp {
    constructor() {
        this.init();
    }

    // Initialize the application
    init() {
        console.log('Initializing Login App...');

        // Check if user is already authenticated
        const authResult = Auth.initPage({
            redirectIfAuth: true,
            homeUrl: 'products.html'
        });

        if (!authResult) return; // Redirected to products

        // Set up event listeners
        this.setupEventListeners();

        console.log('Login app initialized successfully');
    }

    // Set up event listeners
    setupEventListeners() {
        // Login form submission
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                this.handleLogin(e);
            });
        }

        // Enter key on username field
        const usernameInput = document.getElementById('username');
        if (usernameInput) {
            usernameInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.handleLogin(e);
                }
            });

            // Focus on username field
            usernameInput.focus();
        }
    }

    // Handle login form submission
    handleLogin(event) {
        event.preventDefault();

        const usernameInput = document.getElementById('username');
        if (!usernameInput) {
            this.showError('Username field not found');
            return false;
        }

        const username = usernameInput.value.trim();

        if (!username) {
            this.showError('Please enter a username');
            usernameInput.focus();
            return false;
        }

        try {
            // Show loading state
            this.showLoading(true);

            // Attempt login
            Auth.login(username);

            // Show success message briefly
            this.showSuccess('Login successful! Redirecting...');

            // Redirect to products page
            setTimeout(() => {
                window.location.href = 'products.html';
            }, 1000);

        } catch (error) {
            console.error('Login error:', error);
            this.showError(error.message || 'Login failed. Please try again.');
            usernameInput.focus();
        } finally {
            this.showLoading(false);
        }

        return false;
    }

    // Show loading state
    showLoading(isLoading) {
        const submitButton = document.querySelector('#loginForm button[type="submit"]');
        const usernameInput = document.getElementById('username');

        if (submitButton) {
            if (isLoading) {
                submitButton.disabled = true;
                submitButton.innerHTML = `
                    <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Logging in...
                `;
            } else {
                submitButton.disabled = false;
                submitButton.innerHTML = 'Login';
            }
        }

        if (usernameInput) {
            usernameInput.disabled = isLoading;
        }
    }

    // Show error message
    showError(message) {
        this.clearMessages();
        
        const form = document.getElementById('loginForm');
        if (form) {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'alert alert-danger mt-3';
            errorDiv.setAttribute('role', 'alert');
            errorDiv.innerHTML = `
                <i class="bi bi-exclamation-triangle-fill me-2"></i>
                ${message}
            `;
            errorDiv.id = 'login-error';
            
            form.appendChild(errorDiv);

            // Auto-hide error after 5 seconds
            setTimeout(() => {
                this.clearMessages();
            }, 5000);
        }
    }

    // Show success message
    showSuccess(message) {
        this.clearMessages();
        
        const form = document.getElementById('loginForm');
        if (form) {
            const successDiv = document.createElement('div');
            successDiv.className = 'alert alert-success mt-3';
            successDiv.setAttribute('role', 'alert');
            successDiv.innerHTML = `
                <i class="bi bi-check-circle-fill me-2"></i>
                ${message}
            `;
            successDiv.id = 'login-success';
            
            form.appendChild(successDiv);
        }
    }

    // Clear all messages
    clearMessages() {
        const existingError = document.getElementById('login-error');
        const existingSuccess = document.getElementById('login-success');
        
        if (existingError) {
            existingError.remove();
        }
        
        if (existingSuccess) {
            existingSuccess.remove();
        }
    }

    // Handle demo login options (for development)
    addDemoLoginOptions() {
        const form = document.getElementById('loginForm');
        if (!form) return;

        const demoDiv = document.createElement('div');
        demoDiv.className = 'mt-3 text-center';
        demoDiv.innerHTML = `
            <p class="text-muted small mb-2">Demo Accounts:</p>
            <div class="btn-group-vertical w-100" role="group">
                <button type="button" class="btn btn-outline-secondary btn-sm" onclick="loginApp.fillDemoUser('admin')">
                    Admin User
                </button>
                <button type="button" class="btn btn-outline-secondary btn-sm" onclick="loginApp.fillDemoUser('customer')">
                    Customer User
                </button>
                <button type="button" class="btn btn-outline-secondary btn-sm" onclick="loginApp.fillDemoUser('provider')">
                    Provider User
                </button>
            </div>
        `;
        
        form.appendChild(demoDiv);
    }

    // Fill demo user credentials
    fillDemoUser(userType) {
        const usernameInput = document.getElementById('username');
        if (usernameInput) {
            usernameInput.value = userType;
            usernameInput.focus();
        }
    }
}

// Global functions for HTML onclick handlers
window.handleLogin = (event) => {
    if (window.loginApp) {
        return window.loginApp.handleLogin(event);
    }
    return false;
};

// Initialize application when DOM is ready
let loginApp;
document.addEventListener('DOMContentLoaded', () => {
    loginApp = new LoginApp();
    window.loginApp = loginApp;
    
    // Add demo login options in development
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        loginApp.addDemoLoginOptions();
    }
});

// Export for potential external use
export { LoginApp }; 