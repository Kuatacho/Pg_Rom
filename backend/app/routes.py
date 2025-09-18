#define routes like /login, /register, etc.
from flask import Blueprint, request, jsonify
from app.services.prediction_service import predict_gesture

bp = Blueprint("routes", __name__)

@bp.route("/api/predict", methods=["POST"])
def predict():
    try:
        data = request.json
        if not data or "sequence" not in data:
            return jsonify({"error": "No se recibió 'sequence'"}), 400

        predicted_gesture, probabilities = predict_gesture(data["sequence"])

        return jsonify({
            "prediction": predicted_gesture,
            "probabilities": probabilities
        }), 200

    except ValueError as ve:
        return jsonify({"error": str(ve)}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500
