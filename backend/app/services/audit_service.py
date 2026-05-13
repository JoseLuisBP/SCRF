"""Servicio de auditoría para registrar acciones de administradores."""
from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import insert, select

from app.models.auditoria import AuditoriaAdmin


class AuditService:
    """
    Servicio para registrar acciones administrativas en la tabla auditoria_admin.
    Se llama siempre que un admin crea usuarios o modifica rutinas/ejercicios.
    """

    @staticmethod
    async def log_action(
        session: AsyncSession,
        id_admin: int,
        accion: str,
        entidad_afectada: str,
        descripcion: str = ""
    ) -> None:
        """
        Inserta un registro de auditoría.

        Args:
            session: Sesión de base de datos asíncrona
            id_admin: ID del administrador que realiza la acción
            accion: Descripción corta de la acción (ej: "CREATE_ADMIN", "UPDATE_ROUTINE")
            entidad_afectada: Entidad sobre la que recae la acción (ej: "usuarios:5")
            descripcion: Detalle adicional opcional
        """
        await session.execute(
            insert(AuditoriaAdmin).values(
                id_admin=id_admin,
                accion=accion,
                entidad_afectada=entidad_afectada,
                descripcion=descripcion,
            )
        )
        # No se hace commit aquí — el caller controla la transacción
        # para que la auditoría sea atómica con la operación principal.

    @staticmethod
    async def get_audit_logs(
        session: AsyncSession, skip: int = 0, limit: int = 50
    ) -> List[AuditoriaAdmin]:
        """
        Retorna los registros de auditoría ordenados por fecha descendente.

        Args:
            session: Sesión de base de datos asíncrona
            skip: Número de registros a saltar (paginación)
            limit: Máximo de registros a retornar

        Returns:
            Lista de registros de auditoría
        """
        result = await session.execute(
            select(AuditoriaAdmin)
            .order_by(AuditoriaAdmin.fecha_accion.desc())
            .offset(skip)
            .limit(limit)
        )
        return result.scalars().all()
