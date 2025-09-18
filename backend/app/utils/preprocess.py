#auxiliar functions for app.py or our model lstm
import numpy as np
from app.config import NUM_LANDMARKS

def is_valid_sequence(sequence: np.ndarray) -> bool:
    """Verifica si la secuencia no está vacía."""
    return not np.all(sequence == 0)

def fix_frame_length(frame, num_landmarks=NUM_LANDMARKS):
    """Asegura que cada frame tenga el tamaño correcto."""
    if len(frame) < num_landmarks:
        frame.extend([0] * (num_landmarks - len(frame)))
    elif len(frame) > num_landmarks:
        frame = frame[:num_landmarks]
    return frame
