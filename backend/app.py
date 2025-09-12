from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
from tensorflow.keras.models import load_model
import os

app = Flask(__name__)
CORS(app)

# ------------------ Configuración del modelo ------------------
MODEL_PATH = 'modelo_lstm.h5'
SEQUENCE_LENGTH = 30  # Número de frames que tu LSTM espera por secuencia
NUM_LANDMARKS = 21 * 3  # 21 puntos de la mano * 3 coordenadas (x, y, z)
FEATURES = SEQUENCE_LENGTH * NUM_LANDMARKS  # Total de features que el LSTM espera

# Carga del modelo LSTM
if not os.path.exists(MODEL_PATH):
    raise FileNotFoundError(f"No se encontró el modelo en {MODEL_PATH}")
model = load_model(MODEL_PATH)
    
# Lista de palabras que predice tu modelo (orden debe coincidir con el entrenamiento)
GESTURES = ['Cambiar', 'Construir']  # Puedes añadir más palabras según tu entrenamiento

# ------------------ Endpoint de predicción ------------------
@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        if 'sequence' not in data:
            return jsonify({"error": "No se recibió 'sequence'"}), 400

        sequence = np.array(data['sequence'])  # Debe ser una lista de frames, cada frame = 63 valores

        # ------------------ Validación y reshape ------------------
        expected_shape = (SEQUENCE_LENGTH, NUM_LANDMARKS)
        if sequence.shape != expected_shape:
            # Padding si es más corto
            if sequence.shape[0] < SEQUENCE_LENGTH:
                pad_len = SEQUENCE_LENGTH - sequence.shape[0]
                padding = np.zeros((pad_len, NUM_LANDMARKS))
                sequence = np.vstack((padding, sequence))
            # Recorte si es más largo
            elif sequence.shape[0] > SEQUENCE_LENGTH:
                sequence = sequence[-SEQUENCE_LENGTH:]

        # Reshape para LSTM: (1, SEQUENCE_LENGTH, NUM_LANDMARKS)
        input_data = sequence.reshape(1, SEQUENCE_LENGTH, NUM_LANDMARKS)

        # Predicción
        predictions = model.predict(input_data)
        predicted_index = np.argmax(predictions)
        predicted_gesture = GESTURES[predicted_index]

        return jsonify({
            "prediction": predicted_gesture,
            "probabilities": predictions.tolist()
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ------------------ Ejecutar API ------------------
if __name__ == '__main__':
    app.run(debug=True)
