from typing import List
from fastapi import APIRouter, Depends, HTTPException, status

from app.db.session import get_session, SessionManager
from app.models.user import User
from app.schemas.user import UserResponse, UserUpdate, UserChangePassword
from app.api.deps import get_current_user, require_admin
from app.services.user_service import UserService
from app.services.audit_service import AuditService

router = APIRouter()

ROL_NAMES = {1: "usuario", 2: "entrenador", 3: "admin"}


@router.get("/me", response_model=UserResponse)
def get_my_profile(current_user: User = Depends(get_current_user)):
    return current_user


@router.put("/me", response_model=UserResponse)
async def update_my_profile(
    user_update: UserUpdate,
    current_user: User = Depends(get_current_user),
    session_manager: SessionManager = Depends(get_session)
):
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
    success = await UserService.delete_user(
        session_manager.pg_session,
        current_user.id_usuario,
        current_user
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
    user = await UserService.get_user_by_id(session_manager.pg_session, user_id)
    user_correo = user.correo if user else str(user_id)

    success = await UserService.deactivate_user(
        session_manager.pg_session,
        user_id,
        current_user
    )

    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Error al desactivar el usuario"
        )

    await AuditService.log_action(
        session=session_manager.pg_session,
        id_admin=current_user.id_usuario,
        accion="DEACTIVATE_USER",
        entidad_afectada=f"usuarios:{user_id}",
        descripcion=f"Admin {current_user.correo} desactivó la cuenta de: {user_correo}"
    )
    await session_manager.pg_session.commit()

    return {"message": "Usuario desactivado exitosamente"}


@router.post("/{user_id}/activate")
async def activate_user(
    user_id: int,
    current_user: User = Depends(require_admin),
    session_manager: SessionManager = Depends(get_session)
):
    user = await UserService.get_user_by_id(session_manager.pg_session, user_id)
    user_correo = user.correo if user else str(user_id)

    success = await UserService.activate_user(
        session_manager.pg_session,
        user_id,
        current_user
    )

    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Error al activar el usuario"
        )

    await AuditService.log_action(
        session=session_manager.pg_session,
        id_admin=current_user.id_usuario,
        accion="ACTIVATE_USER",
        entidad_afectada=f"usuarios:{user_id}",
        descripcion=f"Admin {current_user.correo} activó la cuenta de: {user_correo}"
    )
    await session_manager.pg_session.commit()

    return {"message": "Usuario activado exitosamente"}


@router.post("/{user_id}/toggle-admin")
async def toggle_admin_status(
    user_id: int,
    current_user: User = Depends(require_admin),
    session_manager: SessionManager = Depends(get_session)
):
    user_before = await UserService.get_user_by_id(session_manager.pg_session, user_id)
    user_correo = user_before.correo if user_before else str(user_id)

    success = await UserService.toggle_admin_status(
        session_manager.pg_session,
        user_id,
        current_user
    )

    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Error al cambiar el estado de administrador"
        )

    user_after = await UserService.get_user_by_id(session_manager.pg_session, user_id)
    nuevo_rol = ROL_NAMES.get(user_after.id_rol if user_after else 1, "usuario")

    await AuditService.log_action(
        session=session_manager.pg_session,
        id_admin=current_user.id_usuario,
        accion="TOGGLE_ADMIN",
        entidad_afectada=f"usuarios:{user_id}",
        descripcion=(
            f"Admin {current_user.correo} cambió estado de admin de: "
            f"{user_correo} → rol '{nuevo_rol}'"
        )
    )
    await session_manager.pg_session.commit()

    return {"message": "Estado de administrador actualizado exitosamente"}


@router.post("/{user_id}/change-password")
async def admin_change_password(
    user_id: int,
    password_data: UserChangePassword,
    current_user: User = Depends(require_admin),
    session_manager: SessionManager = Depends(get_session)
):
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
