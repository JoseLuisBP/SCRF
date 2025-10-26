-- Limpiar tablas si existen
DROP TABLE IF EXISTS auditoria_admin CASCADE;
DROP TABLE IF EXISTS rutina_detalle CASCADE;
DROP TABLE IF EXISTS historial_progreso CASCADE;
DROP TABLE IF EXISTS reseñas CASCADE;
DROP TABLE IF EXISTS ejercicios CASCADE;
DROP TABLE IF EXISTS multimedia CASCADE;
DROP TABLE IF EXISTS rutinas CASCADE;
DROP TABLE IF EXISTS perfil_medico CASCADE;
DROP TABLE IF EXISTS configuracion CASCADE;
DROP TABLE IF EXISTS usuarios CASCADE;
DROP TABLE IF EXISTS roles CASCADE;

ALTER TABLE multimedia
  ADD CONSTRAINT multimedia_ejercicio_fk FOREIGN KEY (id_ejercicio) 
  REFERENCES ejercicios(id_ejercicio) ON DELETE SET NULL;

-- Tabla Rutinas
CREATE TABLE rutinas (
  id_rutina         SERIAL PRIMARY KEY,
  nombre_rutina     VARCHAR(255) UNIQUE NOT NULL,
  descripcion       TEXT,
  nivel             VARCHAR(50),
  duracion_estimada INTEGER,
  categoria         VARCHAR(100),
  creado_por        INTEGER REFERENCES usuarios(id_usuarios) ON DELETE SET NULL,
  fecha_creacion    DATE DEFAULT CURRENT_DATE
);

-- Tabla Rutina_Ejercicio
CREATE TABLE rutina_ejercicio (
  id_rutina_ejercicio SERIAL PRIMARY KEY,
  id_rutina          INTEGER NOT NULL REFERENCES rutinas(id_rutina) ON DELETE CASCADE,
  id_ejercicio       INTEGER NOT NULL REFERENCES ejercicios(id_ejercicio) ON DELETE CASCADE,
  series             INTEGER,
  repeticiones       INTEGER,
  duracion_segundos  INTEGER,
  orden              INTEGER NOT NULL,
  CONSTRAINT unica_rutina_ejercicio UNIQUE (id_rutina, orden)
);

-- Tabla Ejercicios
CREATE TABLE ejercicios ()(
  id_ejercicio      SERIAL PRIMARY KEY,
  nombre_ejercicio  VARCHAR(200) NOT NULL,
  multimedia        VARCHAR(100), REFERENCES multimedia(id_multimedia) ON DELETE SET NULL,
  descripcion       TEXT,
  repeticiones      INTEGER,
  tiempo            INTEGER,
  categoria         VARCHAR(100),
  advertencias      TEXT,
  activo            BOOLEAN DEFAULT TRUE
);

-- Tabla Multimedia
CREATE TABLE multimedia (
  id_multimedia   VARCHAR(100) PRIMARY KEY,
  id_ejercicio    INTEGER,
  tipo            VARCHAR(50),
  url_archivo     TEXT,
  metadatos       JSONB,
  fecha_subida    DATE DEFAULT CURRENT_DATE
);

-- Tabla Historial_Progreso
CREATE TABLE historial_progreso (
  id_historial      SERIAL PRIMARY KEY,
  id_usuario        INTEGER NOT NULL REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
  id_rutina         INTEGER NOT NULL REFERENCES rutinas(id_rutina) ON DELETE SET NULL,
  fecha             DATE DEFAULT CURRENT_DATE,
  duracion_real     INTEGER,
  estado            VARCHAR(50),
  notas             TEXT
);

-- Tabla Reseñas
CREATE TABLE resenas (
  id_resena        SERIAL PRIMARY KEY,
  id_usuario       INTEGER NOT NULL REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
  id_rutina        INTEGER NOT NULL REFERENCES rutinas(id_rutina) ON DELETE CASCADE,
  calificacion     INTEGER CHECK (calificacion >= 0 AND calificacion <= 5),
  comentario       TEXT,
  fecha_resena     DATE DEFAULT CURRENT_DATE,
);

