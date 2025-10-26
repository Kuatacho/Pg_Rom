import {Component, inject, OnInit, signal} from '@angular/core';
import {NgFor, NgIf} from '@angular/common';
import {LessonService} from '../../services/lesson.service';
import {Router} from '@angular/router';
import {Lesson} from '../../../../data/models/lesson.model';
import {Navbar} from '../../../../shared/components/navbar/navbar';

@Component({
  selector: 'app-lessons-list',
  standalone: true,
  imports: [NgFor, NgIf, Navbar],
  templateUrl: './lessons-list.html',
  styleUrl: './lessons-list.css'
})
export class LessonsList implements OnInit {
  private lessonsService = inject(LessonService);
  private router = inject(Router);

  lecciones = signal<Lesson[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  ngOnInit() {
    this.loadLecciones();
  }

  loadLecciones() {
    this.loading.set(true);
    this.error.set(null);

    this.lessonsService.getLecciones().subscribe({
      next: (data) => {
        this.lecciones.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Error al cargar las lecciones');
        console.error(err);
        this.loading.set(false);
      }
    });
  }

  openLesson(lesson: Lesson) {
    this.router.navigate(['/lecciones', lesson.id, 'gestos']);
  }

  trackById(_i: number, l: Lesson) {
    return l.id;
  }


}
