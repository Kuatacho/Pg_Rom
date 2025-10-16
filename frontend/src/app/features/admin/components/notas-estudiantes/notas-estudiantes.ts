import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

interface Nota {
  nombre: string;
  apellido: string;
  leccion: string;
  nota: number;
  fecha: string;
}

@Component({
  selector: 'app-notas-estudiantes',
  standalone: true,
  templateUrl: './notas-estudiantes.html',
  styleUrls: ['./notas-estudiantes.css'],
  imports: [CommonModule, HttpClientModule],
})
export class NotasEstudiantesComponent implements OnInit {
  notas: Nota[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.cargarNotasSimuladas();
    // ⚙️ cuando tengas la API lista -> this.getNotas();
  }

  getNotas(): void {
    this.http.get<Nota[]>('http://127.0.0.1:5000/api/notas').subscribe({
      next: (data) => (this.notas = data),
      error: (err) => console.error('Error al obtener notas:', err),
    });
  }

  // 🧪 Data simulada
  cargarNotasSimuladas(): void {
    this.notas = [
      {
        nombre: 'Lucía',
        apellido: 'Martínez',
        leccion: 'Saludos',
        nota: 92.5,
        fecha: '2025-09-20',
      },
      {
        nombre: 'Carlos',
        apellido: 'Ramírez',
        leccion: 'Saludos',
        nota: 78.3,
        fecha: '2025-09-21',
      },
      {
        nombre: 'María',
        apellido: 'González',
        leccion: 'Saludos',
        nota: 64.8,
        fecha: '2025-09-22',
      },
      {
        nombre: 'Andrés',
        apellido: 'Pérez',
        leccion: 'Saludos',
        nota: 88.9,
        fecha: '2025-09-25',
      },
      {
        nombre: 'Camila',
        apellido: 'Fernández',
        leccion: 'Saludos',
        nota: 95.0,
        fecha: '2025-09-28',
      },
    ];
  }
}
