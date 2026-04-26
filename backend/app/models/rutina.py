"""Modelo ORM para la entidad Rutina en PostgreSQL."""
from sqlalchemy import Column, Integer, String, Text, Date, Boolean, DateTime, ForeignKey, text
from app.db.postgresql import Base


class Rutina(Base):
    __tablename__ = "rutinas"

    id_rutina = Column(Integer, primary_key=True, index=True)
    nombre_rutina = Column(String(255), unique=True, nullable=False)
    descripcion = Column(Text, nullable=True)
    nivel = Column(String(50), nullable=True)
    duracion_estimada = Column(Integer, nullable=True)
    categoria = Column(String(100), nullable=True)

    # Autoría
    creado_por = Column(
        Integer,
        ForeignKey("usuarios.id_usuario", ondelete="SET NULL"),
        nullable=True,
        comment="ID del usuario que creó la rutina (Rol 2 = Fisio, Rol 3 = Admin, None = ML auto)"
    )
    fecha_creacion = Column(Date, server_default=text("CURRENT_DATE"))

    # ── Flags de ML y verificación clínica ──────────────────────────────────
    is_machine_learning_generated = Column(
        Boolean, default=False,
        comment="True si fue generada por el algoritmo CART; False si la creó manualmente un Fisio/Admin"
    )
    is_verified_by_physio = Column(
        Boolean, default=False,
        comment="True cuando un Fisioterapeuta (Rol 2) o Admin (Rol 3) la ha validado clínicamente"
    )
    verified_by = Column(
        Integer,
        ForeignKey("usuarios.id_usuario", ondelete="SET NULL"),
        nullable=True,
        comment="ID del Fisioterapeuta/Admin que realizó la verificación"
    )
    verified_at = Column(
        DateTime, nullable=True,
        comment="Timestamp de la verificación clínica"
    )

    def __repr__(self) -> str:
        return (
            f"<Rutina(id={self.id_rutina}, nombre='{self.nombre_rutina}', "
            f"ml={self.is_machine_learning_generated}, verified={self.is_verified_by_physio})>"
        )
