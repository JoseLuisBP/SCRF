from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.security import get_password_hash, verify_password
from app.db.postgresql import postgresql
from app.models.user import User
from app.schemas.user import UserResponse, UserUpdate, UserChangePassword
from app.api.deps import get_current_user, get_current_superuser

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
def update_my_profile(
    user_update: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(postgresql.get_session)
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

    db.commit()
    db.refresh(current_user)
    
    return current_user


@router.post("/me/change-password")
def change_password(
    password_data: UserChangePassword,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(postgresql.get_session)
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
    # Verificar contraseña actual
    if not verify_password(password_data.contrasena_actual, current_user.contrasena_hash):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="La contraseña actual es incorrecta"
        )
    
    # Actualizar contraseña
    current_user.contrasena_hash = get_password_hash(password_data.nueva_contrasena)
    db.commit()
    
    return {"message": "Contraseña actualizada exitosamente"}


@router.delete("/me")
def delete_my_account(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(postgresql.get_session)
):
    """
    Eliminar cuenta del usuario actual
    
    Args:
        current_user: Usuario autenticado
        db: Sesión de base de datos
    
    Returns:
        Mensaje de confirmación
    """
    db.delete(current_user)
    db.commit()
    
    return {"message": "Cuenta eliminada exitosamente"}


# ============================================
# ENDPOINTS DE ADMIN (requieren administrador)
# ============================================

@router.get("/", response_model=List[UserResponse])
def get_all_users(
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_superuser),
    db: Session = Depends(postgresql.get_session)
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
    users = db.query(User).offset(skip).limit(limit).all()
    return users


@router.get("/{user_id}", response_model=UserResponse)
def get_user_by_id(
    user_id: int,
    current_user: User = Depends(get_current_superuser),
    db: Session = Depends(postgresql.get_session)
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
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuario no encontrado"
        )
    return user


@router.delete("/{user_id}")
def delete_user(
    user_id: int,
    current_user: User = Depends(get_current_superuser),
    db: Session = Depends(postgresql.get_session)
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
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuario no encontrado"
        )
    
    db.delete(user)
    db.commit()
    
    return {"message": "Usuario eliminado exitosamente"}
