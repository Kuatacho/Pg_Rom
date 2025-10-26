import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { GesturesService, Gesto } from '../../services/gestures.service';
import {Navbar} from '../../../../shared/components/navbar/navbar';

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

  leccionId!: number;
  gestos = signal<Gesto[]>([]);
  loading = signal(true);

  ngOnInit(): void {
    this.leccionId = Number(this.route.snapshot.paramMap.get('id'));
    this.gesturesService.getGestosPorLeccion(this.leccionId).subscribe({
      next: (data) => {
        this.gestos.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  practicarGesto(gesto: Gesto) {
    this.router.navigate([`/lecciones/${this.leccionId}/gestos/${gesto.id}/practica`]);
  }
}
