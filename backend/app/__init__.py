from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from app.config import Config

db = SQLAlchemy()
migrate = Migrate()

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Preserve the ordering of keys when returning JSON responses so that
    # the payload matches the field order defined in the models.
    app.config["JSON_SORT_KEYS"] = False
    CORS(app, resources={r"/api/*": {"origins": "*"}})

    db.init_app(app)
    migrate.init_app(app, db)

    # importa modelos (opcional pero útil)
    from app.models import Usuario, Leccion, Nota, Rol, Recuperacion  # noqa

    # registra rutas
    from app.routes import bp
    app.register_blueprint(bp, url_prefix="/api")

    return app
