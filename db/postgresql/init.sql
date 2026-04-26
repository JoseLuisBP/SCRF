-- Limpiar tablas
DROP TABLE IF EXISTS auditoria_admin CASCADE;
DROP TABLE IF EXISTS rutina_ejercicio CASCADE;
DROP TABLE IF EXISTS historial_progreso CASCADE;
DROP TABLE IF EXISTS resenas CASCADE;
DROP TABLE IF EXISTS ejercicios CASCADE;
DROP TABLE IF EXISTS multimedia CASCADE;
DROP TABLE IF EXISTS rutinas CASCADE;
DROP TABLE IF EXISTS perfil_medico CASCADE;
DROP TABLE IF EXISTS configuracion CASCADE;
DROP TABLE IF EXISTS usuarios CASCADE;
DROP TABLE IF EXISTS roles CASCADE;

-- Roles
CREATE TABLE roles (
  id_rol SERIAL PRIMARY KEY,
  nombre_rol VARCHAR(100) NOT NULL,
  descripcion TEXT
);

-- Usuarios
CREATE TABLE usuarios (
  id_usuario SERIAL PRIMARY KEY,
  nombre VARCHAR(200) NOT NULL,
  correo VARCHAR(255) UNIQUE NOT NULL,
  contrasena_hash VARCHAR(512) NOT NULL,
  edad INTEGER,
  peso REAL,
  estatura REAL,
  nivel_fisico VARCHAR(100),
  tiempo_disponible INTEGER,
  objetivo_principal VARCHAR(50),
  fecha_registro DATE DEFAULT CURRENT_DATE,
  confirmado BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  id_rol INTEGER REFERENCES roles(id_rol) ON DELETE SET NULL
);

-- Configuración
CREATE TABLE configuracion (
  id_configuracion SERIAL PRIMARY KEY,
  id_usuario INTEGER UNIQUE REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
  modo_visual VARCHAR(50) DEFAULT 'light',
  tamano_fuente VARCHAR(50) DEFAULT 'medium',
  notificaciones BOOLEAN DEFAULT TRUE,
  preferencia_privacidad BOOLEAN DEFAULT FALSE
);

-- Perfil Médico
CREATE TABLE perfil_medico (
  id_perfil_medico SERIAL PRIMARY KEY,
  id_usuario INTEGER UNIQUE REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
  condiciones_fisicas JSONB DEFAULT '[]'::jsonb,
  lesiones JSONB DEFAULT '[]'::jsonb,
  limitaciones JSONB DEFAULT '[]'::jsonb,
  cifrado_hash VARCHAR(512)
);

-- Rutinas
CREATE TABLE rutinas (
  id_rutina SERIAL PRIMARY KEY,
  nombre_rutina VARCHAR(255) UNIQUE NOT NULL,
  descripcion TEXT,
  nivel VARCHAR(50),
  duracion_estimada INTEGER,
  categoria VARCHAR(100),
  creado_por INTEGER REFERENCES usuarios(id_usuario) ON DELETE SET NULL,
  fecha_creacion DATE DEFAULT CURRENT_DATE,
  -- Flags de ML y verificación clínica
  is_machine_learning_generated BOOLEAN DEFAULT FALSE,
  is_verified_by_physio BOOLEAN DEFAULT FALSE,
  verified_by INTEGER REFERENCES usuarios(id_usuario) ON DELETE SET NULL,
  verified_at TIMESTAMP
);

-- Multimedia
CREATE TABLE multimedia (
  id_multimedia VARCHAR(100) PRIMARY KEY,
  id_ejercicio INTEGER,
  tipo VARCHAR(50),
  url_archivo TEXT,
  metadatos JSONB,
  fecha_subida DATE DEFAULT CURRENT_DATE
);

