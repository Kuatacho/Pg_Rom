# app/models/recuperacion.py
from app import db
from sqlalchemy import ForeignKey
from sqlalchemy.orm import relationship

class Recuperacion(db.Model):
    __tablename__ = "recuperacion"

    id = db.Column("id", db.Integer, primary_key=True, autoincrement=True)
    usuario_id = db.Column(
        "idusuario",
        db.Integer,
        ForeignKey("usuarios.idusuarios", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    token = db.Column("token", db.String(255), nullable=False)
    expira = db.Column("expira", db.DateTime, nullable=False)
    usado = db.Column("usado", db.Boolean, nullable=False, default=False, server_default=db.text("false"))

    usuario = relationship("Usuario", back_populates="recuperaciones")

    def __repr__(self):
        return f"<Recuperacion {self.id} u:{self.usuario_id} usado:{self.usado}>"
