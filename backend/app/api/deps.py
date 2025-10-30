from typing import AsyncGenerator, Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime

from ..core.config import settings
from ..core.security import verify_password
from ..db.session import get_sesion
from ..models.user import User
from ..schemas.token import TokenData

# Configuración de OAuth2
oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl=f"{settings.API_V1_PREFIX}/auth/login"
)

async def get_current_user(
    token: str = Depends(oauth2_scheme),
    session_manager = Depends(get_sesion)
) -> User:
    """
    Valida el token JWT y retorna el usuario actual.
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
        token_data = TokenData(user_id=payload.get("sub"))
        
        if not token_data.user_id:
            raise credentials_exception
            
    except JWTError:
        raise credentials_exception
        
    # Obtener el usuario de la base de datos
    async with session_manager.pg_session as session:
        user = await session.get(User, token_data.user_id)
        
        if user is None:
            raise credentials_exception
            
        return user

async def get_current_active_user(
    current_user: User = Depends(get_current_user),
) -> User:
    """
    Verifica que el usuario actual esté activo.
    """
    if not current_user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
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
