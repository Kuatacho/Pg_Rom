import os

BASE_DIR = os.path.abspath(os.path.dirname(__file__))

MODEL_PATH = os.path.join(BASE_DIR, "models", "modelo_saludos.h5")
SEQUENCE_LENGTH = 30
NUM_LANDMARKS_PER_HAND = 21 * 3
NUM_HANDS = 2
NUM_LANDMARKS = NUM_LANDMARKS_PER_HAND * NUM_HANDS

GESTURES = [
    'Hola',
    'Chau',
    'permiso',
    'Buenos Dias',
    'buenas_tardes',
    'gracias',
    'buenas_noches',
    'por_favor',
    'como_estas',
    'estoy_bien',
    'puedo',
    'no_puedo',
    'mal',
    'Mas o Menos',
    'nombre',
    'si',
    'no',
    'lo_siento',
    'te_amo'
]
