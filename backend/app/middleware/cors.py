from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings

def setup_cors(app: FastAPI) -> None:
    """
    Configura el middleware CORS para la aplicación FastAPI.
    Args:
        app: Instancia de FastAPI
    """
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.BACKEND_CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
