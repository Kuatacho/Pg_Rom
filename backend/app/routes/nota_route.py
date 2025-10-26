from flask import jsonify, request, current_app
from flask_jwt_extended import jwt_required
from app.services import nota_service
from app.routes import bp
from app.utils.logger import *

@bp.post("/create-nota")
# @jwt_required()
def create_nota():
    try:
        data = request.get_json()
        respuesta, status = nota_service.crear_nota(data)
        return jsonify(respuesta), status
    except Exception as e:
        current_app.logger.info(f"Error al crear nota: {e}")
    return jsonify({"msg": "Error interno del servidor"}), 500


@bp.get("/notas")
# @jwt_required()
def obtener_notas():
    try:
        respuesta, status = nota_service.obtener_notas()
        return jsonify(respuesta), status
    except Exception as e:
        current_app.logger.info(f"Error al obtener notas: {e}")
    return jsonify({"msg": "Error interno del servidor"}), 500


@bp.get("/list-notas-by-usuario/<int:usuario_id>")
# @jwt_required()
def obtener_notas_por_usuario(usuario_id: int):
    try:
        respuesta, status = nota_service.obtener_notas_por_usuario(usuario_id)
        return jsonify(respuesta), status
    except Exception as e:
        current_app.logger.info(f"Error al obtener notas por usuario: {e}")
    return jsonify({"msg": "Error interno del servidor"}), 500


@bp.get("/list-notas-by-leccion/<int:leccion_id>")
# @jwt_required()
def obtener_notas_por_leccion(leccion_id: int):
    try:
        respuesta, status = nota_service.obtener_notas_por_leccion(leccion_id)
        return jsonify(respuesta), status
    except Exception as e:
        current_app.logger.info(f"Error al obtener notas por leccion: {e}")
    return jsonify({"msg": "Error interno del servidor"}), 500






