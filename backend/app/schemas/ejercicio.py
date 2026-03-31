from pydantic import BaseModel
from typing import Optional

class EjercicioOut(BaseModel):
    id_ejercicio: int
    nombre_ejercicio: str
    descripcion: str
    repeticiones: Optional[int]
    tiempo: Optional[int]
    categoria: str
    advertencias: Optional[str]
    enfoque: Optional[str] = None
    nivel_dificultad: Optional[str] = None
    contraindicaciones: Optional[list[str]] = []

    class Config:
        from_attributes = True
