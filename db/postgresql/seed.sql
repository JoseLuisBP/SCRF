-- Roles
INSERT INTO roles (name, description) VALUES
  ('user', 'Usuario normal'),
  ('entrenador', 'Entrenador profesional'),
  ('admin', 'Administrador');

-- Usuarios
INSERT INTO usuarios (nombre, correo, contrasena_hash, edad, peso, estatura, nivel_fisico, tiempo_disponible, confirmado, id_rol) VALUES
  ('Admin Sistema', 'admin@fitness.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYILSdGeQNm', 30, 75.0, 175.0, 'advanced', 60, TRUE, 3),
  ('Juan Pérez', 'juan@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYILSdGeQNm', 25, 70.0, 180.0, 'intermediate', 45, TRUE, 1),
  ('María González', 'maria@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYILSdGeQNm', 28, 60.0, 165.0, 'beginner', 30, TRUE, 1),
  ('Carlos Entrenador', 'carlos@fitness.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYILSdGeQNm', 35, 80.0, 178.0, 'advanced', 90, TRUE, 2);

-- Configuración por Usuario
INSERT INTO configuracion (id_usuario, modo_visual, tamano_fuente, notificaciones, preferencia_privacidad) VALUES
  (1, 'dark', 'medium', TRUE, FALSE),
  (2, 'light', 'medium', TRUE, FALSE),
  (3, 'light', 'large', TRUE, TRUE),
  (4, 'dark', 'medium', FALSE, FALSE);

-- Ejercicios
INSERT INTO ejercicios (nombre_ejercicio, descripcion, repeticiones, tiempo, categoria, advertencias, activo) VALUES
  -- PECHO
  ('Press de Banca', 'Ejercicio fundamental para desarrollar el pecho. Acostado en banco plano, empuja la barra desde el pecho hasta extender los brazos.', 10, NULL, 'pecho', 'Usa un ayudante para ejercicios con peso pesado', TRUE),
  ('Flexiones', 'Ejercicio de peso corporal para pecho, tríceps y hombros.', 15, NULL, 'pecho', 'Mantén la espalda recta durante todo el movimiento', TRUE),
  ('Press Inclinado con Mancuernas', 'Variante del press de banca para trabajar la parte superior del pecho.', 12, NULL, 'pecho', NULL, TRUE),
  ('Aperturas con Mancuernas', 'Ejercicio de aislamiento para el pecho.', 12, NULL, 'pecho', 'No bajes demasiado las mancuernas para evitar lesiones en hombros', TRUE),
  
  -- ESPALDA
  ('Dominadas', 'Ejercicio compuesto para toda la espalda.', 8, NULL, 'espalda', 'Si eres principiante, usa banda elástica de ayuda', TRUE),
  ('Remo con Barra', 'Ejercicio para espalda media y lats.', 10, NULL, 'espalda', 'Mantén la espalda recta, no uses impulso', TRUE),
  ('Peso Muerto', 'Ejercicio compuesto para espalda baja, glúteos y piernas.', 8, NULL, 'espalda', 'IMPORTANTE: Técnica correcta es crucial. Consulta a un entrenador', TRUE),
  ('Remo en Polea Baja', 'Ejercicio de máquina para espalda media.', 12, NULL, 'espalda', NULL, TRUE),
  
  -- PIERNAS
  ('Sentadillas', 'Ejercicio rey para desarrollo de piernas.', 12, NULL, 'piernas', 'Rodillas no deben sobrepasar los dedos de los pies', TRUE),
  ('Zancadas', 'Ejercicio unilateral para piernas y glúteos.', 12, NULL, 'piernas', NULL, TRUE),
  ('Prensa de Piernas', 'Ejercicio en máquina para cuádriceps.', 15, NULL, 'piernas', 'No bloquees completamente las rodillas', TRUE),
  ('Curl Femoral', 'Ejercicio de aislamiento para isquiotibiales.', 12, NULL, 'piernas', NULL, TRUE),
  
  -- HOMBROS
  ('Press Militar', 'Ejercicio para hombros con barra o mancuernas.', 10, NULL, 'hombros', NULL, TRUE),
  ('Elevaciones Laterales', 'Aislamiento para deltoides laterales.', 15, NULL, 'hombros', 'No uses impulso, movimiento controlado', TRUE),
  ('Elevaciones Frontales', 'Aislamiento para deltoides frontales.', 15, NULL, 'hombros', NULL, TRUE),
  
  -- BRAZOS
  ('Curl de Bíceps con Barra', 'Ejercicio básico para bíceps.', 12, NULL, 'brazos', 'No balancees el cuerpo', TRUE),
  ('Curl Martillo', 'Variante de curl para bíceps y antebrazo.', 12, NULL, 'brazos', NULL, TRUE),
  ('Extensiones de Tríceps en Polea', 'Ejercicio de aislamiento para tríceps.', 15, NULL, 'brazos', NULL, TRUE),
  ('Fondos en Paralelas', 'Ejercicio compuesto para tríceps y pecho.', 10, NULL, 'brazos', 'Inclínate hacia adelante para enfatizar pecho', TRUE),
  
  -- CORE
  ('Plancha', 'Ejercicio isométrico para core completo.', NULL, 60, 'core', 'Mantén el cuerpo en línea recta', TRUE),
  ('Abdominales Crunch', 'Ejercicio clásico para abdomen.', 20, NULL, 'core', NULL, TRUE),
  ('Russian Twist', 'Ejercicio para oblicuos.', 20, NULL, 'core', NULL, TRUE),
  ('Elevación de Piernas', 'Ejercicio para abdomen bajo.', 15, NULL, 'core', NULL, TRUE),
  
  -- CARDIO
  ('Correr', 'Ejercicio cardiovascular de bajo impacto.', NULL, 1200, 'cardio', 'Calienta antes de empezar', TRUE),
  ('Burpees', 'Ejercicio de cuerpo completo de alta intensidad.', 15, NULL, 'cardio', 'Descansa si sientes mareo', TRUE),
  ('Saltar la Cuerda', 'Cardio de alta intensidad.', NULL, 300, 'cardio', NULL, TRUE),
  ('Mountain Climbers', 'Ejercicio cardiovascular y de core.', 30, NULL, 'cardio', NULL, TRUE);

