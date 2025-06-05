// Quote actions module
import { Utils } from './utils.js';
import { QuoteAPI } from './quoteApi.js';

export const QuoteActions = {
    viewDetails: async (quoteId) => {
        // Show loading modal
        let modal = document.getElementById('quote-details-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'quote-details-modal';
            modal.innerHTML = `
                <div class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                    <div class="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative min-h-[200px]">
                        <button class="absolute top-2 right-2 text-gray-400 hover:text-gray-700" onclick="document.getElementById('quote-details-modal').remove()" aria-label="Close details">&times;</button>
                        <h3 class="text-lg font-semibold mb-2">Quote Details</h3>
                        <div id="quote-details-content" class="text-sm text-gray-700">Loading...</div>
                        
                        <!-- Close Button -->
                        <div class="flex justify-end pt-4 border-t border-gray-200 mt-6">
                            <button 
                                type="button" 
                                class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                                onclick="document.getElementById('quote-details-modal').remove()"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
        }
        // Fetch quote details from backend using centralized API
        try {
            const data = await QuoteAPI.getQuoteById(quoteId);

            // Get state from first quoteItem if present
            let itemState = '-';
            if (data.quoteItem && data.quoteItem.length > 0 && data.quoteItem[0].state) {
                itemState = data.quoteItem[0].state;
            }

            // Related Party rendering
            let relatedPartyHtml = '';
            if (Array.isArray(data.relatedParty) && data.relatedParty.length > 0) {
                relatedPartyHtml = '<div><b>Related Party:</b></div>';
                data.relatedParty.forEach(rp => {
                    relatedPartyHtml += `<div class=\"ml-4 mb-3\"><div>Id: ${rp.id || '-'}<br>Type: ${rp['@type'] || '-'}</div></div>`;
                });
            } else {
                relatedPartyHtml = '<div><b>Related Party:</b> -</div>';
            }

            // Attachment check
            let hasAttachment = 'no';
            if (Array.isArray(data.quoteItem) && data.quoteItem.some(qi => qi.attachment)) {
                hasAttachment = 'yes';
            }

            document.getElementById('quote-details-content').innerHTML = `
                <div><b>ID:</b> ${data.id}</div>
                <div><b>State:</b> ${itemState}</div>
                <div><b>Description:</b> ${data.description || '-'}</div>
                <div><b>Date:</b> ${data.quoteDate ? new Date(data.quoteDate).toLocaleString() : '-'}</div>
                <div><b>Items:</b> ${(data.quoteItem && data.quoteItem.length) ? data.quoteItem.length : 0}</div>
                ${relatedPartyHtml}
                <div><b>Attachment:</b> ${hasAttachment}</div>
            `;
        } catch (err) {
            console.error('Error loading quote details:', err);
            document.getElementById('quote-details-content').innerHTML = `<span class='text-red-600'>Error loading details: ${err.message}</span>`;
        }
    },

    edit: (quoteId) => {
        console.log('Edit quote:', quoteId);
        // For now, show an alert. In the future, this could open an edit form
        alert(`Edit quote: ${Utils.extractShortId(quoteId)}`);
        // Future implementation could be:
        // - Open an edit form modal
        // - Navigate to an edit page
        // - Enable inline editing
    },

    delete: (quoteId) => {
        console.log('Delete quote:', quoteId);
        const confirmDelete = confirm(`Are you sure you want to delete quote ${Utils.extractShortId(quoteId)}?`);
        if (confirmDelete) {
            // Future implementation: call API to delete quote
            console.log('Quote deletion confirmed');
            // API.deleteQuote(quoteId);
        }
    },

    duplicate: (quoteId) => {
        console.log('Duplicate quote:', quoteId);
        // Future implementation: create a copy of the quote
        alert(`Duplicating quote: ${Utils.extractShortId(quoteId)}`);
    },

    export: (quoteId) => {
        console.log('Export quote:', quoteId);
        // Future implementation: export quote data to PDF/Excel
        alert(`Exporting quote: ${Utils.extractShortId(quoteId)}`);
    },

    openChat: async (quoteId) => {
        // Check if chat modal already exists
        let modal = document.getElementById('chat-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'chat-modal';
            modal.innerHTML = `
                <div class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                    <div class="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
                        <button class="absolute top-2 right-2 text-gray-400 hover:text-gray-700" onclick="document.getElementById('chat-modal').remove(); window.stopChatPolling && window.stopChatPolling();" aria-label="Close chat">&times;</button>
                        <h3 class="text-lg font-semibold mb-2">Chat for Quote <span id="chat-quote-id"></span></h3>
                        <div id="chat-messages" class="border rounded p-2 h-48 overflow-y-auto mb-4 bg-gray-50"></div>
                        <form id="chat-form">
                            <input id="chat-input" type="text" class="w-full border rounded px-2 py-1 mb-4" placeholder="Type a message..." required />
                        </form>
                        
                        <!-- Action Buttons Row -->
                        <div class="flex justify-between pt-4 border-t border-gray-200">
                            <button 
                                type="submit" 
                                form="chat-form"
                                class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                            >
                                Send
                            </button>
                            <button 
                                type="button" 
                                class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                                onclick="document.getElementById('chat-modal').remove(); window.stopChatPolling && window.stopChatPolling();"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
        }
        document.getElementById('chat-quote-id').textContent = quoteId.slice(-8);
        const userId = sessionStorage.getItem('userId');
        const messagesDiv = document.getElementById('chat-messages');

        // Funzione per caricare i messaggi
        async function loadMessages() {
            try {
                const data = await QuoteAPI.getQuoteById(quoteId);
                const notes = Array.isArray(data.note) ? data.note : [];
                if (notes.length === 0) {
                    messagesDiv.innerHTML = '<div class="text-gray-400 text-center">No messages yet.</div>';
                } else {
                    messagesDiv.innerHTML = notes.map(note => {
                        const isMine = note.author === userId;
                        return `<div class="mb-2 flex ${isMine ? 'justify-end' : 'justify-start'}">
                            <div class="max-w-xs px-3 py-2 rounded-lg text-sm ${isMine ? 'bg-blue-100 text-blue-900' : 'bg-gray-200 text-gray-800'}">
                                <div>${note.text}</div>
                                <div class="text-xs text-gray-400 mt-1">${note.author === userId ? 'You' : note.author}</div>
                            </div>
                        </div>`;
                    }).join('');
                    messagesDiv.scrollTop = messagesDiv.scrollHeight;
                }
            } catch (err) {
                messagesDiv.innerHTML = '<div class="text-red-500 text-center">Error loading messages</div>';
            }
        }
        // Carica subito i messaggi
        messagesDiv.innerHTML = '<div class="text-gray-400 text-center">Loading messages...</div>';
        await loadMessages();
        // Polling automatico
        if (window.stopChatPolling) window.stopChatPolling();
        let polling = setInterval(loadMessages, 3000);
        window.stopChatPolling = () => clearInterval(polling);

        // Set up form handler
        const form = document.getElementById('chat-form');
        form.onsubmit = async function(e) {
            e.preventDefault();
            const input = document.getElementById('chat-input');
            const msg = input.value.trim();
            if (msg.length === 0) return;
            const sendBtn = form.querySelector('button[type="submit"]');
            sendBtn.disabled = true;
            try {
                await QuoteAPI.addNoteToQuote(quoteId, userId, msg);
                input.value = '';
                // Dopo l'invio aggiorna la lista dei messaggi
                await loadMessages();
            } catch (err) {
                console.error('Error sending message:', err);
                alert(`Error sending message: ${err.message}`);
            } finally {
                sendBtn.disabled = false;
            }
        };
    },

    // Bulk actions for multiple quotes
    bulkActions: {
        delete: (quoteIds) => {
            const count = quoteIds.length;
            const confirmDelete = confirm(`Are you sure you want to delete ${count} quotes?`);
            if (confirmDelete) {
                console.log('Bulk delete confirmed for:', quoteIds);
                // Future implementation: call API for bulk delete
            }
        },

        export: (quoteIds) => {
            console.log('Bulk export for:', quoteIds);
            // Future implementation: bulk export functionality
        },

        updateStatus: (quoteIds, newStatus) => {
            console.log(`Updating ${quoteIds.length} quotes to status: ${newStatus}`);
            // Future implementation: bulk status update
        }
    }
};
