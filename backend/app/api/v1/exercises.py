from fastapi import APIRouter, Depends
from sqlalchemy import text
from app.db.session import get_session, SessionManager
from app.schemas.ejercicio import EjercicioOut
from typing import List

router = APIRouter()

@router.get("/exercises", response_model=List[EjercicioOut])
async def get_exercises(
    session_manager: SessionManager = Depends(get_session)
):
    query = text("""
    SELECT 
        e.id_ejercicio,
        e.nombre_ejercicio,
        e.descripcion,
        e.repeticiones,
        e.tiempo,
        e.categoria,
        e.advertencias,
        e.enfoque,
        e.nivel_dificultad,
        e.contraindicaciones,
        m.url_archivo AS "videoUrl"
    FROM ejercicios e
    LEFT JOIN multimedia m 
        ON m.id_ejercicio = e.id_ejercicio
    WHERE e.activo = TRUE
    """)

    result = await session_manager.pg_session.execute(query)
    rows = result.mappings().all()

    return rows