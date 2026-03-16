from typing import Optional, List
from sqlalchemy import select, update, delete
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import IntegrityError
from fastapi import HTTPException, status

from app.core.security import get_password_hash, verify_password, encrypt_value
from app.models.user import User
from app.models.medical_profile import MedicalProfile
from app.schemas.user import UserCreate, UserUpdate, UserChangePassword, UserResponse, AdminCreate

# ID del rol Administrador (mirrors seed.sql: id_rol=3)
ADMIN_ROL_ID = 3


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
            contrasena_hash=await get_password_hash(user_data.contrasena),
            edad=user_data.edad,
            peso=user_data.peso,
            estatura=user_data.estatura,
            nivel_fisico=user_data.nivel_fisico,
            tiempo_disponible=user_data.tiempo_disponible,
            # informacion_medica se maneja en update_user o create separado
            is_active=True,
            confirmado=user_data.confirmado, # Confirmación de términos y condiciones
            id_rol=1  # Default Role: 1=User  2=Trainer  3=Admin
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
    async def create_admin_user(
        session: AsyncSession,
        admin_data: AdminCreate,
    ) -> User:
        """
        Crea un nuevo usuario con rol Administrador (id_rol=3).
        Solo puede ser llamado desde el endpoint POST /admin/create-admin,
        el cual requiere check_admin_role.

        Args:
            session: Sesión de base de datos
            admin_data: Datos del nuevo administrador

        Returns:
            Usuario administrador creado

        Raises:
            HTTPException: Si el email ya está registrado
        """
        # Verificar si el email ya existe
        existing_user = await UserService.get_user_by_email(session, admin_data.correo)
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="El email ya está registrado"
            )

        # id_rol se fuerza a ADMIN_ROL_ID independientemente del input,
        # garantizando que este método no pueda usarse para crear roles arbitrarios.
        new_admin = User(
            correo=admin_data.correo,
            nombre=admin_data.nombre,
            contrasena_hash=await get_password_hash(admin_data.contrasena),
            edad=admin_data.edad,
            peso=admin_data.peso,
            estatura=admin_data.estatura,
            nivel_fisico=admin_data.nivel_fisico,
            tiempo_disponible=admin_data.tiempo_disponible,
            is_active=True,
            confirmado=admin_data.confirmado,
            id_rol=ADMIN_ROL_ID,  # Siempre 3
        )

        session.add(new_admin)

        try:
            await session.commit()
            await session.refresh(new_admin)
        except IntegrityError as e:
            await session.rollback()
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Error al crear el administrador"
            ) from e

        return new_admin

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

        # SEGURIDAD: Si el usuario que actualiza NO es admin, se elimina id_rol
        # del payload para prevenir escalado de privilegios.
        if current_user and not current_user.is_admin and "id_rol" in update_data:
            update_data.pop("id_rol")

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
            update_data['contrasena_hash'] = await get_password_hash(update_data.pop('contrasena'))

        if 'contrasena' in update_data:
            update_data['contrasena_hash'] = await get_password_hash(update_data.pop('contrasena'))

        # Gestionar Perfil Médico
        medical_profile_data = None
        if 'perfil_medico' in update_data:
            medical_profile_data = update_data.pop('perfil_medico')

        try:
            # Actualizar datos de usuario base
            if update_data:
                await session.execute(
                    update(User)
                    .where(User.id_usuario == user_id)
                    .values(**update_data)
                )

            # Actualizar o Crear Perfil Médico
            if medical_profile_data:
                # Buscar perfil existente (aunque la relación en User lo traería, aquí aseguramos query)
                stmt = select(MedicalProfile).where(MedicalProfile.id_usuario == user_id)
                result = await session.execute(stmt)
                existing_profile = result.scalar_one_or_none()

                # Preparar datos encriptados
                mp_values = {}
                if medical_profile_data.condiciones_fisicas is not None:
                    mp_values['condiciones_fisicas'] = encrypt_value(medical_profile_data.condiciones_fisicas)
                if medical_profile_data.lesiones is not None:
                    mp_values['lesiones'] = encrypt_value(medical_profile_data.lesiones)
                if medical_profile_data.limitaciones is not None:
                    mp_values['limitaciones'] = encrypt_value(medical_profile_data.limitaciones)
                
                if existing_profile:
                    # Actualizar
                    if mp_values:
                        await session.execute(
                            update(MedicalProfile)
                            .where(MedicalProfile.id_perfil_medico == existing_profile.id_perfil_medico)
                            .values(**mp_values)
                        )
                else:
                    # Crear nuevo
                    new_profile = MedicalProfile(
                        id_usuario=user_id,
                        **mp_values
                    )
                    session.add(new_profile)

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
            if not await verify_password(password_data.contrasena_actual, user.contrasena_hash):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="La contraseña actual es incorrecta"
                )

        # Actualizar contraseña
        try:
            await session.execute(
                update(User)
                .where(User.id_usuario == user_id)
                .values(contrasena_hash=await get_password_hash(password_data.nueva_contrasena))
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
        Alterna el id_rol entre ADMIN_ROL_ID (3) y rol normal (1).

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

        # Alternamos id_rol entre ADMIN (3) y Usuario normal (1).
        nuevo_rol = 1 if user.id_rol == ADMIN_ROL_ID else ADMIN_ROL_ID

        try:
            await session.execute(
                update(User)
                .where(User.id_usuario == user_id)
                .values(id_rol=nuevo_rol)
            )
            await session.commit()
            return True

        except Exception as e:
            await session.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Error al cambiar el estado de administrador"
            ) from e
