import {Component, inject, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {ApiService} from '../../../../core/services/api.service';
import {Router} from '@angular/router';
import {Navbar} from '../../../../shared/components/navbar/navbar';

@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule, Navbar],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  private fb = inject(FormBuilder);
  private api = inject(ApiService);
  private router = inject(Router);

  loading = signal(false);
  success = signal(false);
  error = signal<string | null>(null);

  form = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(2)]],
    apellidos: ['', [Validators.required, Validators.minLength(2)]],
    correo: ['', [Validators.required, Validators.email]],
    contrasena: ['', [Validators.required, Validators.minLength(6)]],
    genero: [''],
    fecha_nacimiento: [''],
    celular: ['', [Validators.pattern(/^[0-9]{8,15}$/)]],
  });

  submit() {
    this.error.set(null);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.api.register(this.form.value as any).subscribe({
      next: () => {
        this.loading.set(false);
        this.success.set(true);
        setTimeout(() => this.router.navigate(['/home']), 2000);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err?.error?.msg || 'Error al registrar usuario');
      },
    });
  }

}
