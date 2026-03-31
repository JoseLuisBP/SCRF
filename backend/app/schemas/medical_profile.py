from pydantic import BaseModel, Field, ConfigDict, field_validator
from typing import Optional

# Base Schema
class MedicalProfileBase(BaseModel):
    condiciones_fisicas: Optional[list[str]] = Field(default=[], description="Condiciones físicas del usuario")
    lesiones: Optional[list[str]] = Field(default=[], description="Lesiones del usuario")
    limitaciones: Optional[list[str]] = Field(default=[], description="Limitaciones físicas")

# Schema para Creación
class MedicalProfileCreate(MedicalProfileBase):
    pass

# Schema para Actualización
class MedicalProfileUpdate(MedicalProfileBase):
    pass

# Schema para Respuesta
class MedicalProfileResponse(MedicalProfileBase):
    id_perfil_medico: int = Field(..., description="ID del perfil médico")
    id_usuario: int = Field(..., description="ID del usuario asociado")

    model_config = ConfigDict(from_attributes=True)
