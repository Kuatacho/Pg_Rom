import { Injectable } from '@angular/core';
import { API_CONFIG } from '../../../core/config/api.config';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotaService {
  private base = API_CONFIG.baseUrl;

  constructor(private http: HttpClient) {}

  getNotas(): Observable<any[]> {
    return this.http.get<any[]>(this.base + API_CONFIG.admin.get_notas);
  }
}
