"""
PhysioAuditService — Logger de eventos clínicos del Fisioterapeuta en MongoDB.

Colección: physio_events
Complementa el AuditService de PostgreSQL (auditoria_admin) con logs más granulares
que incluyen metadata clínica de las acciones del Rol 2/3.

Estructura de documento:
{
    "action":    "ROUTINE_ML_VERIFIED",
    "actor":     {"id": 4, "correo": "fisio@example.com", "id_rol": 2},
    "entity":    {"type": "rutinas", "id": 12},
    "timestamp": ISODate,
    "metadata":  {}   # payload específico por acción
}
"""
from __future__ import annotations

from datetime import datetime, timezone
from typing import Any

from pymongo.database import Database

# Nombre de la colección MongoDB
COLLECTION_NAME = "physio_events"


class PhysioAuditService:
    """
    Servicio de auditoría clínica en MongoDB para acciones del Fisioterapeuta.
    Se llama adicionalmente al AuditService de PostgreSQL para enriquecer
    los logs con metadata clínica que no encaja en la tabla auditoria_admin.

    Uso (en un endpoint):
        await PhysioAuditService.log(
            mongo_db=session_manager.mongo,
            action="ROUTINE_ML_VERIFIED",
            actor=current_physio,
            entity_type="rutinas",
            entity_id=id_rutina,
            metadata={"ruta_ml": "Rehabilitación", "ejercicios_count": 8}
        )
    """

    # Acciones soportadas (para documentación y evitar typos)
    EXERCISE_CREATED = "EXERCISE_CREATED"
    EXERCISE_VERIFIED = "EXERCISE_VERIFIED"
    ROUTINE_CREATED_MANUAL = "ROUTINE_CREATED_MANUAL"
    ROUTINE_ML_VERIFIED = "ROUTINE_ML_VERIFIED"
    ROUTINE_MODIFIED = "ROUTINE_MODIFIED"
    PHYSIO_DEACTIVATED = "PHYSIO_DEACTIVATED"

    @staticmethod
    async def log(
        mongo_db: Database,
        action: str,
        actor_id: int,
        actor_correo: str,
        actor_rol: int,
        entity_type: str,
        entity_id: int | None = None,
        metadata: dict[str, Any] | None = None,
    ) -> None:
        """
        Inserta un evento clínico en la colección 'physio_events' de MongoDB.

        Esta operación es fire-and-forget — no bloquea ni hace rollback si falla.
        El caller debe encapsularla en try/except si quiere manejar el fallo.

        Args:
            mongo_db:     Instancia de la base de datos MongoDB (session_manager.mongo)
            action:       Identificador del evento ("ROUTINE_ML_VERIFIED", etc.)
            actor_id:     ID del Fisioterapeuta/Admin que realiza la acción
            actor_correo: Correo del actor para identificación rápida
            actor_rol:    id_rol del actor (2 = Fisio, 3 = Admin)
            entity_type:  Tipo de entidad afectada ("rutinas", "ejercicios", "usuarios")
            entity_id:    ID de la entidad afectada (None si no aplica)
            metadata:     Diccionario con datos específicos del evento (opcional)
        """
        document = {
            "action": action,
            "actor": {
                "id": actor_id,
                "correo": actor_correo,
                "id_rol": actor_rol,
            },
            "entity": {
                "type": entity_type,
                "id": entity_id,
            },
            "timestamp": datetime.now(timezone.utc),
            "metadata": metadata or {},
        }

        collection = mongo_db[COLLECTION_NAME]
        # Motor PyMongo en modo síncrono dentro de FastAPI async —
        # pymongo soporta esto sin bloquear el event loop gracias al motor de I/O
        collection.insert_one(document)

    @staticmethod
    async def log_from_user(
        mongo_db: Database,
        action: str,
        actor,  # User ORM instance
        entity_type: str,
        entity_id: int | None = None,
        metadata: dict[str, Any] | None = None,
    ) -> None:
        """
        Wrapper de conveniencia que extrae actor_id, actor_correo y actor_rol
        directamente del objeto User ORM.

        Args:
            mongo_db:    Instancia de la base de datos MongoDB
            action:      Identificador del evento
            actor:       User ORM con atributos id_usuario, correo, id_rol
            entity_type: Tipo de entidad afectada
            entity_id:   ID de la entidad afectada
            metadata:    Metadata clínica adicional
        """
        await PhysioAuditService.log(
            mongo_db=mongo_db,
            action=action,
            actor_id=actor.id_usuario,
            actor_correo=actor.correo,
            actor_rol=actor.id_rol,
            entity_type=entity_type,
            entity_id=entity_id,
            metadata=metadata,
        )

    @staticmethod
    def get_events_by_actor(
        mongo_db: Database,
        actor_id: int,
        limit: int = 50,
    ) -> list[dict]:
        """
        Consulta síncrona — retorna los últimos N eventos de un actor específico.
        Ordenados por timestamp descendente.

        Args:
            mongo_db:  Instancia de la base de datos MongoDB
            actor_id:  ID del Fisioterapeuta
            limit:     Máximo de eventos a retornar
        Returns:
            Lista de documentos (sin _id para serialización JSON limpia)
        """
        collection = mongo_db[COLLECTION_NAME]
        cursor = collection.find(
            {"actor.id": actor_id},
            {"_id": 0}  # excluir _id de ObjectId (no serializable por defecto)
        ).sort("timestamp", -1).limit(limit)
        return list(cursor)

    @staticmethod
    def get_events_by_entity(
        mongo_db: Database,
        entity_type: str,
        entity_id: int,
    ) -> list[dict]:
        """
        Retorna todos los eventos clínicos sobre una entidad específica.
        Útil para trazabilidad completa de una rutina o ejercicio.

        Args:
            mongo_db:    Instancia de la base de datos MongoDB
            entity_type: "rutinas" | "ejercicios" | "usuarios"
            entity_id:   ID de la entidad
        Returns:
            Lista de documentos ordenados por timestamp desc
        """
        collection = mongo_db[COLLECTION_NAME]
        cursor = collection.find(
            {"entity.type": entity_type, "entity.id": entity_id},
            {"_id": 0}
        ).sort("timestamp", -1)
        return list(cursor)
