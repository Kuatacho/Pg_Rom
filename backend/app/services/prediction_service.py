import numpy as np
from tensorflow.keras.models import load_model
from app.config import MODEL_PATH, SEQUENCE_LENGTH, NUM_LANDMARKS, GESTURES
from app.utils.preprocess import is_valid_sequence, fix_frame_length

# Cargar modelo al iniciar
model = load_model(MODEL_PATH)

def predict_gesture(sequence_raw):
    """Procesa la secuencia y devuelve la predicción + probabilidades."""
    # Normalizar frames
    sequence_fixed = [fix_frame_length(frame) for frame in sequence_raw]
    sequence = np.array(sequence_fixed, dtype=np.float32)

    if not is_valid_sequence(sequence):
        raise ValueError("No se detectaron manos en la secuencia")

    # Ajustar longitud de la secuencia
    if sequence.shape[0] < SEQUENCE_LENGTH:
        padding = np.zeros((SEQUENCE_LENGTH - sequence.shape[0], NUM_LANDMARKS), dtype=np.float32)
        sequence = np.vstack((padding, sequence))
    elif sequence.shape[0] > SEQUENCE_LENGTH:
        sequence = sequence[-SEQUENCE_LENGTH:]

    # Reshape y predicción
    input_data = sequence.reshape(1, SEQUENCE_LENGTH, NUM_LANDMARKS)
    predictions = model.predict(input_data, verbose=0)

    predicted_index = int(np.argmax(predictions))
    predicted_gesture = GESTURES[predicted_index]

    return predicted_gesture, predictions.tolist()
