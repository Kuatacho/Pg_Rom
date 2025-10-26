import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map, Observable} from 'rxjs';


export interface Gesto {
  id:number;
  nombre:string;
  descripcion:string;

}

@Injectable({
  providedIn: 'root'
})
export class GesturesService {

  constructor(private http: HttpClient) { }

  getGestosPorLeccion(leccionId:number):Observable<Gesto[]>{
    return this.http.get<Record<string, Gesto[]>>('assets/data/gestures.json').pipe(
      map(data => data[leccionId] || [])
    );
  }
}
