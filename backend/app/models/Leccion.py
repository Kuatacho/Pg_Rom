# app/models/leccion.py
from app.extensions import db
from sqlalchemy.orm import relationship

class Leccion(db.Model):
    __tablename__ = "lecciones"

    id = db.Column("idlecciones", db.Integer, primary_key=True, autoincrement=True)
    nombre = db.Column("nombreleccion", db.String(100), nullable=False)

    notas = relationship("Nota", back_populates="leccion", passive_deletes=True)

    def __repr__(self):
        return f"<Leccion {self.id} - {self.nombre}>"
