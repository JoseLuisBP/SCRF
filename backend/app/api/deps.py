import logging
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from pydantic import ValidationError
from sqlalchemy.future import select

from ..core.config import settings
from ..db.session import get_session, SessionManager
from ..models.user import User
from ..schemas.token import TokenData

# Configurar logger
logger = logging.getLogger(__name__)

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
        logger.debug(f"Decodificando token...")
        # Decodificar el token JWT
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM]
        )

        logger.debug(f"Payload: {payload}")

        user_id = payload.get("sub")
        if user_id is None:
            logger.error("No se encontró 'sub' en el payload")
            raise credentials_exception
        
        user_id_int = int(user_id)
        logger.debug(f"Buscando usuario con id_usuario={user_id_int}")

        token_data = TokenData(user_id = user_id_int)
        # Obtener el usuario de la base de datos
        result = await session_manager.pg_session.execute(select(User).where(User.id_usuario == token_data.user_id))
        user = result.scalar_one_or_none()

        logger.debug(f"Usuario encontrado: {user is not None}")
        
        if user is None:
            logger.error(f"Usuario con id_usuario={user_id_int} no encontrado en BD")
            raise credentials_exception
        
        if not user.is_active:
            logger.warning(f"Usuario {user_id_int} está inactivo")
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Usuario inactivo"
            )
        logger.debug(f"Usuario autenticado: {user.correo}")
        return user
    except (JWTError, ValueError, ValidationError) as exc:
        logger.error(f"Error al validar token: {exc}")
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
