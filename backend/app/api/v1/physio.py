"""
Router del Fisioterapeuta — endpoints exclusivos para Rol 2 (Fisio) y Rol 3 (Admin).
Todos los endpoints están protegidos por check_physio_role.

Endpoints:
  POST   /physio/exercises              → Crear ejercicio verificado
  POST   /physio/routines               → Crear rutina manual verificada
  GET    /physio/routines/pending       → Lista de rutinas ML sin verificar
  PATCH  /physio/routines/{id}/verify   → Validar rutina ML
  PATCH  /physio/exercises/{id}/verify  → Validar ejercicio individual
  GET    /physio/exercises              → Listar todos los ejercicios (incl. inactivos)
"""
from fastapi import APIRouter, Depends, HTTPException, Body, status
from sqlalchemy import select
from typing import List, Optional

from app.api.deps import check_physio_role, get_session
from app.db.session import SessionManager
from app.models.ejercicio import Ejercicio
from app.models.user import User
from app.schemas.ejercicio import EjercicioOut
from app.schemas.rutina import RutinaPublicOut, RutinaCreateIn
from app.services.recommendation_service import RecommendationService
from app.services.audit_service import AuditService
from app.services.physio_audit_service import PhysioAuditService

router = APIRouter()


# ──────────────────────────────────────────────────────────────────────────────
# EJERCICIOS
# ──────────────────────────────────────────────────────────────────────────────

@router.get(
    "/exercises",
    response_model=List[EjercicioOut],
    summary="Listar todos los ejercicios (activos e inactivos)",
)
async def list_all_exercises(
    skip: int = 0,
    limit: int = 100,
    current_physio: User = Depends(check_physio_role),
    session_manager: SessionManager = Depends(get_session),
) -> List[EjercicioOut]:
    """
    Devuelve todos los ejercicios sin filtro de activo.
    Permite al Fisio ver ejercicios desactivados para poder reactivarlos o verificarlos.
    """
    result = await session_manager.pg_session.execute(
        select(Ejercicio).offset(skip).limit(limit)
    )
    return list(result.scalars().all())


@router.post(
    "/exercises",
    response_model=EjercicioOut,
    status_code=status.HTTP_201_CREATED,
    summary="Crear ejercicio clínico verificado",
)
async def create_exercise(
    nombre_ejercicio: str = Body(...),
    descripcion: str = Body(...),
    categoria: str = Body(...),
    repeticiones: Optional[int] = Body(None),
    tiempo: Optional[int] = Body(None),
    enfoque: Optional[str] = Body(None),
    nivel_dificultad: Optional[str] = Body(None),
    contraindicaciones: Optional[List[str]] = Body(default=[]),
    advertencias: Optional[str] = Body(None),
    current_physio: User = Depends(check_physio_role),
    session_manager: SessionManager = Depends(get_session),
) -> EjercicioOut:
    """
    Crea un ejercicio clínico.
    Por defecto queda con is_verified_by_physio=True y created_by=physio.id.
    """
    db = session_manager.pg_session
    nuevo = Ejercicio(
        nombre_ejercicio=nombre_ejercicio,
        descripcion=descripcion,
        categoria=categoria,
        repeticiones=repeticiones,
        tiempo=tiempo,
        enfoque=enfoque,
        nivel_dificultad=nivel_dificultad,
        contraindicaciones=contraindicaciones or [],
        advertencias=advertencias,
        activo=True,
        is_verified_by_physio=True,
        created_by=current_physio.id_usuario,
    )
    db.add(nuevo)
    await db.flush()

    await AuditService.log_action(
        session=db,
        id_admin=current_physio.id_usuario,
        accion="EXERCISE_CREATED",
        entidad_afectada=f"ejercicios:{nuevo.id_ejercicio}",
        descripcion=f"Fisio {current_physio.correo} creó ejercicio '{nombre_ejercicio}' (id={nuevo.id_ejercicio})",
    )
    # MongoDB — log clínico enriquecido
    try:
        await PhysioAuditService.log_from_user(
            mongo_db=session_manager.mongo,
            action=PhysioAuditService.EXERCISE_CREATED,
            actor=current_physio,
            entity_type="ejercicios",
            entity_id=nuevo.id_ejercicio,
            metadata={"nombre": nombre_ejercicio, "categoria": categoria, "nivel_dificultad": nivel_dificultad},
        )
    except Exception:
        pass  # MongoDB no debe bloquear la operación principal
    await db.commit()
    await db.refresh(nuevo)
    return nuevo


