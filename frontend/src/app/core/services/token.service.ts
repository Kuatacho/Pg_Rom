import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private key = 'access_token';
  private userKey = 'user';


  setToken(token: string): void {
    localStorage.setItem(this.key, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.key);

  }

  clear(): void {
    localStorage.removeItem(this.key);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }


  getUser<T = any>(): T | null {
    const raw = localStorage.getItem(this.userKey);
    return raw ? (JSON.parse(raw) as T) : null;
  }
  setUser(user: any): void {
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }
  //decodificador simple de jwt sin libs

  decode<T = any>(): T | null {
    const token = this.getToken();
    if (!token) return null;
    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload)) as T;
    } catch {
      return null;
    }
  }

  // constructor() {
  // }
}
