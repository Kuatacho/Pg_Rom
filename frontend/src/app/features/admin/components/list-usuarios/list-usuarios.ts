import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEye, faEdit,faSearch } from '@fortawesome/free-solid-svg-icons';
import { UsuarioService } from '../../services/usuario-service';


@Component({
  selector: 'app-list-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule, FontAwesomeModule],
  templateUrl: './list-usuarios.html',
  styleUrls: ['./list-usuarios.css']
})
export class ListUsuarios {
  private api = inject(UsuarioService);
  private cdr = inject(ChangeDetectorRef);

  // --- DATA ---
  usuarios: any[] = [];
  usuariosPagina: any[] = [];
  paginaActual = 1;
  porPagina = 10;

  selectedUser: any = null;
  showModal = false;

  showEditModal = false;
  editUser: any = null;
  saving = false;

  // --- NUEVO: Modal de confirmación ---
  showConfirmModal = false;
  userToConfirm: any = null;
  newEstado: boolean = false;

  // --- ICONOS ---
  faEye = faEye;
  faEdit = faEdit;
  faSearch = faSearch;


  // --- ESTADOS TEMPORALES ---
  savingIds = new Set<number>();
  protected readonly Math = Math;
  private inputSwitchRef: HTMLInputElement | null = null;

  //filtros
  filtroTexto: string = '';
  filtroRol: string = '';
  filtroEstado: boolean | '' = '';


  ngOnInit() {
    this.cargarUsers();
  }

  // === CARGA DE USUARIOS ===
  cargarUsers(): void {
    this.api.getAllUsers().subscribe({
      next: (res) => {
        this.usuarios = (res ?? []).map(u => ({ ...u, estado: u.estado ?? false }));
        this.actualizarPaginacion();
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al cargar usuarios', err)
    });
  }

  actualizarPaginacion() {
    const i = (this.paginaActual - 1) * this.porPagina;
    const f = i + this.porPagina;
    this.usuariosPagina = this.usuarios.slice(i, f);
  }

  siguientePagina() {
    if (this.paginaActual * this.porPagina < this.usuarios.length) {
      this.paginaActual++;
      this.actualizarPaginacion();
      this.cdr.detectChanges();
    }
  }

  anteriorPagina() {
    if (this.paginaActual > 1) {
      this.paginaActual--;
      this.actualizarPaginacion();
      this.cdr.detectChanges();
    }
  }

  // === DETALLES USUARIO ===
  verDetalles(usuario: any) {
    this.selectedUser = usuario;
    this.showModal = true;
    this.cdr.detectChanges();
  }

  cerrarModal() {
    this.showModal = false;
    this.selectedUser = null;
    this.cdr.detectChanges();
  }

  // === EDICIÓN USUARIO ===
  editarUsuario(u: any) {
    this.editUser = { ...u };
    this.showEditModal = true;
    this.cdr.detectChanges();
  }

  cerrarEditModal() {
    this.showEditModal = false;
    this.editUser = null;
    this.cdr.detectChanges();
  }

  guardarCambios() {
    if (!this.editUser?.id) return;
    this.saving = true;

    const payload = {
      nombre: this.editUser.nombre,
      apellidos: this.editUser.apellidos,
      correo: this.editUser.correo,
      celular: this.editUser.celular,
      estado: this.editUser.estado
    };

    this.api.updateUser(this.editUser.id, payload).subscribe({
      next: () => {
        const idx = this.usuarios.findIndex(u => u.id === this.editUser.id);
        if (idx !== -1) {
          this.usuarios[idx] = { ...this.usuarios[idx], ...payload };
          this.actualizarPaginacion();
        }
        this.saving = false;
        this.cerrarEditModal();
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.saving = false;
        console.error('Error al actualizar usuario', err);
        this.cdr.detectChanges();
      }
    });
  }

  // === MANEJO DEL SWITCH ===
  getCheckedValue(event: Event): boolean {
    return (event.currentTarget as HTMLInputElement).checked;
  }

  // Paso previo: pedir confirmación
  solicitarConfirmacion(u: any, checked: boolean, inputEl: HTMLInputElement) {
    this.userToConfirm = u;
    this.newEstado = checked;
    this.inputSwitchRef = inputEl; // referencia directa al input
    this.showConfirmModal = true;
    this.cdr.detectChanges();
  }

  cancelarCambioEstado() {
    if (this.userToConfirm) {
      // revertir el modelo
      this.userToConfirm.estado = !this.newEstado;

      // revertir el input visual (el switch)
      if (this.inputSwitchRef) {
        this.inputSwitchRef.checked = !this.newEstado;
      }
    }

    // limpiar estado temporal
    this.userToConfirm = null;
    this.inputSwitchRef = null;
    this.showConfirmModal = false;
    this.cdr.detectChanges();
  }

  confirmarCambioEstado() {
    if (!this.userToConfirm) return;
    const u = this.userToConfirm;
    const checked = this.newEstado;
    this.showConfirmModal = false;

    this.aplicarCambioEstado(u, checked);
  }

  // Aplicar realmente el cambio de estado
  aplicarCambioEstado(u: any, checked: boolean) {
    if (this.savingIds.has(u.id)) return;

    const prev = u.estado;
    u.estado = checked;
    this.savingIds.add(u.id);
    this.cdr.detectChanges();

    this.api.updateUser(u.id, { estado: checked }).subscribe({
      next: () => {
        this.savingIds.delete(u.id);
        this.userToConfirm = null;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cambiar estado', err);
        u.estado = prev; // revertir si falla
        this.savingIds.delete(u.id);
        this.userToConfirm = null;
        this.cdr.detectChanges();
      }
    });
  }



  //filtros
  aplicarFiltros() {
    let filtrados = this.usuarios;

    // 🔍 Texto
    if (this.filtroTexto.trim()) {
      const txt = this.filtroTexto.toLowerCase();
      filtrados = filtrados.filter(u =>
        u.nombre.toLowerCase().includes(txt) ||
        u.apellidos.toLowerCase().includes(txt) ||
        u.correo.toLowerCase().includes(txt)
      );
    }

    // 🎭 Rol
    if (this.filtroRol) {
      filtrados = filtrados.filter(u => u.rol === this.filtroRol);
    }

    // ⚙️ Estado
    if (this.filtroEstado !== '') {
      filtrados = filtrados.filter(u => u.estado === this.filtroEstado);
    }

    this.usuariosPagina = filtrados.slice(
      (this.paginaActual - 1) * this.porPagina,
      this.paginaActual * this.porPagina
    );
    this.cdr.detectChanges();
  }
}
