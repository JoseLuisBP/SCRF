"""Modelo SQLAlchemy para la tabla auditoria_admin."""
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, func
from app.db.postgresql import Base


class AuditoriaAdmin(Base):
    """
    Registra las acciones realizadas por administradores:
    creación de usuarios, modificación de rutinas/ejercicios, etc.
    La tabla auditoria_admin ya existe en la DB (init.sql).
    """
    __tablename__ = "auditoria_admin"

    id_auditoria = Column(Integer, primary_key=True, index=True)
    id_admin = Column(Integer, ForeignKey("usuarios.id_usuario", ondelete="SET NULL"), nullable=True)
    accion = Column(String(150))
    entidad_afectada = Column(String(200))
    fecha_accion = Column(DateTime, server_default=func.now())
    descripcion = Column(Text)

    def __repr__(self):
        return f"<AuditoriaAdmin(id={self.id_auditoria}, accion='{self.accion}', admin={self.id_admin})>"
