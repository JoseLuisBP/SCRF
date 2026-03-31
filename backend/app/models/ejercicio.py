from sqlalchemy import Column, Integer, String, Boolean, Text
from sqlalchemy.dialects.postgresql import JSONB
from app.db.postgresql import Base

class Ejercicio(Base):
    __tablename__ = "ejercicios"

    id_ejercicio = Column(Integer, primary_key=True, index=True)
    nombre_ejercicio = Column(String(100), nullable=False)
    descripcion = Column(Text, nullable=False)
    repeticiones = Column(Integer, nullable=True)
    tiempo = Column(Integer, nullable=True)
    categoria = Column(String(50), nullable=False)
    
    # ML & Hard Constraints fields
    enfoque = Column(String(50), nullable=True)
    nivel_dificultad = Column(String(50), nullable=True)
    contraindicaciones = Column(JSONB, nullable=True, default=[])
    
    advertencias = Column(Text, nullable=True)
    activo = Column(Boolean, default=True)
