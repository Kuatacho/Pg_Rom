from app.extensions import db
from app.models.Leccion import Leccion

def crear_leccion(data):
    """Crea una nueva lección."""
    nombre = data.get("nombre")
    if not nombre:
        return {"error": "El nombre de la lección es obligatorio"}, 400
    # Validar si ya existe una lección con el mismo nombre
    existente = Leccion.query.filter_by(nombre=nombre).first()
    if existente:
        return {"error": "Ya existe una lección con ese nombre"}, 409
    nueva = Leccion(nombre=nombre)
    db.session.add(nueva)
    db.session.commit()
    return {
        "mensaje": "Lección creada exitosamente",
        "leccion": {"id": nueva.id, "nombre": nueva.nombre}
    }, 201


def obtener_lecciones():
    """Obtiene todas las lecciones."""
    lecciones = Leccion.query.order_by(Leccion.id.asc()).all()
    resultado = [
        {"id": l.id, "nombre": l.nombre} for l in lecciones
    ]
    return resultado, 200


def obtener_leccion_por_id(leccion_id):
    """Obtiene una lección específica por su ID."""
    leccion = Leccion.query.get(leccion_id)
    if not leccion:
        return {"error": "Lección no encontrada"}, 404

    return {"id": leccion.id, "nombre": leccion.nombre}, 200


def actualizar_leccion(leccion_id, data):
    """Actualiza el nombre de una lección."""
    leccion = Leccion.query.get(leccion_id)
    if not leccion:
        return {"error": "Lección no encontrada"}, 404

    nuevo_nombre = data.get("nombre")
    if not nuevo_nombre:
        return {"error": "Debe proporcionar un nombre válido"}, 400

    leccion.nombre = nuevo_nombre
    db.session.commit()

    return {"mensaje": "Lección actualizada correctamente"}, 200


def eliminar_leccion(leccion_id):
    """Elimina una lección."""
    leccion = Leccion.query.get(leccion_id)
    if not leccion:
        return {"error": "Lección no encontrada"}, 404

    db.session.delete(leccion)
    db.session.commit()

    return {"mensaje": f"Lección {leccion_id} eliminada exitosamente"}, 200
