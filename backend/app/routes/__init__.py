from flask import Blueprint

bp = Blueprint("api", __name__)

# Importa los módulos de rutas (se enganchan al mismo bp)
from .usuario_route import *   # noqa
from .predict_route import *   # noqa
from .recuperacion_route import *  # noqa
