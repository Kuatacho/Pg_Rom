import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Navbar } from '../../../../shared/components/navbar/navbar';
import {NotaService} from '../../services/nota.service';
import { TokenService } from '../../../../core/services/token.service';
import {Nota, NuevaNota} from '../../../../data/models/nota.model';

@Component({
  selector: 'app-lesson-results',
  standalone: true,
  imports: [CommonModule, Navbar],
  templateUrl: './lesson-results.html',
  styleUrls: ['./lesson-results.css']
})
export class LessonResults implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private notaService = inject(NotaService);
  private tokenService = inject(TokenService);

  leccionId!: number;
  usuarioId!: number;
  gestosResultados: { nombre: string; nota: number }[] = [];
  promedio = 0;

  ngOnInit(): void {
    this.leccionId = Number(this.route.snapshot.paramMap.get('leccionId'));

    // 🧩 Obtener usuario autenticado desde el TokenService
    const user = this.tokenService.getUser<{ id: number; nombre?: string }>();
    if (!user || !user.id) {
      alert('⚠️ Sesión expirada o usuario no válido. Inicia sesión nuevamente.');
      this.router.navigate(['/login']);
      return;
    }

    this.usuarioId = user.id;

    // 🔹 Recuperar progreso guardado en localStorage
    const key = `progress_leccion_${this.leccionId}`;
    const saved = localStorage.getItem(key);

    if (saved) {
      this.gestosResultados = JSON.parse(saved);
      this.calcularPromedio();
    } else {
      alert('No hay resultados guardados para esta lección.');
      this.router.navigate(['/lecciones']);
    }
  }

  calcularPromedio() {
    if (this.gestosResultados.length === 0) return;
    const total = this.gestosResultados.reduce((acc, g) => acc + g.nota, 0);
    this.promedio = Math.round(total / this.gestosResultados.length);
  }

  volverAIntentar() {
    localStorage.removeItem(`progress_leccion_${this.leccionId}`);
    this.router.navigate([`/lecciones/${this.leccionId}/gestos/1/practica`]);
  }

  registrarNota() {
    const payload: NuevaNota = {
      usuario_id: this.usuarioId,
      leccion_id: this.leccionId,
      puntuacion: this.promedio
    };

    console.log('📤 Enviando nota:', payload);

    this.notaService.registerAverage(payload).subscribe({
      next: () => {
        alert('✅ Nota registrada correctamente');
        localStorage.removeItem(`progress_leccion_${this.leccionId}`);
        this.router.navigate(['/lecciones']);
      },
      error: (err) => {
        console.error('❌ Error al registrar la nota', err);
        alert('Error al registrar la nota. Intenta de nuevo más tarde.');
      }
    });
  }

  protected volverALecciones() {

  }
}
