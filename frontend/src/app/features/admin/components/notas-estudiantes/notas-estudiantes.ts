import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NotaService } from '../../services/nota-service';
import { EstudianteConNotas } from '../../../../data/models/nota.model';

@Component({
  selector: 'app-notas-estudiantes',
  standalone: true,
  templateUrl: './notas-estudiantes.html',
  styleUrls: ['./notas-estudiantes.css'],
  imports: [CommonModule, FormsModule, HttpClientModule, NgFor],
})
export class NotasEstudiantesComponent implements OnInit {
  estudiantes: EstudianteConNotas[] = [];
  filtroNombre: string = '';
  filtroLeccion: string = '';
  pagina = 1;
  porPagina = 10;

  constructor(
    private notaService: NotaService,
    private cdRef: ChangeDetectorRef
  ) {}

  estudianteSeleccionado: EstudianteConNotas | null = null;
  mostrarModal = false;

  ngOnInit(): void {
    this.notaService.getNotas().subscribe({
      next: (data) => {
        console.log('✅ Datos crudos:', data);

        // Agrupar por estudiante
        const agrupado: Record<string, EstudianteConNotas> = {};

        data.forEach((item) => {
          const partes = item.usuario?.trim().split(' ') || [''];
          const nombre = partes[0];
          const apellido = partes.slice(1).join(' ') || '';
          const clave = `${nombre} ${apellido}`;

          if (!agrupado[clave]) {
            agrupado[clave] = {
              nombre,
              apellido,
              notas: [],
            };
          }

          agrupado[clave].notas.push({
            leccion: item.leccion,
            puntuacion: item.puntuacion,
            fecha: item.fecha ? new Date(item.fecha).toISOString() : null,
          });
        });

        this.estudiantes = Object.values(agrupado);
        console.log('✅ Estudiantes agrupados:', this.estudiantes);

        this.cdRef.detectChanges(); // importante en modo zone-less
      },
      error: (err) => console.error('❌ Error al obtener notas:', err),
    });
  }

  // 🔍 Filtros combinados
  get estudiantesFiltrados(): EstudianteConNotas[] {
    return this.estudiantes.filter((est) => {
      const nombreCompleto = `${est.nombre} ${est.apellido}`.toLowerCase();
      const coincideNombre = nombreCompleto.includes(this.filtroNombre.toLowerCase());
      const coincideLeccion = est.notas.some((n) =>
        n.leccion.toLowerCase().includes(this.filtroLeccion.toLowerCase())
      );
      return coincideNombre && coincideLeccion;
    });
  }

  // 📄 Paginación
  get totalPaginas(): number {
    return Math.ceil(this.estudiantesFiltrados.length / this.porPagina);
  }

  get estudiantesPaginados(): EstudianteConNotas[] {
    const inicio = (this.pagina - 1) * this.porPagina;
    return this.estudiantesFiltrados.slice(inicio, inicio + this.porPagina);
  }

  cambiarPagina(delta: number) {
    this.pagina += delta;
  }


  abrirModal(est: EstudianteConNotas) {
    this.estudianteSeleccionado = est;
    this.mostrarModal = true;
  }

  cerrarModal() {
    this.estudianteSeleccionado = null;
    this.mostrarModal = false;
  }

  get promedioEstudiante(): number {
    if (!this.estudianteSeleccionado) return 0;
    const total = this.estudianteSeleccionado.notas.reduce((sum, nota) => sum + nota.puntuacion, 0);
    return total / this.estudianteSeleccionado.notas.length;
  }

}
