from app.schemas.medical_profile import MedicalProfileResponse, MedicalProfileUpdate

# Schema base para Usuario
class UserBase(BaseModel):
    nombre: str = Field(..., min_length=4, max_length=100, description="Nombre completo del usuario")
    correo: EmailStr = Field(..., description="Correo electrónico del usuario")
    edad: Optional[int] = Field(None, ge=0, le=80, description="Edad del usuario")
    peso: Optional[float] = Field(None, gt=0, description="Peso del usuario en kg")
    estatura: Optional[int] = Field(None, gt=0, description="Estatura del usuario en cm")
    nivel_fisico: Optional[str] = Field(None, max_length=100, description="Nivel físico del usuario")
    tiempo_disponible: Optional[int] = Field(None, ge=0, description="Tiempo disponible para entrenar en minutos por día")

# Schema para creación de Usuario
class UserCreate(UserBase):
    contrasena: str = Field(..., min_length=8, max_length=50, description="Contraseña del usuario")
    confirmado: bool = Field(default=False, description="Indica si el usuario aceptó los términos")

# Schema para actualización de Usuario
class UserUpdate(UserBase):
    contrasena: Optional[str] = Field(None, min_length=8, max_length=50, description="Contraseña del usuario")
    perfil_medico: Optional[MedicalProfileUpdate] = Field(None, description="Datos del perfil médico")

# Schema para cambio de contraseña
class UserChangePassword(BaseModel):
    contrasena_actual: str = Field(..., min_length=4, max_length=50, description="Contraseña actual del usuario")
    nueva_contrasena: str = Field(..., min_length=4, max_length=50, description="Nueva contraseña del usuario")

# Schema para respuesta
class UserResponse(UserBase):
    id_usuario: int = Field(..., description="ID único del usuario")
    fecha_registro: date = Field(..., description="Fecha de registro del usuario")
    confirmado: bool = Field(..., description="Indica si el usuario ha aceptado los términos y condiciones de uso")
    is_active: bool = Field(..., description="Indica si la cuenta del usuario está activa")
    is_admin: bool = Field(default=False, description="Indica si el usuario tiene privilegios administrativos")
    id_rol: Optional[int] = Field(None, description="ID del rol asignado al usuario")
    perfil_medico: Optional[MedicalProfileResponse] = Field(None, description="Perfil médico del usuario")

    model_config = ConfigDict(from_attributes=True)

