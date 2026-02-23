from pydantic import BaseModel, Field, ConfigDict, field_validator
from typing import Optional

# Base Schema
class MedicalProfileBase(BaseModel):
    condiciones_fisicas: Optional[str] = Field(None, description="Condiciones físicas del usuario (Texto encriptado en DB)")
    lesiones: Optional[str] = Field(None, description="Lesiones del usuario (Texto encriptado en DB)")
    limitaciones: Optional[str] = Field(None, description="Limitaciones físicas (Texto encriptado en DB)")

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

    @field_validator('condiciones_fisicas', 'lesiones', 'limitaciones', mode='before')
    @classmethod
    def decrypt_fields(cls, v: Optional[str]) -> Optional[str]:
        if v:
            from app.core.security import decrypt_value
            return decrypt_value(v)
        return v
