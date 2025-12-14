from fastapi import APIRouter, Depends
from sqlalchemy.future import select
from app.db.session import get_session, SessionManager
from app.models.ejercicio import Ejercicio
from app.schemas.ejercicio import EjercicioOut
from typing import List

router = APIRouter()

@router.get(
    "/exercises",
    response_model=List[EjercicioOut]
)
async def get_exercises(
    session_manager: SessionManager = Depends(get_session)
):
    result = await session_manager.pg_session.execute(
        select(Ejercicio).where(Ejercicio.activo == True)
    )
    ejercicios = result.scalars().all()
    return ejercicios
