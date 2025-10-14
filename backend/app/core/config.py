"""Configuración de la aplicación usando Pydantic Settings"""
from typing import List
from pydantic_settings import BaseSettings
from pydantic import field_validator


class Settings(BaseSettings):
    """Configuración de la aplicación"""
    # Application
    PROJECT_NAME: str
    VERSION: str
    API_V1_PREFIX: str
    DEBUG: bool
    ENVIRONMENT: setattr

    # Server
    HOST: str
    PORT: int

    # Security
    SECRET_KEY: str
    ALGORITHM: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int

    # PostgreSQL
    POSTGRES_SERVER: str
    POSTGRES_USER: str
    POSTGRES_PASSWORD: str
    POSTGRES_DB: str
    POSTGRES_PORT: int

    # MongoDB (opcional)
    MONGODB_URL: str
    MONGODB_DB: str

    # CORS
    BACKEND_CORS_ORIGINS: List[str]

    @field_validator("BACKEND_CORS_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v):
        """Convertir una cadena separada por comas en una lista"""
        if isinstance(v, str):
            return [i.strip() for i in v.split(",")]
        return v
    
    @property
    def DATABASE_URL(self) -> str:
        """Construir URL de la base de datos PostgreSQL"""
        return (
            f"postgresql://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}"
            f"@{self.POSTGRES_SERVER}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"
        )
    
    @property
    def ASYNC_DATABASE_URL(self) -> str:
        """URL asíncrona para PostgreSQL"""
        return (
            f"postgresql+asyncpg://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}"
            f"@{self.POSTGRES_SERVER}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"
        )
    
    class Config:
        env_file = "../../.env"
        case_sensitive = True


# Instancia global de settings
settings = Settings()
