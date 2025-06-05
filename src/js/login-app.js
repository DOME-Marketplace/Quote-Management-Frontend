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

        // Enter key on user ID field
        const userIdInput = document.getElementById('userId');
        if (userIdInput) {
            userIdInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.handleLogin(e);
                }
            });

            // Focus on user ID field
            userIdInput.focus();
        }
    }

    // Handle login form submission
    handleLogin(event) {
        event.preventDefault();

        const userIdInput = document.getElementById('userId');
        if (!userIdInput) {
            this.showError('User ID field not found');
            return false;
        }

        const userId = userIdInput.value.trim();

        if (!userId) {
            this.showError('Please enter a User ID');
            userIdInput.focus();
            return false;
        }

        try {
            // Show loading state
            this.showLoading(true);

            // Attempt login
            Auth.login(userId);

            // Show success message briefly
            this.showSuccess('Login successful! Redirecting...');

            // Redirect to products page
            setTimeout(() => {
                window.location.href = 'products.html';
            }, 1000);

        } catch (error) {
            console.error('Login error:', error);
            this.showError(error.message || 'Login failed. Please try again.');
            userIdInput.focus();
        } finally {
            this.showLoading(false);
        }

        return false;
    }

    // Show loading state
    showLoading(isLoading) {
        const submitButton = document.querySelector('#loginForm button[type="submit"]');
        const userIdInput = document.getElementById('userId');

        if (submitButton) {
            if (isLoading) {
                submitButton.disabled = true;
                submitButton.innerHTML = `
                    <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Logging in...
                `;
            } else {
                submitButton.disabled = false;
                submitButton.innerHTML = '<i class="bi bi-box-arrow-in-right me-2"></i>Login';
            }
        }

        if (userIdInput) {
            userIdInput.disabled = isLoading;
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
});

// Export for potential external use
export { LoginApp }; 