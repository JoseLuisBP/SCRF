"""
Router de administración — endpoints exclusivos para usuarios con id_rol=3.
Todos los endpoints de este módulo están protegidos por check_admin_role.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from typing import List

from app.db.session import get_session, SessionManager
from app.models.user import User
from app.schemas.user import AdminCreate, UserResponse, UserRoleChange
from app.schemas.admin import AdminStats, AuditoriaResponse
from app.api.deps import check_admin_role
from app.services.user_service import UserService
from app.services.audit_service import AuditService

router = APIRouter()

ROL_NAMES = {1: "usuario", 2: "entrenador", 3: "admin"}


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
    """
    new_admin = await UserService.create_admin_user(
        session_manager.pg_session,
        admin_data,
    )

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
    """
    users = await UserService.get_all_users(
        session_manager.pg_session,
        skip=skip,
        limit=limit
    )
    return users


@router.get(
    "/stats",
    response_model=AdminStats,
    summary="Estadísticas del sistema (solo Admin)"
)
async def get_system_stats(
    current_admin: User = Depends(check_admin_role),
    session_manager: SessionManager = Depends(get_session)
):
    """
    Retorna conteos agregados de usuarios por rol y estado de cuenta.

    **Requiere**: token de un usuario con id_rol=3 en el JWT.
    """
    stats = await UserService.get_stats(session_manager.pg_session)
    return stats


@router.get(
    "/audit-logs",
    response_model=List[AuditoriaResponse],
    summary="Registros de auditoría (solo Admin)"
)
async def get_audit_logs(
    skip: int = 0,
    limit: int = 50,
    current_admin: User = Depends(check_admin_role),
    session_manager: SessionManager = Depends(get_session)
):
    """
    Retorna el historial de acciones administrativas ordenado por fecha descendente.

    **Requiere**: token de un usuario con id_rol=3 en el JWT.
    """
    logs = await AuditService.get_audit_logs(
        session_manager.pg_session, skip=skip, limit=limit
    )
    return logs


@router.put(
    "/users/{user_id}/role",
    response_model=UserResponse,
    summary="Cambiar rol de un usuario (solo Admin)"
)
async def change_user_role(
    user_id: int,
    role_data: UserRoleChange,
    current_admin: User = Depends(check_admin_role),
    session_manager: SessionManager = Depends(get_session)
):
    """
    Asigna cualquier rol válido a un usuario (1=usuario, 2=entrenador, 3=admin).

    **Requiere**: token de un usuario con id_rol=3 en el JWT.

    - No se puede cambiar el propio rol.
    - La acción queda registrada en `auditoria_admin`.
    """
    updated_user = await UserService.change_role(
        session_manager.pg_session,
        user_id,
        role_data.id_rol,
        current_admin
    )

    await AuditService.log_action(
        session=session_manager.pg_session,
        id_admin=current_admin.id_usuario,
        accion="CHANGE_ROLE",
        entidad_afectada=f"usuarios:{user_id}",
        descripcion=(
            f"Admin {current_admin.correo} cambió rol de usuario {user_id} "
            f"a '{ROL_NAMES.get(role_data.id_rol, role_data.id_rol)}'"
        )
    )
    await session_manager.pg_session.commit()

    return updated_user


@router.delete(
    "/users/{user_id}",
    summary="Eliminar usuario (solo Admin)"
)
async def delete_user(
    user_id: int,
    current_admin: User = Depends(check_admin_role),
    session_manager: SessionManager = Depends(get_session)
):
    """
    Elimina permanentemente un usuario del sistema.

    **Requiere**: token de un usuario con id_rol=3 en el JWT.

    - No se puede eliminar la propia cuenta.
    - La acción queda registrada en `auditoria_admin`.

    Raises:
        HTTPException 404: Si el usuario no existe
        HTTPException 400: Si se intenta eliminar la propia cuenta
    """
    user = await UserService.get_user_by_id(session_manager.pg_session, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuario no encontrado"
        )

    user_correo = user.correo

    success = await UserService.delete_user(
        session_manager.pg_session,
        user_id,
        current_admin
    )

    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Error al eliminar el usuario"
        )

    await AuditService.log_action(
        session=session_manager.pg_session,
        id_admin=current_admin.id_usuario,
        accion="DELETE_USER",
        entidad_afectada=f"usuarios:{user_id}",
        descripcion=f"Admin {current_admin.correo} eliminó usuario: {user_correo}"
    )
    await session_manager.pg_session.commit()

    return {"message": "Usuario eliminado exitosamente"}
