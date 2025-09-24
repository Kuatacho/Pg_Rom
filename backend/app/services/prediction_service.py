import numpy as np
from tensorflow.keras.models import load_model
from app.config import MODEL_PATH, SEQUENCE_LENGTH, NUM_LANDMARKS, GESTURES
from app.utils.preprocess import is_valid_sequence, fix_frame_length

# Cargar modelo al iniciar
model = load_model(MODEL_PATH)

def predict_gesture(sequence_raw):
    """
    Procesa la secuencia y devuelve la predicción + probabilidades.
    sequence_raw: lista de frames (cada frame = 126 floats o landmarks crudos).
    """
    # Normalizar cada frame → garantizamos vector (126,)
    sequence_fixed = [fix_frame_length(frame) for frame in sequence_raw]
    sequence = np.asarray(sequence_fixed, dtype=np.float32)  # (T, 126)

    # Validar secuencia
    if not is_valid_sequence(sequence):
        raise ValueError("No se detectaron suficientes manos en la secuencia")

    # Ajustar longitud temporal
    if sequence.shape[0] < SEQUENCE_LENGTH:
        pad = np.zeros((SEQUENCE_LENGTH - sequence.shape[0], NUM_LANDMARKS), dtype=np.float32)
        sequence = np.vstack([pad, sequence])
    elif sequence.shape[0] > SEQUENCE_LENGTH:
        sequence = sequence[-SEQUENCE_LENGTH:]

    # Preparar batch (1, 30, 126)
    input_data = sequence.reshape(1, SEQUENCE_LENGTH, NUM_LANDMARKS)
    predictions = model.predict(input_data, verbose=0)[0]  # (num_classes,)

    # Predicción final
    predicted_index = int(np.argmax(predictions))
    predicted_gesture = GESTURES[predicted_index]
    probabilities = predictions.astype(float).tolist()  # lista 1D de floats

    return predicted_gesture, predicted_index, probabilities
