# app/config.py
import os
from pathlib import Path
from dotenv import load_dotenv

# ----- Configuración del modelo (puede quedarse igual) -----
BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = BASE_DIR / "models" / "modelo_lstm_completed.h5"
SEQUENCE_LENGTH = 30
NUM_LANDMARKS_PER_HAND = 21 * 3
NUM_HANDS = 2
NUM_LANDMARKS = NUM_LANDMARKS_PER_HAND * NUM_HANDS
GESTURES = [
    "hola", "chau", "permiso", "buenos_dias", "buenas_tardes", "gracias",
    "buenas_noches", "por_favor", "como_estas",
    "estoy_bien", "puedo", "no_puedo", "mal", "mas_o_menos",
    "nombre", "si", "no", "lo_siento", "te_amo", "Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado", "Domingo",
    "perro", "gato", "vaca", "condor", "loro","tortuga","vibora","gallo", "gallina", "pez",
    "pato", "conejo", "chancho","caballo", "llama", "oveja", "toro", "tomate","cebolla", "zanahoria", "papa","manzana",
    "naranja", "uva", "platano", "guineo","piña",  "rojo", "amarillo", "cafe", "azul", "blanco", "verde", "rosado",
    "negro", "anaranjado", "celeste", "lila", "hombre", "mujer", "padre", "esposo", "mama", "esposa", "bebe", "abuelo",
    "abuela","hijo", "hija","hermano", "hermana", "casa", "cuarto", "dormitorio", "baño", "plaza", "escuela", "hospital",
    "iglesia", "farmacia", "mercado", "jardín", "hotel", "restaurante", "la_paz", "santa_cruz", "cochabamba", "oruro",
    "tarija", "beni", "chuquisaca", "potosi", "pando", "litoral","mes", "dia", "semana", "año", "ayer", "anteayer",
    "hoy", "ahora", "mañana", "pasado_mañana", "fecha", "yo", "tu", "nosotros", "el", "ustedes", "ella", "nuestro",
    "ellos", "ellas", "suyo", "tuyo", "mio", "mesa", "silla", "puerta", "telefono", "fax", "pelota", "televisor",
    "tenedor", "heladera", "cuchillo", "cuchara", "taza", "plato", "cama", "frazada", "regla", "papel", "sabana", "pizarra",
    "libro", "lapiz", "borrador", "cuello", "pulmones", "corazon", "manos", "brazo", "estomago", "dedos", "pies", "ojos",
    "nariz", "dientes", "boca", "oreja", "cabello", "cabeza", "pan", "leche", "carne", "fideo", "queso", "arroz1", "arroz2",
    "sal", "aceite", "coffee", "azucar", "te", "galletas", "auto", "tren", "avion", "flota", "micro", "trufi", "taxi",
    "motocicleta", "helicoptero", "bicicleta", "barco", "arbol", "bosque", "flor", "pasto", "mar", "piedra", "rio", "tierra",
    "hoja", "frio", "calor", "campo", "valle", "luna", "montana", "nieve","sol", "estrella", "nube", "cielo", "lluvia",
    "quien1", "quien2", "donde", "como", "por_que", "que", "cual", "para_que", "cuantos", "cuando", "enero", "febrero", "marzo",
    "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre","noviembre", "diciembre", "cambiar", "construir",
    "cocinar", "comprar", "vender", "aprender", "abrir", "hablar","prestar1", "prestar2", "comer", "querer", "dibujar",
    "copiar", "pedir", "escribir", "ver", "preparar", "venir", "ir", "practicar", "dormir", "pintar", "ayudar1", "ayudar2",
    "comprender", "atender", "cero", "uno", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve", "diez",
    "once", "doce", "trece", "catorce", "quince", "dieciséis", "diecisiete", "dieciocho", "diecinueve", "veinte",
    "veintiuno", "veintidós", "veintitrés", "veinticuatro", "veinticinco", "veintiséis", "veintisiete", "veintiocho",
    "veintinueve", "treinta", "cuarenta", "cincuenta"
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
