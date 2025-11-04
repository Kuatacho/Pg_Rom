# app/config.py
import os
from pathlib import Path
from dotenv import load_dotenv

# ----- Configuración del modelo (puede quedarse igual) -----
BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = BASE_DIR / "models" / "modelo_lstm_lessonTwo.h5"
SEQUENCE_LENGTH = 30
NUM_LANDMARKS_PER_HAND = 21 * 3
NUM_HANDS = 2
NUM_LANDMARKS = NUM_LANDMARKS_PER_HAND * NUM_HANDS
GESTURES = [
    "hola","chau","permiso","buenos_dias","buenas_tardes","gracias",
    "buenas_noches","por_favor","como_estas","estoy_bien","puedo",
    "no_puedo","mal","mas_o_menos","nombre","si","no","lo_siento","te_amo",
    "Lunes","Martes","Miercoles","Jueves","Viernes","Sabado","Domingo",
]

# ----- Configuración BD -----
load_dotenv()

class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "change-me")
    SQLALCHEMY_DATABASE_URI = os.getenv(
        "DATABASE_URL",
        f"postgresql+psycopg2://{os.getenv('DB_USER','postgres')}:{os.getenv('DB_PASSWORD','')}"
        f"@{os.getenv('DB_HOST','localhost')}:{os.getenv('DB_PORT','5433')}/{os.getenv('DB_NAME','postgres')}"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JSON_SORT_KEYS = False
    # ----- Configuración de Flask-Mail -----
    MAIL_SERVER = os.getenv("MAIL_SERVER", "smtp.gmail.com")
    MAIL_PORT = int(os.getenv("MAIL_PORT", 587))
    MAIL_USE_TLS = os.getenv("MAIL_USE_TLS", "true").lower() in ["true", "1", "t"]
    MAIL_USE_SSL = os.getenv("MAIL_USE_SSL", "false").lower() in ["true", "1", "t"]
    MAIL_USERNAME = os.getenv("MAIL_USERNAME")  # tu correo
    MAIL_PASSWORD = os.getenv("MAIL_PASSWORD")  # tu app password
    MAIL_DEFAULT_SENDER = (
        os.getenv("MAIL_DEFAULT_NAME", "Soporte"),
        os.getenv("MAIL_DEFAULT_EMAIL", os.getenv("MAIL_USERNAME"))
    )
