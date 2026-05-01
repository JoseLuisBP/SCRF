from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.future import select
from sqlalchemy import text
from typing import List
from pydantic import BaseModel, Field

from app.db.session import get_session, SessionManager
from app.models.historial_progreso import HistorialProgreso
from app.schemas.historial_progreso import HistorialProgresoOut
from app.api.deps import get_current_user
from app.models.user import User

router = APIRouter()


# ─────────────────────────────────────────────
# 🔥 NUEVO: Schema para crear progreso
# ─────────────────────────────────────────────
class ProgresoCreateIn(BaseModel):
    id_rutina: int | None = None
    duracion_real: int = Field(..., gt=0)
    estado: str = "completado"
    notas: str | None = None
    grupo_trabajado: str


# ─────────────────────────────────────────────
# 🔥 NUEVO: Crear progreso
# ─────────────────────────────────────────────
@router.post("/progreso")
async def registrar_progreso(
    data: ProgresoCreateIn,
    session_manager: SessionManager = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    """
    Guarda el progreso de la rutina (clave para rotación de grupos)
    """
    try:
        await session_manager.pg_session.execute(
            text("""
                INSERT INTO historial_progreso
                (id_usuario, id_rutina, fecha, duracion_real, estado, notas, grupo_trabajado)
                VALUES (
                    :id_usuario,
                    :id_rutina,
                    CURRENT_DATE,
                    :duracion_real,
                    :estado,
                    :notas,
                    :grupo
                )
            """),
            {
                "id_usuario": current_user.id_usuario,
                "id_rutina": data.id_rutina,
                "duracion_real": data.duracion_real,
                "estado": data.estado,
                "notas": data.notas,
                "grupo": data.grupo_trabajado,
            },
        )

        await session_manager.pg_session.commit()

        return {
            "message": "Progreso guardado correctamente",
            "grupo": data.grupo_trabajado
        }

    except Exception as e:
        await session_manager.pg_session.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Error al guardar progreso: {str(e)}"
        )


# ─────────────────────────────────────────────
# 🔹 EXISTENTE: Obtener progreso por usuario
# ─────────────────────────────────────────────
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
        .order_by(HistorialProgreso.fecha.desc())
    )

    progreso = result.scalars().all()
    return progreso