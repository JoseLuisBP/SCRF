from typing import Callable
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from pydantic import ValidationError

from app.core.config import settings
from app.db.session import get_session, SessionManager
from app.models.user import User
from app.schemas.token import TokenData
from app.services.auth_service import AuthService


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

        user = await AuthService.get_user_by_id(
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
    if not current_user.rol.nombre_rol == "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="El usuario no tiene suficientes privilegios"
        )
    return current_user

# Dependencia para roles específicos
async def check_user_role(
    required_role: str,
    current_user: User = Depends(get_current_user)
) -> bool:
    """
    Verifica si el usuario tiene el rol requerido.
    Args:
        required_role: Rol requerido para acceder al recurso
        current_user: Usuario actual
    Returns:
        bool: True si el usuario tiene el rol requerido
    Raises:
        HTTPException: Si el usuario no tiene el rol requerido
    """
    if required_role not in current_user.roles:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Se requiere el rol {required_role}"
        )
    return True
