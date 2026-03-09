from pydantic import BaseModel
from typing import Optional

class Token(BaseModel):
    """Schema para el token de acceso"""
    access_token: str
    token_type: str
    expires_in: int
    id_rol: Optional[int] = None        # Rol del usuario — facilita el control de acceso en el frontend
    refresh_token: Optional[str] = None

class TokenData(BaseModel):
    """Schema para los datos contenidos en el token"""
    user_id: int
    id_rol: Optional[int] = None        # Claim de rol incluido en el payload JWT

class LoginRequest(BaseModel):
    """Schema para la petición de login"""
    correo: str
    contrasena: str
