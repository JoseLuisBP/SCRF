from sqlalchemy import Column, Integer, String, Boolean, Text
from app.db.postgresql import Base

class Ejercicio(Base):
    __tablename__ = "ejercicios"

    id_ejercicio = Column(Integer, primary_key=True, index=True)
    nombre_ejercicio = Column(String(100), nullable=False)
    descripcion = Column(Text, nullable=False)
    repeticiones = Column(Integer, nullable=True)
    tiempo = Column(Integer, nullable=True)
    categoria = Column(String(50), nullable=False)
    advertencias = Column(Text, nullable=True)
    activo = Column(Boolean, default=True)
