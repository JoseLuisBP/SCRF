"""
Router de recomendaciones personalizadas.
Thin layer: solo valida autorización y delega al RecommendationService.
Toda la lógica de negocio (CART, filtros, badges) vive en:
  app/services/recommendation_service.py
"""
from fastapi import APIRouter, Depends, HTTPException

from app.api.deps import get_current_user, ADMIN_ROL_ID
from app.db.session import SessionManager, get_session
from app.models.user import User
from app.schemas.rutina import RutinaMLOut
from app.services.ml_service import ml_service
from app.services.recommendation_service import RecommendationService
from app.services.user_service import UserService

router = APIRouter()


@router.post(
    "/{id_usuario}",
    response_model=RutinaMLOut,
    summary="Generar rutina personalizada con el modelo CART",
    description=(
        "Infiere la ruta de entrenamiento óptima para el usuario usando el algoritmo CART "
        "y retorna los ejercicios filtrados por contraindicaciones médicas. "
        "La rutina generada tiene `is_machine_learning_generated=True` y badge `ml_generated`. "
        "Un Fisioterapeuta (Rol 2) puede posteriormente validarla via `PATCH /physio/routines/{id}/verify`."
    ),
)
async def get_personalized_routine(
    id_usuario: int,
    session_manager: SessionManager = Depends(get_session),
    current_user: User = Depends(get_current_user),
) -> RutinaMLOut:
    # 🔐 Solo el propio usuario o un Admin/Fisio puede solicitar la rutina de otro
    if current_user.id_usuario != id_usuario and current_user.id_rol not in (2, ADMIN_ROL_ID):
        raise HTTPException(status_code=403, detail="No tienes permiso para acceder a esta rutina")

    user = await UserService.get_user_by_id(session_manager.pg_session, id_usuario)
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    return await RecommendationService.generate_ml_routine(
        db=session_manager.pg_session,
        user=user,
        ml_svc=ml_service,
    )