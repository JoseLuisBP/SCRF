"""Configuración de la aplicación usando Pydantic Settings"""
from typing import List, Any
from pydantic_settings import BaseSettings
from pydantic import field_validator, computed_field


class Settings(BaseSettings):
    """Configuración de la aplicación"""
    # Application
    PROJECT_NAME: str = "Sistema Rehabilitación"
    VERSION: str = "1.0.0"
    API_V1_PREFIX: str = "/api/v1"
    DEBUG: bool = False
    ENVIRONMENT: str = "development"

    # Server
    HOST: str = "0.0.0.0"
    PORT: int = 8000

    # Security
    SECRET_KEY: str = "secretkey"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # PostgreSQL
    POSTGRES_SERVER: str = "postgres_db"
    POSTGRES_USER: str = "admin"
    POSTGRES_PASSWORD: str = "admin"
    POSTGRES_DB: str = "app_db"
    POSTGRES_PORT: int = 5432

    # MongoDB
    MONGODB_URL: str = "mongodb://admin:admin@mongo_db:27017/app_mongo?authSource=admin"
    MONGODB_DB: str = "app_mongo"

    # CORS
    BACKEND_CORS_ORIGINS: Any = ["http://localhost:5173", "http://localhost:3000"]

    @field_validator("BACKEND_CORS_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v: Any) -> List[str]:
        """Convertir una cadena separada por comas en una lista"""
        if v is None or v == "":
            return ["http://localhost:5173", "http://localhost:3000"]
        if isinstance(v, str):
            origins = [origin.strip() for origin in v.split(",") if origin.strip()]
            return origins if origins else ["http://localhost:5173", "http://localhost:3000"]
        elif isinstance(v, list):
            return v
        return ["http://localhost:5173", "http://localhost:3000"]
    
    @computed_field
    @property
    def DATABASE_URL(self) -> str:
        """Construir URL de la base de datos PostgreSQL"""
        return (
            f"postgresql://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}"
            f"@{self.POSTGRES_SERVER}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"
        )

    @computed_field
    @property
    def ASYNC_DATABASE_URL(self) -> str:
        """URL asíncrona para PostgreSQL"""
        return (
            f"postgresql+asyncpg://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}"
            f"@{self.POSTGRES_SERVER}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"
        )
    
    class Config:
        env_file = ".env"
        case_sensitive = True
        extra = "ignore"

# Instancia global de settings
settings = Settings()