-- Rutinas
INSERT INTO rutinas (nombre_rutina, descripcion, nivel, duracion_estimado, categoria, creado_por) VALUES
  ('Principiantes - Cuerpo Completo', 'Rutina ideal para personas que inician en el gimnasio. 3 veces por semana.', 'beginner', 45, 'fuerza', 4),
  ('Intermedio - Push Pull Legs', 'Rutina dividida en empuje, tirón y piernas. 6 días a la semana.', 'intermediate', 60, 'fuerza', 4),
  ('Avanzado - Hipertrofia', 'Rutina enfocada en ganancia muscular. 5 días a la semana.', 'advanced', 75, 'hipertrofia', 4),
  ('HIIT 20 Minutos', 'Entrenamiento de alta intensidad para quemar grasa.', 'intermediate', 20, 'cardio', 4),
  ('Core y Abdomen', 'Rutina específica para fortalecer el core.', 'beginner', 30, 'core', 4);

-- Rutina_Ejercicios
-- Rutina 1: Principiantes - Cuerpo Completo
INSERT INTO rutina_detalle (id_rutina, orden, id_ejercicio, repeticiones, duracion_segundos) VALUES
  (1, 1, 2, 12, NULL),   -- Flexiones
  (1, 2, 9, 10, NULL),   -- Sentadillas
  (1, 3, 6, 10, NULL),   -- Remo con Barra
  (1, 4, 13, 10, NULL),  -- Press Militar
  (1, 5, 20, NULL, 45),  -- Plancha
  (1, 6, 21, 15, NULL);  -- Abdominales

-- Rutina 2: Push (Empuje)
INSERT INTO rutina_detalle (id_rutina, orden, id_ejercicio, repeticiones, duracion_segundos) VALUES
  (2, 1, 1, 8, NULL),    -- Press de Banca
  (2, 2, 3, 10, NULL),   -- Press Inclinado
  (2, 3, 13, 10, NULL),  -- Press Militar
  (2, 4, 14, 12, NULL),  -- Elevaciones Laterales
  (2, 5, 18, 12, NULL);  -- Extensiones Tríceps

