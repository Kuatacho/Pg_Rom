from flask import Blueprint, request, jsonify
from app.services.prediction_service import predict_gesture
from app.config import GESTURES  # aseguramos que GESTURES esté disponible

bp = Blueprint("routes", __name__)

@bp.route("/api/predict", methods=["POST"])
def predict():
    try:
        data = request.json
        if not data or "sequence" not in data:
            return jsonify({"error": "No se recibió 'sequence'"}), 400

        predicted_gesture, probabilities = predict_gesture(data["sequence"])

        # Asegurar que probabilities es 1D
        probs = probabilities[0] if isinstance(probabilities[0], list) else probabilities
        probs = [float(p) for p in probs]

        # Calcular confianza
        confidence = max(probs) if probs else 0.0

        return jsonify({
            "prediction": predicted_gesture,
            "confidence": confidence,
            "probabilities": probs,
            "gestures": GESTURES
        }), 200

    except ValueError as ve:
        return jsonify({"error": str(ve)}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500
