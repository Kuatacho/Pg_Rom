from flask import jsonify, request, current_app
from flask_jwt_extended import jwt_required
from app.services import leccion_service
from app.routes import bp


@bp.post("/crear-lecciones")
# @jwt_required()
def crear_leccion():
    try:
        data = request.get_json()
        respuesta, status = leccion_service.crear_leccion(data)
        return jsonify(respuesta), status
    except Exception as e:
        current_app.logger.error(f"Error al crear lección: {e}")
        return jsonify({"msg": "Error interno del servidor"}), 500


@bp.get("/lecciones")
# @jwt_required()
def obtener_lecciones():
    try:
        respuesta, status = leccion_service.obtener_lecciones()
        return jsonify(respuesta), status
    except Exception as e:
        current_app.logger.error(f"Error al obtener lecciones: {e}")
        return jsonify({"msg": "Error interno del servidor"}), 500


@bp.get("/lecciones/<int:leccion_id>")
# @jwt_required()
def obtener_leccion(leccion_id):
    try:
        respuesta, status = leccion_service.obtener_leccion_por_id(leccion_id)
        return jsonify(respuesta), status
    except Exception as e:
        current_app.logger.error(f"Error al obtener lección {leccion_id}: {e}")
        return jsonify({"msg": "Error interno del servidor"}), 500


@bp.put("/lecciones/<int:leccion_id>")
# @jwt_required()
def actualizar_leccion(leccion_id):
    try:
        data = request.get_json()
        respuesta, status = leccion_service.actualizar_leccion(leccion_id, data)
        return jsonify(respuesta), status
    except Exception as e:
        current_app.logger.error(f"Error al actualizar lección {leccion_id}: {e}")
        return jsonify({"msg": "Error interno del servidor"}), 500


@bp.delete("/lecciones/<int:leccion_id>")
# @jwt_required()
def eliminar_leccion(leccion_id):
    try:
        respuesta, status = leccion_service.eliminar_leccion(leccion_id)
        return jsonify(respuesta), status
    except Exception as e:
        current_app.logger.error(f"Error al eliminar lección {leccion_id}: {e}")
        return jsonify({"msg": "Error interno del servidor"}), 500
