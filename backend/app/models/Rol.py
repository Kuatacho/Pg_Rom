from app.extensions import db
from sqlalchemy import ForeignKey
from sqlalchemy.orm import relationship


class Rol(db.Model):
    """
    Representa un rol del sistema (ej. 'admin', 'alumno', 'instructor', etc.).
    Se asocia a un usuario mediante la FK 'usuarios_idusuarios'.
    """
    __tablename__ = "rol"

    # ==========================
    # CAMPOS / COLUMNAS
    # ==========================
    id = db.Column("idrol", db.Integer, primary_key=True, autoincrement=True)

    # ForeignKey conecta con el id del usuario
    usuario_id = db.Column(
        "usuarios_idusuarios",
        db.Integer,
        ForeignKey("usuarios.idusuarios", ondelete="CASCADE"),  # elimina el rol si se elimina el usuario
        nullable=False,
        index=True,
    )

    # Nombre del rol: 'admin', 'alumno', etc.
    rol = db.Column("rol", db.String(45), nullable=False)

    # ==========================
    # RELACIÓN INVERSA
    # ==========================
    usuario = relationship("Usuario", back_populates="roles")

    def __repr__(self):
        """Representación legible del rol."""
        return f"<Rol {self.id} usuario:{self.usuario_id} {self.rol}>"
