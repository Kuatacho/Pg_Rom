from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
from tensorflow.keras.models import load_model
import os

app = Flask(__name__)
CORS(app)

# ------------------ Configuración del modelo ------------------
MODEL_PATH = 'modelo_lstm_modOne.h5'
SEQUENCE_LENGTH = 30  # Frames que tu LSTM espera por secuencia
NUM_LANDMARKS_PER_HAND = 21 * 3  # 21 puntos * 3 coordenadas
NUM_HANDS = 2
NUM_LANDMARKS = NUM_LANDMARKS_PER_HAND * NUM_HANDS  # Total de features por frame (126)

# Carga del modelo
if not os.path.exists(MODEL_PATH):
    raise FileNotFoundError(f"No se encontró el modelo en {MODEL_PATH}")
model = load_model(MODEL_PATH)

# Gestos entrenados
GESTURES = ['Cambiar', 'Construir']  # Asegúrate que coincida con tu entrenamiento

# ------------------ Endpoint de predicción ------------------
@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        if 'sequence' not in data:
            return jsonify({"error": "No se recibió 'sequence'"}), 400

        # Convertimos a numpy array float32
        sequence = np.array(data['sequence'], dtype=np.float32)
        print("Secuencia recibida shape:", sequence.shape)  # DEBUG

        # ------------------ Asegurar que cada frame tenga 126 features ------------------
        new_sequence = []
        for frame in sequence:
            frame_list = frame.tolist() if isinstance(frame, np.ndarray) else frame
            # Rellenar con ceros si falta mano
            if len(frame_list) < NUM_LANDMARKS:
                frame_list.extend([0] * (NUM_LANDMARKS - len(frame_list)))
            elif len(frame_list) > NUM_LANDMARKS:
                frame_list = frame_list[:NUM_LANDMARKS]
            new_sequence.append(frame_list)
        sequence = np.array(new_sequence, dtype=np.float32)

        # ------------------ Ajuste de longitud de secuencia ------------------
        if sequence.shape[0] < SEQUENCE_LENGTH:
            pad_len = SEQUENCE_LENGTH - sequence.shape[0]
            padding = np.zeros((pad_len, NUM_LANDMARKS), dtype=np.float32)
            sequence = np.vstack((padding, sequence))
        elif sequence.shape[0] > SEQUENCE_LENGTH:
            sequence = sequence[-SEQUENCE_LENGTH:]

        # Reshape para LSTM
        input_data = sequence.reshape(1, SEQUENCE_LENGTH, NUM_LANDMARKS)

        # Predicción
        predictions = model.predict(input_data)
        predicted_index = int(np.argmax(predictions))
        predicted_gesture = GESTURES[predicted_index]

        print("Predicción:", predicted_gesture)  # DEBUG
        return jsonify({
            "prediction": predicted_gesture,
            "probabilities": predictions.tolist()
        })

    except Exception as e:
        print("ERROR:", e)
        return jsonify({"error": str(e)}), 500

# ------------------ Ejecutar API ------------------
if __name__ == '__main__':
    app.run(debug=True)
