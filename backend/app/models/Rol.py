# app/models/rol.py
from app import db
from sqlalchemy import ForeignKey
from sqlalchemy.orm import relationship

class Rol(db.Model):
    __tablename__ = "rol"

    id = db.Column("idrol", db.Integer, primary_key=True, autoincrement=True)
    usuario_id = db.Column(
        "usuarios_idusuarios",
        db.Integer,
        ForeignKey("usuarios.idusuarios", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    rol = db.Column("rol", db.String(45), nullable=False)

    usuario = relationship("Usuario", back_populates="roles")

    def __repr__(self):
        return f"<Rol {self.id} u:{self.usuario_id} {self.rol}>"
