from flask import request, jsonify
from app.routes import bp  # 👈 usa el blueprint central
from app.services.prediction_service import predict_gesture
from app.config import GESTURES



# --- Helper para respuestas ---
def response(data=None, error=None, status=200):
    if error:
        return jsonify({"error": error}), status
    return jsonify(data), status


# -------- Test endpoint --------
@bp.route("/ping", methods=["GET"])
def ping():
    return response({"message": "API is working"})


# -------- Endpoint de predicción --------
@bp.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json(silent=True)
        if not data or "sequence" not in data:
            return response(error="No se recibió 'sequence'", status=400)
        # Llamar al servicio de predicción
        predicted_gesture, predicted_index, probabilities = predict_gesture(data["sequence"])
        # Calcular confianza
        confidence = max(probabilities) if probabilities else 0.0
        return response({
            "prediction": predicted_gesture,
            "prediction_index": predicted_index,
            "confidence": float(confidence),
            "probabilities": probabilities,
            "gestures": GESTURES,
        }, status=200)

    except ValueError as ve:
        return response(error=str(ve), status=400)
    except Exception as e:
        return response(error=f"Error interno: {str(e)}", status=500)
