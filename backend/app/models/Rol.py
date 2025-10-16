from app.extensions import db
from sqlalchemy.orm import relationship

class Rol(db.Model):
    """
    Representa un rol del sistema ('admin', 'alumno', 'instructor', etc.).
    No depende de un usuario, sino que es asignado a uno o varios usuarios.
    """
    __tablename__ = "rol"
    id = db.Column("idrol", db.Integer, primary_key=True, autoincrement=True)
    nombre = db.Column("nombrerol", db.String(45), nullable=False)
    # Relación inversa: un rol puede estar asignado a muchos usuarios
    usuarios = relationship("Usuario", back_populates="rol", passive_deletes=True)
    def __repr__(self):
        return f"<Rol id={self.id} nombre='{self.nombre}'>"
