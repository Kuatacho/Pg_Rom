import {Component, inject, AfterViewInit,ChangeDetectorRef} from '@angular/core';
import {CommonModule} from '@angular/common';

import {UsuarioService} from '../../services/usuario-service';
import {Observable} from 'rxjs';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-list-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './list-usuarios.html',
  styleUrl: './list-usuarios.css'
})
export class ListUsuarios implements AfterViewInit {
  private api = inject(UsuarioService);
  private cdr = inject(ChangeDetectorRef);

  usuarios:any[]=[];
  selectedUser:any=null;
  showModal:boolean=false;

  showEditModal=false
  editUser:any=null;
  saving=false





ngAfterViewInit():void {
  this.cargarUsers();
}

  cargarUsers(): void {
    this.api.getAllUsers().subscribe({
      next: (res) => {
        this.usuarios = (res ?? []).map(u => ({ ...u, estado: u.estado ?? false }));
        this.cdr.detectChanges(); // for zoneless change detection
        console.log('Usuarios cargados', this.usuarios);
      },
      error: (err) => {
        console.error('Error al cargar usuarios', err);
        this.usuarios = [];
        this.cdr.detectChanges();
      }
    });
  }

  verDetalles(usuario:any) {
  this.selectedUser = usuario;
  this.showModal = true;
  }

  cerrarModal(){
    this.showModal = false;
    this.selectedUser = null;
  }

  //modal edicion

  editarUsuario(u:any){
    this.editUser = {...u}; // crear una copia para editar
    this.showEditModal = true;
    this.cdr.detectChanges();
  }

  cerrarEditModal(){
    this.showEditModal = false;
    this.editUser = null;
    this.cdr.detectChanges();

  }


  guardarCambios(){
    if(!this.editUser) return;
    this.saving = true;
    const payload = {
      nombre:this.editUser.nombre,
      apellidos:this.editUser.apellidos,
      correo:this.editUser.correo,
      celular:this.editUser.celular,
      estado:this.editUser.estado,
    }

    this.api.updateUser(this.editUser.id, payload).subscribe({
      next: (updated) => {
        // Actualizamos la tabla local
        const idx = this.usuarios.findIndex(u => u.id === this.editUser.id);
        if (idx !== -1) {
          this.usuarios[idx] = { ...this.usuarios[idx], ...payload };
        }

        this.saving = false;
        this.cerrarEditModal();
        this.cdr.detectChanges();

        console.log('Usuario actualizado', updated);
      },
      error: (err) => {
        console.error('Error al actualizar usuario', err);
        this.saving = false;
        this.cdr.detectChanges();
      }


    })
  }




  desactivarUsuario(u:any){
    const nuevoEstado = !u.estado;
    this.api.updateUser(u.id, {estado: nuevoEstado}).subscribe({
      next: (updated) => {
        u.estado = nuevoEstado;
        this.cdr.detectChanges();
        console.log('Usuario desactivado/activado', updated);
      },
      error: (err) => {
        console.error('Error al desactivar/activar usuario', err);
      }
    });
  }
}
