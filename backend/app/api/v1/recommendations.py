from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.api.deps import get_session, get_current_user
from app.models.user import User
from app.models.ejercicio import Ejercicio
from app.services.ml_service import ml_service
from typing import Dict, Any

router = APIRouter()

@router.post("/{id_usuario}", response_model=Dict[str, Any])
def get_personalized_routine(
    id_usuario: int,
    db: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    """
    Endpoint de Inferencia ML para obtener una rutina personalizada (Ruta de Entrenamiento)
    y unos ejercicios iniciales recomendados estrictamente filtrados (Hard Constraints).
    """
    # Autorización (Dejo la lógica existente, el usuario solo genera sus rutas a menos que sea Admin)
    if current_user.id_usuario != id_usuario and not current_user.is_admin:
        raise HTTPException(status_code=403, detail="No tienes permiso para generar rutinas para este usuario")
        
    user = db.query(User).filter(User.id_usuario == id_usuario).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
        
    # Extracción del Perfil Médico
    medical_profile = user.perfil_medico
    
    # Generar Flag de Inferencia ML
    tiene_lesion = 1 if medical_profile and medical_profile.lesiones and len(medical_profile.lesiones) > 0 else 0
    
    # Inferencia ML
    edad = user.edad or 30
    nivel_fisico = user.nivel_fisico or "sedentario"
    objetivo_principal = user.objetivo_principal or "Salud/Movilidad"
    
    ruta_recomendada = ml_service.predict_routine_path(
        edad=edad,
        nivel_fisico=nivel_fisico,
        objetivo_principal=objetivo_principal,
        tiene_lesion=tiene_lesion
    )
    
    # ==========================
    # Lógica "HARD CONSTRAINTS"
    # ==========================
    lesiones_usuario = medical_profile.lesiones if medical_profile and medical_profile.lesiones else []
    
    query = db.query(Ejercicio).filter(Ejercicio.activo == True)
    
    all_exercises = query.all()
    filtered_exercises = []
    
    # Filtrado exacto
    for ej in all_exercises:
        is_safe = True
        
        # Filtro estricto por contraindicación json/lista
        if getattr(ej, "contraindicaciones", None) and isinstance(ej.contraindicaciones, list):
            for lesion in lesiones_usuario:
                # Si una lesión del usuario coincide con una contraindicación del Ejercicio, se corta.
                if lesion in ej.contraindicaciones:
                    is_safe = False
                    break
        
        # Filtro blando por Ruta
        # Ejemplo: Si es de rehabilitación, nunca recomendar un ejercicio de hipertrofia o Fuerza si no es de su enfoque.
        if ruta_recomendada == 'Rehabilitación' and getattr(ej, "enfoque", "") not in ['Rehabilitación', 'Salud/Movilidad']:
            is_safe = False
            
        if ruta_recomendada == 'Adulto Mayor' and getattr(ej, "nivel_dificultad", "") == 'Avanzado':
            is_safe = False
            
        if is_safe:
            filtered_exercises.append({
                "id_ejercicio": ej.id_ejercicio,
                "nombre_ejercicio": ej.nombre_ejercicio,
                "categoria": ej.categoria,
                "enfoque": getattr(ej, "enfoque", "General"),
                "nivel_dificultad": getattr(ej, "nivel_dificultad", "General")
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
            "descripcion": f"Rutina personalizada recomendada por el modelo ML CART para ruta: {ruta_recomendada}",
            "ejercicios_habilitados": filtered_exercises[:15] # Mostramos los 15 más óptimos
        }
    }
