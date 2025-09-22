// src/app/core/services/auth-mock.service.ts
import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { of, throwError, delay } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthMockService {
  private platformId = inject(PLATFORM_ID);

  private isBrowser() { return isPlatformBrowser(this.platformId); }

  login(email: string, password: string) {
    const ok = (email === 'test@test.com' && password === '123456') || (email && password.length >= 6);
    if (!ok) return throwError(() => new Error('Credenciales inválidas'));

    if (this.isBrowser()) {
      localStorage.setItem('demo_token', 'ok');
      localStorage.setItem('demo_user', JSON.stringify({
        name: 'Usuario Demo',
        email,
      }));
    }
    return of(null).pipe(delay(400));
  }

  logout() {
    if (this.isBrowser()) {
      localStorage.removeItem('demo_token');
      localStorage.removeItem('demo_user');
    }
  }

  isLoggedIn(): boolean {
    return this.isBrowser() && !!localStorage.getItem('demo_token');
  }

  getUser() {
    if (!this.isBrowser()) return null;
    const raw = localStorage.getItem('demo_user');
    return raw ? JSON.parse(raw) : null;
  }
}