-- Ejercicios
CREATE TABLE ejercicios (
  id_ejercicio SERIAL PRIMARY KEY,
  nombre_ejercicio VARCHAR(200) NOT NULL,
  descripcion TEXT,
  repeticiones INTEGER,
  tiempo INTEGER,
  categoria VARCHAR(100),
  enfoque VARCHAR(50),
  nivel_dificultad VARCHAR(50),
  contraindicaciones JSONB DEFAULT '[]'::jsonb,
  advertencias TEXT,
  activo BOOLEAN DEFAULT TRUE,
  -- Verificación clínica del Fisioterapeuta (Rol 2)
  is_verified_by_physio BOOLEAN DEFAULT FALSE,
  created_by INTEGER REFERENCES usuarios(id_usuario) ON DELETE SET NULL,
  verification_notes TEXT
);

-- Rutina_Ejercicio
CREATE TABLE rutina_ejercicio (
  id_rutina_ejercicio SERIAL PRIMARY KEY,
  id_rutina INTEGER REFERENCES rutinas(id_rutina) ON DELETE CASCADE,
  id_ejercicio INTEGER REFERENCES ejercicios(id_ejercicio) ON DELETE CASCADE,
  series INTEGER,
  repeticiones INTEGER,
  duracion_segundos INTEGER,
  orden INTEGER,
  UNIQUE (id_rutina, orden)
);

-- Reseñas
CREATE TABLE resenas (
  id_resena SERIAL PRIMARY KEY,
  id_usuario INTEGER REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
  id_rutina INTEGER REFERENCES rutinas(id_rutina) ON DELETE CASCADE,
  calificacion INTEGER CHECK (calificacion BETWEEN 0 AND 5),
  comentario TEXT,
  fecha_resena DATE DEFAULT CURRENT_DATE
);

-- Historial
CREATE TABLE historial_progreso (
  id_historial SERIAL PRIMARY KEY,
  id_usuario INTEGER REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
  id_rutina INTEGER REFERENCES rutinas(id_rutina) ON DELETE SET NULL,
  fecha DATE DEFAULT CURRENT_DATE,
  duracion_real INTEGER,
  estado VARCHAR(50),
  notas TEXT
);

-- Auditoría
CREATE TABLE auditoria_admin (
  id_auditoria SERIAL PRIMARY KEY,
  id_admin INTEGER REFERENCES usuarios(id_usuario) ON DELETE SET NULL,
  accion VARCHAR(150),
  entidad_afectada VARCHAR(200),
  fecha_accion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  descripcion TEXT
);


-- Indices
CREATE INDEX idx_historial_usuario_fecha ON historial_progreso (id_usuario, fecha);
CREATE INDEX idx_rutina_creado_por ON rutinas (creado_por);
CREATE INDEX idx_ejercicios_categoria ON ejercicios (categoria);
CREATE INDEX idx_usuarios_correo ON usuarios (correo);
CREATE INDEX idx_usuarios_rol ON usuarios (id_rol);
CREATE INDEX idx_resenas_rutina ON resenas (id_rutina);
CREATE INDEX idx_resenas_usuario ON resenas (id_usuario);
-- Índices de verificación clínica
CREATE INDEX idx_rutinas_ml_flag ON rutinas (is_machine_learning_generated);
CREATE INDEX idx_rutinas_verified ON rutinas (is_verified_by_physio);
CREATE INDEX idx_ejercicios_verified ON ejercicios (is_verified_by_physio);

-- Comentarios
COMMENT ON TABLE roles IS 'Roles del sistema (admin, usuario, etc.)';
COMMENT ON TABLE usuarios IS 'Usuarios de la aplicación';
COMMENT ON TABLE perfil_medico IS 'Información médica sensible de usuarios';
COMMENT ON TABLE multimedia IS 'Archivos multimedia (imágenes, videos)';
COMMENT ON TABLE ejercicios IS 'Catálogo de ejercicios';
COMMENT ON TABLE rutinas IS 'Rutinas de entrenamiento';
COMMENT ON TABLE rutina_ejercicio IS 'Ejercicios dentro de cada rutina';
COMMENT ON TABLE historial_progreso IS 'Registro de entrenamientos completados';
COMMENT ON TABLE resenas IS 'Valoraciones de rutinas por usuarios';
COMMENT ON TABLE auditoria_admin IS 'Log de acciones administrativas';
COMMENT ON TABLE configuracion IS 'Preferencias personalizadas de usuarios';
