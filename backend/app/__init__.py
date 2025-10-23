from cgitb import handler

from flask import Flask
from flask_cors import CORS
from app.config import Config
from app.extensions import *  # ⬅️ importamos desde extensions
# registra rutas
from app.routes import bp
from app.utils.logger import setup_loggin


def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)
    CORS(app, resources={r"/api/*": {"origins": "http://localhost:4200"}})

    # configuracion del logger
    setup_loggin(app)

    #conf de jwt
    app.config["JWT_SECRET_KEY"]='123'
    app.config["JWT_ACCESS_TOKEN_EXPIRES"]=3600
    # inicializaciones
    db.init_app(app)
    migrate.init_app(app, db)
    mail.init_app(app)
    jwt.init_app(app)



    # Mantiene orden del json
    app.config["JSON_SORT_KEYS"] = False
    # registramos rutas
    app.register_blueprint(bp, url_prefix="/api")

    app.logger.info("Sistema iniciado")
    return app
