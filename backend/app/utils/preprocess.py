# app/utils/preprocess.py
import numpy as np
from typing import List, Dict, Any, Union

# Importa TODO lo que usas (evita NameError)
from app.config import NUM_LANDMARKS, NUM_LANDMARKS_PER_HAND

# ---------- Normalización por mano (igual que en captura/reconocimiento) ----------
def normalize_hand(hand_landmarks: np.ndarray) -> np.ndarray:
    """
    hand_landmarks: np.ndarray de forma (21, 3) con (x, y, z) en [0,1] de MediaPipe.
    Retorna un vector (63,) normalizado:
      - Traslación: muñeca (idx 0) como origen.
      - Escala: distancia muñeca -> MCP dedo medio (idx 9).
    """
    hand_landmarks = np.asarray(hand_landmarks, dtype=np.float32)
    if hand_landmarks.shape != (21, 3):
        # Si no es válido, devuelve ceros para esta mano
        return np.zeros(NUM_LANDMARKS_PER_HAND, dtype=np.float32)

    wrist = hand_landmarks[0]
    mcp_mid = hand_landmarks[9]
    scale = np.linalg.norm(mcp_mid - wrist)
    if not np.isfinite(scale) or scale < 1e-6:
        scale = 1e-6

    normed = (hand_landmarks - wrist) / scale
    return normed.reshape(-1).astype(np.float32)  # (63,)

def _from_raw_hands_to_features(raw_frame: List[Dict[str, Any]]) -> np.ndarray:
    """
    raw_frame: lista de dicts como:
      [{"label": "Left"|"Right", "landmarks": [[x,y,z], ... (21)]}, ...]
    Devuelve vector (126,) = [63 izq] + [63 der]. Zeros si falta alguna mano.
    """
    left = np.zeros(NUM_LANDMARKS_PER_HAND, dtype=np.float32)
    right = np.zeros(NUM_LANDMARKS_PER_HAND, dtype=np.float32)

    for hand in raw_frame:
        label = str(hand.get("label", "")).lower()
        lm = np.asarray(hand.get("landmarks", []), dtype=np.float32)

        feats = normalize_hand(lm)
        if label == "left":
            left = feats
        elif label == "right":
            right = feats
        else:
            # Si no viene label, mete la primera al slot libre
            if not left.any():
                left = feats
            else:
                right = feats

    return np.concatenate([left, right], axis=0)  # (126,)

# ---------- Entrada flexible: features (126) o landmarks crudos ----------
def fix_frame_length(frame: Union[List, np.ndarray], num_landmarks: int = NUM_LANDMARKS) -> np.ndarray:
    """
    Acepta dos casos:
      1) Ya son features (lista/np.array 1D con 126 floats) -> asegura tamaño/tipo.
      2) Son landmarks crudos (lista de dicts con manos) -> normaliza y empaqueta (126).
    Devuelve siempre np.ndarray (126,) en float32.
    """
    # Caso 1: vector plano (ya features)
    arr = np.asarray(frame, dtype=np.float32)
    if arr.ndim == 1:
        if arr.size < num_landmarks:
            pad = np.zeros(num_landmarks - arr.size, dtype=np.float32)
            arr = np.concatenate([arr, pad], axis=0)
        elif arr.size > num_landmarks:
            arr = arr[:num_landmarks]
        return arr.astype(np.float32)

    # Caso 2: lista de dicts (raw hands)
    if isinstance(frame, list) and frame and isinstance(frame[0], dict):
        feats = _from_raw_hands_to_features(frame)
        return feats.astype(np.float32)

    # Fallback: no reconocido -> ceros
    return np.zeros(num_landmarks, dtype=np.float32)

def is_valid_sequence(sequence: np.ndarray, min_valid_frames: int = 5) -> bool:
    """
    Valida que la secuencia tenga la forma (T, 126) y al menos 'min_valid_frames'
    frames no vacíos (un frame vacío es todo ceros).
    """
    seq = np.asarray(sequence, dtype=np.float32)
    if seq.ndim != 2 or seq.shape[1] != NUM_LANDMARKS:
        return False
    valid_frames = int(np.sum(~np.all(seq == 0, axis=1)))
    return valid_frames >= min_valid_frames
