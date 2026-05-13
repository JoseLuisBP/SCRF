from pydantic import BaseModel, Field
from typing import Optional, List


class EjercicioOut(BaseModel):
    id_ejercicio: int
    nombre_ejercicio: str
    descripcion: str
    repeticiones: Optional[int] = None
    tiempo: Optional[int] = None
    categoria: str
    advertencias: Optional[str] = None
    enfoque: Optional[str] = None
    nivel_dificultad: Optional[str] = None
    contraindicaciones: Optional[List[str]] = []

    videoUrl: Optional[str] = None

    # Sello de verificación clínica — expuesto al frontend
    is_verified_by_physio: bool = False

    # Campos de gestión clínica (visibles para fisio/admin)
    activo: bool = True
    created_by: Optional[int] = None
    verification_notes: Optional[str] = None

    model_config = {"from_attributes": True}


class EjercicioUpdateIn(BaseModel):
    nombre_ejercicio: Optional[str] = Field(None, max_length=100)
    descripcion: Optional[str] = None
    categoria: Optional[str] = Field(None, max_length=50)
    repeticiones: Optional[int] = Field(None, ge=0)
    tiempo: Optional[int] = Field(None, ge=0)
    enfoque: Optional[str] = Field(None, max_length=50)
    nivel_dificultad: Optional[str] = Field(None, max_length=50)
    contraindicaciones: Optional[List[str]] = None
    advertencias: Optional[str] = None


class PhysioStatsOut(BaseModel):
    ejercicios_creados: int = 0
    ejercicios_verificados: int = 0
    ejercicios_sin_verificar: int = 0
    rutinas_pendientes: int = 0
    rutinas_verificadas_por_mi: int = 0