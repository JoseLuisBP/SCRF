from pydantic import BaseModel
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

    # Pydantic V2 — reemplaza class Config: orm_mode / from_attributes
    model_config = {"from_attributes": True}