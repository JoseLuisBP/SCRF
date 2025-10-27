from pydantic import BaseModel
from typing import Optional

class Token(BaseModel):
    """Schema para el token de acceso"""
    access_token: str
    token_type: str
    expires_in: int
    refresh_token: Optional[str] = None

class TokenData(BaseModel):
    """Schema para los datos contenidos en el token"""
    user_id: Optional[int] = None

class LoginRequest(BaseModel):
    """Schema para la petición de login"""
    correo: str
    contrasena: str
