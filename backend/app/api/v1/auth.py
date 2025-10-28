from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.security import (
    verify_password, 
    get_password_hash, 
    create_access_token
)
from app.db.postgresql import postgresql
from app.models.user import User
from app.schemas.user import UserCreate, UserResponse
from app.schemas.token import Token, LoginRequest
from app.api.deps import get_current_user

router = APIRouter()


@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
def register(user_data: UserCreate, db: Session = Depends(postgresql.get_session)):
    """
    Registrar un nuevo usuario
    
    Args:
        user_data: Datos del usuario a crear
        db: Sesión de base de datos
    
    Returns:
        Token de acceso JWT
    
    Raises:
        HTTPException: Si el email o username ya existen
    """
    # Verificar si el email ya existe
    existing_user = db.query(User).filter(User.correo == user_data.correo).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El email ya está registrado"
        )

    # Verificar si el nombre de usuario ya existe
    existing_username = db.query(User).filter(User.nombre == user_data.nombre).first()
    if existing_username:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El nombre de usuario ya está en uso"
        )
    
    # Crear nuevo usuario
    db_user = User(
        correo=user_data.correo,
        nombre=user_data.nombre,
        contrasena_hash=get_password_hash(user_data.contrasena),
        edad=user_data.edad,
        peso=user_data.peso,
        estatura=user_data.estatura,
        nivel_fisico=user_data.nivel_fisico,
    )
    
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    # Crear token de acceso
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(db_user.id)}, 
        expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer"
    }


@router.post("/login", response_model=Token)
def login(login_data: LoginRequest, db: Session = Depends(postgresql.get_session)):
    """
    Iniciar sesión con email y contraseña
    
    Args:
        login_data: Credenciales de login (email y password)
        db: Sesión de base de datos
    
    Returns:
        Token de acceso JWT
    
    Raises:
        HTTPException: Si las credenciales son incorrectas
    """
    # Buscar usuario por correo
    user = db.query(User).filter(User.correo == login_data.correo).first()

    if not user or not verify_password(login_data.contrasena, user.contrasena_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Correo o contraseña incorrectos",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Usuario inactivo"
        )
    
    # Crear token de acceso
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(user.id)}, 
        expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer"
    }


@router.get("/verify", response_model=UserResponse)
def verify_token(current_user: User = Depends(get_current_user)):
    """
    Verificar token JWT y obtener información del usuario actual
    
    Args:
        current_user: Usuario actual obtenido del token
    
    Returns:
        Información del usuario autenticado
    """
    return current_user


@router.get("/me", response_model=UserResponse)
def get_current_user_info(current_user: User = Depends(get_current_user)):
    """
    Obtener información del usuario actual
    
    Args:
        current_user: Usuario actual obtenido del token
    
    Returns:
        Información del usuario autenticado
    """
    return current_user


@router.post("/logout")
def logout():
    """
    Cerrar sesión (endpoint simbólico)
    
    En JWT, el logout se maneja en el cliente eliminando el token.
    
    Returns:
        Mensaje de confirmación
    """
    return {"message": "Sesión cerrada exitosamente"}
