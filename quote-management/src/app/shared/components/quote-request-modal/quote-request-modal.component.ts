import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductWithProvider } from '../../../features/products/services/product.service';
import { QuoteService } from '../../../features/quotes/services/quote.service';

export interface QuoteRequestData {
  buyerMessage: string;
  buyerIdRef: string;
  providerIdRef: string;
  productOfferingId: string;
}

@Component({
  selector: 'app-quote-request-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4" 
         (click)="onBackdropClick($event)">
      <div class="relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-full overflow-hidden" 
           (click)="$event.stopPropagation()">
        
        <!-- Modal Header -->
        <div class="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 class="text-xl font-semibold text-gray-900">
            @if (currentStep === 1) {
              Request Quote
            } @else if (currentStep === 2) {
              Add Desired Completion Date
            } @else {
              Request Complete
            }
          </h3>
          <button 
            type="button" 
            class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center" 
            (click)="onClose()">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
            </svg>
          </button>
        </div>
        
        <!-- Modal Body -->
        <div class="p-6 overflow-y-auto" style="max-height: calc(80vh - 220px);">
          <div class="space-y-6" [formGroup]="quoteForm">
            
            <!-- STEP 1: Request Quote -->
            @if (currentStep === 1) {
              <!-- Product Info Header -->
              <div class="bg-gray-50 p-4 rounded-lg">
                <h4 class="text-lg font-medium text-gray-900 mb-2">Request Quote For:</h4>
                <p class="text-gray-700">{{ displayProductName }}</p>
              </div>

              <!-- Quote Request Form -->
              <div class="space-y-4">
                <!-- Buyer Message -->
                <div>
                  <label for="buyerMessage" class="block text-sm font-medium text-gray-700 mb-2">
                    Message / Requirements *
                  </label>
                  <textarea 
                    id="buyerMessage" 
                    formControlName="buyerMessage"
                    rows="6" 
                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical"
                    [class.border-red-300]="isFieldInvalid('buyerMessage')"
                    placeholder="Please describe your requirements or any specific questions about this product..."
                  ></textarea>
                  @if (isFieldInvalid('buyerMessage')) {
                    <p class="text-red-500 text-xs mt-1">Message is required</p>
                  }
                  <p class="text-xs text-gray-500 mt-1">
                    Please provide as much detail as possible to help us prepare an accurate quote.
                  </p>
                </div>
              </div>
            }

            <!-- STEP 2: Add Completion Date -->
            @if (currentStep === 2) {
              <!-- Success/Error Message -->
              @if (quoteCreationSuccess) {
                <div class="flex items-center justify-center mb-6">
                  <div class="text-center">
                    <svg class="mx-auto h-16 w-16 text-green-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h4 class="text-xl font-semibold text-gray-900 mb-2">Quote Created Successfully!</h4>
                    <p class="text-gray-600">Your quote request has been submitted.</p>
                  </div>
                </div>
              }
              @if (quoteCreationError) {
                <div class="flex items-center justify-center mb-6">
                  <div class="text-center">
                    <svg class="mx-auto h-16 w-16 text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h4 class="text-xl font-semibold text-gray-900 mb-2">Error in Quote Creation</h4>
                    <p class="text-red-600">{{ errorMessage }}</p>
                  </div>
                </div>
              }

              <!-- Only show date field if quote was created successfully -->
              @if (quoteCreationSuccess && createdQuoteId) {
                <div>
                  <label for="completionDate" class="block text-sm font-medium text-gray-700 mb-2">
                    Completion Date:
                  </label>
                  <p class="text-xs text-gray-500 mb-2">
                    Select when you would like this quote to be completed
                  </p>
                  <input 
                    type="date" 
                    id="completionDate"
                    formControlName="completionDate"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    [class.border-red-300]="isFieldInvalid('completionDate')"
                  />
                  @if (isFieldInvalid('completionDate')) {
                    <p class="text-red-500 text-xs mt-1">Date is required</p>
                  }
                  <p class="text-xs text-gray-500 mt-1">
                    Date must be in the future
                  </p>
                </div>
              }
            }

            <!-- STEP 3: Final Confirmation -->
            @if (currentStep === 3) {
              <div class="flex items-center justify-center">
                <div class="text-center">
                  @if (quoteCreationSuccess && dateUpdateSuccess) {
                    <svg class="mx-auto h-20 w-20 text-green-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h4 class="text-2xl font-semibold text-gray-900 mb-2">Request sent successfully!</h4>
                    <p class="text-gray-600 mb-4">Your quote request has been submitted.</p>
                    <p class="text-sm text-gray-500">You can monitoring its status in the Quotes section.</p>
                  } @else {
                    <svg class="mx-auto h-20 w-20 text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h4 class="text-2xl font-semibold text-gray-900 mb-2">Request Failed</h4>
                    @if (quoteCreationError) {
                      <p class="text-red-600 mb-4">Failed to create quote. Please try again.</p>
                    } @else if (dateUpdateError) {
                      <p class="text-red-600 mb-4">Quote created but failed to update date. You can update it later from the quote details.</p>
                    }
                  }
                </div>
              </div>
            }
            
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
          
          <!-- Step 1 Footer -->
          @if (currentStep === 1) {
            <div class="flex justify-between space-x-3">
              <button 
                type="submit" 
                (click)="onSubmit()"
                [disabled]="isSubmitting"
                class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                @if (isSubmitting) {
                  <span class="flex items-center">
                    <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </span>
                } @else {
                  Send Request
                }
              </button>
              <button 
                type="button" 
                class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                (click)="onClose()"
              >
                Cancel
              </button>
            </div>
          }

          <!-- Step 2 Footer -->
          @if (currentStep === 2) {
            <div class="flex justify-between space-x-3">
              @if (quoteCreationSuccess && createdQuoteId) {
                <button 
                  type="button" 
                  (click)="onSaveDateRequest()"
                  [disabled]="isSubmitting"
                  class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  @if (isSubmitting) {
                    <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  } @else {
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                    Save Request Date
                  }
                </button>
              } @else {
                <!-- If quote creation failed, show a cancel button -->
                <div></div>
              }
              <button 
                type="button" 
                class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                (click)="onClose()"
              >
                Cancel
              </button>
            </div>
          }

          <!-- Step 3 Footer -->
          @if (currentStep === 3) {
            <div class="flex justify-between space-x-3">
              <button 
                type="button" 
                (click)="goToQuotes()"
                class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors flex items-center"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
                Go to Quotes
              </button>
              <button 
                type="button" 
                class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                (click)="onClose()"
              >
                Cancel
              </button>
            </div>
          }

        </div>
      </div>
    </div>
  `
})
export class QuoteRequestModalComponent {
  @Input() product: ProductWithProvider | null = null;
  @Input() buyerId: string = '';
  @Input() isOpen = false;
  @Output() closeModal = new EventEmitter<void>();
  @Output() submitRequest = new EventEmitter<QuoteRequestData>();
  @Output() quoteCreated = new EventEmitter<any>();

  private fb = inject(FormBuilder);
  private quoteService = inject(QuoteService);
  private router = inject(Router);
  
  quoteForm: FormGroup;
  isSubmitting = false;
  
  // Step management
  currentStep: 1 | 2 | 3 = 1;
  
  // Step 2 state
  quoteCreationSuccess = false;
  quoteCreationError = false;
  createdQuoteId: string | null = null;
  errorMessage = '';
  
  // Step 3 state
  dateUpdateSuccess = false;
  dateUpdateError = false;

  constructor() {
    this.quoteForm = this.fb.group({
      buyerMessage: ['', [Validators.required, Validators.minLength(10)]],
      completionDate: ['', Validators.required]
    });
  }

  get displayProductName(): string {
    return this.product?.name || 'Unknown Product';
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.quoteForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  onBackdropClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }

  onClose(): void {
    this.quoteForm.reset({
      buyerMessage: '',
      completionDate: ''
    });
    this.isSubmitting = false;
    this.currentStep = 1;
    this.quoteCreationSuccess = false;
    this.quoteCreationError = false;
    this.createdQuoteId = null;
    this.errorMessage = '';
    this.dateUpdateSuccess = false;
    this.dateUpdateError = false;
    this.closeModal.emit();
  }

  onSubmit(): void {
    // Only validate buyerMessage for step 1
    const messageControl = this.quoteForm.get('buyerMessage');
    if (messageControl?.valid && this.product && this.buyerId && !this.isSubmitting) {
      this.isSubmitting = true;
      
      const formValue = this.quoteForm.value;
      const requestData: QuoteRequestData = {
        buyerMessage: formValue.buyerMessage,
        buyerIdRef: this.buyerId,
        providerIdRef: this.product.providerId || '',
        productOfferingId: this.product.productOfferingId || this.product.id || ''
      };

      console.log('Submitting quote request with data:', requestData);
      console.log('Buyer ID:', this.buyerId);
      console.log('Product:', this.product);
      console.log('Provider ID from product:', this.product.providerId);

      // Call the API to create the quote
      this.quoteService.createQuoteFromRequest(requestData).subscribe({
        next: (response) => {
          console.log('Quote created successfully:', response);
          this.quoteCreationSuccess = true;
          this.quoteCreationError = false;
          this.createdQuoteId = response.id || null;
          this.quoteCreated.emit(response);
          this.submitRequest.emit(requestData); // Still emit for backward compatibility
          this.isSubmitting = false;
          this.currentStep = 2; // Move to step 2
        },
        error: (error) => {
          console.error('Error creating quote:', error);
          this.quoteCreationSuccess = false;
          this.quoteCreationError = true;
          this.errorMessage = error.error?.message || 'Failed to create quote. Please try again.';
          this.isSubmitting = false;
          this.currentStep = 2; // Still move to step 2 to show error
        }
      });
    } else {
      // Mark buyerMessage as touched to show validation errors
      messageControl?.markAsTouched();
      
      // Show validation message if buyerId is missing
      if (!this.buyerId) {
        alert('Buyer ID is required. Please log in first.');
      }
    }
  }

  onSaveDateRequest(): void {
    const dateControl = this.quoteForm.get('completionDate');
    if (dateControl?.valid && this.createdQuoteId && !this.isSubmitting) {
      this.isSubmitting = true;
      
      const dateValue = dateControl.value;
      
      // Format date as DD-MM-YYYY as required by the API
      // The date input returns YYYY-MM-DD format, so we need to convert it
      const dateObj = new Date(dateValue);
      const formattedDate = `${dateObj.getDate().toString().padStart(2, '0')}-${(dateObj.getMonth() + 1).toString().padStart(2, '0')}-${dateObj.getFullYear()}`;
      
      console.log('Updating quote date:', formattedDate, 'for quote ID:', this.createdQuoteId);

      // Call the API to update the quote date with 'requested' as dateType
      this.quoteService.updateQuoteDate(this.createdQuoteId, formattedDate, 'requested').subscribe({
        next: (response) => {
          console.log('Quote date updated successfully:', response);
          this.dateUpdateSuccess = true;
          this.dateUpdateError = false;
          this.isSubmitting = false;
          this.currentStep = 3; // Move to step 3
        },
        error: (error) => {
          console.error('Error updating quote date:', error);
          this.dateUpdateSuccess = false;
          this.dateUpdateError = true;
          this.isSubmitting = false;
          this.currentStep = 3; // Still move to step 3 to show error
        }
      });
    } else {
      // Mark date field as touched to show validation errors
      dateControl?.markAsTouched();
    }
  }

  goToQuotes(): void {
    this.onClose();
    this.router.navigate(['/quotes']);
  }
} 