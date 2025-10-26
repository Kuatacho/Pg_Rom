from app.extensions import db
from app.models.Nota import Nota
from app.models.Leccion import Leccion
from app.models.Usuario import Usuario
from decimal import Decimal

def crear_nota(data):
    usuario_id = data.get("usuario_id")
    leccion_id = data.get("leccion_id")
    puntuacion = data.get("puntuacion")

    if not all([usuario_id, leccion_id, puntuacion]):
        return {"error": "Faltan campos requeridos"}, 400

    usuario = Usuario.query.get(usuario_id)
    leccion = Leccion.query.get(leccion_id)

    if not usuario:
        return {"error": f"Usuario con id {usuario_id} no existe"}, 404
    if not leccion:
        return {"error": f"Lección con id {leccion_id} no existe"}, 404

    nueva_nota = Nota(
        usuario_id=usuario_id,
        leccion_id=leccion_id,
        puntuacion=puntuacion
    )

    db.session.add(nueva_nota)
    db.session.commit()

    return {
        "mensaje": "Nota registrada exitosamente",
        "nota": {
            "id": nueva_nota.id,
            "usuario_id": nueva_nota.usuario_id,
            "leccion_id": nueva_nota.leccion_id,
            "puntuacion": float(nueva_nota.puntuacion)
        }
    }, 201


def obtener_notas_por_usuario(usuario_id):
    """Obtiene todas las notas de un usuario de forma segura."""
    notas = Nota.query.filter_by(usuario_id=usuario_id).all()
    if not notas:
        return {"mensaje": "No hay notas para este usuario"}, 404

    resultado = []
    for n in notas:
        try:
            puntuacion_val = (
                float(n.puntuacion)
                if isinstance(n.puntuacion, Decimal)
                else n.puntuacion
            )
        except Exception:
            puntuacion_val = None  # fallback seguro

        resultado.append({
            "id": n.id,
            "usuario_id": n.usuario_id,
            "leccion_id": n.leccion_id,
            "puntuacion": puntuacion_val
        })
    return resultado, 200


def obtener_notas_por_leccion(leccion_id):
    """Obtiene todas las notas de una lección."""
    notas = Nota.query.filter_by(leccion_id=leccion_id).all()
    if not notas:
        return {"mensaje": "No hay notas para esta lección"}, 404

    resultado = []
    for n in notas:
        try:
            puntuacion_val = (
                float(n.puntuacion)
                if isinstance(n.puntuacion, Decimal)
                else n.puntuacion
            )
        except Exception:
            puntuacion_val = None

        resultado.append({
            "id": n.id,
            "usuario_id": n.usuario_id,
            "leccion_id": n.leccion_id,
            "puntuacion": puntuacion_val
        })
    return resultado, 200
