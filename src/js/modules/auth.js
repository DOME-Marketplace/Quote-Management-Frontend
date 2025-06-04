// Authentication module
export const Auth = {
    // Check if user is authenticated
    isAuthenticated: () => {
        return sessionStorage.getItem('username') !== null;
    },

    // Get current username
    getCurrentUser: () => {
        return sessionStorage.getItem('username');
    },

    // Login user
    login: (username) => {
        if (!username || username.trim() === '') {
            throw new Error('Username is required');
        }
        
        sessionStorage.setItem('username', username.trim());
        console.log(`User ${username} logged in successfully`);
        return true;
    },

    // Logout user
    logout: () => {
        const username = sessionStorage.getItem('username');
        sessionStorage.removeItem('username');
        console.log(`User ${username} logged out`);
        return true;
    },

    // Redirect to login if not authenticated
    requireAuth: (redirectUrl = 'login.html') => {
        if (!Auth.isAuthenticated()) {
            window.location.href = redirectUrl;
            return false;
        }
        return true;
    },

    // Redirect to main app if already authenticated
    redirectIfAuthenticated: (redirectUrl = 'products.html') => {
        if (Auth.isAuthenticated()) {
            window.location.href = redirectUrl;
            return true;
        }
        return false;
    },

    // Initialize auth state for a page
    initPage: (options = {}) => {
        const {
            requireAuth = false,
            redirectIfAuth = false,
            loginUrl = 'login.html',
            homeUrl = 'products.html',
            onAuth = null,
            onUnauth = null
        } = options;

        if (requireAuth && !Auth.isAuthenticated()) {
            window.location.href = loginUrl;
            return false;
        }

        if (redirectIfAuth && Auth.isAuthenticated()) {
            window.location.href = homeUrl;
            return false;
        }

        const username = Auth.getCurrentUser();
        
        if (username && onAuth) {
            onAuth(username);
        } else if (!username && onUnauth) {
            onUnauth();
        }

        return true;
    },

    // Update UI with user info
    updateUserDisplay: (elementId = 'username-display') => {
        const element = document.getElementById(elementId);
        const username = Auth.getCurrentUser();
        
        if (element && username) {
            element.textContent = `Welcome, ${username}`;
        }
    },

    // Session management
    session: {
        // Extend session
        extend: () => {
            const username = Auth.getCurrentUser();
            if (username) {
                sessionStorage.setItem('username', username);
                sessionStorage.setItem('lastActivity', new Date().toISOString());
            }
        },

        // Check session validity
        isValid: (maxInactiveMinutes = 60) => {
            const lastActivity = sessionStorage.getItem('lastActivity');
            if (!lastActivity) return false;

            const lastActivityTime = new Date(lastActivity);
            const now = new Date();
            const diffMinutes = (now - lastActivityTime) / (1000 * 60);

            return diffMinutes < maxInactiveMinutes;
        },

        // Clear expired session
        clearIfExpired: (maxInactiveMinutes = 60) => {
            if (!Auth.session.isValid(maxInactiveMinutes)) {
                Auth.logout();
                return true;
            }
            return false;
        }
    }
}; 