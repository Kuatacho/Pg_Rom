from datetime import date
from app.extensions import db
from sqlalchemy.orm import relationship
from collections import OrderedDict


class Usuario(db.Model):
    """
    Representa a un usuario del sistema.
    Se mapea con la tabla 'usuarios' en la base de datos.
    """
    __tablename__ = "usuarios"

    # ==========================
    # CAMPOS / COLUMNAS
    # ==========================
    id = db.Column("idusuarios", db.Integer, primary_key=True, autoincrement=True)
    nombre = db.Column("nombre", db.String(45), nullable=False)
    apellidos = db.Column("apellidos", db.String(45), nullable=False)
    correo = db.Column("correo", db.String(100), nullable=False, unique=True, index=True)
    genero = db.Column("genero", db.String(45))
    fecha_nacimiento = db.Column("fechanacimiento", db.Date)
    contrasena = db.Column("contrasena", db.String(255), nullable=False)
    celular = db.Column("celular", db.String(15))

    # ==========================
    # RELACIONES
    # ==========================
    # Un usuario puede tener varias notas (una relación uno a muchos)
    notas = relationship("Nota", back_populates="usuario", passive_deletes=True)

    # Un usuario puede tener varios roles (por ejemplo, "admin", "alumno", etc.)
    # ⚠️ Si solo tendrá UN rol, igual se deja como lista y se usa el primero (roles[0])
    roles = relationship("Rol", back_populates="usuario", passive_deletes=True, uselist=True)

    # Un usuario puede tener varios registros de recuperación de contraseña
    recuperaciones = relationship("Recuperacion", back_populates="usuario", passive_deletes=True)

    # ==========================
    # MÉTODOS DE UTILIDAD
    # ==========================
    def to_dict(self):
        """
        Convierte el objeto Usuario en un diccionario listo para devolver como JSON.
        Incluye el rol del usuario de forma dinámica (aunque no sea un campo físico).
        """
        return OrderedDict({
            "id": self.id,
            "nombre": self.nombre,
            "apellidos": self.apellidos,
            "correo": self.correo,
            "genero": self.genero,
            "fecha_nacimiento": (
                self.fecha_nacimiento.isoformat()
                if isinstance(self.fecha_nacimiento, date) and self.fecha_nacimiento
                else None
            ),
            "celular": self.celular,
            # ⚠️ No se recomienda exponer la contraseña, incluso si está hasheada
            "rol": self.get_rol()
        })

    def get_rol(self):
        """
        Retorna el primer rol asociado al usuario.
        Si no tiene roles asignados, devuelve None.
        """
        return self.roles[0].rol if self.roles else None

    def __repr__(self):
        """Representación legible en la consola (útil para debug)."""
        return f"<Usuario {self.correo}>"
