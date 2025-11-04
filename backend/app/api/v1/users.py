from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.future import select

from app.core.security import get_password_hash, verify_password
from app.db.session import SessionManager, get_session
from app.models.user import User
from app.schemas.user import UserResponse, UserUpdate, UserChangePassword
from app.api.deps import get_current_user, get_current_superuser

router = APIRouter()


@router.get("/me", response_model=UserResponse)
async def get_my_profile(current_user: User = Depends(get_current_user)):
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
        db: Sesión de base de datos
    
    Returns:
        Usuario actualizado
    
    Raises:
        HTTPException: Si el email/username ya están en uso
    """
    db = session_manager.pg_session
    # Verificar si el nuevo email ya existe (si se está cambiando)
    if user_update.correo and user_update.correo != current_user.correo:
        existing_email = db.query(User).filter(User.correo == user_update.correo).first()
        if existing_email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="El correo ya está registrado"
            )
        current_user.correo = user_update.correo
    
    # Actualizar campos opcionales
    if user_update.nombre is not None:
        current_user.nombre = user_update.nombre
    if user_update.edad is not None:
        current_user.edad = user_update.edad
    if user_update.peso is not None:
        current_user.peso = user_update.peso
    if user_update.estatura is not None:
        current_user.estatura = user_update.estatura
    if user_update.nivel_fisico is not None:
        current_user.nivel_fisico = user_update.nivel_fisico

    await db.commit()
    await db.refresh(current_user)
    
    return current_user


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
        db: Sesión de base de datos
    
    Returns:
        Mensaje de confirmación
    
    Raises:
        HTTPException: Si la contraseña actual es incorrecta
    """
    db = session_manager.pg_session
    # Verificar contraseña actual
    if not verify_password(password_data.contrasena_actual, current_user.contrasena_hash):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="La contraseña actual es incorrecta"
        )
    
    # Actualizar contraseña
    current_user.contrasena_hash = get_password_hash(password_data.nueva_contrasena)
    await db.commit()
    
    return {"message": "Contraseña actualizada exitosamente"}


@router.delete("/me")
async def delete_my_account(
    current_user: User = Depends(get_current_user),
    session_manager: SessionManager = Depends(get_session)
):
    """
    Eliminar cuenta del usuario actual
    
    Args:
        current_user: Usuario autenticado
        db: Sesión de base de datos
    
    Returns:
        Mensaje de confirmación
    """
    db = session_manager.pg_session
    await db.delete(current_user)
    await db.commit()
    
    return {"message": "Cuenta eliminada exitosamente"}


# ============================================
# ENDPOINTS DE ADMIN (requieren administrador)
# ============================================

@router.get("/", response_model=List[UserResponse])
async def get_all_users(
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_superuser),
    session_manager: SessionManager = Depends(get_session)
):
    """
    Obtener todos los usuarios (solo admin)
    
    Args:
        skip: Número de registros a saltar
        limit: Número máximo de registros a retornar
        current_user: Usuario superadmin
        db: Sesión de base de datos
    
    Returns:
        Lista de usuarios
    """
    db = session_manager.pg_session

    result = await db.execute(
        select(User).offset(skip).limit(limit)
    )
    users = result.scalars().all()
    return users


@router.get("/{user_id}", response_model=UserResponse)
async def get_user_by_id(
    user_id: int,
    current_user: User = Depends(get_current_superuser),
    session_manager: SessionManager = Depends(get_session)
):
    """
    Obtener usuario por ID (solo admin)
    
    Args:
        user_id: ID del usuario
        current_user: Usuario superadmin
        db: Sesión de base de datos
    
    Returns:
        Usuario encontrado
    
    Raises:
        HTTPException: Si el usuario no existe
    """
    db = session_manager.pg_session

    user = await db.get(User, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuario no encontrado"
        )
    return user


@router.delete("/{user_id}")
async def delete_user(
    user_id: int,
    current_user: User = Depends(get_current_superuser),
    session_manager: SessionManager = Depends(get_session)
):
    """
    Eliminar usuario por ID (solo admin)
    
    Args:
        user_id: ID del usuario a eliminar
        current_user: Usuario superadmin
        db: Sesión de base de datos
    
    Returns:
        Mensaje de confirmación
    
    Raises:
        HTTPException: Si el usuario no existe
    """
    db = session_manager.pg_session

    user = await db.get(User, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuario no encontrado"
        )
    
    await db.delete(user)
    await db.commit()
    
    return {"message": "Usuario eliminado exitosamente"}
