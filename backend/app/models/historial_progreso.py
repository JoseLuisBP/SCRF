from sqlalchemy import Column, Integer, String, Date, Text, ForeignKey
from datetime import date

from app.db.postgresql import Base


class HistorialProgreso(Base):
    """
    Modelo HistorialProgreso
    ------------------------
    Guarda el progreso de un usuario al realizar una rutina.
    """

    __tablename__ = "historial_progreso"

    id_historial = Column(Integer, primary_key=True, index=True)

    # Usuario que realizó la rutina
    id_usuario = Column(
        Integer,
        ForeignKey("usuarios.id_usuario", ondelete="CASCADE"),
        nullable=False
    )

    # Rutina realizada
    id_rutina = Column(
        Integer,
        ForeignKey("rutinas.id_rutina", ondelete="SET NULL"),
        nullable=True
    )

    # Fecha del progreso
    fecha = Column(Date, default=date.today)

    # Duración real de la rutina
    duracion_real = Column(Integer, nullable=True)

    # Estado del progreso (completado, incompleto, etc.)
    estado = Column(String(50), nullable=True)

    # Notas adicionales
    notas = Column(Text, nullable=True)
