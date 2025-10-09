// import { Component, inject, signal } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
// import { RouterModule, Router } from '@angular/router';
// import { AuthMockService } from '../../../../core/services/auth-mock.service';
//
// @Component({
//   selector: 'app-login',
//   standalone: true,
//   imports: [CommonModule, ReactiveFormsModule, RouterModule],
//   templateUrl: './login.html',
// })
// export class LoginComponent {
//   private fb = inject(FormBuilder);
//   private auth = inject(AuthMockService);
//   private router = inject(Router);
//
//   loading = false;
//   error = ''; // si quieres seguir mostrando error inline
//
//   // 🔔 Estado de modals
//   showSuccess = false;
//   showError = false;
//   modalMsg = '';
//
//   form = this.fb.group({
//     email: ['', [Validators.required, Validators.email]],
//     password: ['', [Validators.required, Validators.minLength(6)]],
//   });
//
//   // submit() {
//   //   this.error = '';
//   //   if (this.form.invalid) { this.form.markAllAsTouched(); return; }
//   //   this.loading = true;
//   //
//   //   const { email, password } = this.form.value as { email: string; password: string };
//   //
//   //   this.auth.login(email, password).subscribe({
//   //     next: () => {
//   //       this.loading = false;
//   //       this.modalMsg = 'Inicio de sesión correcto. ¡Bienvenido!';
//   //       this.showSuccess = true;
//   //
//   //       // Redirige después de un suspiro; cambia a tu ruta preferida
//   //       setTimeout(() => this.goAfterSuccess(), 1200);
//   //     },
//   //     error: (e) => {
//   //       this.loading = false;
//   //       this.modalMsg = e?.message ?? 'Credenciales inválidas. Inténtalo de nuevo.';
//   //       this.showError = true;
//   //       // opcional: además del modal, también puedes setear error inline
//   //       // this.error = this.modalMsg;
//   //     }
//   //   });
//   // }
//   submit() {
//     this.error.set(null);
//     if (this.form.invalid) {
//       this.form.markAllAsTouched();
//       return;
//     }
//     this.loading.set(true);
//     this.api.login(this.form.value as any).subscribe({
//       next: () => {
//         this.loading.set(false);
//         this.router.navigate(['/dashboard']);
//       },
//       error: (err) => {
//         this.loading.set(false);
//         this.error.set(err?.error?.msg || 'Error al iniciar sesión');
//       },
//     });
//   }
//
//   // 👉 Ruta destino tras éxito (ajusta a /dashboard o lo que uses)
//   goAfterSuccess() {
//     this.closeSuccess();
//     this.router.navigate(['/home']);
//   }
//
//   // Controles de modal
//   closeSuccess() { this.showSuccess = false; }
//   closeError() { this.showError = false; }
// }

//NEW

// features/auth/components/login/login.ts
import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService } from '../../../../core/services/api.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private api = inject(ApiService);
  private router = inject(Router);

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
        this.router.navigate(['/home']);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err?.error?.msg || 'Error al iniciar sesión');
      },
    });
  }
}

