from fastapi import FastAPI
from fastapi.responses import JSONResponse
from app.core.config import settings
from app.core.logging import logger


def setup_error_handlers(app: FastAPI) -> None:
    """Configura manejadores globales de errores"""
    
    @app.exception_handler(Exception)
    async def global_exception_handler(_request, exc):
        """Manejador global de excepciones"""
        logger.error(f"Error inesperado: {exc}")
        return JSONResponse(
            status_code=500,
            content={
                "detail": "Error interno del servidor",
                "message": str(exc) if settings.DEBUG else "Ha ocurrido un error inesperado"
            }
        )
