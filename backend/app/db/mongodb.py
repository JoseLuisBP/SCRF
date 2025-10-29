"""Gestor de conexión MongoDB asíncrono usando Motor - Singleton"""
from typing import Optional
import logging
from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.errors import ConnectionFailure, OperationFailure
from ..core.config import settings

logger = logging.getLogger(__name__)

class MongoDBManager:
    _instance = None
    _client: Optional[AsyncIOMotorClient] = None
    _db = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance

    async def connect(self):
        """Establece la conexión con MongoDB"""
        try:
            if not self._client:
                self._client = AsyncIOMotorClient(settings.MONGODB_URL)
                self._db = self._client[settings.MONGODB_DB_NAME]
                # Verificar conexión
                await self._client.admin.command('ping')
                logger.info("Conexión exitosa a MongoDB")
        except ConnectionFailure as e:
            logger.error(f"Error al conectar a MongoDB: {e}")
            raise
        except Exception as e:
            logger.error(f"Error inesperado al conectar a MongoDB: {e}")
            raise

    async def disconnect(self):
        """Cierra la conexión con MongoDB"""
        if self._client:
            self._client.close()
            self._client = None
            self._db = None
            logger.info("Desconexión exitosa de MongoDB")

    @property
    def db(self):
        """Retorna la instancia de la base de datos"""
        if not self._client:
            raise ConnectionFailure("No hay conexión activa con MongoDB")
        return self._db

    async def get_collection(self, collection_name: str):
        """Obtiene una colección específica"""
        return self.db[collection_name]

    async def create_indexes(self):
        """Crea los índices necesarios en las colecciones"""
        try:
            # Índices para la colección de analytics
            analytics = self.db.analytics
            await analytics.create_index([("userId", 1), ("timestamp", -1)])
            
            # Índices para la colección de progreso
            progress = self.db.progress
            await progress.create_index([("userId", 1), ("date", -1)])
            
            logger.info("Índices creados exitosamente")
        except OperationFailure as e:
            logger.error(f"Error al crear índices: {e}")
            raise

    async def health_check(self) -> bool:
        """Verifica el estado de la conexión"""
        try:
            await self._client.admin.command('ping')
            return True
        except Exception as e:
            logger.error(f"Error en health check de MongoDB: {e}")
            return False

# Instancia global del gestor de MongoDB
mongodb = MongoDBManager()
