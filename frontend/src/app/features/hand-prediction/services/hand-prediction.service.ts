import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface PredictionResponse {
  prediction: string;
  probabilities?: number[][];
}

@Injectable({
  providedIn: 'root'
})
export class PredictionService {
  private readonly API_URL = 'http://localhost:5000/api/predict';

  constructor(private http: HttpClient) {}

  sendSequence(sequence: number[][]): Observable<PredictionResponse> {
    return this.http.post<PredictionResponse>(this.API_URL, { sequence });
  }
}
