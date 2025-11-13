"""Gestor de conexión PostgreSQL asíncrono usando SQLAlchemy - Singleton"""

from contextlib import asynccontextmanager
from typing import AsyncGenerator
import logging
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy import MetaData
from app.core.config import settings

logger = logging.getLogger(__name__)

# Crear la base para los modelos
convention = {
    "ix": "ix_%(column_0_label)s",
    "uq": "uq_%(table_name)s_%(column_0_name)s",
    "ck": "ck_%(table_name)s_%(constraint_name)s",
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
    "pk": "pk_%(table_name)s"
}

metadata = MetaData(naming_convention=convention)
Base = declarative_base(metadata=metadata)

class PostgreSQLManager:
    _instance = None
    _engine = None
    _async_session_factory = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance

    def initialize(self):
        """Inicializa el motor de base de datos y la fábrica de sesiones"""
        try:
            if not self._engine:
                self._engine = create_async_engine(
                    settings.ASYNC_DATABASE_URL,
                    echo=settings.DB_ECHO_LOG,
                    pool_size=settings.DB_POOL_SIZE,
                    max_overflow=settings.DB_MAX_OVERFLOW
                )

                self._async_session_factory = sessionmaker(
                    self._engine,
                    class_=AsyncSession,
                    expire_on_commit=False
                )
                logger.info("Motor PostgreSQL inicializado exitosamente")
        except Exception as e:
            logger.error(f"Error al inicializar PostgreSQL: {e}")
            raise
    
    @asynccontextmanager
    async def get_session(self) -> AsyncGenerator[AsyncSession, None]:
        """
        Generador de sesiones asíncronas.
        Uso:
            async with postgresql.get_session() as session:
                # usar la sesión
                result = await session.execute(select(User))
        """
        if not self._async_session_factory:
            raise RuntimeError("PostgreSQL no está inicializado")
        
        async with self._async_session_factory() as session:
            try:
                yield session
            except Exception as e:
                await session.rollback()
                logger.error(f"Error en la sesión de PostgreSQL: {e}")
                raise
            finally:
                await session.close()

    async def health_check(self) -> bool:
        """Verifica el estado de la conexión"""
        try:
            async with self._async_session_factory() as session:
                await session.execute("SELECT 1")
                return True
        except Exception as e:
            logger.error(f"Error en health check de PostgreSQL: {e}")
            return False

    async def close(self):
        """Cierra todas las conexiones"""
        if self._engine:
            await self._engine.dispose()
            self._engine = None
            self._async_session_factory = None
            logger.info("Conexiones PostgreSQL cerradas exitosamente")

# Instancia global del gestor de PostgreSQL
postgresql = PostgreSQLManager()
