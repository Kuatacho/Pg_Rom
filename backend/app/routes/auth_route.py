from flask import  request, jsonify
from werkzeug.security import check_password_hash
from flask_jwt_extended import create_access_token
from app.models.Usuario import Usuario
from app import db
from app.routes import bp
from app.services.auth_service import AuthService
import json
from flask import request, Response
from app.services import mail_service as rs
from app.routes import bp  # reutilizamos el blueprint único


@bp.post('auth/login')
def login():
    data = request.get_json()
    response, status = AuthService.login_usuario(data)
    return jsonify(response), status


#register

@bp.post("auth/register")
def register():
    data = request.get_json()
    response, status = AuthService.registrar_usuario(data)
    return jsonify(response), status


#recuperar contra


@bp.post("auth/recover/forgot")
def forgot_password():
    data = request.get_json(silent=True) or {}
    email = data.get("email", "").strip().lower()

    rs.solicitar_recuperacion(email)
    return Response(
        json.dumps({"message": "Si el correo existe, se enviaron instrucciones"}, ensure_ascii=False),
        mimetype="application/json",
        status=200
    )


@bp.get("auth/recover/verify")
def verify_token():
    token = request.args.get("token", "")
    valido = rs.verificar_token(token)
    status = 200 if valido else 400
    return Response(
        json.dumps({"valid": valido}, ensure_ascii=False),
        mimetype="application/json",
        status=status
    )


@bp.post("auth/recover/reset")
def reset_password():
    data = request.get_json(silent=True) or {}
    token = data.get("token", "")
    new_password = data.get("new_password", "")

    ok = rs.resetear_contrasenia(token, new_password)
    status = 200 if ok else 400
    return Response(
        json.dumps({"ok": ok}, ensure_ascii=False),
        mimetype="application/json",
        status=status
    )
