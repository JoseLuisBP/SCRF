"""Configuración del sistema de logging"""
import logging
import sys
from pathlib import Path
# Handler de archivo rotativo
from logging.handlers import RotatingFileHandler
from app.core.config import settings

# Crear directorio de logs
log_dir = Path("logs")
log_dir.mkdir(exist_ok=True)

def setup_logging():
    """Configuración de logging para producción"""
    
    # Logger raíz
    root_logger = logging.getLogger()
    level = logging.DEBUG if settings.DEBUG else logging.INFO
    root_logger.setLevel(level)
    
    # Handler de consola con formato legible
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setLevel(level)
    console_formatter = logging.Formatter(
        "%(asctime)s - %(name)s - %(levelname)s - %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S"
    )
    console_handler.setFormatter(console_formatter)
    root_logger.addHandler(console_handler)
    
    # Handler general
    app_handler = RotatingFileHandler(
        log_dir / "app.log",
        maxBytes=10*1024*1024,  # 10MB
        backupCount=5,
        encoding='utf-8'
    )
    app_handler.setLevel(logging.INFO)
    app_handler.setFormatter(console_formatter)
    root_logger.addHandler(app_handler)
    
    # Handler de errores
    error_handler = RotatingFileHandler(
        log_dir / "error.log",
        maxBytes=10*1024*1024,
        backupCount=5,
        encoding='utf-8'
    )
    error_handler.setLevel(logging.ERROR)
    error_handler.setFormatter(console_formatter)
    root_logger.addHandler(error_handler)
    
    return root_logger

logger = setup_logging()
