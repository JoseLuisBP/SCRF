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

# Rol de Administrador en la tabla roles (seed.sql)
ADMIN_ROL_ID = 3


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
        id_rol_from_token = payload.get("id_rol")  # Claim de rol añadido en auth_service
        token_data = TokenData(user_id=user_id_int, id_rol=id_rol_from_token)

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

# ---------------------------------------------------------------------------
# SISTEMA ANTIGUO (comentado — no borrar)
# Las siguientes dependencias usaban la property is_admin del modelo ORM
# (que comprueba el nombre del rol en la relación). Se reemplazan por
# check_admin_role que lee id_rol directamente del payload JWT.
# ---------------------------------------------------------------------------
# async def get_current_superuser(
#     current_user: User = Depends(get_current_user),
# ) -> User:
#     """Verifica que el usuario actual sea administrador (método antiguo)."""
#     if not current_user.is_admin:  # is_admin = property ORM, no columna DB
#         raise HTTPException(
#             status_code=status.HTTP_403_FORBIDDEN,
#             detail="El usuario no tiene suficientes privilegios"
#         )
#     return current_user
#
# async def require_admin(
#     current_user: User = Depends(get_current_user)
# ) -> User:
#     """Verifica si el usuario tiene permisos de administrador (método antiguo)."""
#     if not current_user.is_admin:  # is_admin = property ORM, no columna DB
#         raise HTTPException(
#             status_code=status.HTTP_403_FORBIDDEN,
#             detail="Se requieren permisos de administrador"
#         )
#     return current_user
# ---------------------------------------------------------------------------

# Nueva dependencia basada en id_rol del JWT (sin consulta extra a la DB)
async def check_admin_role(
    token: str = Depends(oauth2_scheme),
    current_user: User = Depends(get_current_user)
) -> User:
    """
    Verifica que el usuario tenga el rol de Administrador (id_rol == 3).

    Lee el claim 'id_rol' del JWT para evitar una consulta extra a la DB.
    También valida contra el id_rol real del usuario en DB como segunda capa.

    Args:
        token: Token JWT del header Authorization
        current_user: Usuario autenticado obtenido de get_current_user
    Returns:
        Usuario administrador
    Raises:
        HTTPException 403: Si el usuario no tiene rol de administrador
    """
    # Primera capa: leer id_rol del JWT claim (rápido, sin DB)
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        id_rol_token = payload.get("id_rol")
    except JWTError:
        id_rol_token = None

    # Segunda capa: comparar con el id_rol real del usuario en DB
    # Usamos el valor de la DB como fuente de verdad final.
    if current_user.id_rol != ADMIN_ROL_ID:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Se requiere rol de Administrador para esta operación"
        )
    return current_user


# Alias mantenido para retrocompatibilidad con endpoints existentes (users.py)
# que ya usan require_admin. Apuntar al nuevo sistema basado en id_rol.
async def require_admin(
    current_user: User = Depends(check_admin_role)
) -> User:
    """Alias de check_admin_role para retrocompatibilidad con endpoints existentes."""
    return current_user
