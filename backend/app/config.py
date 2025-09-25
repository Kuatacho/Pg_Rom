import os

BASE_DIR = os.path.abspath(os.path.dirname(__file__))

MODEL_PATH = os.path.join(BASE_DIR, "models", "modelo_lstm_lessonOne.h5")
SEQUENCE_LENGTH = 30
NUM_LANDMARKS_PER_HAND = 21 * 3
NUM_HANDS = 2
NUM_LANDMARKS = NUM_LANDMARKS_PER_HAND * NUM_HANDS

GESTURES = [
    "hola", "chau", "permiso", "buenos_dias", "buenas_tardes", "gracias",
      "buenas_noches", "por_favor", "como_estas", 
    "estoy_bien", "puedo", "no_puedo", "mal", "mas_o_menos",
      "nombre", "si", "no", "lo_siento", "te_amo"
]
