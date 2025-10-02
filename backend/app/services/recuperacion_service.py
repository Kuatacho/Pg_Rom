import secrets
from datetime import datetime, timedelta
from werkzeug.security import generate_password_hash
from app import db
from app.models.Usuario import Usuario
from app.models.Recuperacion import Recuperacion
from flask_mail import Message
from app import mail


def solicitar_recuperacion(email: str) -> None:
    """Genera un token y lo envía por correo"""
    user = Usuario.query.filter_by(correo=email).first()
    if not user:
        return  # No revelamos si existe o no

    # Generar token y fecha de expiración
    token = secrets.token_urlsafe(32)
    expira = datetime.utcnow() + timedelta(minutes=30)

    # Guardar en tabla recuperacion
    rec = Recuperacion(
        usuario_id=user.id,
        token=token,
        expira=expira,
        usado=False
    )
    db.session.add(rec)
    db.session.commit()

    # Enviar correo con Flask-Mail
    link = f"http://localhost:4200/auth/reset?token={token}"  # luego lo usará el frontend
    msg = Message(
        subject="Recuperación de contraseña",
        recipients=[user.correo],
        html=f"""
        <p>Hola {user.nombre},</p>
        <p>Haz clic en el siguiente enlace para restablecer tu contraseña (válido por 30 minutos):</p>
        <a href="{link}">Restablecer contraseña</a>
        """
    )
    mail.send(msg)


def verificar_token(token: str) -> bool:
    rec = Recuperacion.query.filter_by(token=token).first()
    if not rec:
        return False
    if rec.usado:
        return False
    if rec.expira < datetime.utcnow():
        return False
    return True


def resetear_contrasenia(token: str, nueva_password: str) -> bool:
    rec = Recuperacion.query.filter_by(token=token).first()
    if not rec or rec.usado or rec.expira < datetime.utcnow():
        return False

    user = rec.usuario
    user.contrasena = generate_password_hash(nueva_password)

    rec.usado = True
    db.session.commit()
    return True
