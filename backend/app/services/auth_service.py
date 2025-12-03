from datetime import timedelta
from typing import Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import IntegrityError
from fastapi import HTTPException, status

from app.core.config import settings
from app.core.security import (
    verify_password,
    get_password_hash,
    create_access_token
)
from app.models.user import User
from app.schemas.user import UserCreate
from app.schemas.token import Token

class AuthService:
    
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

        # Se accede al usuario por correo a través de la sesión
        result = await session.execute(
            select(User).where(User.correo == correo)
        )
        # 
        user = result.scalar_one_or_none()

        if not user:
            return None
        if not verify_password(contrasena, user.contrasena_hash):
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
        # Verificar si el email ya existe
        result = await session.execute(
            select(User).where(User.correo == user_data.correo)
        )
        existing_user = result.scalar_one_or_none()
        
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="El email ya está registrado",
                headers={"WWW-Authenticate": "Bearer"}
            )
        
        # Crear nuevo usuario
        new_user = User(
            correo=user_data.correo,
            nombre=user_data.nombre,
            contrasena_hash=get_password_hash(user_data.contrasena),
            edad=user_data.edad,
            peso=user_data.peso,
            estatura=user_data.estatura,
            nivel_fisico=user_data.nivel_fisico,
            is_active=True,
        )
        
        session.add(new_user)
        
        try:
            await session.commit()
            await session.refresh(new_user)
        except IntegrityError as e:
            await session.rollback()
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="El email ya está registrado",
                headers={"WWW-Authenticate": "Bearer"}
            ) from e
        
        return new_user

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
    async def get_user_by_id(
        session: AsyncSession,
        user_id: int
    ) -> Optional[User]:
        """
        Obtiene un usuario por su ID.
        
        Args:
            session: Sesión de base de datos
            user_id: ID del usuario
            
        Returns:
            Usuario si existe, None en caso contrario
        """
        result = await session.execute(
            select(User).where(User.id_usuario == user_id)
        )
        return result.scalar_one_or_none()

    @staticmethod
    async def get_user_by_email(
        session: AsyncSession,
        correo: str
    ) -> Optional[User]:
        """
        Obtiene un usuario por su correo.
        
        Args:
            session: Sesión de base de datos
            correo: Correo del usuario
            
        Returns:
            Usuario si existe, None en caso contrario
        """
        result = await session.execute(
            select(User).where(User.correo == correo)
        )
        return result.scalar_one_or_none()
