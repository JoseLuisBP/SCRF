from sqlalchemy import Column, Integer, String, Boolean, Text, ForeignKey
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

    # Verificación clínica (Rol 2 / Fisioterapeuta)
    is_verified_by_physio = Column(
        Boolean, default=False,
        comment="Validado clínicamente por un Fisioterapeuta (Rol 2) o Admin (Rol 3)"
    )
    created_by = Column(
        Integer, ForeignKey("usuarios.id_usuario", ondelete="SET NULL"),
        nullable=True,
        comment="ID del usuario (Rol 2/3) que creó el ejercicio"
    )
    verification_notes = Column(
        Text, nullable=True,
        comment="Notas clínicas del fisioterapeuta al verificar el ejercicio"
    )
