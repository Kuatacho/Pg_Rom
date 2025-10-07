from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token
from app.extensions import db
from app.models.Usuario import Usuario
from app.models.Rol import Rol
import string
import secrets


# --- Generar contraseña aleatoria ---
def generate_random_password(length: int = 12) -> str:
    alphabet = string.ascii_letters + string.digits + "!@#$%^&*"
    return ''.join(secrets.choice(alphabet) for _ in range(length))

class AuthService:
    @staticmethod
    def registrar_usuario(data):
        """
        Registra un nuevo usuario y le asigna rol por defecto.
        """
        plain_password = generate_random_password()
        hashed_password = generate_password_hash(plain_password)

        correo = data.get("correo")
        contrasena = data.get("contrasena")

        if Usuario.query.filter_by(correo=correo).first():
            return {"msg": "El correo ya está registrado"}, 409

        usuario = Usuario(
            nombre=data.get("nombre"),
            apellidos=data.get("apellidos"),
            correo=correo,
            genero=data.get("genero"),
            fecha_nacimiento=data.get("fecha_nacimiento"),
            celular=data.get("celular"),
            contrasena=hashed_password,
        )
        db.session.add(usuario)
        db.session.commit()

        # Si el frontend manda "rol", úsalo, si no, asigna "User"
        rol_asignado = data.get("rol", "User")
        rol = Rol(usuario_id=usuario.id, rol=rol_asignado)
        db.session.add(rol)
        db.session.commit()

        return {"msg": f"Usuario registrado como {rol_asignado}", "usuario": usuario.to_dict(), "contrasenia generada": plain_password}, 201

    @staticmethod
    def login_usuario(data):
        """
        Inicia sesión y genera un token JWT.
        """
        correo = data.get("correo")
        contrasena = data.get("contrasena")

        usuario = Usuario.query.filter_by(correo=correo).first()
        if not usuario or not check_password_hash(usuario.contrasena, contrasena):
            return {"msg": "Credenciales incorrectas"}, 401

        rol = usuario.get_rol() or "User"

        token = create_access_token(identity=correo, additional_claims={"id": usuario.id, "role": rol})
        return {
            "access_token": token,
            "usuario": usuario.to_dict()
        }, 200
