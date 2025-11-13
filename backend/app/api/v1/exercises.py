from fastapi import APIRouter, Depends, Query
from sqlalchemy.future import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.postgresql import postgresql
from app.models.ejercicio import Ejercicio
from app.schemas.ejercicio import EjercicioResponse

router = APIRouter(prefix="/exercises", tags=["Exercises"])

@router.get("/", response_model=list[EjercicioResponse])
async def get_exercises(
    categoria: str | None = Query(None, description="Filtrar por categoría"),
    db: AsyncSession = Depends(postgresql.get_session)
):
    """
    Obtener todos los ejercicios activos, opcionalmente filtrados por categoría.
    """
    query = select(Ejercicio).where(Ejercicio.activo == True)

    if categoria:
        query = query.where(Ejercicio.categoria.ilike(f"%{categoria}%"))

    result = await db.execute(query)
    ejercicios = result.scalars().all()
    return ejercicios
