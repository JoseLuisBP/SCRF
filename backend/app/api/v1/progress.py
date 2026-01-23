from fastapi import APIRouter, Depends
from sqlalchemy.future import select
from typing import List

from app.db.session import get_session, SessionManager
from app.models.historial_progreso import HistorialProgreso
from app.schemas.historial_progreso import HistorialProgresoOut

router = APIRouter()

@router.get(
    "/progress/{id_usuario}",
    response_model=List[HistorialProgresoOut]
)
async def get_progress_by_user(
    id_usuario: int,
    session_manager: SessionManager = Depends(get_session)
):
    """
    Obtiene el historial de progreso de un usuario específico
    """
    result = await session_manager.pg_session.execute(
        select(HistorialProgreso)
        .where(HistorialProgreso.id_usuario == id_usuario)
        .order_by(HistorialProgreso.fecha)
    )

    progreso = result.scalars().all()
    return progreso
