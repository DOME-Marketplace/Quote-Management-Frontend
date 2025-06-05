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
                        <button type="button" class="absolute top-4 right-4 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 inline-flex items-center" onclick="document.getElementById('quote-details-modal').remove()" aria-label="Close details">
                            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                            </svg>
                        </button>
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
                    <div class="bg-white rounded-lg shadow-lg w-full max-w-4xl p-8 relative">
                        <button type="button" class="absolute top-4 right-4 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 inline-flex items-center" onclick="document.getElementById('chat-modal').remove(); window.stopChatPolling && window.stopChatPolling();" aria-label="Close chat">
                            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                            </svg>
                        </button>
                        <h3 class="text-lg font-semibold mb-2">Chat for Quote <span id="chat-quote-id"></span></h3>
                        <div id="chat-messages" class="border rounded p-4 h-96 overflow-y-auto mb-6 bg-gray-50"></div>
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
            
            // Find the submit button more reliably - it's outside the form but has form attribute
            const sendBtn = document.querySelector('button[form="chat-form"][type="submit"]');
            if (sendBtn) {
                sendBtn.disabled = true;
            }
            
            try {
                await QuoteAPI.addNoteToQuote(quoteId, userId, msg);
                input.value = '';
                // Dopo l'invio aggiorna la lista dei messaggi
                await loadMessages();
            } catch (err) {
                console.error('Error sending message:', err);
                alert(`Error sending message: ${err.message}`);
            } finally {
                if (sendBtn) {
                    sendBtn.disabled = false;
                }
            }
        };
    },

    addAttachment: async (quoteId) => {
        // Check if attachment modal already exists
        let modal = document.getElementById('attachment-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'attachment-modal';
            modal.innerHTML = `
                <div class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                    <div class="bg-white rounded-lg shadow-lg w-full max-w-lg p-8 relative">
                        <button class="absolute top-2 right-2 text-gray-400 hover:text-gray-700" onclick="document.getElementById('attachment-modal').remove();" aria-label="Close">&times;</button>
                        <h3 class="text-lg font-semibold mb-4">Add Attachment to Quote <span id="attachment-quote-id"></span></h3>
                        
                        <div id="attachment-content">
                            <div class="mb-4">
                                <label for="file-input" class="block text-sm font-medium text-gray-700 mb-2">Select PDF File</label>
                                <input type="file" id="file-input" accept=".pdf" class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                                <p class="text-xs text-gray-500 mt-1">Only PDF files are allowed</p>
                            </div>
                            
                            <div class="mb-6">
                                <label for="description-input" class="block text-sm font-medium text-gray-700 mb-2">Description (Optional)</label>
                                <textarea id="description-input" rows="3" class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Enter description for the attachment..."></textarea>
                            </div>
                        </div>
                        
                        <!-- Action Buttons Row -->
                        <div class="flex justify-between pt-4 border-t border-gray-200">
                            <button 
                                id="upload-btn"
                                type="button"
                                class="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
                                onclick="window.QuoteActions.handleAttachmentUpload()"
                            >
                                Upload
                            </button>
                            <button 
                                type="button" 
                                class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                                onclick="document.getElementById('attachment-modal').remove();"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
        }
        
        document.getElementById('attachment-quote-id').textContent = quoteId.slice(-8);
        
        // Store the quote ID for later use
        modal.dataset.quoteId = quoteId;
        
        // Check if quote already has attachment and show warning if needed
        try {
            const quoteData = await QuoteAPI.getQuoteById(quoteId);
            const hasAttachment = Array.isArray(quoteData.quoteItem) && 
                                quoteData.quoteItem.some(qi => qi.attachment && qi.attachment.length > 0);
            
            if (hasAttachment) {
                const contentDiv = document.getElementById('attachment-content');
                contentDiv.innerHTML = `
                    <div class="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                        <div class="flex">
                            <div class="flex-shrink-0">
                                <svg class="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                                </svg>
                            </div>
                            <div class="ml-3">
                                <h3 class="text-sm font-medium text-yellow-800">Warning: Existing Attachment</h3>
                                <div class="mt-2 text-sm text-yellow-700">
                                    <p>This quote already has an attachment. Uploading a new file will overwrite the existing PDF.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="mb-4">
                        <label for="file-input" class="block text-sm font-medium text-gray-700 mb-2">Select PDF File</label>
                        <input type="file" id="file-input" accept=".pdf" class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                        <p class="text-xs text-gray-500 mt-1">Only PDF files are allowed</p>
                    </div>
                    
                    <div class="mb-6">
                        <label for="description-input" class="block text-sm font-medium text-gray-700 mb-2">Description (Optional)</label>
                        <textarea id="description-input" rows="3" class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Enter description for the attachment..."></textarea>
                    </div>
                `;
            }
        } catch (error) {
            console.error('Error checking for existing attachments:', error);
        }
    },

    handleAttachmentUpload: async function() {
        const modal = document.getElementById('attachment-modal');
        const quoteId = modal.dataset.quoteId;
        const fileInput = document.getElementById('file-input');
        const descriptionInput = document.getElementById('description-input');
        const uploadBtn = document.getElementById('upload-btn');
        
        const file = fileInput.files[0];
        if (!file) {
            alert('Please select a PDF file to upload.');
            return;
        }
        
        if (file.type !== 'application/pdf') {
            alert('Please select a valid PDF file.');
            return;
        }
        
        // Show loading state
        uploadBtn.disabled = true;
        uploadBtn.textContent = 'Uploading...';
        
        try {
            const description = descriptionInput.value.trim();
            await QuoteAPI.addAttachmentToQuote(quoteId, file, description);
            
            // Show success message
            alert('Attachment uploaded successfully!');
            
            // Close modal
            modal.remove();
            
        } catch (error) {
            console.error('Error uploading attachment:', error);
            alert(`Error uploading attachment: ${error.message}`);
        } finally {
            // Reset button state
            uploadBtn.disabled = false;
            uploadBtn.textContent = 'Upload';
        }
    },

    downloadAttachment: async (quoteId) => {
        try {
            // Get quote data with attachment
            const quoteData = await QuoteAPI.getQuoteById(quoteId);
            
            // Find the first attachment in any quote item
            let attachment = null;
            if (Array.isArray(quoteData.quoteItem)) {
                for (const item of quoteData.quoteItem) {
                    if (item.attachment && item.attachment.length > 0) {
                        attachment = item.attachment[0]; // Get first attachment
                        break;
                    }
                }
            }
            
            if (!attachment) {
                alert('No attachment found for this quote.');
                return;
            }
            
            if (!attachment.content) {
                alert('Attachment content not found or not embedded.');
                return;
            }
            
            // Decode BASE64 content
            try {
                const binaryString = atob(attachment.content);
                const bytes = new Uint8Array(binaryString.length);
                for (let i = 0; i < binaryString.length; i++) {
                    bytes[i] = binaryString.charCodeAt(i);
                }
                
                // Create blob with PDF mime type
                const blob = new Blob([bytes], { type: 'application/pdf' });
                
                // Create download URL
                const url = URL.createObjectURL(blob);
                
                // Create temporary download link
                const link = document.createElement('a');
                link.href = url;
                
                // Generate filename
                const shortQuoteId = Utils.extractShortId(quoteId);
                const filename = attachment.name || `quote-${shortQuoteId}-attachment.pdf`;
                link.download = filename;
                
                // Trigger download
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                
                // Clean up object URL
                URL.revokeObjectURL(url);
                
                console.log(`Downloaded attachment: ${filename}`);
                
            } catch (decodeError) {
                console.error('Error decoding BASE64 content:', decodeError);
                alert('Error decoding PDF content. The file may be corrupted.');
            }
            
        } catch (error) {
            console.error('Error downloading attachment:', error);
            alert(`Error downloading attachment: ${error.message}`);
        }
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
