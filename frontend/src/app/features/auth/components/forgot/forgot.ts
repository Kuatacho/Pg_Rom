// src/app/pages/auth/forgot/forgot.ts
import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../../core/services/api.service';
import { ChangeDetectorRef } from '@angular/core';
@Component({
  selector: 'app-forgot',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './forgot.html',
  styleUrl: './forgot.css'
})
export class Forgot {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private auth = inject(ApiService);
  private cdRef=inject(ChangeDetectorRef);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  loading = false;
  success = false;
  error = '';

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.error = '';
    this.cdRef.detectChanges(); // 👈 importante justo después de cambiar `loading`

    const email = this.form.value.email || '';
    console.log('📨 Enviando email a backend:', email);

    this.auth.forgotPassword(email).subscribe({
      next: () => {
        this.success = true;
        this.loading = false;
        this.cdRef.detectChanges(); // 👈 vuelve a notificar a Angular
      },
      error: (err) => {
        this.error = 'Ocurrió un error al enviar las instrucciones.';
        this.loading = false;
        console.error('Recuperación fallida:', err);
        this.cdRef.detectChanges(); // 👈 importante
      }
    });
  }


  goLogin() {
    this.router.navigate(['/login']);
  }
}
