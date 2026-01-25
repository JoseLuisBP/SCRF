from pydantic import BaseModel
from datetime import date
from typing import Optional


class HistorialProgresoOut(BaseModel):
    """
    Schema de salida para HistorialProgreso
    --------------------------------------
    Se usa para enviar el progreso del usuario al frontend.
    """

    id_historial: int
    id_usuario: int
    id_rutina: Optional[int]
    fecha: date
    duracion_real: Optional[int]
    estado: Optional[str]
    notas: Optional[str]

    class Config:
        orm_mode = True
