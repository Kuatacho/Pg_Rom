from flask import Blueprint


bp = Blueprint("api", __name__)

# Importa los módulos de rutas (se enganchan al mismo bp)
from .usuario_route import *
from .predict_route import *
from .test_route import *
from .auth_route import *
from .nota_route import *
from .leccion_route import *

