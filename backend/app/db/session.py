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
    MongoDB se inicializa solo cuando se accede por primera vez.
    PostgreSQL debe ser establecido explícitamente mediante set_pg_session. 
    """
    
    def __init__(self):
        self._pg_session: Optional[AsyncSession] = None
        self._mongo_db: Optional[Database] = None
        self._mongo_initialized: bool = False

    @property
    def mongo(self):
        """
        Acceso lazy a la base de datos MongoDB.
        Se inicializa solo cuando es accedido por primera vez.
        Returns:
            Database: Instancia de la base de datos MongoDB
        Raises:
            RuntimeError: Si MongoDB no está disponible o configurado
        """
        if not self._mongo_initialized:
            if mongodb.db is None:
                raise RuntimeError(
                    "MongoDB no está configurado."
                    "Verifica la configuración de conexión."
                )
            self._mongo_db = mongodb.db
            self._mongo_initialized = True
        return self._mongo_db

    @property
    def pg_session(self) -> AsyncSession:
        """
        Acceso a la sesión de PostgreSQL.
        Returns:
            AsyncSession: Sesión activa de PostgreSQL
        Raises:
            RuntimeError: Si la sesión no ha sido inicializada
        """
        if not self._pg_session:
            raise RuntimeError(
                "Sesión PostgreSQL no inicializada."
                "Debe llamarse set_pg_session primero."
            )
        return self._pg_session

    async def set_pg_session(self, session: AsyncSession) -> None:
        """
        Establece la sesión PostgreSQL.
        Args:
            session: Sesión de PostgreSQL a establecer
        """
        self._pg_session = session

    def has_mongo(self) -> bool:
        """
        Verifica si MongoDB está disponible sin inicializarlo.
        Returns:
            bool: True si MongoDB está disponible
        """
        return mongodb.db is not None
    
    def has_pg_session(self) -> bool:
        """
        Verifica si la sesión PostgreSQL está inicializada.
        Returns:
            bool: True si la sesión está activa
        """
        return self._pg_session is not None

    async def close(self) -> None:
        """
        Limpia las referencias de las sesiones.
        Nota: PostgreSQL se cierra automáticamente por su contex manager.
        Mongo usa un pool de conexiones manejado globalmente.
        """
        # Limpia referencias de PostgreSQL
        self._pg_session = None
        # Limpia referencias de MongoDB
        self._mongo_initialized = False
        self._mongo_db = None

async def get_session_manager() -> AsyncGenerator[SessionManager, None]:
    """
    Generador de dependencias para SessionManager.
    Inicializa PostgreSQL automáticamente.
    MongoDB se inicializa solo cuando se accede.
    
    Yields:
        SessionManager: Instancia del gestor de sesiones
        
    Example:
        ```python
        @app.get("/users")
        async def get_users(
            session_manager: SessionManager = Depends(get_session_manager)
        ):
            # Usar la sesión de PostgreSQL directamente
            user = await session_manager.pg_session.get(User, user_id)
            
            # MongoDB se inicializa solo si lo usas
            if session_manager.has_mongo():
                data = session_manager.mongo["collection"].find_one({})
        ```
    """
    manager = SessionManager()
    # Usar el generador de PostgreSQL como context manager
    async with postgresql.get_session() as pg_sesion:
        await manager.set_pg_session(pg_sesion)
        try:
            yield manager
        finally:
            # El context manager de PostgreSQL se encarga del cleanup
            # Solo limpiamos las referencias del manager
            manager._pg_session = None
            manager._mongo_initialized = False
            manager._mongo_db = None

# Para uso con FastAPI Depends
get_session = get_session_manager
