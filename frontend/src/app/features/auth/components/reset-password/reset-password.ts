// src/app/pages/auth/reset-password/reset-password.ts
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../../core/services/api.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reset-password.html'
})
export class ResetPasswordComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private api = inject(ApiService);
  private cdRef = inject(ChangeDetectorRef); //  Necesario para zone-less

  token = this.route.snapshot.queryParamMap.get('token') || '';
  loading = false;
  success = false;
  error = '';

  form = this.fb.group({
    new_password: ['', [Validators.required, Validators.minLength(6)]],
  });

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.error = '';
    this.cdRef.detectChanges(); //  Forzar actualización de vista

    const new_password = this.form.value.new_password || '';

    this.api.resetPassword(this.token, new_password).subscribe({
      next: () => {
        this.success = true;
        this.loading = false;
        this.cdRef.detectChanges(); // Refresca la vista al terminar
      },
      error: (err) => {
        console.error(' Error al cambiar contraseña:', err);
        this.error = 'No se pudo cambiar la contraseña. Verifica el enlace o inténtalo más tarde.';
        this.loading = false;
        this.cdRef.detectChanges(); //  Refresca para mostrar el error
      },
    });
  }

  goLogin() {
    this.router.navigate(['/login']);
  }
}
