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

    class Config:
        from_attributes = True
