"""
Router de administración — endpoints exclusivos para usuarios con id_rol=3.
Todos los endpoints de este módulo están protegidos por check_admin_role.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from typing import List

from app.db.session import get_session, SessionManager
from app.models.user import User
from app.schemas.user import AdminCreate, UserResponse
from app.api.deps import check_admin_role
from app.services.user_service import UserService
from app.services.audit_service import AuditService

router = APIRouter()


@router.post(
    "/create-admin",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Crear nuevo Administrador"
)
async def create_admin(
    admin_data: AdminCreate,
    current_admin: User = Depends(check_admin_role),
    session_manager: SessionManager = Depends(get_session)
):
    """
    Registra un nuevo usuario con rol Administrador (id_rol=3).

    **Requiere**: token de un usuario con id_rol=3 en el JWT.

    - El `id_rol` del nuevo admin se fuerza a 3 en el servicio sin importar el body.
    - La acción queda registrada en `auditoria_admin`.

    Args:
        admin_data: Datos del nuevo administrador (nombre, correo, contraseña, etc.)
        current_admin: Administrador autenticado que realiza la operación
        session_manager: Gestor de sesiones de base de datos

    Returns:
        Perfil del nuevo administrador creado

    Raises:
        HTTPException 400: Si el correo ya está registrado
        HTTPException 403: Si el token no tiene id_rol=3
    """
    new_admin = await UserService.create_admin_user(
        session_manager.pg_session,
        admin_data,
    )

    # Registrar en auditoría — la operación ya fue commiteada en create_admin_user,
    # por eso hacemos un commit separado aquí para el registro de auditoría.
    await AuditService.log_action(
        session=session_manager.pg_session,
        id_admin=current_admin.id_usuario,
        accion="CREATE_ADMIN",
        entidad_afectada=f"usuarios:{new_admin.id_usuario}",
        descripcion=f"Admin {current_admin.correo} creó nuevo administrador: {new_admin.correo}"
    )
    await session_manager.pg_session.commit()

    return new_admin


@router.get(
    "/users",
    response_model=List[UserResponse],
    summary="Listar todos los usuarios (solo Admin)"
)
async def list_all_users(
    skip: int = 0,
    limit: int = 100,
    current_admin: User = Depends(check_admin_role),
    session_manager: SessionManager = Depends(get_session)
):
    """
    Retorna la lista paginada de todos los usuarios del sistema.

    **Requiere**: token de un usuario con id_rol=3 en el JWT.

    Args:
        skip: Número de registros a saltar (paginación)
        limit: Máximo de registros a retornar
        current_admin: Administrador autenticado
        session_manager: Gestor de sesiones de base de datos

    Returns:
        Lista de usuarios
    """
    users = await UserService.get_all_users(
        session_manager.pg_session,
        skip=skip,
        limit=limit
    )
    return users
