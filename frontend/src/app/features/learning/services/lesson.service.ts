import { Injectable, inject } from '@angular/core';
import {API_CONFIG} from '../../../core/config/api.config';
import {Observable} from 'rxjs';
import {Lesson} from '../../../data/models/lesson.model';
import {HttpClient} from '@angular/common/http';
import {TokenService} from '../../../core/services/token.service';

@Injectable({
  providedIn: 'root'
})
export class LessonService {
  private base= API_CONFIG.baseUrl

  getLecciones():Observable<Lesson[]>{
    return this.http.get<Lesson[]>(this.base + API_CONFIG.learning.lecciones);
  }

  constructor(private http: HttpClient) {
  }
}
