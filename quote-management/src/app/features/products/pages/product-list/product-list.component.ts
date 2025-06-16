import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProductService } from '../../../../core/services/product.service';
import { NotificationService } from '../../../../shared/services/notification.service';
import { Product } from '../../../../shared/models/product.model';
import { NotificationComponent } from '../../../../shared/components/notification/notification.component';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, NotificationComponent, ConfirmDialogComponent],
  template: `
    <app-notification></app-notification>

    <div class="container mx-auto px-4 py-8">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-gray-900">Products</h1>
        <button
          (click)="createProduct()"
          class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Create Product
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

      <!-- Products Table -->
      <div *ngIf="!isLoading && !error" class="bg-white shadow-md rounded-lg overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr *ngFor="let product of products">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ product.id }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ product.name }}</td>
              <td class="px-6 py-4 text-sm text-gray-500">{{ product.description }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  (click)="viewProduct(product)"
                  class="text-indigo-600 hover:text-indigo-900 mr-4"
                >
                  View
                </button>
                <button
                  (click)="editProduct(product)"
                  class="text-indigo-600 hover:text-indigo-900 mr-4"
                >
                  Edit
                </button>
                <button
                  (click)="confirmDelete(product)"
                  class="text-red-600 hover:text-red-900"
                >
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Delete Confirmation Dialog -->
    <app-confirm-dialog
      [isOpen]="showDeleteConfirm"
      title="Delete Product"
      [message]="deleteConfirmMessage"
      confirmText="Delete"
      confirmButtonClass="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
      (confirm)="deleteProduct()"
      (cancel)="showDeleteConfirm = false"
    ></app-confirm-dialog>
  `
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  isLoading = false;
  error: string | null = null;
  showDeleteConfirm = false;
  deleteConfirmMessage = '';
  productToDelete: Product | null = null;

  constructor(
    private router: Router,
    private productService: ProductService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.isLoading = true;
    this.error = null;

    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.isLoading = false;
      },
      error: (error: Error) => {
        this.error = 'Failed to load products. Please try again.';
        this.isLoading = false;
        this.notificationService.showError(this.error);
      }
    });
  }

  createProduct() {
    this.router.navigate(['/products/new']);
  }

  viewProduct(product: Product) {
    this.router.navigate(['/products', product.id]);
  }

  editProduct(product: Product) {
    this.router.navigate(['/products', product.id, 'edit']);
  }

  confirmDelete(product: Product) {
    this.productToDelete = product;
    this.deleteConfirmMessage = `Are you sure you want to delete product ${product.name}? This action cannot be undone.`;
    this.showDeleteConfirm = true;
  }

  deleteProduct() {
    if (!this.productToDelete) return;

    this.productService.deleteProduct(this.productToDelete.id).subscribe({
      next: () => {
        this.notificationService.showSuccess('Product deleted successfully');
        this.loadProducts();
      },
      error: (error: Error) => {
        this.notificationService.showError('Failed to delete product. Please try again.');
      }
    });

    this.showDeleteConfirm = false;
    this.productToDelete = null;
  }
} 