from typing import Callable
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from pydantic import ValidationError

from app.core.config import settings
from app.db.session import get_session, SessionManager
from app.models.user import User
from app.schemas.token import TokenData
from app.services.user_service import UserService


# Configuración de OAuth2
oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl=f"{settings.API_V1_PREFIX}/auth/login"
)

async def get_current_user(
    token: str = Depends(oauth2_scheme),
    session_manager: SessionManager = Depends(get_session)
) -> User:
    """
    Valida el token JWT y retorna el usuario actual.

    Args:
        token: Token JWT del header Authorization
        session_manager: Gestor de sesiones de base de datos
    Returns:
        Usuario autenticado
    Raises:
        HTTPException: Si el token es inválido o el usuario no existe
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="No se pudieron validar las credenciales",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        # Decodificar el token JWT
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM]
        )

        user_id = payload.get("sub")
        if user_id is None:
            raise credentials_exception
        
        user_id_int = int(user_id)
        token_data = TokenData(user_id=user_id_int)

        user = await UserService.get_user_by_id(
            session_manager.pg_session,
            token_data.user_id
        )
        
        if user is None:
            raise credentials_exception
        
        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Usuario inactivo"
            )
        return user
    except (JWTError, ValueError, ValidationError) as exc:
        raise credentials_exception from exc

async def get_current_active_user(
    current_user: User = Depends(get_current_user),
) -> User:
    """
    Verifica que el usuario actual esté activo.
    Args:
        current_user: Usuario obtenido del token
    Returns:
        Usuario activo
    Raises:
        HTTPException: Si el usuario está inactivo
    """
    if not current_user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Usuario inactivo"
        )
    return current_user

async def get_current_superuser(
    current_user: User = Depends(get_current_user),
) -> User:
    """
    Verifica que el usuario actual sea administrador.
    """
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="El usuario no tiene suficientes privilegios"
        )
    return current_user

# Dependencia para verificar permisos de administrador
async def require_admin(
    current_user: User = Depends(get_current_user)
) -> User:
    """
    Verifica si el usuario tiene permisos de administrador.
    Args:
        current_user: Usuario actual
    Returns:
        Usuario administrador
    Raises:
        HTTPException: Si el usuario no es administrador
    """
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Se requieren permisos de administrador"
        )
    return current_user
