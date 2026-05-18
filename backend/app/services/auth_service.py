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
from app.models.medical_profile import MedicalProfile
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
        Registra un nuevo usuario y crea su perfil médico asociado.

        El flujo es:
          1. Crear el usuario en la tabla `usuarios` vía UserService.
          2. Usar el id_usuario recién generado para insertar un registro
             en `perfil_medico`. Si el request no incluye `perfil_medico`,
             se guardan arrays vacíos como valor por defecto.
          3. Hacer refresh del usuario para que la relación
             `usuario.perfil_medico` quede cargada antes de devolverlo.

        Args:
            session: Sesión de base de datos (AsyncSession)
            user_data: Datos del usuario + perfil médico opcional

        Returns:
            Usuario creado con su perfil médico ya relacionado

        Raises:
            HTTPException 409: Si el correo ya está registrado
            HTTPException 500: Si ocurre un error inesperado al crear el perfil
        """
        # ── 1. Crear usuario ──────────────────────────────────────────────────
        # UserService.create_user ya maneja el error de correo duplicado
        # (lanza HTTPException 409) y hace commit + refresh del usuario.
        user = await UserService.create_user(session, user_data)

        # ── 2. Crear perfil médico ────────────────────────────────────────────
        # Extraer datos del perfil médico si vienen en el request;
        # de lo contrario usar listas vacías como valor por defecto.
        perfil_data = user_data.perfil_medico

        perfil_medico = MedicalProfile(
            id_usuario=user.id_usuario,
            condiciones_fisicas=perfil_data.condiciones_fisicas if perfil_data else [],
            lesiones=perfil_data.lesiones if perfil_data else [],
            limitaciones=perfil_data.limitaciones if perfil_data else [],
        )

        try:
            session.add(perfil_medico)
            await session.commit()
            # Refrescar para que la relación user.perfil_medico quede poblada
            await session.refresh(user)
        except Exception as exc:
            await session.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error al crear el perfil médico: {str(exc)}"
            ) from exc

        return user

    @staticmethod
    def create_token(user: User) -> Token:
        """
        Crea un token de acceso para el usuario.

        Args:
            user: Usuario para el cual crear el token

        Returns:
            Token con access_token, tipo, tiempo de expiración e id_rol
        """
        access_token_expires = timedelta(
            minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
        )
        # El payload incluye id_rol para que los endpoints de admin puedan
        # validar el rol sin hacer una consulta extra a la base de datos.
        access_token = create_access_token(
            data={"sub": str(user.id_usuario), "id_rol": user.id_rol},
            expires_delta=access_token_expires
        )

        return Token(
            access_token=access_token,
            token_type="bearer",
            expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
            id_rol=user.id_rol,       # Devuelto para que el frontend lo persista sin decodificar el JWT
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