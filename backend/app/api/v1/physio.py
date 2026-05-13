"""
Router del Fisioterapeuta — endpoints exclusivos para Rol 2 (Fisio) y Rol 3 (Admin).
Todos los endpoints están protegidos por check_physio_role.

Endpoints:
  GET    /physio/stats                        → Estadísticas del fisioterapeuta
  GET    /physio/exercises                    → Listar todos los ejercicios (incl. inactivos)
  GET    /physio/exercises/unverified         → Ejercicios sin verificación clínica
  POST   /physio/exercises                    → Crear ejercicio verificado
  PATCH  /physio/exercises/{id}/verify        → Validar ejercicio individual
  PATCH  /physio/exercises/{id}               → Editar ejercicio
  PATCH  /physio/exercises/{id}/toggle-active → Activar/desactivar ejercicio
  GET    /physio/routines/pending             → Lista de rutinas ML sin verificar
  POST   /physio/routines                     → Crear rutina manual verificada
  PATCH  /physio/routines/{id}/verify         → Validar rutina ML
  PATCH  /physio/routines/{id}/reject         → Rechazar rutina ML con motivo
"""
from fastapi import APIRouter, Depends, HTTPException, Body, status
from sqlalchemy import select, func
from typing import List, Optional

from app.api.deps import check_physio_role, get_session
from app.db.session import SessionManager
from app.models.ejercicio import Ejercicio
from app.models.rutina import Rutina
from app.models.user import User
from app.schemas.ejercicio import EjercicioOut, EjercicioUpdateIn, PhysioStatsOut
from app.schemas.rutina import RutinaPublicOut, RutinaCreateIn
from app.services.recommendation_service import RecommendationService
from app.services.audit_service import AuditService
from app.services.physio_audit_service import PhysioAuditService

router = APIRouter()


# ──────────────────────────────────────────────────────────────────────────────
# ESTADÍSTICAS DEL FISIOTERAPEUTA
# ──────────────────────────────────────────────────────────────────────────────

@router.get(
    "/stats",
    response_model=PhysioStatsOut,
    summary="Estadísticas propias del fisioterapeuta",
)
async def get_physio_stats(
    current_physio: User = Depends(check_physio_role),
    session_manager: SessionManager = Depends(get_session),
) -> PhysioStatsOut:
    db = session_manager.pg_session
    physio_id = current_physio.id_usuario

    creados = await db.scalar(
        select(func.count()).where(Ejercicio.created_by == physio_id)
    )
    verificados_ej = await db.scalar(
        select(func.count()).where(
            Ejercicio.is_verified_by_physio == True,
            Ejercicio.activo == True,
        )
    )
    sin_verificar = await db.scalar(
        select(func.count()).where(
            Ejercicio.is_verified_by_physio == False,
            Ejercicio.activo == True,
        )
    )
    pendientes_rutinas = await db.scalar(
        select(func.count()).where(
            Rutina.is_machine_learning_generated == True,
            Rutina.is_verified_by_physio == False,
        )
    )
    verificadas_por_mi = await db.scalar(
        select(func.count()).where(Rutina.verified_by == physio_id)
    )

    return PhysioStatsOut(
        ejercicios_creados=creados or 0,
        ejercicios_verificados=verificados_ej or 0,
        ejercicios_sin_verificar=sin_verificar or 0,
        rutinas_pendientes=pendientes_rutinas or 0,
        rutinas_verificadas_por_mi=verificadas_por_mi or 0,
    )


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


@router.get(
    "/exercises/unverified",
    response_model=List[EjercicioOut],
    summary="Listar ejercicios sin verificación clínica",
)
async def list_unverified_exercises(
    skip: int = 0,
    limit: int = 100,
    current_physio: User = Depends(check_physio_role),
    session_manager: SessionManager = Depends(get_session),
) -> List[EjercicioOut]:
    result = await session_manager.pg_session.execute(
        select(Ejercicio)
        .where(Ejercicio.is_verified_by_physio == False, Ejercicio.activo == True)
        .offset(skip)
        .limit(limit)
    )
    return list(result.scalars().all())


