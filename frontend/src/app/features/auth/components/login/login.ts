
import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService } from '../../../../core/services/api.service';
import {TokenService} from '../../../../core/services/token.service';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class Login {
  private fb = inject(FormBuilder);
  private api = inject(ApiService);
  private router = inject(Router);
  private token=inject(TokenService);

  loading = signal(false);
  error = signal<string | null>(null);

  form = this.fb.group({
    correo: ['', [Validators.required, Validators.email]],
    contrasena: ['', [Validators.required, Validators.minLength(6)]],
  });

  submit() {
    this.error.set(null);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading.set(true);
    this.api.login(this.form.value as any).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate([this.token.getDefaultRedirect()]);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err?.error?.msg || 'Error al iniciar sesión');
      },
    });
  }
}

