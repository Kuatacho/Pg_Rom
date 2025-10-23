import logging
from logging.handlers import RotatingFileHandler
import os


def setup_loggin(app):
    # """Configura el logger de la aplicación."""
    log_dir = os.path.join(os.path.dirname(__file__), '..', 'logs')
    os.makedirs(log_dir, exist_ok=True)
    log_file = os.path.join(log_dir, 'app.log')
    ## Definimos el tamanio de nuestro archivo de log y la cantidad de backups que va a realizar
    handler = RotatingFileHandler(log_file, maxBytes=1000000, backupCount=5)
    formatter = logging.Formatter(
        '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )
    handler.setFormatter(formatter)
    handler.setLevel(logging.INFO)

    app.logger.addHandler(handler)
    app.logger.setLevel(logging.INFO)
    app.logger.info('Logger initialized')
