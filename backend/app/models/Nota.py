# app/models/nota.py
from app.extensions import db
from sqlalchemy import Numeric, ForeignKey
from sqlalchemy.orm import relationship

class Nota(db.Model):
    __tablename__ = "notas"

    id = db.Column("idnotas", db.Integer, primary_key=True, autoincrement=True)
    puntuacion = db.Column("puntuacion", db.Numeric(5, 2), nullable=False)

    usuario_id = db.Column(
        "usuarios_idusuarios",
        db.Integer,
        ForeignKey("usuarios.idusuarios", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    leccion_id = db.Column(
        "lecciones_idlecciones",
        db.Integer,
        ForeignKey("lecciones.idlecciones", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    usuario = relationship("Usuario", back_populates="notas")
    leccion = relationship("Leccion", back_populates="notas")

    def __repr__(self):
        return f"<Nota {self.id} u:{self.usuario_id} l:{self.leccion_id} {self.puntuacion}>"
