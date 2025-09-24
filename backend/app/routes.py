from flask import Blueprint, request, jsonify
from app.services.prediction_service import predict_gesture
from app.config import GESTURES  # aseguramos que GESTURES esté disponible

bp = Blueprint("routes", __name__)

# -------- Test endpoint --------
@bp.route("/api/ping", methods=["GET"])
def ping():
    return jsonify({"message": "API is working"}), 200


# -------- Endpoint de predicción --------
@bp.route("/api/predict", methods=["POST"])
def predict():
    try:
        data = request.json
        if not data or "sequence" not in data:
            return jsonify({"error": "No se recibió 'sequence'"}), 400

        # Llamar al servicio de predicción
        predicted_gesture, predicted_index, probabilities = predict_gesture(data["sequence"])

        # Calcular confianza = mayor probabilidad
        confidence = max(probabilities) if probabilities else 0.0

        return jsonify({
            "prediction": predicted_gesture,        # el nombre de la seña (ej: "hola")
            "prediction_index": predicted_index,    # índice de la seña (ej: 0)
            "confidence": float(confidence),        # cuánta seguridad tiene el modelo
            "probabilities": probabilities,         # lista de probabilidades para cada clase
            "gestures": GESTURES                    # el listado de gestos posibles
        }), 200

    except ValueError as ve:
        return jsonify({"error": str(ve)}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500
