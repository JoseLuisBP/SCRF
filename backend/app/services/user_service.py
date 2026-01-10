from typing import Optional, List
from sqlalchemy import select, update, delete
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import IntegrityError
from fastapi import HTTPException, status

from app.core.security import get_password_hash, verify_password
from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate, UserChangePassword, UserResponse


class UserService:
    """
    Servicio para operaciones CRUD de usuarios.
    Maneja todas las operaciones relacionadas con la gestión de usuarios.
    """

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

    @staticmethod
    async def get_all_users(
        session: AsyncSession,
        skip: int = 0,
        limit: int = 100
    ) -> List[User]:
        """
        Obtiene una lista paginada de todos los usuarios.

        Args:
            session: Sesión de base de datos
            skip: Número de registros a saltar
            limit: Número máximo de registros a devolver

        Returns:
            Lista de usuarios
        """
        result = await session.execute(
            select(User).offset(skip).limit(limit)
        )
        return result.scalars().all()

    @staticmethod
    async def create_user(
        session: AsyncSession,
        user_data: UserCreate
    ) -> User:
        """
        Crea un nuevo usuario.

        Args:
            session: Sesión de base de datos
            user_data: Datos del usuario a crear

        Returns:
            Usuario creado

        Raises:
            HTTPException: Si el email ya está registrado
        """
        # Verificar si el email ya existe
        existing_user = await UserService.get_user_by_email(session, user_data.correo)
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="El email ya está registrado"
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
            tiempo_disponible=user_data.tiempo_disponible,
            is_active=True,
            is_admin=False
        )

        session.add(new_user)

        try:
            await session.commit()
            await session.refresh(new_user)
        except IntegrityError as e:
            await session.rollback()
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Error al crear el usuario"
            ) from e

        return new_user

    @staticmethod
    async def update_user(
        session: AsyncSession,
        user_id: int,
        user_data: UserUpdate,
        current_user: User = None
    ) -> Optional[User]:
        """
        Actualiza los datos de un usuario.

        Args:
            session: Sesión de base de datos
            user_id: ID del usuario a actualizar
            user_data: Datos a actualizar
            current_user: Usuario que realiza la actualización (para validaciones)

        Returns:
            Usuario actualizado o None si no existe

        Raises:
            HTTPException: Si hay errores de validación
        """
        user = await UserService.get_user_by_id(session, user_id)
        if not user:
            return None

        # Verificar permisos (solo el propio usuario o admin pueden actualizar)
        if current_user and current_user.id_usuario != user_id and not current_user.is_admin:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="No tienes permisos para actualizar este usuario"
            )

        update_data = user_data.model_dump(exclude_unset=True)

        # Si se está actualizando el email, verificar que no exista
        if 'correo' in update_data:
            existing_user = await UserService.get_user_by_email(session, update_data['correo'])
            if existing_user and existing_user.id_usuario != user_id:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="El email ya está registrado"
                )

        # Si se está actualizando la contraseña, hashearla
        if 'contrasena' in update_data:
            update_data['contrasena_hash'] = get_password_hash(update_data.pop('contrasena'))

        try:
            await session.execute(
                update(User)
                .where(User.id_usuario == user_id)
                .values(**update_data)
            )
            await session.commit()

            # Recargar el usuario actualizado
            updated_user = await UserService.get_user_by_id(session, user_id)
            return updated_user

        except IntegrityError as e:
            await session.rollback()
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Error al actualizar el usuario"
            ) from e

    @staticmethod
    async def change_password(
        session: AsyncSession,
        user_id: int,
        password_data: UserChangePassword,
        current_user: User = None
    ) -> bool:
        """
        Cambia la contraseña de un usuario.

        Args:
            session: Sesión de base de datos
            user_id: ID del usuario
            password_data: Datos de cambio de contraseña
            current_user: Usuario que realiza el cambio

        Returns:
            True si el cambio fue exitoso

        Raises:
            HTTPException: Si hay errores de validación
        """
        user = await UserService.get_user_by_id(session, user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Usuario no encontrado"
            )

        # Verificar permisos
        if current_user and current_user.id_usuario != user_id and not current_user.is_admin:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="No tienes permisos para cambiar la contraseña de este usuario"
            )

        # Verificar contraseña actual (si no es admin cambiando la de otro)
        if current_user and current_user.id_usuario == user_id:
            if not verify_password(password_data.contrasena_actual, user.contrasena_hash):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="La contraseña actual es incorrecta"
                )

        # Actualizar contraseña
        try:
            await session.execute(
                update(User)
                .where(User.id_usuario == user_id)
                .values(contrasena_hash=get_password_hash(password_data.nueva_contrasena))
            )
            await session.commit()
            return True

        except Exception as e:
            await session.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Error al cambiar la contraseña"
            ) from e

    @staticmethod
    async def deactivate_user(
        session: AsyncSession,
        user_id: int,
        current_user: User
    ) -> bool:
        """
        Desactiva la cuenta de un usuario.

        Args:
            session: Sesión de base de datos
            user_id: ID del usuario a desactivar
            current_user: Usuario que realiza la desactivación

        Returns:
            True si la desactivación fue exitosa

        Raises:
            HTTPException: Si no hay permisos o el usuario no existe
        """
        user = await UserService.get_user_by_id(session, user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Usuario no encontrado"
            )

        # Solo admins pueden desactivar cuentas
        if not current_user.is_admin:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Solo los administradores pueden desactivar cuentas"
            )

        # No permitir desactivar la propia cuenta
        if current_user.id_usuario == user_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No puedes desactivar tu propia cuenta"
            )

        try:
            await session.execute(
                update(User)
                .where(User.id_usuario == user_id)
                .values(is_active=False)
            )
            await session.commit()
            return True

        except Exception as e:
            await session.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Error al desactivar el usuario"
            ) from e

    @staticmethod
    async def activate_user(
        session: AsyncSession,
        user_id: int,
        current_user: User
    ) -> bool:
        """
        Activa la cuenta de un usuario.

        Args:
            session: Sesión de base de datos
            user_id: ID del usuario a activar
            current_user: Usuario que realiza la activación

        Returns:
            True si la activación fue exitosa

        Raises:
            HTTPException: Si no hay permisos o el usuario no existe
        """
        user = await UserService.get_user_by_id(session, user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Usuario no encontrado"
            )

        # Solo admins pueden activar cuentas
        if not current_user.is_admin:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Solo los administradores pueden activar cuentas"
            )

        try:
            await session.execute(
                update(User)
                .where(User.id_usuario == user_id)
                .values(is_active=True)
            )
            await session.commit()
            return True

        except Exception as e:
            await session.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Error al activar el usuario"
            ) from e

    @staticmethod
    async def delete_user(
        session: AsyncSession,
        user_id: int,
        current_user: User
    ) -> bool:
        """
        Elimina permanentemente un usuario.

        Args:
            session: Sesión de base de datos
            user_id: ID del usuario a eliminar
            current_user: Usuario que realiza la eliminación

        Returns:
            True si la eliminación fue exitosa

        Raises:
            HTTPException: Si no hay permisos o el usuario no existe
        """
        user = await UserService.get_user_by_id(session, user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Usuario no encontrado"
            )

        # Solo admins pueden eliminar usuarios
        if not current_user.is_admin:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Solo los administradores pueden eliminar usuarios"
            )

        # No permitir eliminar la propia cuenta
        if current_user.id_usuario == user_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No puedes eliminar tu propia cuenta"
            )

        try:
            await session.execute(
                delete(User).where(User.id_usuario == user_id)
            )
            await session.commit()
            return True

        except Exception as e:
            await session.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Error al eliminar el usuario"
            ) from e

    @staticmethod
    async def toggle_admin_status(
        session: AsyncSession,
        user_id: int,
        current_user: User
    ) -> bool:
        """
        Cambia el estado de administrador de un usuario.

        Args:
            session: Sesión de base de datos
            user_id: ID del usuario
            current_user: Usuario que realiza el cambio

        Returns:
            True si el cambio fue exitoso

        Raises:
            HTTPException: Si no hay permisos o el usuario no existe
        """
        user = await UserService.get_user_by_id(session, user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Usuario no encontrado"
            )

        # Solo admins pueden cambiar permisos
        if not current_user.is_admin:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Solo los administradores pueden cambiar permisos"
            )

        # No permitir cambiar los propios permisos
        if current_user.id_usuario == user_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No puedes cambiar tus propios permisos de administrador"
            )

        try:
            await session.execute(
                update(User)
                .where(User.id_usuario == user_id)
                .values(is_admin=not user.is_admin)
            )
            await session.commit()
            return True

        except Exception as e:
            await session.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Error al cambiar el estado de administrador"
            ) from e