-- Tabla Auditoria Administradores
CREATE TABLE auditoria_admin (
  id_auditoria        SERIAL PRIMARY KEY,
  id_admin            INTEGER REFERENCES usuarios(id_usuario) ON DELETE SET NULL,
  accion              VARCHAR(150),
  entidad_afectada    VARCHAR(200),
  fecha_accion        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  descripcion         TEXT
);

-- Tabla Configuración por Usuario
CREATE TABLE configuracion (
  id_configuracion   SERIAL PRIMARY KEY,
  id_usuario         INTEGER UNIQUE REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
  modo_visual        VARCHAR(50) DEFAULT 'light',
  tamano_fuente      VARCHAR(50) DEFAULT 'medium',
  notificaciones     BOOLEAN DEFAULT TRUE,
  preferencia_privacidad BOOLEAN DEFAULT FALSE
);

-- Tabla Roles
CREATE TABLE roles (
  id_rol           SERIAL PRIMARY KEY,
  nombre_rol       VARCHAR(100) NOT NULL,
  descripcion      TEXT
);

-- Tabla Usuarios
CREATE TABLE usuarios (
  id_usuario           SERIAL PRIMARY KEY,
  nombre               VARCHAR(200) NOT NULL,
  correo               VARCHAR(255) UNIQUE NOT NULL,
  contrasena_hash      VARCHAR(512) NOT NULL,
  edad                 INTEGER,
  peso                 REAL,
  estatura             REAL,
  nivel_fisico         VARCHAR(100),
  tiempo_disponible    INTEGER,
  fecha_registro       DATE DEFAULT CURRENT_DATE,
  confirmado           BOOLEAN DEFAULT FALSE,
  id_rol               INTEGER REFERENCES roles(id_rol) ON DELETE SET NULL
);

-- Tabla Perfil Medico
CREATE TABLE perfil_medico (
  id_perfil_medico   SERIAL PRIMARY KEY,
  id_usuario         INTEGER NOT NULL UNIQUE REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
  condiciones_fisicas TEXT,
  lesiones           TEXT,
  limitaciones       TEXT,
  cifrado_hash       VARCHAR(512)
);

-- Indices
CREATE INDEX idx_historial_usuario_fecha ON historial_progreso (id_usuario, fecha);
CREATE INDEX idx_rutina_creado_por ON rutinas (creado_por);
CREATE INDEX idx_ejercicios_categoria ON ejercicios (categoria);
CREATE INDEX idx_usuarios_correo ON usuarios (correo);
CREATE INDEX idx_usuarios_rol ON usuarios (id_rol);
CREATE INDEX idx_reseñas_rutina ON reseñas (id_rutina);
CREATE INDEX idx_reseñas_usuario ON reseñas (id_usuario);

-- Comentarios
COMMENT ON TABLE roles IS 'Roles del sistema (admin, usuario, etc.)';
COMMENT ON TABLE usuarios IS 'Usuarios de la aplicación';
COMMENT ON TABLE perfil_medico IS 'Información médica sensible de usuarios';
COMMENT ON TABLE multimedia IS 'Archivos multimedia (imágenes, videos)';
COMMENT ON TABLE ejercicios IS 'Catálogo de ejercicios';
COMMENT ON TABLE rutinas IS 'Rutinas de entrenamiento';
COMMENT ON TABLE rutina_detalle IS 'Ejercicios dentro de cada rutina';
COMMENT ON TABLE historial_progreso IS 'Registro de entrenamientos completados';
COMMENT ON TABLE reseñas IS 'Valoraciones de rutinas por usuarios';
COMMENT ON TABLE auditoria_admin IS 'Log de acciones administrativas';
COMMENT ON TABLE configuracion IS 'Preferencias personalizadas de usuarios';
