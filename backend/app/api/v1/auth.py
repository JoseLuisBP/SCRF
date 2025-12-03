from fastapi import APIRouter, Depends, HTTPException, status

from app.db.session import get_session, SessionManager
from app.models.user import User
from app.schemas.user import UserCreate, UserResponse
from app.schemas.token import Token, LoginRequest
from app.api.deps import get_current_user
from app.services.auth_service import AuthService

router = APIRouter()

@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
async def register(
    user_data: UserCreate, 
    session_manager: SessionManager = Depends(get_session)
):
    """
    Registrar un nuevo usuario

    Args:
        user_data: Datos del usuario a crear
        session_manager: Gestor de sesiones de base de datos
    Returns:
        Token de acceso JWT
    Raises:
        HTTPException: Si el correo ya está registrado
    """
    
    # Registrar el usuario usando el servicio de autenticación
    user = await AuthService.register_user(
        session_manager.pg_session,
        user_data
    )
    
    # Crear y retornar token
    token = AuthService.create_token(user)
    return token


@router.post("/login", response_model=Token)
async def login(
    login_data: LoginRequest, 
    session_manager: SessionManager = Depends(get_session)
):
    """
    Iniciar sesión con correo y contraseña

    Args:
        login_data: Credenciales de login (correo y contraseña)
        session_manager: SessionManager = Depends(get_session)
    Returns:
        Token de acceso JWT
    Raises:
        HTTPException: Si las credenciales son incorrectas
    """
    # Autenticar usuario
    user = await AuthService.authenticate_user(
        session_manager.pg_session,
        login_data.correo,
        login_data.contrasena
    )
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciales incorrectas o usuario inactivo",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Crear y retornar token
    token = AuthService.create_token(user)
    return token


@router.get("/verify", response_model=UserResponse)
async def verify_token(
    current_user: User = Depends(get_current_user)
):
    """
    Verificar token JWT y obtener información del usuario actual

    Args:
        current_user: Usuario actual obtenido del token
    Returns:
        Información del usuario autenticado
    """
    return current_user


@router.get("/me", response_model=UserResponse)
async def get_current_user_info(
    current_user: User = Depends(get_current_user)
):
    """
    Obtener información del usuario actual
    
    Args:
        current_user: Usuario actual obtenido del token
    Returns:
        Información del usuario autenticado
    """
    return current_user


@router.post("/logout")
async def logout():
    """
    Cerrar sesión (endpoint simbólico)
    En JWT, el logout se maneja en el cliente eliminando el token.
    Returns:
        Mensaje de confirmación
    """
    return {"message": "Sesión cerrada exitosamente"}
