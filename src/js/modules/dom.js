// DOM manipulation module
export const DOM = {
    // Get element by ID with error handling
    getElementById: (id) => {
        const element = document.getElementById(id);
        if (!element) {
            console.error(`Element with ID '${id}' not found`);
        }
        return element;
    },

    // Show element
    showElement: (id) => {
        const element = DOM.getElementById(id);
        if (element) {
            element.classList.remove('hidden');
        }
    },

    // Hide element
    hideElement: (id) => {
        const element = DOM.getElementById(id);
        if (element) {
            element.classList.add('hidden');
        }
    },

    // Update text content
    updateText: (id, text) => {
        const element = DOM.getElementById(id);
        if (element) {
            element.textContent = text;
        }
    },

    // Update innerHTML
    updateHTML: (id, html) => {
        const element = DOM.getElementById(id);
        if (element) {
            element.innerHTML = html;
        }
    },

    // Add event listener with error handling
    addEventListener: (id, event, handler) => {
        const element = DOM.getElementById(id);
        if (element) {
            element.addEventListener(event, handler);
            return true;
        }
        return false;
    },

    // Remove event listener
    removeEventListener: (id, event, handler) => {
        const element = DOM.getElementById(id);
        if (element) {
            element.removeEventListener(event, handler);
        }
    },

    // Toggle class
    toggleClass: (id, className) => {
        const element = DOM.getElementById(id);
        if (element) {
            element.classList.toggle(className);
        }
    },

    // Add class
    addClass: (id, className) => {
        const element = DOM.getElementById(id);
        if (element) {
            element.classList.add(className);
        }
    },

    // Remove class
    removeClass: (id, className) => {
        const element = DOM.getElementById(id);
        if (element) {
            element.classList.remove(className);
        }
    }
}; 