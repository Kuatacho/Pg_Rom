# app/routes/usuarios.py
from collections import OrderedDict
import json
from flask import request, Response, jsonify, current_app
from flask_jwt_extended import jwt_required
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
        ("contrasena", u.contrasena),
        ("rol", u.rol.nombre if u.rol else None),
        ("estado", bool(u.estado) if u.estado is not None else None),
    ])




@bp.get('/get-roles')
@jwt_required()
def get_roles():
    roles=usuario_service.get_all_roles()
    current_app.logger.info(f"Peticion de obtener Roles: {[r.nombre for r in roles]}")
    return jsonify([{"id": r.id, "nombre": r.nombre} for r in roles]), 200


# --- Listar todos los usuarios ---
@bp.get("/list-usuarios")
@jwt_required()
def listar_usuarios():
    usuarios = usuario_service.get_all_users()
    current_app.logger.info(f"Peticion de listar Usuarios registrado")
    return json_response([_public_user_dict(u) for u in usuarios])


# --- Obtener usuario por ID ---
@bp.get("/list-usuarios-by/<int:user_id>")
@jwt_required()
def obtener_usuario(user_id: int):
    u = usuario_service.get_user_by_id(user_id)
    if not u:
        return json_response({"error": "Usuario no encontrado"}, 404)

    current_app.logger.info(f"Peticion de listar Usuarios por ID registrado", {"user_id": user_id})
    return json_response(_public_user_dict(u))


# actualizar usuario
@bp.put("/update-usuario/<int:user_id>")
@jwt_required()
def actualizar_usuario(user_id: int):
    data= request.get_json()
    if not data:
        return json_response({"error": "No se proporcionaron datos"}, 400)
    u = usuario_service.update_user(user_id, data)
    if not u:
        return json_response({"error": "Usuario no encontrado"}, 404)
    current_app.logger.info(f"Peticion de actualizar Usuario registrado", {"user_id": user_id})
    return json_response(_public_user_dict(u))









