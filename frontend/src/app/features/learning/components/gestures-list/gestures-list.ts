import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { GesturesService, Gesto } from '../../services/gestures.service';
import { LessonService } from '../../services/lesson.service';
import { Navbar } from '../../../../shared/components/navbar/navbar';
import { Lesson } from '../../../../data/models/lesson.model';

@Component({
  selector: 'app-gestures-list',
  standalone: true,
  imports: [NgFor, NgIf, Navbar],
  templateUrl: './gestures-list.html',
  styleUrl: './gestures-list.css'
})
export class GesturesListComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private gesturesService = inject(GesturesService);
  private lessonService = inject(LessonService);

  leccionId!: number;
  leccion = signal<Lesson | null>(null);
  gestos = signal<Gesto[]>([]);
  loading = signal(true);

  ngOnInit(): void {
    this.leccionId = Number(this.route.snapshot.paramMap.get('id'));

    // Traer todas las lecciones y filtrar la que corresponde
    this.lessonService.getLecciones().subscribe({
      next: (lecciones) => {
        const l = lecciones.find(x => x.id === this.leccionId) ?? null;
        this.leccion.set(l);
      },
      error: () => this.leccion.set(null)
    });

    // Traer gestos
    this.gesturesService.getGestosPorLeccion(this.leccionId).subscribe({
      next: (data) => {
        this.gestos.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  practicarGesto(gesto: Gesto) {
    this.router.navigate([`/lecciones/${this.leccionId}/gestos/${gesto.id}/practica`]);
  }
}
