
import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { TokenService } from '../services/token.service';
import { API_CONFIG } from '../config/api.config';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private token: TokenService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const apiBase = API_CONFIG.baseUrl;
    const isApiCall = req.url.startsWith(apiBase);
    const jwt = this.token.getToken();

    const authReq = isApiCall && jwt
      ? req.clone({ setHeaders: { Authorization: `Bearer ${jwt}` } })
      : req;

    return next.handle(authReq).pipe(
      catchError((err: HttpErrorResponse) => {
        // Si expira o es inválido, limpiamos token (puedes redirigir al login también)
        if (err.status === 401) {
          this.token.clear();
        }
        return throwError(() => err);
      })
    );
  }
}
