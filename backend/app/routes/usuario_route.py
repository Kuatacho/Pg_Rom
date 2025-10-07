# app/routes/usuarios.py
from collections import OrderedDict
import json
from flask import request, Response
from app.routes import bp
from app.services import usuario_service


# --- Helper para respuesta JSON ---
def json_response(payload, status=200):
    return Response(
        json.dumps(payload, ensure_ascii=False),
        mimetype="application/json",
        status=status
    )


def _public_user_dict(u) -> OrderedDict:
    """
    Construye JSON público del usuario con 'id' primero
    """
    return OrderedDict([
        ("id", u.id),
        ("nombre", u.nombre),
        ("apellidos", u.apellidos),
        ("correo", u.correo),
        ("genero", u.genero),
        ("fecha_nacimiento", u.fecha_nacimiento.isoformat() if u.fecha_nacimiento else None),
        ("celular", u.celular),
        ("contrasena", u.contrasena)
    ])


# --- Listar todos los usuarios ---
@bp.get("/usuarios")
def listar_usuarios():
    usuarios = usuario_service.get_all_users()
    return json_response([_public_user_dict(u) for u in usuarios])


# --- Obtener usuario por ID ---
@bp.get("/usuarios/<int:user_id>")
def obtener_usuario(user_id: int):
    u = usuario_service.get_user_by_id(user_id)
    if not u:
        return json_response({"error": "Usuario no encontrado"}, 404)
    return json_response(_public_user_dict(u))



# # --- Login de usuario ---
# @bp.post("/usuarios/login")
# def login_usuario():
#     data = request.get_json(silent=True) or {}
#     correo = (data.get("correo") or "").strip().lower()
#     password = data.get("contrasena") or ""
#
#     if not correo or not password:
#         return json_response({"error": "Correo y contraseña son requeridos"}, 400)
#
#     user = usuario_service.login_user(correo, password)
#     if not user:
#         return json_response({"error": "Credenciales inválidas"}, 401)
#
#     return json_response(_public_user_dict(user))
