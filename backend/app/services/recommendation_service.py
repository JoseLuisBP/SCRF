from __future__ import annotations

from datetime import datetime, timezone
from typing import List, Dict
from collections import defaultdict
import random

from sqlalchemy import select, text
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.ejercicio import Ejercicio
from app.models.rutina import Rutina
from app.models.user import User
from app.schemas.rutina import (
    RutinaCreateIn,
    RutinaMLDetalle,
    RutinaMLOut,
    EjercicioEnRutinaOut
)
from app.services.ml_service import MLService


# ─────────────────────────────────────────────────────────────
# Configuración base
# ─────────────────────────────────────────────────────────────
_RUTA_CATEGORIAS: dict[str, list[str]] = {
    "Rehabilitación": ["core", "cardio", "piernas", "rehabilitacion", "movilidad"],
    "Fuerza/Joven":   ["pecho", "espalda", "piernas", "hombros", "brazos", "core"],
    "Adulto Mayor":   ["movilidad", "rehabilitacion", "core", "piernas"],
    "Híbrido":        ["core", "cardio", "piernas", "pecho", "espalda"],
}


class RecommendationService:

    # ─────────────────────────────────────────────────────────────
    #  Rotación inteligente de grupo
    # ─────────────────────────────────────────────────────────────
    @staticmethod
    async def _get_next_grupo(db, user_id: int, ruta: str):
        result = await db.execute(text("""
            SELECT grupo_trabajado
            FROM historial_progreso
            WHERE id_usuario = :user_id
            ORDER BY fecha DESC
            LIMIT 1
        """), {"user_id": user_id})

        last = result.scalar()

        orden = {
            "Fuerza/Joven": ["piernas", "pecho", "espalda", "hombros", "core"],
            "Híbrido": ["piernas", "espalda", "pecho", "core", "cardio"],
            "Adulto Mayor": ["movilidad", "core", "piernas"],
            "Rehabilitación": ["rehabilitacion", "movilidad", "core"]
        }

        lista = orden.get(ruta, ["core"])

        if not last or last not in lista:
            return lista[0]

        idx = lista.index(last)
        return lista[(idx + 1) % len(lista)]

    # ─────────────────────────────────────────────────────────────
    #  Estructurar rutina por grupos (DINÁMICA)
    # ─────────────────────────────────────────────────────────────
    @staticmethod
    def _estructurar_rutina_por_grupos(
        ejercicios: List[EjercicioEnRutinaOut],
        ruta: str,
        nivel_fisico: str
    ) -> Dict[str, List[EjercicioEnRutinaOut]]:

        grupos = defaultdict(list)

        for ej in ejercicios:
            grupos[ej.categoria].append(ej)

        #  Base por nivel
        if nivel_fisico == "sedentario":
            base = 2
        elif nivel_fisico == "moderado":
            base = 3
        else:
            base = 4

        #  Límites por ruta
        if ruta == "Fuerza/Joven":
            limite = {
                "piernas": base + 1,
                "pecho": base,
                "espalda": base,
                "hombros": base,
                "brazos": base - 1,
                "core": base - 1,
            }

        elif ruta == "Híbrido":
            limite = {
                "piernas": base,
                "espalda": base,
                "pecho": base,
                "core": base - 1,
                "cardio": base - 1,
            }

        elif ruta == "Adulto Mayor":
            limite = {
                "movilidad": base + 1,
                "core": base - 1,
                "piernas": base - 1,
            }

        elif ruta == "Rehabilitación":
            limite = {
                "rehabilitacion": base + 1,
                "movilidad": base,
                "core": base - 1,
            }

        else:
            limite = {}

        rutina = {}

        for categoria, cantidad in limite.items():
            if categoria in grupos:
                disponibles = grupos[categoria]

                cantidad = max(1, cantidad)

                rutina[categoria] = random.sample(
                    disponibles,
                    min(len(disponibles), cantidad)
                )

        return rutina

    # ─────────────────────────────────────────────────────────────
    #  Generar rutina ML
    # ─────────────────────────────────────────────────────────────
    @staticmethod
    async def generate_ml_routine(
        db: AsyncSession,
        user: User,
        ml_svc: MLService,
    ) -> RutinaMLOut:

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

        # 1. ML
        ruta_recomendada = ml_svc.predict_routine_path(
            edad=edad,
            nivel_fisico=nivel_fisico,
            objetivo_principal=objetivo_principal,
            tiene_lesion=tiene_lesion,
        )

        # 2. Grupo del día
        grupo_del_dia = await RecommendationService._get_next_grupo(
            db, user.id_usuario, ruta_recomendada
        )

        # 3. Query ejercicios
        categorias = _RUTA_CATEGORIAS.get(ruta_recomendada, [])
        query = select(Ejercicio).where(Ejercicio.activo == True)

        if categorias:
            query = query.where(Ejercicio.categoria.in_(categorias))

        result = await db.execute(query)
        ejercicios: list[Ejercicio] = list(result.scalars().all())

        # 4. Multimedia
        multimedia_result = await db.execute(text(
            "SELECT id_ejercicio, url_archivo FROM multimedia"
        ))

        multimedia_map = {
            row["id_ejercicio"]: row["url_archivo"]
            for row in multimedia_result.mappings().all()
        }

        # 5. Filtrar contraindicaciones
        ejercicios_seguros: List[EjercicioEnRutinaOut] = []

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

        # 6. Estructurar rutina
        rutina_estructurada = RecommendationService._estructurar_rutina_por_grupos(
            ejercicios_seguros,
            ruta_recomendada,
            nivel_fisico
        )

        #  SOLO grupo del día
        rutina_estructurada = {
            grupo_del_dia: rutina_estructurada.get(grupo_del_dia, [])
        }

        # 7. Response
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
                ejercicios_habilitados=rutina_estructurada,
            ),
            grupo_objetivo=grupo_del_dia,
        )

    # ─────────────────────────────────────────────────────────────
    # RESTO SIN CAMBIOS
    # ─────────────────────────────────────────────────────────────
    @staticmethod
    async def get_pending_verification_routines(
        db: AsyncSession,
        skip: int = 0,
        limit: int = 20,
    ) -> list[Rutina]:
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

    @staticmethod
    async def verify_routine(
        db: AsyncSession,
        id_rutina: int,
        physio: User,
    ) -> Rutina:
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

    @staticmethod
    async def create_physio_routine(
        db: AsyncSession,
        data: RutinaCreateIn,
        physio: User,
    ) -> Rutina:
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
        await db.flush()
        return nueva_rutina

    @staticmethod
    async def verify_exercise(
        db: AsyncSession,
        id_ejercicio: int,
        physio: User,
        notes: str | None = None,
    ) -> Ejercicio:
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