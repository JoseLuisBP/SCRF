"""Schemas Pydantic para la entidad Rutina y respuestas de verificación clínica."""
from __future__ import annotations

from datetime import date, datetime
from typing import List, Optional

from pydantic import BaseModel, Field, model_validator


# ──────────────────────────────────────────────────────────────────────────────
# Tipos de badge — fuente de verdad única calculada en el backend
# ──────────────────────────────────────────────────────────────────────────────
class VerificationBadge:
    PHYSIO_VERIFIED = "physio_verified"   # Manual por Fisio/Admin → badge VERDE
    ML_VERIFIED = "ml_verified"           # ML + revisada por Fisio → badge INDIGO
    ML_GENERATED = "ml_generated"         # ML sin revisar → badge AMBER


# ──────────────────────────────────────────────────────────────────────────────
# Input — Creación de rutina manual por el Fisioterapeuta
# ──────────────────────────────────────────────────────────────────────────────
class RutinaCreateIn(BaseModel):
    nombre_rutina: str = Field(..., max_length=255)
    descripcion: Optional[str] = None
    nivel: Optional[str] = Field(None, max_length=50)
    duracion_estimada: Optional[int] = Field(None, ge=1)
    categoria: Optional[str] = Field(None, max_length=100)
    ejercicio_ids: List[int] = Field(default_factory=list, description="IDs de ejercicios en orden")


# ──────────────────────────────────────────────────────────────────────────────
# Output público — lo que ve el usuario final (con el sello)
# ──────────────────────────────────────────────────────────────────────────────
class RutinaPublicOut(BaseModel):
    id_rutina: int
    nombre_rutina: str
    descripcion: Optional[str] = None
    nivel: Optional[str] = None
    duracion_estimada: Optional[int] = None
    categoria: Optional[str] = None
    creado_por: Optional[int] = None
    fecha_creacion: Optional[date] = None

    # Flags de ML y verificación
    is_machine_learning_generated: bool = False
    is_verified_by_physio: bool = False
    verified_by: Optional[int] = None
    verified_at: Optional[datetime] = None

    # Badge computado — el frontend solo renderiza, nunca calcula
    verification_badge: Optional[str] = None

    @model_validator(mode="after")
    def compute_badge(self) -> "RutinaPublicOut":
        """
        Calcula el badge según el estado combinado de los dos flags.
        Reglas de negocio:
          - ML + Verificada → 'ml_verified'   (IA revisada por profesional)
          - Solo verificada → 'physio_verified' (creación manual del fisio)
          - Solo ML        → 'ml_generated'   (pendiente de revisión)
        """
        if self.is_verified_by_physio and self.is_machine_learning_generated:
            self.verification_badge = VerificationBadge.ML_VERIFIED
        elif self.is_verified_by_physio:
            self.verification_badge = VerificationBadge.PHYSIO_VERIFIED
        else:
            self.verification_badge = VerificationBadge.ML_GENERATED
        return self

    model_config = {"from_attributes": True}


# ──────────────────────────────────────────────────────────────────────────────
# Output ML — respuesta del endpoint /recommendations (extiende RutinaPublicOut)
# ──────────────────────────────────────────────────────────────────────────────
class EjercicioEnRutinaOut(BaseModel):
    id_ejercicio: int
    nombre_ejercicio: str
    descripcion: Optional[str] = None
    repeticiones: Optional[int] = None
    tiempo: Optional[int] = None
    categoria: Optional[str] = None
    advertencias: Optional[str] = None
    enfoque: Optional[str] = None
    nivel_dificultad: Optional[str] = None
    contraindicaciones: Optional[List[str]] = []
    videoUrl: Optional[str] = None
    is_verified_by_physio: bool = False

    model_config = {"from_attributes": True}


class RutinaMLOut(BaseModel):
    """Respuesta completa del módulo de recomendación ML (CART)."""
    ruta_ml: str
    usuario_id: int
    inference_features: dict
    rutina_generada: "RutinaMLDetalle"


class RutinaMLDetalle(BaseModel):
    id_rutina: Optional[int] = None
    descripcion: str
    is_machine_learning_generated: bool = True
    is_verified_by_physio: bool = False
    verification_badge: str = VerificationBadge.ML_GENERATED
    ejercicios_habilitados: List[EjercicioEnRutinaOut]
