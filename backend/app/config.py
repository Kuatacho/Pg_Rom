#######config file to config the app like paths param about model lstm#######
import os

BASE_DIR = os.path.abspath(os.path.dirname(__file__))

MODEL_PATH = os.path.join(BASE_DIR, "models", "modelo_lstm_modOne.h5")
SEQUENCE_LENGTH = 30
NUM_LANDMARKS_PER_HAND = 21 * 3
NUM_HANDS = 2
NUM_LANDMARKS = NUM_LANDMARKS_PER_HAND * NUM_HANDS

GESTURES = ["Cambiar", "Construir"]
