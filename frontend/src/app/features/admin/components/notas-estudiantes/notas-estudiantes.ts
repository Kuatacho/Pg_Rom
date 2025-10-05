import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // ✅ necesario para *ngFor y pipes
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Navbar } from "../../../../shared/components/navbar/navbar";


interface Nota {
  nombre: string;
  apellido: string;
  modulo: string;
  seccion: string;
  nota: number;
  fecha: string;
}

@Component({
  selector: 'app-notas-estudiantes',
  standalone: true,
  templateUrl: './notas-estudiantes.html',
  styleUrls: ['./notas-estudiantes.css'],
  imports: [
    CommonModule,
    HttpClientModule,
    Navbar  // si luego quieres mostrarlo
  ]
})
export class NotasEstudiantesComponent implements OnInit {
  notas: Nota[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getNotas();
  }

  getNotas(): void {
    // ⚠️ cambia la URL por tu endpoint real
    this.http.get<Nota[]>('http://127.0.0.1:5000/api/notas').subscribe({
      next: (data) => (this.notas = data),
      error: (err) => console.error('Error al obtener notas:', err)
    });
  }
}
