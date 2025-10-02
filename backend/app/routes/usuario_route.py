# app/routes/usuarios.py
from flask import request, jsonify
from app.routes import bp
from app.services import usuario_service


# --- Listar todos los usuarios ---
@bp.get("/usuarios")
def listar_usuarios():
    usuarios = usuario_service.get_all_users()
    return jsonify([u.to_dict() for u in usuarios]), 200


# --- Obtener usuario por ID ---
@bp.get("/usuarios/<int:user_id>")
def obtener_usuario(user_id):
    u = usuario_service.get_user_by_id(user_id)
    if not u:
        return jsonify({"error": "Usuario no encontrado"}), 404
    return jsonify(u.to_dict()), 200


# --- Registrar un nuevo usuario (password generado automáticamente) ---
@bp.post("/usuarios/register")
def registrar_usuario():
    data = request.get_json(silent=True) or {}

    try:
        new_user, plain_password = usuario_service.create_user(data)
        return jsonify({
            "usuario": new_user.to_dict(),
            "password": plain_password  # ⚠️ Devuelto solo una vez
        }), 201
    except ValueError as ve:
        return jsonify({"error": str(ve)}), 400
    except Exception as e:
        return jsonify({"error": f"Error interno: {str(e)}"}), 500


# --- Login de usuario ---
@bp.post("/usuarios/login")
def login_usuario():
    data = request.get_json(silent=True) or {}

    correo = data.get("correo")
    password = data.get("contrasena")
    if not correo or not password:
        return jsonify({"error": "Correo y contraseña son requeridos"}), 400

    user = usuario_service.login_user(correo, password)
    if not user:
        return jsonify({"error": "Credenciales inválidas"}), 401

    return jsonify(user.to_dict()), 200
