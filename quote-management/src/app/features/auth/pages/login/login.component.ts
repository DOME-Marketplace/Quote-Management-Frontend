import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LoginService } from '../../../../core/services/login.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="flex flex-col items-center justify-center min-h-screen">
      <h2 class="text-2xl font-bold mb-4">Login</h2>
      <form (ngSubmit)="onLogin()" class="w-80 p-6 bg-white rounded shadow">
        <label class="block mb-2 font-medium">User ID</label>
        <input [(ngModel)]="userId" name="userId" required class="w-full p-2 border rounded mb-4" />
        <button type="submit" class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Login</button>
      </form>
    </div>
  `
})
export class LoginComponent {
  userId = '';

  constructor(
    private loginService: LoginService,
    private router: Router
  ) {}

  onLogin() {
    if (this.userId.trim()) {
      this.loginService.setUserId(this.userId.trim());
      this.router.navigate(['/products']);
    }
  }
} 