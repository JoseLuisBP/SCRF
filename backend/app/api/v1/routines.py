"""
Router público para la exploración del catálogo general de rutinas.
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select, text
from typing import List

from app.api.deps import get_session
from app.db.session import SessionManager
from app.models.rutina import Rutina
from app.schemas.rutina import RutinaPublicOut, EjercicioEnRutinaOut

router = APIRouter()

@router.get(
    "/",
    response_model=List[RutinaPublicOut],
    summary="Listar todas las rutinas del catálogo",
)
async def get_all_routines(
    session_manager: SessionManager = Depends(get_session),
    skip: int = 0,
    limit: int = 100,
) -> List[RutinaPublicOut]:
    """
    Devuelve todas las rutinas registradas en el sistema (generadas por ML, validadas, manuales, etc).
    Ordenadas por fecha de creación descendente.
    """
    db = session_manager.pg_session
    result = await db.execute(
        select(Rutina)
        .order_by(Rutina.fecha_creacion.desc(), Rutina.id_rutina.desc())
        .offset(skip)
        .limit(limit)
    )
    return list(result.scalars().all())


@router.get(
    "/{id_rutina}/exercises",
    response_model=List[EjercicioEnRutinaOut],
    summary="Obtener los ejercicios detallados de una rutina",
)
async def get_routine_exercises(
    id_rutina: int,
    session_manager: SessionManager = Depends(get_session),
) -> List[EjercicioEnRutinaOut]:
    """
    Obtiene la lista de ejercicios que componen una rutina, incluyendo
    sus metadatos, ordenados por la columna 'orden' de la tabla intermedia.
    """
    db = session_manager.pg_session
    
    # Verificamos si la rutina existe
    rutina = await db.scalar(select(Rutina).where(Rutina.id_rutina == id_rutina))
    if not rutina:
        raise HTTPException(status_code=404, detail="Rutina no encontrada")

    query = text("""
    SELECT 
        e.id_ejercicio,
        e.nombre_ejercicio,
        e.descripcion,
        COALESCE(re.repeticiones, e.repeticiones) as repeticiones,
        COALESCE(re.duracion_segundos, e.tiempo) as tiempo,
        e.categoria,
        e.advertencias,
        e.enfoque,
        e.nivel_dificultad,
        e.contraindicaciones,
        e.is_verified_by_physio,
        m.url_archivo AS "videoUrl"
    FROM ejercicios e
    JOIN rutina_ejercicio re ON e.id_ejercicio = re.id_ejercicio
    LEFT JOIN multimedia m ON m.id_ejercicio = e.id_ejercicio
    WHERE re.id_rutina = :id_rutina
    ORDER BY re.orden ASC
    """)

    result = await db.execute(query, {"id_rutina": id_rutina})
    rows = result.mappings().all()

    return rows
