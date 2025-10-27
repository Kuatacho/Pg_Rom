// src/app/features/learning/services/nota.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Nota } from '../../../data/models/nota.model';
import { API_CONFIG } from '../../../core/config/api.config';
import { TokenService } from '../../../core/services/token.service';

@Injectable({
  providedIn: 'root'
})
export class NotaService {
  private readonly base = API_CONFIG.baseUrl;

  constructor(
    private http: HttpClient,
    private tokenService: TokenService
  ) {}

  /** 🔹 Registrar promedio (nota final) de una lección */
  registerAverage(payload: Nota): Observable<any> {
    // POST → base + endpoint definido en tu config
    return this.http.post(
      this.base + API_CONFIG.learning.create_nota,
      payload
    );
  }
}
