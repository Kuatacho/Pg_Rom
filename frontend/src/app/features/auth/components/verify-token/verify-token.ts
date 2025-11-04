// src/app/pages/auth/verify-token/verify-token.ts
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../../core/services/api.service';

@Component({
  selector: 'app-verify-token',
  standalone: true,
  template: `<p class="text-center mt-20 text-lg">Verificando token...</p>`
})
export class VerifyTokenComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private api = inject(ApiService);

  ngOnInit() {
    const token = this.route.snapshot.queryParamMap.get('token') || '';
    if (!token) {
      this.router.navigate(['/auth/forgot']);
      return;
    }

    this.api.verifyToken(token).subscribe({
      next: (res) => {
        if (res.valid) {
          this.router.navigate(['/auth/reset'], { queryParams: { token } });
        } else {
          this.router.navigate(['/auth/forgot'], {
            queryParams: { error: 'Token inválido o expirado' }
          });
        }
      },
      error: () => {
        this.router.navigate(['/auth/forgot'], {
          queryParams: { error: 'Error al verificar el token' }
        });
      }
    });
  }
}