-- Rutina 3: Avanzado - Día de Pecho
INSERT INTO rutina_detalle (id_rutina, orden, id_ejercicio, repeticiones, duracion_segundos) VALUES
  (3, 1, 1, 6, NULL),    -- Press de Banca (pesado)
  (3, 2, 3, 10, NULL),   -- Press Inclinado
  (3, 3, 4, 12, NULL),   -- Aperturas
  (3, 4, 2, 15, NULL),   -- Flexiones
  (3, 5, 19, 10, NULL);  -- Fondos

-- Rutina 4: HIIT
INSERT INTO rutina_detalle (id_rutina, orden, id_ejercicio, repeticiones, duracion_segundos) VALUES
  (4, 1, 25, 20, NULL),  -- Burpees
  (4, 2, 27, 30, NULL),  -- Mountain Climbers
  (4, 3, 10, 20, NULL),  -- Zancadas
  (4, 4, 2, 20, NULL),   -- Flexiones
  (4, 5, 26, NULL, 120); -- Saltar cuerda

-- Rutina 5: Core
INSERT INTO rutina_detalle (id_rutina, orden, id_ejercicio, repeticiones, duracion_segundos) VALUES
  (5, 1, 20, NULL, 60),  -- Plancha
  (5, 2, 21, 25, NULL),  -- Crunches
  (5, 3, 22, 30, NULL),  -- Russian Twist
  (5, 4, 23, 20, NULL),  -- Elevación piernas
  (5, 5, 20, NULL, 45);  -- Plancha lateral

-- Historial_Progreso
INSERT INTO historial_progreso (id_rutina, id_usuario, fecha, duracion_real, estado, notas) VALUES
  (1, 2, CURRENT_DATE - INTERVAL '7 days', 48, 'completado', 'Primera semana, me costó pero lo terminé'),
  (1, 2, CURRENT_DATE - INTERVAL '5 days', 45, 'completado', 'Mucho mejor que la primera vez'),
  (1, 2, CURRENT_DATE - INTERVAL '3 days', 43, 'completado', 'Aumenté peso en sentadillas'),
  (1, 3, CURRENT_DATE - INTERVAL '2 days', 50, 'completado', 'Excelente rutina para principiantes'),
  (4, 2, CURRENT_DATE - INTERVAL '1 day', 22, 'completado', 'HIIT brutal pero efectivo');

-- Reseñas
INSERT INTO reseñas (id_usuario, id_rutina, calificacion, comentario, fecha_creacion) VALUES
  (2, 1, 5, 'Excelente rutina para empezar. Muy bien explicada.', CURRENT_DATE - INTERVAL '5 days'),
  (3, 1, 5, 'Perfecta para principiantes como yo. La recomiendo 100%', CURRENT_DATE - INTERVAL '2 days'),
  (2, 4, 4, 'HIIT muy intenso pero efectivo. Me ayudó a quemar grasa.', CURRENT_DATE - INTERVAL '1 day'),
  (3, 5, 5, 'Mi core nunca había estado tan fuerte. Rutina perfecta.', CURRENT_DATE);

-- Perfil Médico
INSERT INTO perfil_medico (id_usuario, condiciones_fisicas, lesiones, limitaciones, cifrado_hash) VALUES
  (3, 'Asma leve controlada', 'Esguince de tobillo hace 2 años (recuperado)', 'Evitar ejercicios de alto impacto prolongados', 'hash-placeholder-123');

-- Auditoría
INSERT INTO auditoria_admin (id_admin, accion, entidad_afectada, descripcion) VALUES
  (1, 'CREAR_EJERCICIO', 'ejercicios', 'Se creó el ejercicio "Press de Banca"'),
  (1, 'CREAR_RUTINA', 'rutinas', 'Se creó la rutina "Principiantes - Cuerpo Completo"'),
  (1, 'MODIFICAR_USUARIO', 'usuarios', 'Se confirmó el email del usuario ID 2');
