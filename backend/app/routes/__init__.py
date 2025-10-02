from flask import Blueprint

bp = Blueprint("api", __name__)

# Importa los módulos de rutas
from .usuario_route import *   # noqa
from .predict_route import * # noqa
