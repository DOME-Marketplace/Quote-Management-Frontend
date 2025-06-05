// Authentication module
export const Auth = {
    // Check if user is authenticated
    isAuthenticated: () => {
        return sessionStorage.getItem('userId') !== null;
    },

    // Get current user ID
    getCurrentUserId: () => {
        return sessionStorage.getItem('userId');
    },

    // Get current user data (including type determination)
    getCurrentUser: () => {
        const userId = sessionStorage.getItem('userId');
        if (!userId) return null;

        return {
            userId: userId,
            userType: Auth.getUserType(userId),
            displayName: Auth.getDisplayName(userId)
        };
    },

    // Determine user type from User ID
    getUserType: (userId) => {
        if (!userId) return 'unknown';
        
        // Check for individual users (customers)
        if (userId.includes('individual')) {
            return 'customer';
        }
        
        // Check for organization users (providers)
        if (userId.includes('organization')) {
            return 'provider';
        }
        
        // Default fallback
        return 'unknown';
    },

    // Get display name from User ID
    getDisplayName: (userId) => {
        if (!userId) return 'Unknown User';
        
        // Extract a readable part from the User ID
        const idPart = userId.split(':').pop();
        const shortId = idPart ? idPart.substring(0, 8) : 'unknown';
        const userType = Auth.getUserType(userId);
        
        return `${userType.charAt(0).toUpperCase() + userType.slice(1)} (${shortId})`;
    },

    // Check if current user is of specific type
    isUserType: (type) => {
        const user = Auth.getCurrentUser();
        return user && user.userType === type;
    },

    // Check if current user is customer
    isCustomer: () => {
        return Auth.isUserType('customer');
    },

    // Check if current user is provider
    isProvider: () => {
        return Auth.isUserType('provider');
    },

    // Login user
    login: (userId) => {
        if (!userId || userId.trim() === '') {
            throw new Error('User ID is required');
        }
        
        const trimmedUserId = userId.trim();
        
        // Validate User ID format (basic validation)
        if (!trimmedUserId.startsWith('urn:ngsi-ld:') || 
            (!trimmedUserId.includes('individual:') && !trimmedUserId.includes('organization:'))) {
            throw new Error('Invalid User ID format');
        }
        
        // Store user data
        sessionStorage.setItem('userId', trimmedUserId);
        sessionStorage.setItem('loginTime', new Date().toISOString());
        sessionStorage.setItem('lastActivity', new Date().toISOString());
        
        const userType = Auth.getUserType(trimmedUserId);
        console.log(`User logged in successfully - ID: ${trimmedUserId}, Type: ${userType}`);
        
        return true;
    },

    // Logout user
    logout: () => {
        const userId = sessionStorage.getItem('userId');
        sessionStorage.removeItem('userId');
        sessionStorage.removeItem('loginTime');
        sessionStorage.removeItem('lastActivity');
        console.log(`User ${userId} logged out`);
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
            onUnauth = null,
            requiredUserType = null
        } = options;

        if (requireAuth && !Auth.isAuthenticated()) {
            window.location.href = loginUrl;
            return false;
        }

        if (redirectIfAuth && Auth.isAuthenticated()) {
            window.location.href = homeUrl;
            return false;
        }

        const user = Auth.getCurrentUser();
        
        // Check if specific user type is required
        if (requiredUserType && user && user.userType !== requiredUserType) {
            console.warn(`Access denied. Required user type: ${requiredUserType}, Current: ${user.userType}`);
            // Could redirect to access denied page or show error
            return false;
        }
        
        if (user && onAuth) {
            onAuth(user);
        } else if (!user && onUnauth) {
            onUnauth();
        }

        return true;
    },

    // Update UI with user info
    updateUserDisplay: (elementId = 'user-display') => {
        const element = document.getElementById(elementId);
        const user = Auth.getCurrentUser();
        
        if (element && user) {
            element.innerHTML = `
                <span class="user-info">
                    <i class="bi bi-person-circle me-1"></i>
                    ${user.displayName}
                    <small class="text-muted">(${user.userType})</small>
                </span>
            `;
        }
    },

    // Get user data for API calls or other uses
    getUserData: () => {
        const user = Auth.getCurrentUser();
        if (!user) return null;

        return {
            userId: user.userId,
            userType: user.userType,
            displayName: user.displayName,
            loginTime: sessionStorage.getItem('loginTime'),
            lastActivity: sessionStorage.getItem('lastActivity')
        };
    },

    // Session management
    session: {
        // Extend session
        extend: () => {
            const userId = Auth.getCurrentUserId();
            if (userId) {
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