'''Modelo de datos para la entidad Usuario en la base de datos PostgreSQL'''
from sqlalchemy import Column, Date, Integer, String, Boolean, Float, ForeignKey, text
from sqlalchemy.orm import relationship
from app.db.postgresql import Base


class User(Base):
    __tablename__ = "usuarios"
    
    id_usuario = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(200), nullable=False)
    correo = Column(String(255), unique=True, nullable=False, index=True)
    contrasena_hash = Column(String(512), nullable=False)
    
    # Información del perfil
    edad = Column(Integer, nullable=True)
    peso = Column(Float, nullable=True)
    estatura = Column(Float, nullable=True)
    nivel_fisico = Column(String(100), nullable=True)
    tiempo_disponible = Column(Integer, nullable=True)

    # Estado y permisos
    fecha_registro = Column(Date, server_default=text("CURRENT_DATE"))
    confirmado = Column(Boolean, default=False, comment="Indica si el usuario ha aceptado los términos y condiciones")
    is_active = Column(Boolean, default=True, comment="Indica si la cuenta del usuario está activa")
    id_rol = Column(Integer, ForeignKey("roles.id_rol", ondelete="SET NULL"))

    # Relaciones
    rol = relationship("Rol", back_populates="usuarios", lazy="joined")

    def __repr__(self):
        return f"<Usuario(id_usuario={self.id_usuario}, correo='{self.correo}', nombre='{self.nombre}')>"
