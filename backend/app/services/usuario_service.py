# app/services/usuario_service.py
import secrets
import string
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy.exc import IntegrityError
from app import db
from app.models import Usuario, Rol


def get_all_roles():
    return Rol.query.all()


# --- Obtener todos los usuarios ---
def get_all_users():
    return Usuario.query.all()


# --- Obtener usuario por ID ---
def get_user_by_id(user_id: int):
    return Usuario.query.get(user_id)

# actualizar usuario
def update_user(user_id: int, data: dict):
    user = get_user_by_id(user_id)
    if not user:
        return None

    for key, value in data.items():
        if hasattr(user, key):
            setattr(user, key, value)

    db.session.commit()
    return user





