from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select, text
from app.api.deps import get_session, get_current_user
from app.db.session import SessionManager
from app.models.user import User
from app.models.ejercicio import Ejercicio
from app.services.ml_service import ml_service
from typing import Dict, Any

router = APIRouter()

@router.post("/{id_usuario}", response_model=Dict[str, Any])
async def get_personalized_routine(
    id_usuario: int,
    session_manager: SessionManager = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    # 🔐 AUTH
    if current_user.id_usuario != id_usuario and not current_user.is_admin:
        raise HTTPException(status_code=403, detail="No tienes permiso")

    db = session_manager.pg_session

    # 👤 USER
    result = await db.execute(
        select(User).where(User.id_usuario == id_usuario)
    )
    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    medical_profile = user.perfil_medico
    lesiones_usuario = (
        medical_profile.lesiones if medical_profile and medical_profile.lesiones else []
    )

    tiene_lesion = 1 if len(lesiones_usuario) > 0 else 0
    edad = user.edad or 30
    nivel_fisico = user.nivel_fisico or "sedentario"
    objetivo_principal = user.objetivo_principal or "Salud/Movilidad"

    ruta_recomendada = ml_service.predict_routine_path(
        edad=edad,
        nivel_fisico=nivel_fisico,
        objetivo_principal=objetivo_principal,
        tiene_lesion=tiene_lesion
    )

    
    # 🎯 FILTRO POR RUTA (del segundo archivo)
    
    query = select(Ejercicio).where(Ejercicio.activo == True)

    if ruta_recomendada == "Rehabilitación":
        query = query.where(
            Ejercicio.categoria.in_(["core", "cardio", "piernas"])
        )
    elif ruta_recomendada == "Fuerza/Joven":
        query = query.where(
            Ejercicio.categoria.in_(["pecho", "espalda", "piernas", "hombros", "brazos"])
        )
    elif ruta_recomendada == "Adulto Mayor":
        query = query.where(
            Ejercicio.categoria.in_(["movilidad", "Rehabilitación"])
        )

    result = await db.execute(query)
    ejercicios = result.scalars().all()

    
    # MULTIMEDIA MAP (del primer archivo)
    
    multimedia_result = await db.execute(text("""
        SELECT id_ejercicio, url_archivo
        FROM multimedia
    """))

    multimedia_map = {}
    for row in multimedia_result.mappings().all():
        multimedia_map[row["id_ejercicio"]] = row["url_archivo"]

    
    # FILTRO POR CONTRAINDICACIONES
    
    filtered_exercises = []

    for ej in ejercicios:
        is_safe = True

        if isinstance(ej.contraindicaciones, list):
            for lesion in lesiones_usuario:
                if lesion in ej.contraindicaciones:
                    is_safe = False
                    break

        if is_safe:
            filtered_exercises.append({
                "id_ejercicio": ej.id_ejercicio,
                "nombre_ejercicio": ej.nombre_ejercicio,
                "descripcion": ej.descripcion,
                "repeticiones": ej.repeticiones,
                "tiempo": ej.tiempo,
                "categoria": ej.categoria,
                "advertencias": ej.advertencias,
                "enfoque": ej.enfoque,
                "nivel_dificultad": ej.nivel_dificultad,
                "contraindicaciones": ej.contraindicaciones,
                "videoUrl": multimedia_map.get(ej.id_ejercicio)  # ✅ URL real desde multimedia
            })

    return {
        "ruta_ml": ruta_recomendada,
        "usuario_id": id_usuario,
        "inference_features": {
            "edad": edad,
            "nivel_fisico": nivel_fisico,
            "objetivo": objetivo_principal,
            "tiene_lesion": bool(tiene_lesion)
        },
        "rutina_generada": {
            "descripcion": f"Rutina ML: {ruta_recomendada}",
            "ejercicios_habilitados": filtered_exercises[:15]
        }
    }