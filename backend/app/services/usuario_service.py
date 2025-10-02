# app/services/usuario_service.py
import secrets
import string
from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy.exc import IntegrityError
from app import db
from app.models import Usuario


# --- Generar contraseña aleatoria ---
def generate_random_password(length: int = 10) -> str:
    alphabet = string.ascii_letters + string.digits + "!@#$%^&*"
    return ''.join(secrets.choice(alphabet) for _ in range(length))


# --- Obtener todos los usuarios ---
def get_all_users():
    return Usuario.query.order_by(Usuario.id.asc()).all()


# --- Obtener usuario por ID ---
def get_user_by_id(user_id: int):
    return Usuario.query.get(user_id)


# --- Registrar un usuario (password generado automáticamente) ---
def create_user(data: dict):
    try:
        if not data.get("correo"):
            raise ValueError("El correo es obligatorio")

        # Generar password aleatorio
        plain_password = generate_random_password(12)  # 12 caracteres por defecto
        hashed_password = generate_password_hash(plain_password)

        new_user = Usuario(
            nombre=data.get("nombre", "").strip(),
            apellidos=data.get("apellidos", "").strip(),
            correo=data["correo"].strip().lower(),
            genero=data.get("genero"),
            fecha_nacimiento=data.get("fecha_nacimiento"),
            contrasena=hashed_password,
            celular=data.get("celular"),
        )

        db.session.add(new_user)
        db.session.commit()

        # Devolver user + password plano (solo aquí)
        return new_user, plain_password

    except IntegrityError:
        db.session.rollback()
        raise ValueError("El correo ya está registrado")


# --- Login de usuario ---
def login_user(correo: str, password: str):
    user = Usuario.query.filter_by(correo=correo.strip().lower()).first()
    if not user or not check_password_hash(user.contrasena, password):
        return None
    return user