@router.patch(
    "/exercises/{id_ejercicio}",
    response_model=EjercicioOut,
    summary="Editar datos de un ejercicio",
)
async def update_exercise(
    id_ejercicio: int,
    data: EjercicioUpdateIn,
    current_physio: User = Depends(check_physio_role),
    session_manager: SessionManager = Depends(get_session),
) -> EjercicioOut:
    db = session_manager.pg_session
    result = await db.execute(select(Ejercicio).where(Ejercicio.id_ejercicio == id_ejercicio))
    ejercicio = result.scalar_one_or_none()
    if not ejercicio:
        raise HTTPException(status_code=404, detail=f"Ejercicio {id_ejercicio} no encontrado")

    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(ejercicio, field, value)

    await AuditService.log_action(
        session=db,
        id_admin=current_physio.id_usuario,
        accion="EXERCISE_UPDATED",
        entidad_afectada=f"ejercicios:{id_ejercicio}",
        descripcion=f"Fisio {current_physio.correo} editó ejercicio id={id_ejercicio}; campos: {list(update_data.keys())}",
    )
    try:
        await PhysioAuditService.log_from_user(
            mongo_db=session_manager.mongo,
            action="EXERCISE_UPDATED",
            actor=current_physio,
            entity_type="ejercicios",
            entity_id=id_ejercicio,
            metadata={"campos_modificados": list(update_data.keys())},
        )
    except Exception:
        pass
    await db.commit()
    await db.refresh(ejercicio)
    return ejercicio


@router.patch(
    "/exercises/{id_ejercicio}/toggle-active",
    response_model=EjercicioOut,
    summary="Activar o desactivar un ejercicio",
)
async def toggle_exercise_active(
    id_ejercicio: int,
    current_physio: User = Depends(check_physio_role),
    session_manager: SessionManager = Depends(get_session),
) -> EjercicioOut:
    db = session_manager.pg_session
    result = await db.execute(select(Ejercicio).where(Ejercicio.id_ejercicio == id_ejercicio))
    ejercicio = result.scalar_one_or_none()
    if not ejercicio:
        raise HTTPException(status_code=404, detail=f"Ejercicio {id_ejercicio} no encontrado")

    ejercicio.activo = not ejercicio.activo
    nuevo_estado = "activado" if ejercicio.activo else "desactivado"

    await AuditService.log_action(
        session=db,
        id_admin=current_physio.id_usuario,
        accion="EXERCISE_TOGGLED",
        entidad_afectada=f"ejercicios:{id_ejercicio}",
        descripcion=f"Fisio {current_physio.correo} {nuevo_estado} ejercicio id={id_ejercicio}",
    )
    try:
        await PhysioAuditService.log_from_user(
            mongo_db=session_manager.mongo,
            action="EXERCISE_TOGGLED",
            actor=current_physio,
            entity_type="ejercicios",
            entity_id=id_ejercicio,
            metadata={"activo": ejercicio.activo},
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


@router.patch(
    "/routines/{id_rutina}/reject",
    response_model=RutinaPublicOut,
    summary="Rechazar rutina ML (marcar como no apta clínicamente)",
)
async def reject_routine(
    id_rutina: int,
    motivo: str = Body(..., description="Motivo clínico del rechazo"),
    current_physio: User = Depends(check_physio_role),
    session_manager: SessionManager = Depends(get_session),
) -> RutinaPublicOut:
    """
    Rechaza una rutina ML — queda is_verified_by_physio=False con trazabilidad
    del fisio que la rechazó y el motivo en el log clínico.
    No volverá a aparecer en la cola de pendientes porque tiene verified_by asignado.
    """
    from datetime import datetime, timezone

    db = session_manager.pg_session
    result = await db.execute(select(Rutina).where(Rutina.id_rutina == id_rutina))
    rutina = result.scalar_one_or_none()
    if not rutina:
        raise HTTPException(status_code=404, detail=f"Rutina {id_rutina} no encontrada")

    if rutina.is_verified_by_physio:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="La rutina ya fue verificada; no puede rechazarse.",
        )

    rutina.verified_by = current_physio.id_usuario
    rutina.verified_at = datetime.now(timezone.utc).replace(tzinfo=None)

    await AuditService.log_action(
        session=db,
        id_admin=current_physio.id_usuario,
        accion="ROUTINE_ML_REJECTED",
        entidad_afectada=f"rutinas:{id_rutina}",
        descripcion=f"Fisio {current_physio.correo} rechazó rutina ML id={id_rutina} — motivo: {motivo}",
    )
    try:
        await PhysioAuditService.log_from_user(
            mongo_db=session_manager.mongo,
            action="ROUTINE_ML_REJECTED",
            actor=current_physio,
            entity_type="rutinas",
            entity_id=id_rutina,
            metadata={"motivo": motivo},
        )
    except Exception:
        pass
    await db.commit()
    await db.refresh(rutina)
    return rutina
