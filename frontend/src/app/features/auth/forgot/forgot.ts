import { Component,inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'app-forgot',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './forgot.html',
  styleUrl: './forgot.css'
})
export class Forgot {
  private fb = inject(FormBuilder);
  private router = inject(Router);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  // Solo UI: sin llamadas a backend
  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    // Mantén solo la UI; si quieres, luego acá conectas tu API.
  }

  goLogin() {
    this.router.navigate(['/login']);
  }

}
