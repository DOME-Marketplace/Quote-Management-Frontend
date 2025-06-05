// Modal component
import { Utils } from '../modules/utils.js';

export const Modal = {
    // Create and show a modal
    show: (content, options = {}) => {
        const {
            title = 'Modal',
            size = 'md', // sm, md, lg, xl, 2xl
            showCloseButton = true,
            backdrop = true,
            keyboard = true
        } = options;

        // Remove existing modal if present
        Modal.hide();

        const sizeClasses = {
            sm: 'max-w-sm',
            md: 'max-w-md',
            lg: 'max-w-lg',
            xl: 'max-w-xl',
            '2xl': 'max-w-2xl',
            '3xl': 'max-w-3xl',
            '4xl': 'max-w-4xl',
            '5xl': 'max-w-5xl',
            '6xl': 'max-w-6xl'
        };

        const modalHTML = `
            <div id="modal-overlay" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4" ${backdrop ? 'onclick="Modal.handleBackdropClick(event)"' : ''}>
                <div class="relative bg-white rounded-lg shadow-xl ${sizeClasses[size] || sizeClasses.md} w-full max-h-full overflow-hidden" onclick="event.stopPropagation()">
                    <!-- Modal Header -->
                    <div class="flex items-center justify-between p-6 border-b border-gray-200">
                        <h3 class="text-xl font-semibold text-gray-900">
                            ${title}
                        </h3>
                        ${showCloseButton ? `
                            <button type="button" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center" onclick="Modal.hide()">
                                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                                </svg>
                            </button>
                        ` : ''}
                    </div>
                    
                    <!-- Modal Body -->
                    <div class="p-6 overflow-y-auto" style="max-height: calc(80vh - 160px);">
                        ${content}
                    </div>
                </div>
            </div>
        `;

        // Create modal element
        const modalDiv = document.createElement('div');
        modalDiv.innerHTML = modalHTML;
        document.body.appendChild(modalDiv);

        // Add keyboard event listener
        if (keyboard) {
            document.addEventListener('keydown', Modal.handleKeydown);
        }

        // Prevent body scroll
        document.body.style.overflow = 'hidden';
    },

    // Hide modal
    hide: () => {
        const modal = document.getElementById('modal-overlay');
        if (modal) {
            modal.parentElement.remove();
        }

        // Remove keyboard event listener
        document.removeEventListener('keydown', Modal.handleKeydown);

        // Restore body scroll
        document.body.style.overflow = '';
    },

    // Handle backdrop click
    handleBackdropClick: (event) => {
        if (event.target.id === 'modal-overlay') {
            Modal.hide();
        }
    },

    // Handle keyboard events
    handleKeydown: (event) => {
        if (event.key === 'Escape') {
            Modal.hide();
        }
    },

    // Create product details content
    createProductDetailsContent: (product) => {
        // Use product specification data if available (richer details)
        const spec = product.productSpecification;
        const displayName = spec?.name || product.name;
        const displayDescription = spec?.description || product.description;
        
        return `
            <div class="space-y-6">
                <!-- Product Header -->
                <div class="border-b border-gray-200 pb-4">
                    <h3 class="text-xl font-semibold text-gray-900">${displayName}</h3>
                    <p class="text-sm text-gray-500 mt-1">Product Offering: ${product.id}</p>
                    ${spec ? `<p class="text-sm text-gray-500">Product Specification: ${spec.id}</p>` : ''}
                </div>

                <!-- Basic Information -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <h4 class="font-medium text-gray-900 mb-2">Product Information</h4>
                        <dl class="space-y-2">
                            <div>
                                <dt class="text-sm text-gray-600">Status:</dt>
                                <dd class="text-sm font-medium">${spec?.lifecycleStatus || product.lifecycleStatus || 'N/A'}</dd>
                            </div>
                            <div>
                                <dt class="text-sm text-gray-600">Last Updated:</dt>
                                <dd class="text-sm">${spec?.lastUpdate || product.lastUpdate || 'N/A'}</dd>
                            </div>
                            ${product.version ? `
                            <div>
                                <dt class="text-sm text-gray-600">Version:</dt>
                                <dd class="text-sm">${product.version}</dd>
                            </div>
                            ` : ''}
                        </dl>
                    </div>
                    
                    <div>
                        <h4 class="font-medium text-gray-900 mb-2">Availability</h4>
                        <dl class="space-y-2">
                            <div>
                                <dt class="text-sm text-gray-600">Bundle:</dt>
                                <dd class="text-sm">${product.isBundle ? 'Yes' : 'No'}</dd>
                            </div>
                            <div>
                                <dt class="text-sm text-gray-600">Sellable:</dt>
                                <dd class="text-sm">${product.isSellable ? 'Yes' : 'No'}</dd>
                            </div>
                        </dl>
                    </div>
                </div>

                <!-- Description -->
                ${displayDescription ? `
                <div>
                    <h4 class="font-medium text-gray-900 mb-2">Description</h4>
                    <div class="text-sm text-gray-700 bg-gray-50 p-4 rounded-lg whitespace-pre-wrap">${displayDescription}</div>
                </div>
                ` : ''}

                <!-- Product Characteristics -->
                ${spec?.productSpecCharacteristic && spec.productSpecCharacteristic.length > 0 ? `
                <div>
                    <h4 class="font-medium text-gray-900 mb-2">Characteristics</h4>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                        ${spec.productSpecCharacteristic.map(char => `
                            <div class="bg-gray-50 p-3 rounded">
                                <div class="font-medium text-sm">${char.name || 'N/A'}</div>
                                <div class="text-xs text-gray-600">${char.description || 'No description'}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                ` : ''}

                <!-- Attachments -->
                ${spec?.attachment && spec.attachment.length > 0 ? `
                <div>
                    <h4 class="font-medium text-gray-900 mb-2">Attachments</h4>
                    <div class="space-y-2">
                        ${spec.attachment.map(att => `
                            <div class="flex items-center space-x-2 text-sm">
                                <span class="text-blue-600">📎</span>
                                <a href="${att.url || '#'}" class="text-blue-600 hover:underline">${att.name || 'Download'}</a>
                                <span class="text-gray-500">(${att.mimeType || 'Unknown type'})</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
                ` : ''}

                <!-- Related Parties (Provider Information) -->
                ${spec?.relatedParty && spec.relatedParty.length > 0 ? `
                <div>
                    <h4 class="font-medium text-gray-900 mb-2">Related Parties</h4>
                    <div class="space-y-3">
                        ${spec.relatedParty.map(party => `
                            <div class="bg-blue-50 p-3 rounded-lg">
                                <div class="flex items-center justify-between">
                                    <div>
                                        <div class="font-medium text-sm">${party.name || 'N/A'}</div>
                                        <div class="text-xs text-gray-600">Role: ${party.role || 'N/A'}</div>
                                        <div class="text-xs text-gray-500 break-all">${party.id || 'N/A'}</div>
                                    </div>
                                    <span class="text-blue-600 text-sm px-2 py-1 bg-blue-100 rounded">${party.role || 'Unknown'}</span>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                ` : ''}
            </div>
        `;
    },

    // Create quote request modal content
    createQuoteRequestContent: (product) => {
        const name = product.name || 'Unknown Product';
        const productId = product.id || '';

        return `
            <div class="space-y-6">
                <!-- Product Info Header -->
                <div class="bg-gray-50 p-4 rounded-lg">
                    <h4 class="text-lg font-medium text-gray-900 mb-2">Request Quote For:</h4>
                    <p class="text-gray-700">${name}</p>
                </div>

                <!-- Quote Request Form -->
                <form id="quote-request-form" onsubmit="return ProductActions.submitQuoteRequest(event, '${productId}')">
                    <div class="space-y-4">
                        <div>
                            <label for="quote-message" class="block text-sm font-medium text-gray-700 mb-2">
                                Message / Requirements
                            </label>
                            <textarea 
                                id="quote-message" 
                                name="message"
                                rows="6" 
                                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical"
                                placeholder="Please describe your requirements, quantities, timeline, or any specific questions about this product..."
                                required
                            ></textarea>
                            <p class="text-xs text-gray-500 mt-1">
                                Please provide as much detail as possible to help us prepare an accurate quote.
                            </p>
                        </div>
                    </div>

                    <!-- Actions -->
                    <div class="flex space-x-3 pt-6 border-t border-gray-200 mt-6">
                        <button 
                            type="submit" 
                            class="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            id="send-request-btn"
                        >
                            Send Request
                        </button>
                        <button 
                            type="button" 
                            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                            onclick="Modal.hide()"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        `;
    }
};