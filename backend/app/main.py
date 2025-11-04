from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.core.config import settings
from app.core.logging import logger
from app.api.v1 import auth, users
from app.db.postgresql import postgresql
from app.api.v1 import test_db


@asynccontextmanager
async def lifespan(application: FastAPI):
    """Eventos de inicio y cierre de la aplicación"""
    logger.info("Iniciando %s v%s", settings.PROJECT_NAME, settings.VERSION)
    logger.info("Entorno: %s", settings.ENVIRONMENT)
    logger.info("Documentación disponible en /docs y /redoc")

    # Inicializar PostgreSQL aquí
    try:
        postgresql.initialize()
        logger.info("Conexión PostgreSQL inicializada correctamente.")
    except Exception as e:
        logger.error(f"Error al inicializar PostgreSQL: {e}")
        raise # Detiene la ejecución de la aplicación

    yield  # Aquí corre la app

    # Cierre de conexiones al apagar
    await postgresql.close()
    logger.info("Cerrando la aplicación y conexiones PostgreSQL...")

app = FastAPI(
    lifespan=lifespan,
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="API backend de la aplicación",
    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(
    auth.router,
    prefix=f"{settings.API_V1_PREFIX}/auth",
    tags=["Authentication"]
)

app.include_router(
    users.router,
    prefix=f"{settings.API_V1_PREFIX}/users",
    tags=["Users"]
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

@app.get("/health")
def health_check():
    """Health check endpoints"""
    return {
        "status": "healthy",
        "version": settings.VERSION,
        "environment": settings.ENVIRONMENT
    }

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


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG,
    )
