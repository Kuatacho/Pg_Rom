# app/services/usuario_service.py
import secrets
import string
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy.exc import IntegrityError
from app import db
from app.models import Usuario


# --- Generar contraseña aleatoria ---
def generate_random_password(length: int = 12) -> str:
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
    """
    Crea un nuevo usuario con validaciones y devuelve:
    - el objeto usuario
    - la contraseña en texto plano (generada automáticamente)
    """
    if not data.get("correo"):
        raise ValueError("El correo es obligatorio")

    # Normalizar valores
    correo = data["correo"].strip().lower()
    nombre = (data.get("nombre") or "").strip()
    apellidos = (data.get("apellidos") or "").strip()
    genero = data.get("genero")
    celular = data.get("celular")

    # Parsear fecha de nacimiento si existe
    fecha_nacimiento = None
    if data.get("fecha_nacimiento"):
        try:
            fecha_nacimiento = datetime.strptime(data["fecha_nacimiento"], "%Y-%m-%d").date()
        except ValueError:
            raise ValueError("Formato de fecha inválido, usa YYYY-MM-DD")

    # Generar y hashear contraseña
    plain_password = generate_random_password()
    hashed_password = generate_password_hash(plain_password)

    new_user = Usuario(
        nombre=nombre,
        apellidos=apellidos,
        correo=correo,
        genero=genero,
        fecha_nacimiento=fecha_nacimiento,
        contrasena=hashed_password,
        celular=celular,
    )

    try:
        db.session.add(new_user)
        db.session.commit()
        return new_user, plain_password
    except IntegrityError:
        db.session.rollback()
        raise ValueError("El correo ya está registrado")


# --- Login de usuario ---
def login_user(correo: str, password: str):
    """
    Verifica credenciales. Devuelve el usuario si son correctas, None si no.
    """
    user = Usuario.query.filter_by(correo=correo.strip().lower()).first()
    if not user or not check_password_hash(user.contrasena, password):
        return None
    return user
