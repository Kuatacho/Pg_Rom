import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../../../core/services/api.service';
import {Navbar} from '../../../../shared/components/navbar/navbar';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, Navbar],
  templateUrl: './register.html',
  styleUrls: ['./register.css'],
})
export class Register{
  private fb = inject(FormBuilder);
  private api = inject(ApiService);
  private router = inject(Router);

  loading = signal(false);
  error = signal<string | null>(null);

  // 👇 Nuevo: estado del modal
  showModal = signal(false);
  nuevoUsuario = signal<{ nombre: string; contrasena: string } | null>(null);

  form = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(2)]],
    apellidos: ['', [Validators.required, Validators.minLength(2)]],
    correo: ['', [Validators.required, Validators.email]],
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
      next: (res: any) => {
        this.loading.set(false);
        const nombre = res.usuario?.nombre || 'Usuario';
        const contrasena = res['contrasenia generada'] || 'N/A';

        // Guardar datos para mostrar en modal
        this.nuevoUsuario.set({ nombre, contrasena });
        console.log('MOSTRAR MODAL');
        this.showModal.set(true);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err?.error?.msg || 'Error al registrar usuario');
      },
    });
  }

  cerrarModal() {
    this.showModal.set(false);
    this.router.navigate(['/login']);
  }

  copiarContrasena() {
    const contrasena = this.nuevoUsuario()?.contrasena;
    if (contrasena) {
      navigator.clipboard.writeText(contrasena);
      alert('Contraseña copiada al portapapeles');
    }
  }
}