@router.patch(
    "/exercises/{id_ejercicio}/verify",
    response_model=EjercicioOut,
    summary="Verificar ejercicio clínicamente",
)
async def verify_exercise(
    id_ejercicio: int,
    notes: Optional[str] = Body(None, description="Notas clínicas del fisioterapeuta"),
    current_physio: User = Depends(check_physio_role),
    session_manager: SessionManager = Depends(get_session),
) -> EjercicioOut:
    """
    Marca un ejercicio como verificado clínicamente por el Fisioterapeuta.
    Opcionalmente añade notas de verificación.
    """
    db = session_manager.pg_session
    try:
        ejercicio = await RecommendationService.verify_exercise(
            db=db,
            id_ejercicio=id_ejercicio,
            physio=current_physio,
            notes=notes,
        )
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

    await AuditService.log_action(
        session=db,
        id_admin=current_physio.id_usuario,
        accion="EXERCISE_VERIFIED",
        entidad_afectada=f"ejercicios:{id_ejercicio}",
        descripcion=f"Fisio {current_physio.correo} verificó ejercicio id={id_ejercicio}",
    )
    # MongoDB — log clínico
    try:
        await PhysioAuditService.log_from_user(
            mongo_db=session_manager.mongo,
            action=PhysioAuditService.EXERCISE_VERIFIED,
            actor=current_physio,
            entity_type="ejercicios",
            entity_id=id_ejercicio,
            metadata={"notes": notes},
        )
    except Exception:
        pass
    await db.commit()
    await db.refresh(ejercicio)
    return ejercicio


# ──────────────────────────────────────────────────────────────────────────────
# RUTINAS
# ──────────────────────────────────────────────────────────────────────────────

@router.get(
    "/routines/pending",
    response_model=List[RutinaPublicOut],
    summary="Rutinas ML pendientes de verificación",
)
async def get_pending_routines(
    skip: int = 0,
    limit: int = 20,
    current_physio: User = Depends(check_physio_role),
    session_manager: SessionManager = Depends(get_session),
) -> List[RutinaPublicOut]:
    """
    Lista todas las rutinas generadas por el algoritmo CART
    que aún NO han sido verificadas por un Fisioterapeuta.
    Ordenadas por fecha de creación descendente.
    """
    rutinas = await RecommendationService.get_pending_verification_routines(
        db=session_manager.pg_session,
        skip=skip,
        limit=limit,
    )
    return rutinas


@router.post(
    "/routines",
    response_model=RutinaPublicOut,
    status_code=status.HTTP_201_CREATED,
    summary="Crear rutina clínica manual",
)
async def create_physio_routine(
    data: RutinaCreateIn,
    current_physio: User = Depends(check_physio_role),
    session_manager: SessionManager = Depends(get_session),
) -> RutinaPublicOut:
    """
    El Fisioterapeuta crea una rutina de forma manual.
    Defaults automáticos:
      - is_machine_learning_generated = False
      - is_verified_by_physio         = True  (el creador la avala)
    """
    db = session_manager.pg_session
    rutina = await RecommendationService.create_physio_routine(
        db=db,
        data=data,
        physio=current_physio,
    )

    await AuditService.log_action(
        session=db,
        id_admin=current_physio.id_usuario,
        accion="ROUTINE_CREATED_MANUAL",
        entidad_afectada=f"rutinas:{rutina.id_rutina}",
        descripcion=(
            f"Fisio {current_physio.correo} creó rutina manual "
            f"'{rutina.nombre_rutina}' (id={rutina.id_rutina})"
        ),
    )
    # MongoDB — log clínico con metadata de la rutina
    try:
        await PhysioAuditService.log_from_user(
            mongo_db=session_manager.mongo,
            action=PhysioAuditService.ROUTINE_CREATED_MANUAL,
            actor=current_physio,
            entity_type="rutinas",
            entity_id=rutina.id_rutina,
            metadata={
                "nombre_rutina": rutina.nombre_rutina,
                "nivel": rutina.nivel,
                "categoria": rutina.categoria,
                "ejercicio_ids": data.ejercicio_ids,
            },
        )
    except Exception:
        pass
    await db.commit()
    await db.refresh(rutina)
    return rutina


@router.patch(
    "/routines/{id_rutina}/verify",
    response_model=RutinaPublicOut,
    summary="Verificar rutina ML",
)
async def verify_routine(
    id_rutina: int,
    current_physio: User = Depends(check_physio_role),
    session_manager: SessionManager = Depends(get_session),
) -> RutinaPublicOut:
    """
    El Fisioterapeuta valida una rutina generada por ML.
    Establece:
      - is_verified_by_physio = True
      - verified_by           = id del fisio
      - verified_at           = timestamp UTC actual
    El badge cambia de 'ml_generated' → 'ml_verified'.
    """
    db = session_manager.pg_session
    try:
        rutina = await RecommendationService.verify_routine(
            db=db,
            id_rutina=id_rutina,
            physio=current_physio,
        )
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

    await AuditService.log_action(
        session=db,
        id_admin=current_physio.id_usuario,
        accion="ROUTINE_ML_VERIFIED",
        entidad_afectada=f"rutinas:{id_rutina}",
        descripcion=(
            f"Fisio {current_physio.correo} verificó rutina ML "
            f"id={id_rutina} — badge: ml_verified"
        ),
    )
    # MongoDB — log clínico con timestamp de verificación
    try:
        await PhysioAuditService.log_from_user(
            mongo_db=session_manager.mongo,
            action=PhysioAuditService.ROUTINE_ML_VERIFIED,
            actor=current_physio,
            entity_type="rutinas",
            entity_id=id_rutina,
            metadata={"verified_at": rutina.verified_at.isoformat() if rutina.verified_at else None},
        )
    except Exception:
        pass
    await db.commit()
    await db.refresh(rutina)
    return rutina
