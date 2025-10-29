'''Gestor de sesiones para bases de datos PostgreSQL y MongoDB.'''
from typing import AsyncGenerator, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from pymongo.database import Database
from .postgresql import postgresql
from .mongodb import mongodb

class SessionManager:
    """
    Gestor de sesiones que proporciona acceso a las bases de datos
    PostgreSQL y MongoDB.
    """
    
    def __init__(self):
        self._pg_session: Optional[AsyncSession] = None
        self._mongo_db: Database = mongodb.db

    @property
    def mongo(self):
        """Acceso a la base de datos MongoDB"""
        return self._mongo_db

    @property
    def pg_session(self) -> AsyncSession:
        """Acceso a la sesión de PostgreSQL"""
        if not self._pg_session:
            raise RuntimeError("Sesión PostgreSQL no inicializada")
        return self._pg_session

    async def set_pg_session(self, session: AsyncSession):
        """Establece la sesión PostgreSQL"""
        self._pg_session = session

    async def close(self):
        """Cierra las sesiones activas"""
        if self._pg_session:
            await self._pg_session.close()
            self._pg_session = None

async def get_session_manager() -> AsyncGenerator[SessionManager, None]:
    """Generador de dependencias para SessionManager"""
    manager = SessionManager()
    
    try:
        pg_session = await postgresql.get_session()
        await manager.set_pg_session(pg_session)
        yield manager
    finally:
        await manager.close()

# Para uso con FastAPI Depends
get_sesion = get_session_manager
