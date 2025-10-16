// core/services/api.service.ts
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {API_CONFIG} from '../config/api.config';
import {Observable, tap} from 'rxjs';
import {AuthResponse} from '../../data/models/auth_response.model';
import {User} from '../../data/models/user.model';
import {TokenService} from './token.service';

@Injectable({providedIn: 'root'})
export class ApiService {
  private readonly base = API_CONFIG.baseUrl;

  constructor(private http: HttpClient, private token: TokenService) {
  }

  // AUTH
  login(payload: { correo: string; contrasena: string }): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.base}${API_CONFIG.auth.login}`, payload)
      .pipe(tap
        (res => {
          this.token.setToken(res.access_token);
          this.token.setUser(res.usuario);
        })
      );

  }

  register(payload: any): Observable<any> {
    return this.http.post(`${this.base}${API_CONFIG.auth.register}`, payload);
  }

  getRoles():Observable<any> {
    return this.http.get(`${this.base}/get-roles`);
  }


// TODO
  // forgotPassword(correo: string): Observable<any> {
  //   return this.http.post(`${this.base}${API_CONFIG.auth.forgot}`, { correo });
  // }
  //
  // resetPassword(token: string, nueva_contrasena: string): Observable<any> {
  //   return this.http.post(`${this.base}${API_CONFIG.auth.reset}`, { token, nueva_contrasena });
  // }
  //
  // me(): Observable<User> {
  //   return this.http.get<User>(`${this.base}${API_CONFIG.auth.me}`);
  // }

  logout(): void {
    this.token.clear();
  }
}
