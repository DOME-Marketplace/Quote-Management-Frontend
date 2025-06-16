import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { QuoteService } from '../../../../core/services/quote.service';
import { NotificationService } from '../../../../shared/services/notification.service';
import { Quote } from '../../../../shared/models/quote.model';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { NotificationComponent } from '../../../../shared/components/notification/notification.component';

@Component({
  selector: 'app-quote-list',
  standalone: true,
  imports: [CommonModule, ConfirmDialogComponent, NotificationComponent],
  template: `
    <app-notification></app-notification>

    <div class="container mx-auto px-4 py-8">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-gray-900">Quotes</h1>
        <button
          (click)="createQuote()"
          class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          New Quote
        </button>
      </div>

      <!-- Loading State -->
      <div *ngIf="isLoading" class="flex justify-center items-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>

      <!-- Error State -->
      <div *ngIf="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mb-4">
        {{ error }}
      </div>

      <!-- Quotes Table -->
      <div *ngIf="!isLoading && !error" class="bg-white shadow-md rounded-lg overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr *ngFor="let quote of quotes">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ quote.id }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ quote.description || '-' }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ quote.quoteDate | date:'medium' }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  [ngClass]="{
                    'px-2 inline-flex text-xs leading-5 font-semibold rounded-full': true,
                    'bg-green-100 text-green-800': !quoteService.isQuoteFinalized(quote),
                    'bg-red-100 text-red-800': quoteService.isQuoteCancelled(quote),
                    'bg-blue-100 text-blue-800': quoteService.isQuoteAccepted(quote)
                  }"
                >
                  {{ getQuoteStatus(quote) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex space-x-2">
                  <button
                    (click)="viewQuote(quote.id)"
                    class="text-blue-600 hover:text-blue-900"
                  >
                    View
                  </button>
                  <button
                    *ngIf="!quoteService.isQuoteFinalized(quote)"
                    (click)="editQuote(quote.id)"
                    class="text-indigo-600 hover:text-indigo-900"
                  >
                    Edit
                  </button>
                  <button
                    *ngIf="!quoteService.isQuoteFinalized(quote)"
                    (click)="confirmDelete(quote)"
                    class="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Delete Confirmation Dialog -->
    <app-confirm-dialog
      [isOpen]="showDeleteConfirm"
      title="Delete Quote"
      [message]="deleteConfirmMessage"
      confirmText="Delete"
      confirmButtonClass="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
      (confirm)="deleteQuote()"
      (cancel)="showDeleteConfirm = false"
    ></app-confirm-dialog>
  `
})
export class QuoteListComponent implements OnInit {
  quotes: Quote[] = [];
  isLoading = false;
  error: string | null = null;
  showDeleteConfirm = false;
  deleteConfirmMessage = '';
  quoteToDelete: Quote | null = null;

  constructor(
    public quoteService: QuoteService,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.loadQuotes();
  }

  loadQuotes() {
    this.isLoading = true;
    this.error = null;

    this.quoteService.getQuotes().subscribe({
      next: (quotes) => {
        this.quotes = quotes;
        this.isLoading = false;
      },
      error: (error: Error) => {
        this.error = 'Failed to load quotes. Please try again.';
        this.isLoading = false;
        this.notificationService.showError(this.error);
      }
    });
  }

  getQuoteStatus(quote: Quote): string {
    if (this.quoteService.isQuoteCancelled(quote)) {
      return 'Cancelled';
    }
    if (this.quoteService.isQuoteAccepted(quote)) {
      return 'Accepted';
    }
    return 'Draft';
  }

  createQuote() {
    this.router.navigate(['/quotes/new']);
  }

  viewQuote(id: string) {
    this.router.navigate(['/quotes', id]);
  }

  editQuote(id: string) {
    this.router.navigate(['/quotes', id, 'edit']);
  }

  confirmDelete(quote: Quote) {
    this.quoteToDelete = quote;
    this.deleteConfirmMessage = `Are you sure you want to delete quote ${quote.id}? This action cannot be undone.`;
    this.showDeleteConfirm = true;
  }

  deleteQuote() {
    if (!this.quoteToDelete) return;

    this.quoteService.deleteQuote(this.quoteToDelete.id).subscribe({
      next: () => {
        this.notificationService.showSuccess('Quote deleted successfully');
        this.loadQuotes();
      },
      error: (error: Error) => {
        this.notificationService.showError('Failed to delete quote. Please try again.');
      }
    });

    this.showDeleteConfirm = false;
    this.quoteToDelete = null;
  }
} 