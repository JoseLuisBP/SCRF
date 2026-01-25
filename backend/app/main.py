from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.core.config import settings
from app.core.logging import logger
from app.api.v1 import auth, users, exercises, progress
from app.db.postgresql import postgresql
from app.db.mongodb import mongodb
from app.middleware import setup_cors, setup_error_handlers


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

    # Inicializar MongoDB
    try:
        await mongodb.connect()
        logger.info("Conexión MongoDB inicializada correctamente.")
    except Exception as e:
        logger.error(f"Error al inicializar MongoDB: {e}")

    yield  # Aquí corre la app

    # Cierre de conexiones al apagar
    await mongodb.disconnect()
    await postgresql.close()
    logger.info("Cerrando la aplicación y conexiones...")


def create_app() -> FastAPI:
    """Crea y configura la aplicación FastAPI"""
    application = FastAPI(
        lifespan=lifespan,
        title=settings.PROJECT_NAME,
        version=settings.VERSION,
        description="API backend de la aplicación",
        docs_url="/docs",
        redoc_url="/redoc",
    )

    # Configurar Middleware
    from fastapi.middleware.trustedhost import TrustedHostMiddleware
    from app.middleware.security import SecurityHeadersMiddleware
    from app.middleware.logging import LogRequestsMiddleware

    # 1. Security Headers (Primero para que aplique a todo)
    application.add_middleware(SecurityHeadersMiddleware)
    
    # 2. Trusted Host
    # Permite requests con cualquier Host header por ahora "*"
    # En producción cambiar a los dominios reales ["misitio.com"]
    application.add_middleware(TrustedHostMiddleware, allowed_hosts=["*"])

    # 3. CORS (Ya configurado en setup_cors, pero aseguramos orden lógico)
    setup_cors(application)
    
    # 4. Logging (Captura requests después de seguridad y antes de ruteo)
    application.add_middleware(LogRequestsMiddleware)

    setup_error_handlers(application)

    # Incluir routers
    application.include_router(
        auth.router,
        prefix=f"{settings.API_V1_PREFIX}/auth",
        tags=["Authentication"]
    )

    application.include_router(
        users.router,
        prefix=f"{settings.API_V1_PREFIX}/users",
        tags=["Users"]
    )

    application.include_router(
        exercises.router, 
        prefix="/api/v1"
    )

    application.include_router(
        progress.router,
        prefix="/api/v1"
    )

    @application.get("/")
    def root():
        """Ruta raíz"""
        return {
            "message": "Cuidado y Rehabilitación API Backend",
            "version": settings.VERSION,
            "status": "running",
            "docs": "/docs",
        }

    @application.get("/health")
    def health_check():
        """Health check endpoints"""
        return {
            "status": "healthy",
            "version": settings.VERSION,
            "environment": settings.ENVIRONMENT
        }

    return application

app = create_app()


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG,
    )
