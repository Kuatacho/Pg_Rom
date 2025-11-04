// Para CREAR una nota
export interface NuevaNota {
  usuario_id: number;
  leccion_id: number;
  puntuacion: number;
  fecha?: string; // opcional
}

// Para MOSTRAR una nota individual
export interface Nota {
  nombre: string;
  apellido: string;
  leccion: string;
  puntuacion: number;
  fecha: string | null;
}

// Estructura agrupada por estudiante
export interface EstudianteConNotas {
  nombre: string;
  apellido: string;
  notas: {
    leccion: string;
    puntuacion: number;
    fecha: string | null;
  }[];
}
