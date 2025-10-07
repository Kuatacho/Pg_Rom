# app/services/usuario_service.py
import secrets
import string
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy.exc import IntegrityError
from app import db
from app.models import Usuario





# --- Obtener todos los usuarios ---
def get_all_users():
    return Usuario.query.order_by(Usuario.id.asc()).all()


# --- Obtener usuario por ID ---
def get_user_by_id(user_id: int):
    return Usuario.query.get(user_id)



