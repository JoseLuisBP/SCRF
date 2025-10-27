from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from typing import AsyncGenerator, Optional
from .postgresql import postgresql
from .mongodb import mongodb

class SessionManager:
    """
    Gestor de sesiones que proporciona acceso a las bases de datos
    PostgreSQL y MongoDB.
    """
    
    def __init__(self):
        self._pg_session: Optional[AsyncSession] = None
        self._mongo_db = mongodb.db

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
    """
    Dependencia para obtener un gestor de sesiones.
    Uso:
        @app.get("/ruta")
        async def endpoint(session_manager: SessionManager = Depends(get_session_manager)):
            # Usar session_manager.mongo o session_manager.pg_session
    """
    manager = SessionManager()
    
    try:
        async with postgresql.get_session() as pg_session:
            await manager.set_pg_session(pg_session)
            yield manager
    finally:
        await manager.close()

# Para uso con FastAPI Depends
get_db = get_session_manager
