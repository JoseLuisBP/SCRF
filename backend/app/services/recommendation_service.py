"""
Servicio de recomendación de rutinas.
Separa la lógica de negocio del router HTTP (recommendations.py).

Responsabilidades:
  - Inferencia con modelo CART (MLService)
  - Filtrado de ejercicios por ruta y contraindicaciones
  - Persistencia de rutinas ML en la BD
  - Validación de rutinas ML por el Fisioterapeuta
  - Creación de rutinas manuales por el Fisioterapeuta
"""
from __future__ import annotations

from datetime import datetime, timezone
from typing import List

from sqlalchemy import select, text
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.ejercicio import Ejercicio
from app.models.rutina import Rutina
from app.models.user import User
from app.schemas.rutina import RutinaCreateIn, RutinaMLDetalle, RutinaMLOut, EjercicioEnRutinaOut
from app.services.ml_service import MLService

# Mapeo de rutas CART → categorías de ejercicios permitidas
_RUTA_CATEGORIAS: dict[str, list[str]] = {
    "Rehabilitación": ["core", "cardio", "piernas", "rehabilitacion"],
    "Fuerza/Joven":   ["pecho", "espalda", "piernas", "hombros", "brazos"],
    "Adulto Mayor":   ["movilidad", "rehabilitacion"],
    "Híbrido":        ["core", "cardio", "piernas", "pecho", "espalda"],
}

# Límite de ejercicios en una rutina ML
_ML_EJERCICIO_LIMIT = 15


