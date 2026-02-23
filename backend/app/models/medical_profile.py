'''Modelo de datos para el Perfil Médico en la base de datos PostgreSQL'''
from sqlalchemy import Column, Integer, String, Text, ForeignKey
from sqlalchemy.orm import relationship
from app.db.postgresql import Base

class MedicalProfile(Base):
    __tablename__ = "perfil_medico"

    id_perfil_medico = Column(Integer, primary_key=True, index=True)
    id_usuario = Column(Integer, ForeignKey("usuarios.id_usuario", ondelete="CASCADE"), unique=True, nullable=False)
    
    # Información médica sensible (encriptada)
    condiciones_fisicas = Column(Text, nullable=True)
    lesiones = Column(Text, nullable=True)
    limitaciones = Column(Text, nullable=True)
    
    # Hash opcional para búsquedas o verificación de integridad (si se usara en el futuro)
    cifrado_hash = Column(String(512), nullable=True)

    # Relación bidireccional
    usuario = relationship("User", back_populates="perfil_medico", uselist=False)

    def __repr__(self):
        return f"<MedicalProfile(id_perfil_medico={self.id_perfil_medico}, id_usuario={self.id_usuario})>"
