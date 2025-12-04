import { Injectable, inject } from '@angular/core';
import {API_CONFIG} from '../../../core/config/api.config';
import {map, Observable} from 'rxjs';
import {Lesson} from '../../../data/models/lesson.model';
import {HttpClient} from '@angular/common/http';
import {TokenService} from '../../../core/services/token.service';

@Injectable({
  providedIn: 'root'
})
export class LessonService {
  private base= API_CONFIG.baseUrl

  getLecciones(): Observable<Lesson[]> {
    return this.http.get<Lesson[]>(this.base + API_CONFIG.learning.lecciones).pipe(
      map((lecciones: Lesson[]) => lecciones.map((l) => ({
        ...l,
        imagen: this.getLessonImage(l) // enriquecemos cada lección
      })))
    );
  }

  private getLessonImage(lesson: Lesson): string {
    const name = lesson.nombre.toLowerCase();

    //  matching flexible según nombre
    if (name.includes('saludo')) return 'assets/img/saludos.jpg';
    if (name.includes('semana')) return 'assets/img/diaSemana.jpg';
    if (name.includes('animales')) return 'assets/img/Animales.jpg';
    if (name.includes('verduras')) return 'assets/img/verduras.jpg';
    if (name.includes('frutas')) return 'assets/img/frutas.jpg';
    if (name.includes('colores')) return 'assets/img/Colores.jpg';
    if (name.includes('familia')) return 'assets/img/Familia.jpg';
    if (name.includes('lugares')) return 'assets/img/Lugares.jpg';
    if (name.includes('departamentos de bolivia')) return 'assets/img/depsBolivia.jpeg';
    if (name.includes('tiempo')) return 'assets/img/Tiempo.jpg';
    if (name.includes('pronombres')) return 'assets/img/Pronombres.jpg';
    if (name.includes('sustantivos')) return 'assets/img/Sustantivos.jpg';
    if (name.includes('cuerpo humano')) return 'assets/img/Cuerpo Humano.jpg';
    if (name.includes('alimentos')) return 'assets/img/Alimentos.jpg';
    if (name.includes('medios de transporte')) return 'assets/img/medios de transporte.jpg';
    if (name.includes('naturaleza')) return 'assets/img/Naturaleza.jpg';
    if (name.includes('preguntas')) return 'assets/img/preguntas.jpg';
    if (name.includes('calendario')) return 'assets/img/calendario.jpg';
    if (name.includes('verbos')) return 'assets/img/verbos.jpg';
    if (name.includes('numeros')) return 'assets/img/Numeros.jpg';


    // fallback
    return 'assets/img/lecciones/default.jpg';
  }

  constructor(private http: HttpClient) {
  }
}
