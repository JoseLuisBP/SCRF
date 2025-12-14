"""
Dependencias de base de datos para FastAPI
"""

from sqlalchemy.ext.asyncio import AsyncSession
from app.db.postgresql import postgresql

async def get_db() -> AsyncSession:
    """
    Dependencia que retorna una AsyncSession válida.
    FastAPI manejará automáticamente el ciclo de vida.
    """
    async for session in postgresql.get_session():
        yield session
