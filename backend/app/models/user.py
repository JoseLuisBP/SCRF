'''Modelo de datos para la entidad Usuario en la base de datos PostgreSQL'''
from sqlalchemy import Column, Date, Integer, String, Boolean, Float, ForeignKey, func
from sqlalchemy.orm import relationship
from app.db.postgresql import Base


class Usuario(Base):
    __tablename__ = "usuarios"
    
    id_usuario = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(200), nullable=False)
    correo = Column(String(255), unique=True, nullable=False, index=True)
    contrasena_hash = Column(String(512), nullable=False)
    
    edad = Column(Integer, nullable=True)
    peso = Column(Float, nullable=True)
    estatura = Column(Float, nullable=True)
    nivel_fisico = Column(String(100), nullable=True)

    tiempo_disponible = Column(Integer, nullable=True)
    fecha_registro = Column(Date, server_default=func.current_date())
    confirmado = Column(Boolean, default=False)
    id_rol = Column(Integer, ForeignKey("roles.id_rol", ondelete="SET NULL"), nullable=True)

    # Relación a Rol
    rol = relationship("Rol", back_populates="usuarios", lazy="joined")

    def __repr__(self):
        return f"<Usuario(id_usuario={self.id_usuario}, correo='{self.correo}', nombre='{self.nombre}')>"
