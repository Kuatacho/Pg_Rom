from datetime import date
from app.extensions import db
from sqlalchemy.orm import relationship
from collections import OrderedDict

class Usuario(db.Model):
    """
    Representa a un usuario del sistema.
    """
    __tablename__ = "usuarios"

    id = db.Column("idusuarios", db.Integer, primary_key=True, autoincrement=True)
    nombre = db.Column("nombre", db.String(45), nullable=False)
    apellidos = db.Column("apellidos", db.String(45), nullable=False)
    correo = db.Column("correo", db.String(100), nullable=False, unique=True, index=True)
    genero = db.Column("genero", db.String(45))
    fecha_nacimiento = db.Column("fechanacimiento", db.Date)
    contrasena = db.Column("contrasena", db.String(255), nullable=False)
    celular = db.Column("celular", db.String(15))

    # 🔄 Foreign Key al rol
    id_rol = db.Column("idrol", db.Integer, db.ForeignKey("rol.idrol", ondelete="SET NULL"), nullable=True)

    # ✅ Relación uno a muchos inversa (un usuario tiene UN rol)
    rol = relationship("Rol", back_populates="usuarios")

    # Otras relaciones
    notas = relationship("Nota", back_populates="usuario", passive_deletes=True)
    recuperaciones = relationship("Recuperacion", back_populates="usuario", passive_deletes=True)

    # Métodos utilitarios
    def to_dict(self):
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
            "rol": self.rol.nombre if self.rol else None
        })

    def __repr__(self):
        return f"<Usuario {self.correo}>"
