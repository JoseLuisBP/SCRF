from sqlalchemy import Column, Integer, String, Text
from sqlalchemy.orm import relationship
from app.db.postgresql import Base

class Rol(Base):
    __tablename__ = "roles"

    id_rol = Column(Integer, primary_key=True, index=True)
    nombre_rol = Column(String(100), nullable=False)
    descripcion = Column(Text, nullable=True)
    
    # Relación inversa a Usuario
    usuarios = relationship("User", back_populates="rol", cascade="all, delete")

    def __repr__(self):
        return f"<Rol(id_rol={self.id_rol}, nombre_rol='{self.nombre_rol}')>"
