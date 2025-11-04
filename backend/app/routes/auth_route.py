from flask import jsonify
from app.services.auth_service import AuthService
import json
from flask import request, Response, current_app
from app.services import mail_service as rs, auth_service
from app.routes import bp  # reutilizamos el blueprint único


@bp.post('auth/login')
def login():
    data = request.get_json()
    response, status = AuthService.login_usuario(data)
    current_app.logger.info(f"Intento de login para {data.get('correo')}: {status}")
    return jsonify(response), status


# register

@bp.post("auth/register")
def register():
    data = request.get_json()
    response, status = AuthService.registrar_usuario(data)
    current_app.logger.info(f"Registro de usuario para {data.get('correo'),data.get('rol') }: {status}")
    return jsonify(response), status


# recuperar contra


@bp.post("auth/forgot")
def forgot_password():
    data = request.get_json(silent=True) or {}
    email = data.get("email", "").strip().lower()
    rs.solicitar_recuperacion(email)

    current_app.logger.info(f"Solicitud de recuperacion de contrasenia para {email}")
    return Response(
        json.dumps({"message": "Si el correo existe, se enviaron instrucciones"}, ensure_ascii=False),
        mimetype="application/json",
        status=200
    )


@bp.get("auth/verify")
def verify_token():
    token = request.args.get("token", "")
    valido = rs.verificar_token(token)
    status = 200 if valido else 400
    return Response(
        json.dumps({"valid": valido}, ensure_ascii=False),
        mimetype="application/json",
        status=status
    )


@bp.post("auth/reset")
def reset_password():
    data = request.get_json(silent=True) or {}
    token = data.get("token", "")
    new_password = data.get("new_password", "")
    ok = rs.resetear_contrasenia(token, new_password)
    status = 200 if ok else 400

    current_app.logger.info(f"Cambio de contrasenia realizado con status: {status}")
    return Response(
        json.dumps({"ok": ok}, ensure_ascii=False),
        mimetype="application/json",
        status=status
    )
