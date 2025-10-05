import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Navbar } from "../../../../shared/components/navbar/navbar";

@Component({
  selector: 'app-register-form',
  imports: [Navbar],
  templateUrl: './register-form.html',
  styleUrl: './register-form.css'
})

export class RegisterFormComponent implements OnInit {
  userForm!: FormGroup;
  roles = ['Administrador', 'Estudiante'];
  successMessage = '';
  errorMessage = '';

  constructor(private fb: FormBuilder, private http: HttpClient) {}

  ngOnInit(): void {
    this.userForm = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rol: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.userForm.invalid) return;

    this.http.post('http://127.0.0.1:5000/api/usuarios', this.userForm.value).subscribe({
      next: (res) => {
        this.successMessage = 'Usuario creado correctamente ✅';
        this.errorMessage = '';
        this.userForm.reset();
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Ocurrió un error al crear el usuario ❌';
        this.successMessage = '';
      }
    });
  }
}
