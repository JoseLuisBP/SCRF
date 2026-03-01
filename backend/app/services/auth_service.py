from datetime import timedelta
from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException, status

from app.core.config import settings
from app.core.security import (
    verify_password,
    create_access_token
)
from app.models.user import User
from app.schemas.user import UserCreate
from app.schemas.token import Token
from app.services.user_service import UserService


class AuthService:
    """
    Servicio para operaciones de autenticación y gestión de tokens.
    Maneja login, registro y creación de tokens de acceso.
    """

    @staticmethod
    async def authenticate_user(
        session: AsyncSession,
        correo: str,
        contrasena: str
    ) -> Optional[User]:
        """
        Autentica un usuario por correo y contraseña.

        Args:
            session: Sesión de base de datos
            correo: Correo del usuario
            contrasena: Contraseña en texto plano

        Returns:
            User si las credenciales son válidas, None en caso contrario
        """
        user = await UserService.get_user_by_email(session, correo)

        if not user:
            return None
        if not await verify_password(contrasena, user.contrasena_hash):
            return None
        if not user.is_active:
            return None

        return user

    @staticmethod
    async def register_user(
        session: AsyncSession,
        user_data: UserCreate
    ) -> User:
        """
        Registra un nuevo usuario.

        Args:
            session: Sesión de base de datos
            user_data: Datos del usuario a crear

        Returns:
            Usuario creado

        Raises:
            HTTPException: Si el email ya está registrado o hay error de integridad
        """
        return await UserService.create_user(session, user_data)

    @staticmethod
    def create_token(user: User) -> Token:
        """
        Crea un token de acceso para el usuario.

        Args:
            user: Usuario para el cual crear el token

        Returns:
            Token con access_token, tipo y tiempo de expiración
        """
        access_token_expires = timedelta(
            minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
        )
        access_token = create_access_token(
            data={"sub": str(user.id_usuario)},
            expires_delta=access_token_expires
        )

        return Token(
            access_token=access_token,
            token_type="bearer",
            expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
            refresh_token=None
        )

    @staticmethod
    async def get_current_user(
        session: AsyncSession,
        user_id: int
    ) -> Optional[User]:
        """
        Obtiene el usuario actual por ID (wrapper para UserService).

        Args:
            session: Sesión de base de datos
            user_id: ID del usuario

        Returns:
            Usuario si existe y está activo, None en caso contrario
        """
        user = await UserService.get_user_by_id(session, user_id)
        if user and user.is_active:
            return user
        return None
