export interface User{
  id: number;
  nombre: string;
  apellidos: string;
  correo: string;
  genero?: string | null;
  fecha_nacimiento: string;
  celular?: string;
  rol?: string;
  estado:boolean;
}
