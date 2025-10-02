import json
from flask import request, Response
from app.services import recuperacion_service as rs
from app.routes import bp  # reutilizamos el blueprint único


@bp.post("/recuperacion/forgot")
def forgot_password():
    data = request.get_json(silent=True) or {}
    email = data.get("email", "").strip().lower()

    rs.solicitar_recuperacion(email)
    return Response(
        json.dumps({"message": "Si el correo existe, se enviaron instrucciones"}, ensure_ascii=False),
        mimetype="application/json",
        status=200
    )


@bp.get("/recuperacion/verify")
def verify_token():
    token = request.args.get("token", "")
    valido = rs.verificar_token(token)
    status = 200 if valido else 400
    return Response(
        json.dumps({"valid": valido}, ensure_ascii=False),
        mimetype="application/json",
        status=status
    )


@bp.post("/recuperacion/reset")
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
