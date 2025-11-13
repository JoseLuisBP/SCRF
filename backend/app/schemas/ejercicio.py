from pydantic import BaseModel
from typing import Optional

class EjercicioResponse(BaseModel):
    id_ejercicio: int
    nombre_ejercicio: str
    descripcion: str
    repeticiones: Optional[int] = None
    tiempo: Optional[int] = None
    categoria: str
    advertencias: Optional[str] = None
    activo: bool

    class Config:
        orm_mode = True
