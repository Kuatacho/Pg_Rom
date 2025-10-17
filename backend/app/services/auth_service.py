from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token
from app.extensions import db
from app.models.Usuario import Usuario
from app.models.Rol import Rol
import string
import secrets
from app.models.Rol import Rol
from app.services.mail_service import enviar_credenciales_usuario


# --- Generar contraseña aleatoria ---
def generate_random_password(length: int = 12) -> str:
    alphabet = string.ascii_letters + string.digits + "!@#$%^&*"
    return ''.join(secrets.choice(alphabet) for _ in range(length))




class AuthService:
    @staticmethod
    def registrar_usuario(data):
        """
        Registra un nuevo usuario y le asigna un rol existente y envia
        credenciales al correo del user creado.
        """
        # Generar contraseña aleatoria y hashearla
        plain_password = generate_random_password()
        hashed_password = generate_password_hash(plain_password)

        correo = data.get("correo")
        if Usuario.query.filter_by(correo=correo).first():
            return {"msg": "El correo ya está registrado"}, 409

        # Obtener el rol solicitado o usar "User" por defecto
        rol_nombre = data.get("rol", "User")
        rol = Rol.query.filter_by(nombre=rol_nombre).first()
        if not rol:
            return {"msg": f"El rol '{rol_nombre}' no existe."}, 400

        # Crear el usuario y asignarle el id del rol
        usuario = Usuario(
            nombre=data.get("nombre"),
            apellidos=data.get("apellidos"),
            correo=correo,
            genero=data.get("genero"),
            fecha_nacimiento=data.get("fecha_nacimiento"),
            celular=data.get("celular"),
            contrasena=hashed_password,
            id_rol=rol.id
        )

        db.session.add(usuario)
        db.session.commit()

        try:
            enviar_credenciales_usuario(
                nombre=usuario.nombre,
                correo=usuario.correo,
                contrasena= plain_password,
                rol=rol_nombre
            )
        except Exception as e:
            print(f"Error al enviar correo: {e}")
        return {
            "msg": f"Usuario registrado con rol '{rol_nombre}'",
            "usuario": usuario.to_dict(),
            "contrasenia_generada": plain_password
        }, 201



    @staticmethod
    def login_usuario(data):
        """
        Inicia sesión y genera un token JWT.
        """
        correo = data.get("correo")
        contrasena = data.get("contrasena")

        usuario = Usuario.query.filter_by(correo=correo).first()
        if not usuario or not check_password_hash(usuario.contrasena, contrasena):
            return {"msg": "Credenciales incorrectas"}, 401

        rol_nombre = usuario.rol.nombre if usuario.rol else "User"

        token = create_access_token(
            identity=correo,
            additional_claims={"id": usuario.id, "role": rol_nombre}
        )

        return {
            "access_token": token,
            "usuario": usuario.to_dict()
        }, 200




