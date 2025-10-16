import {Component, inject, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors} from '@angular/forms';
import {Router} from '@angular/router';
import {ApiService} from '../../../../core/services/api.service';

@Component({
  selector: 'app-register-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register-form.html',
  styleUrls: ['./register-form.css'],
})
export class RegisterForm {
  private fb = inject(FormBuilder);
  private api = inject(ApiService);
  private router = inject(Router);

  loading = signal(false);
  error = signal<string | null>(null);
  showModal = signal(false);
  nuevoUsuario = signal<{ nombre: string; contrasena: string } | null>(null);

  //roles
  roles = signal<string[]>([]);

  //expresiones regulares
  private soloLetras = /^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/;
  private celularRegex = /^[67]\d{7}$/;


  form = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(2), Validators.pattern(this.soloLetras)]],
    apellidos: ['', [Validators.required, Validators.minLength(2), Validators.pattern(this.soloLetras)]],
    correo: ['', [Validators.required, Validators.email]],
    genero: [''],
    fecha_nacimiento: ['',[ Validators.required, this.validarEdadMinima]],
    celular: ['', [Validators.required, Validators.pattern(this.celularRegex)]],
    rol: ['User', Validators.required], // valor por defecto
  });

  ngOnInit() {
    this.cargarRoles();
  }


  validarEdadMinima(control: AbstractControl): ValidationErrors | null {
    const fecha = control.value;
    if (!fecha) return null;

    const nacimiento = new Date(fecha);
    const hoy = new Date();
    const edad = hoy.getFullYear() - nacimiento.getFullYear();
    const ajusteMes = hoy.getMonth() - nacimiento.getMonth();

    //ajustamos
    const edadReal = ajusteMes < 0 || (ajusteMes === 0 && hoy.getDate() < nacimiento.getDate()) ? edad - 1 : edad;
    return edadReal < 7 ?{edadMinima: true} : null;
  }

  submit() {
    this.error.set(null);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.api.register(this.form.value).subscribe({
      next: (res: any) => {
        this.loading.set(false);
        const nombre = res.usuario?.nombre || 'Usuario';
        const contrasena = res['contrasenia_generada'] || 'N/A';
        this.nuevoUsuario.set({nombre, contrasena});
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

  cargarRoles() {
    this.api.getRoles().subscribe({
      next: (res: any) => {
        this.roles.set(res.map((r: any) => r.nombre));
        console.log("exito al cargar roles");

      },
      error: (err) => {
        console.log('error cargar roles', err);
      }
    })

  }
}
