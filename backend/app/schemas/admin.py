"""Schemas Pydantic exclusivos del módulo de administración."""
from pydantic import BaseModel, ConfigDict, Field
from typing import Optional
from datetime import datetime


class AdminStats(BaseModel):
    total_usuarios: int = Field(..., description="Total de usuarios registrados")
    usuarios_activos: int = Field(..., description="Usuarios con cuenta activa")
    usuarios_inactivos: int = Field(..., description="Usuarios con cuenta inactiva")
    total_admins: int = Field(..., description="Usuarios con rol Administrador (id_rol=3)")
    total_entrenadores: int = Field(..., description="Usuarios con rol Entrenador (id_rol=2)")
    total_usuarios_rol: int = Field(..., description="Usuarios con rol base Usuario (id_rol=1)")


class AuditoriaResponse(BaseModel):
    id_auditoria: int
    id_admin: Optional[int] = None
    accion: str
    entidad_afectada: str
    fecha_accion: datetime
    descripcion: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)
