from typing import List
from fastapi import APIRouter, Depends, HTTPException, status

from app.db.session import get_session, SessionManager
from app.models.user import User
from app.schemas.user import UserResponse, UserUpdate, UserChangePassword
from app.api.deps import get_current_user, require_admin
from app.services.user_service import UserService

router = APIRouter()


@router.get("/me", response_model=UserResponse)
def get_my_profile(current_user: User = Depends(get_current_user)):
    """
    Obtener perfil del usuario actual
    
    Args:
        current_user: Usuario autenticado
    
    Returns:
        Información del perfil del usuario
    """
    return current_user


@router.put("/me", response_model=UserResponse)
async def update_my_profile(
    user_update: UserUpdate,
    current_user: User = Depends(get_current_user),
    session_manager: SessionManager = Depends(get_session)
):
    """
    Actualizar perfil del usuario actual
    
    Args:
        user_update: Datos a actualizar
        current_user: Usuario autenticado
        session_manager: Gestor de sesiones de base de datos
    
    Returns:
        Usuario actualizado
    
    Raises:
        HTTPException: Si hay errores de validación
    """
    updated_user = await UserService.update_user(
        session_manager.pg_session,
        current_user.id_usuario,
        user_update,
        current_user
    )
    
    if not updated_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuario no encontrado"
        )
    
    return updated_user


@router.post("/me/change-password")
async def change_password(
    password_data: UserChangePassword,
    current_user: User = Depends(get_current_user),
    session_manager: SessionManager = Depends(get_session)
):
    """
    Cambiar contraseña del usuario actual
    
    Args:
        password_data: Contraseña actual y nueva
        current_user: Usuario autenticado
        session_manager: Gestor de sesiones de base de datos
    
    Returns:
        Mensaje de confirmación
    
    Raises:
        HTTPException: Si hay errores de validación
    """
    success = await UserService.change_password(
        session_manager.pg_session,
        current_user.id_usuario,
        password_data,
        current_user
    )
    
    if success:
        return {"message": "Contraseña actualizada exitosamente"}
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Error al cambiar la contraseña"
        )


@router.delete("/me")
async def delete_my_account(
    current_user: User = Depends(get_current_user),
    session_manager: SessionManager = Depends(get_session)
):
    """
    Eliminar cuenta del usuario actual
    
    Args:
        current_user: Usuario autenticado
        session_manager: Gestor de sesiones de base de datos
    
    Returns:
        Mensaje de confirmación
    """
    # Para que un usuario pueda eliminar su propia cuenta, pasamos current_user como el "admin"
    # El UserService verificará que no se pueda eliminar la propia cuenta de un admin desde fuera
    # pero aquí permitimos que el usuario se elimine a sí mismo
    success = await UserService.delete_user(
        session_manager.pg_session,
        current_user.id_usuario,
        current_user  # El usuario puede eliminarse a sí mismo
    )
    
    if success:
        return {"message": "Cuenta eliminada exitosamente"}
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Error al eliminar la cuenta"
        )


# ============================================
# ENDPOINTS DE ADMIN (requieren administrador)
# ============================================

@router.get("/", response_model=List[UserResponse])
async def get_all_users(
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(require_admin),
    session_manager: SessionManager = Depends(get_session)
):
    """
    Obtener todos los usuarios (solo admin)
    
    Args:
        skip: Número de registros a saltar
        limit: Número máximo de registros a retornar
        current_user: Usuario administrador
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


@router.get("/{user_id}", response_model=UserResponse)
async def get_user_by_id(
    user_id: int,
    current_user: User = Depends(require_admin),
    session_manager: SessionManager = Depends(get_session)
):
    """
    Obtener usuario por ID (solo admin)
    
    Args:
        user_id: ID del usuario
        current_user: Usuario administrador
        session_manager: Gestor de sesiones de base de datos
    
    Returns:
        Usuario encontrado
    
    Raises:
        HTTPException: Si el usuario no existe
    """
    user = await UserService.get_user_by_id(
        session_manager.pg_session,
        user_id
    )
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuario no encontrado"
        )
    
    return user


@router.put("/{user_id}", response_model=UserResponse)
async def update_user(
    user_id: int,
    user_update: UserUpdate,
    current_user: User = Depends(require_admin),
    session_manager: SessionManager = Depends(get_session)
):
    """
    Actualizar cualquier usuario por ID (solo admin)
    
    Args:
        user_id: ID del usuario a actualizar
        user_update: Datos a actualizar
        current_user: Usuario administrador
        session_manager: Gestor de sesiones de base de datos
    
    Returns:
        Usuario actualizado
    
    Raises:
        HTTPException: Si el usuario no existe
    """
    updated_user = await UserService.update_user(
        session_manager.pg_session,
        user_id,
        user_update,
        current_user
    )
    
    if not updated_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuario no encontrado"
        )
    
    return updated_user


@router.post("/{user_id}/deactivate")
async def deactivate_user(
    user_id: int,
    current_user: User = Depends(require_admin),
    session_manager: SessionManager = Depends(get_session)
):
    """
    Desactivar cuenta de usuario (solo admin)
    
    Args:
        user_id: ID del usuario a desactivar
        current_user: Usuario administrador
        session_manager: Gestor de sesiones de base de datos
    
    Returns:
        Mensaje de confirmación
    """
    success = await UserService.deactivate_user(
        session_manager.pg_session,
        user_id,
        current_user
    )
    
    if success:
        return {"message": "Usuario desactivado exitosamente"}
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Error al desactivar el usuario"
        )


@router.post("/{user_id}/activate")
async def activate_user(
    user_id: int,
    current_user: User = Depends(require_admin),
    session_manager: SessionManager = Depends(get_session)
):
    """
    Activar cuenta de usuario (solo admin)
    
    Args:
        user_id: ID del usuario a activar
        current_user: Usuario administrador
        session_manager: Gestor de sesiones de base de datos
    
    Returns:
        Mensaje de confirmación
    """
    success = await UserService.activate_user(
        session_manager.pg_session,
        user_id,
        current_user
    )
    
    if success:
        return {"message": "Usuario activado exitosamente"}
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Error al activar el usuario"
        )


@router.post("/{user_id}/toggle-admin")
async def toggle_admin_status(
    user_id: int,
    current_user: User = Depends(require_admin),
    session_manager: SessionManager = Depends(get_session)
):
    """
    Cambiar estado de administrador de un usuario (solo admin)
    
    Args:
        user_id: ID del usuario
        current_user: Usuario administrador
        session_manager: Gestor de sesiones de base de datos
    
    Returns:
        Mensaje de confirmación
    """
    success = await UserService.toggle_admin_status(
        session_manager.pg_session,
        user_id,
        current_user
    )
    
    if success:
        return {"message": "Estado de administrador actualizado exitosamente"}
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Error al cambiar el estado de administrador"
        )


@router.post("/{user_id}/change-password")
async def admin_change_password(
    user_id: int,
    password_data: UserChangePassword,
    current_user: User = Depends(require_admin),
    session_manager: SessionManager = Depends(get_session)
):
    """
    Cambiar contraseña de cualquier usuario (solo admin)
    
    Args:
        user_id: ID del usuario
        password_data: Nueva contraseña
        current_user: Usuario administrador
        session_manager: Gestor de sesiones de base de datos
    
    Returns:
        Mensaje de confirmación
    """
    # Para admin, no verificamos la contraseña actual
    success = await UserService.change_password(
        session_manager.pg_session,
        user_id,
        password_data,
        current_user
    )
    
    if success:
        return {"message": "Contraseña cambiada exitosamente"}
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Error al cambiar la contraseña"
        )
