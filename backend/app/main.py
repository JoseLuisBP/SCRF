from fastapi import FastAPI
from contextlib import asynccontextmanager

from app.core.config import settings
from app.core.logging import logger

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Eventos de inicio y cierre de la aplicación"""
    logger.info(f"Iniciando {settings.PROJECT_NAME} v{settings.VERSION}")
    logger.info(f"Entorno: {settings.ENVIRONMENT}")
    logger.info("Documentación disponible en /docs y /redoc")
    yield
    logger.info("Cerrando la aplicación...")

app = FastAPI(
    lifespan=lifespan,
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="API backend de la aplicación",
    docs_url="/docs",
    redoc_url="/redoc",
)

@app.get("/")
def root():
    """Ruta raíz"""
    return {
        "message": "Cuidado y Rehabilitación API Backend",
        "version": settings.VERSION,
        "status": "running",
        "docs": "/docs",
    }


@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    """Manejador global de excepciones"""
    logger.error(f"Error inesperado: {exc}")
    return {
        "detail": "Error interno del servidor",
        "message": str(exc) if settings.DEBUG else "Ha ocurrido un error inesperado"
    }

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG,
    )
