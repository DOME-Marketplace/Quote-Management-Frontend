// Navigation component
import { Auth } from '../modules/auth.js';

export const Navigation = {
    // Create Bootstrap navbar
    create: (options = {}) => {
        const {
            currentPage = '',
            showAuth = true,
            brandText = 'Quote Management',
            brandHref = 'index.html'
        } = options;

        const authSection = showAuth ? Navigation.createAuthSection() : '';
        
        return `
            <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
                <div class="container">
                    <a class="navbar-brand" href="${brandHref}">${brandText}</a>
                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="collapse navbar-collapse" id="navbarNav">
                        <ul class="navbar-nav me-auto">
                            ${Navigation.createNavItems(currentPage)}
                        </ul>
                        ${authSection}
                    </div>
                </div>
            </nav>
        `;
    },

    // Create navigation items
    createNavItems: (currentPage) => {
        const navItems = [
            { href: 'index.html', text: 'Home', page: 'home' },
            { href: 'products.html', text: 'Products', page: 'products' }
        ];

        return navItems.map(item => {
            const isActive = currentPage === item.page ? 'active' : '';
            return `
                <li class="nav-item">
                    <a class="nav-link ${isActive}" href="${item.href}">${item.text}</a>
                </li>
            `;
        }).join('');
    },

    // Create authentication section
    createAuthSection: () => {
        return `
            <div class="d-flex align-items-center">
                <span class="text-light me-3" id="username-display"></span>
                <button class="btn btn-outline-light" onclick="Navigation.handleLogout()">Logout</button>
            </div>
        `;
    },

    // Handle logout action
    handleLogout: () => {
        try {
            Auth.logout();
            window.location.href = 'login.html';
        } catch (error) {
            console.error('Logout error:', error);
            // Force logout even if there's an error
            window.location.href = 'login.html';
        }
    },

    // Initialize navigation for a page
    init: (options = {}) => {
        const {
            requireAuth = false,
            currentPage = '',
            containerId = 'navigation-container'
        } = options;

        // Check authentication if required
        if (requireAuth) {
            Auth.initPage({
                requireAuth: true,
                onAuth: (username) => {
                    // Update username display after navigation is rendered
                    setTimeout(() => Auth.updateUserDisplay(), 100);
                }
            });
        }

        // Render navigation if container exists
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = Navigation.create({ 
                currentPage, 
                showAuth: requireAuth 
            });
            
            // Update username display if authenticated
            if (requireAuth && Auth.isAuthenticated()) {
                Auth.updateUserDisplay();
            }
        }
    },

    // Create breadcrumb navigation
    createBreadcrumb: (items) => {
        return `
            <nav aria-label="breadcrumb">
                <ol class="breadcrumb">
                    ${items.map((item, index) => {
                        const isLast = index === items.length - 1;
                        if (isLast) {
                            return `<li class="breadcrumb-item active" aria-current="page">${item.text}</li>`;
                        } else {
                            return `<li class="breadcrumb-item"><a href="${item.href}">${item.text}</a></li>`;
                        }
                    }).join('')}
                </ol>
            </nav>
        `;
    },

    // Create sidebar navigation (for future use)
    createSidebar: (items, currentPage) => {
        return `
            <div class="sidebar">
                <ul class="nav nav-pills flex-column">
                    ${items.map(item => {
                        const isActive = currentPage === item.page ? 'active' : '';
                        return `
                            <li class="nav-item">
                                <a class="nav-link ${isActive}" href="${item.href}">
                                    ${item.icon ? `<i class="${item.icon}"></i>` : ''} 
                                    ${item.text}
                                </a>
                            </li>
                        `;
                    }).join('')}
                </ul>
            </div>
        `;
    }
}; 