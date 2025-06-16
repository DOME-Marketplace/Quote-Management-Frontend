import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoginService {
  private readonly USER_KEY = 'loggedOnUserId';

  setUserId(userId: string): void {
    localStorage.setItem(this.USER_KEY, userId);
  }

  getUserId(): string | null {
    return localStorage.getItem(this.USER_KEY);
  }

  isLoggedIn(): boolean {
    return !!this.getUserId();
  }

  logout(): void {
    localStorage.removeItem(this.USER_KEY);
  }
} 