class RecommendationService:

    # ──────────────────────────────────────────────────────────────────────────
    # Inferencia ML + Filtrado → Rutina efímera (NO persiste en BD)
    # ──────────────────────────────────────────────────────────────────────────
    @staticmethod
    async def generate_ml_routine(
        db: AsyncSession,
        user: User,
        ml_svc: MLService,
    ) -> RutinaMLOut:
        """
        Genera una rutina personalizada usando el modelo CART.

        El resultado NO se persiste — es una respuesta en tiempo real.
        El badge será siempre 'ml_generated' (pendiente de revisión del Fisio).

        Args:
            db:     Sesión de PostgreSQL
            user:   Usuario solicitante (debe tener perfil médico cargado)
            ml_svc: Instancia del servicio ML (singleton)
        Returns:
            RutinaMLOut con los ejercicios filtrados y el badge correspondiente
        """
        medical_profile = user.perfil_medico
        lesiones_usuario: list[str] = (
            medical_profile.lesiones
            if medical_profile and medical_profile.lesiones
            else []
        )

        tiene_lesion = 1 if lesiones_usuario else 0
        edad = user.edad or 30
        nivel_fisico = user.nivel_fisico or "sedentario"
        objetivo_principal = user.objetivo_principal or "Salud/Movilidad"

        # 1. Inferencia CART
        ruta_recomendada = ml_svc.predict_routine_path(
            edad=edad,
            nivel_fisico=nivel_fisico,
            objetivo_principal=objetivo_principal,
            tiene_lesion=tiene_lesion,
        )

        # 2. Filtro por categorías de la ruta
        categorias = _RUTA_CATEGORIAS.get(ruta_recomendada, [])
        query = select(Ejercicio).where(Ejercicio.activo == True)
        if categorias:
            query = query.where(Ejercicio.categoria.in_(categorias))

        result = await db.execute(query)
        ejercicios: list[Ejercicio] = list(result.scalars().all())

        # 3. Mapa de multimedia
        multimedia_result = await db.execute(text(
            "SELECT id_ejercicio, url_archivo FROM multimedia"
        ))
        multimedia_map: dict[int, str] = {
            row["id_ejercicio"]: row["url_archivo"]
            for row in multimedia_result.mappings().all()
        }

        # 4. Filtro por contraindicaciones
        ejercicios_seguros: list[EjercicioEnRutinaOut] = []
        for ej in ejercicios:
            if isinstance(ej.contraindicaciones, list):
                if any(l in ej.contraindicaciones for l in lesiones_usuario):
                    continue
            ejercicios_seguros.append(EjercicioEnRutinaOut(
                id_ejercicio=ej.id_ejercicio,
                nombre_ejercicio=ej.nombre_ejercicio,
                descripcion=ej.descripcion,
                repeticiones=ej.repeticiones,
                tiempo=ej.tiempo,
                categoria=ej.categoria,
                advertencias=ej.advertencias,
                enfoque=ej.enfoque,
                nivel_dificultad=ej.nivel_dificultad,
                contraindicaciones=ej.contraindicaciones or [],
                videoUrl=multimedia_map.get(ej.id_ejercicio),
                is_verified_by_physio=ej.is_verified_by_physio,
            ))

        return RutinaMLOut(
            ruta_ml=ruta_recomendada,
            usuario_id=user.id_usuario,
            inference_features={
                "edad": edad,
                "nivel_fisico": nivel_fisico,
                "objetivo": objetivo_principal,
                "tiene_lesion": bool(tiene_lesion),
            },
            rutina_generada=RutinaMLDetalle(
                descripcion=f"Rutina ML: {ruta_recomendada}",
                is_machine_learning_generated=True,
                is_verified_by_physio=False,
                ejercicios_habilitados=ejercicios_seguros[:_ML_EJERCICIO_LIMIT],
            ),
        )

    # ──────────────────────────────────────────────────────────────────────────
    # Rutinas ML pendientes de verificación (para el dashboard del Fisio)
    # ──────────────────────────────────────────────────────────────────────────
    @staticmethod
    async def get_pending_verification_routines(
        db: AsyncSession,
        skip: int = 0,
        limit: int = 20,
    ) -> list[Rutina]:
        """
        Retorna rutinas generadas por ML que aún no han sido verificadas.
        Ordenadas por fecha de creación descendente.
        """
        result = await db.execute(
            select(Rutina)
            .where(
                Rutina.is_machine_learning_generated == True,
                Rutina.is_verified_by_physio == False,
            )
            .order_by(Rutina.fecha_creacion.desc())
            .offset(skip)
            .limit(limit)
        )
        return list(result.scalars().all())

    # ──────────────────────────────────────────────────────────────────────────
    # Verificación de rutina ML por el Fisioterapeuta
    # ──────────────────────────────────────────────────────────────────────────
    @staticmethod
    async def verify_routine(
        db: AsyncSession,
        id_rutina: int,
        physio: User,
    ) -> Rutina:
        """
        El Fisioterapeuta (Rol 2) o Admin (Rol 3) valida una rutina ML.

        Actualiza:
          - is_verified_by_physio = True
          - verified_by           = physio.id_usuario
          - verified_at           = ahora (UTC)

        Args:
            db:       Sesión de PostgreSQL
            id_rutina: ID de la rutina a verificar
            physio:   Usuario con Rol 2 o 3
        Returns:
            Rutina actualizada
        Raises:
            ValueError: Si la rutina no existe
        """
        result = await db.execute(
            select(Rutina).where(Rutina.id_rutina == id_rutina)
        )
        rutina = result.scalar_one_or_none()
        if not rutina:
            raise ValueError(f"Rutina {id_rutina} no encontrada")

        rutina.is_verified_by_physio = True
        rutina.verified_by = physio.id_usuario
        rutina.verified_at = datetime.now(timezone.utc).replace(tzinfo=None)

        await db.flush()
        return rutina

    # ──────────────────────────────────────────────────────────────────────────
    # Creación de rutina manual por el Fisioterapeuta
    # ──────────────────────────────────────────────────────────────────────────
    @staticmethod
    async def create_physio_routine(
        db: AsyncSession,
        data: RutinaCreateIn,
        physio: User,
    ) -> Rutina:
        """
        Crea una rutina manualmente por un Fisioterapeuta o Admin.

        Defaults automáticos:
          - is_machine_learning_generated = False  (no es ML)
          - is_verified_by_physio         = True   (el propio creador la avala)
          - verified_by                   = physio.id_usuario
          - verified_at                   = ahora (UTC)
          - creado_por                    = physio.id_usuario

        Args:
            db:    Sesión de PostgreSQL
            data:  Datos de la rutina a crear
            physio: Usuario con Rol 2 o 3
        Returns:
            Nueva Rutina persistida (sin commit — el router/caller hace commit)
        """
        now = datetime.now(timezone.utc).replace(tzinfo=None)
        nueva_rutina = Rutina(
            nombre_rutina=data.nombre_rutina,
            descripcion=data.descripcion,
            nivel=data.nivel,
            duracion_estimada=data.duracion_estimada,
            categoria=data.categoria,
            creado_por=physio.id_usuario,
            is_machine_learning_generated=False,
            is_verified_by_physio=True,
            verified_by=physio.id_usuario,
            verified_at=now,
        )
        db.add(nueva_rutina)
        await db.flush()  # Genera el id_rutina antes del return
        return nueva_rutina

    # ──────────────────────────────────────────────────────────────────────────
    # Verificación de ejercicio individual
    # ──────────────────────────────────────────────────────────────────────────
    @staticmethod
    async def verify_exercise(
        db: AsyncSession,
        id_ejercicio: int,
        physio: User,
        notes: str | None = None,
    ) -> Ejercicio:
        """
        El Fisioterapeuta valida clínicamente un ejercicio.

        Args:
            db:           Sesión de PostgreSQL
            id_ejercicio: ID del ejercicio a verificar
            physio:       Usuario con Rol 2 o 3
            notes:        Notas clínicas opcionales
        Returns:
            Ejercicio actualizado
        Raises:
            ValueError: Si el ejercicio no existe
        """
        result = await db.execute(
            select(Ejercicio).where(Ejercicio.id_ejercicio == id_ejercicio)
        )
        ejercicio = result.scalar_one_or_none()
        if not ejercicio:
            raise ValueError(f"Ejercicio {id_ejercicio} no encontrado")

        ejercicio.is_verified_by_physio = True
        if notes:
            ejercicio.verification_notes = notes
        await db.flush()
        return ejercicio
