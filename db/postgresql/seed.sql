-- Roles
INSERT INTO roles (nombre_rol, descripcion) VALUES
  ('user', 'Usuario normal'),
  ('entrenador', 'Entrenador profesional'),
  ('admin', 'Administrador');

-- Usuarios
INSERT INTO usuarios (nombre, correo, contrasena_hash, edad, peso, estatura, nivel_fisico, tiempo_disponible, objetivo_principal, confirmado, is_active, id_rol) VALUES
  -- Usuarios originales
  ('Admin Sistema', 'admin@fitness.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYILSdGeQNm', 30, 75.0, 175.0, 'advanced', 60, 'Administración', TRUE, TRUE, 3),
  ('Juan Pérez', 'juan@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYILSdGeQNm', 25, 70.0, 180.0, 'intermediate', 45, 'Ganar Masa', TRUE, TRUE, 1),
  ('María González', 'maria@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYILSdGeQNm', 28, 60.0, 165.0, 'beginner', 30, 'Salud', TRUE, TRUE, 1),
  ('Carlos Entrenador', 'carlos@fitness.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYILSdGeQNm', 35, 80.0, 178.0, 'advanced', 90, 'Entrenamiento', TRUE, TRUE, 2),

  -- Usuarios tuyos
  ('luis2', 'hola@gmail.com', '$2b$12$4hMAx0E7VBQQgCO5fsb49uMvznMJc0XB1.AJ6hfqKHi7WBRy2JPTS', 21, 95.0, 190.0, 'intermediate', 30, 'Bajar peso', TRUE, TRUE, 1),
  ('luis2', 'hola2@gmail.com', '$2b$12$aLR6oEadbypTDDmMIlrxMe/Tu8.vF.rYr4QaFooACTUwZRusSAA0q', 21, 95.0, 190.0, 'advanced', 30, 'Competencia', TRUE, TRUE, 3),
  ('luis2', 'hola4@gmail.com', '$2b$12$JkAAbyuqMNEcMFzwHwnXGuQ.7LRAFHIpoOtWWpZfRbcAZjFK/BKf2', 21, 95.0, 190.0, 'beginner', 30, 'Salud', TRUE, TRUE, 1),

  -- Usuario Gym Bro (hash corregido)
  ('Gym Bro', 'fuerza@test.com', '$2b$12$JkAAbyuqMNEcMFzwHwnXGuQ.7LRAFHIpoOtWWpZfRbcAZjFK/BKf2', 25, 80.0, 175.0, 'intenso', 60, 'Fuerza/Hipertrofia', TRUE, TRUE, 1),

  -- Usuario Adulto Mayor (para probar ruta)
  ('Adulto Mayor Test', 'adulto@test.com', '$2b$12$JkAAbyuqMNEcMFzwHwnXGuQ.7LRAFHIpoOtWWpZfRbcAZjFK/BKf2', 72, 68.0, 165.0, 'sedentario', 30, 'movilidad', TRUE, TRUE, 1),

  -- Usuario con lesión (rehabilitación)
  ('Rehab Test', 'rehab@test.com', '$2b$12$JkAAbyuqMNEcMFzwHwnXGuQ.7LRAFHIpoOtWWpZfRbcAZjFK/BKf2', 40, 75.0, 170.0, 'ligero', 30, 'Rehabilitación', TRUE, TRUE, 1),

  -- Usuario híbrido (deporte)
  ('Atleta Test', 'atleta@test.com', '$2b$12$JkAAbyuqMNEcMFzwHwnXGuQ.7LRAFHIpoOtWWpZfRbcAZjFK/BKf2', 30, 78.0, 178.0, 'moderado', 60, 'Resistencia/Deporte', TRUE, TRUE, 1);

-- Configuración por Usuario
INSERT INTO configuracion (id_usuario, modo_visual, tamano_fuente, notificaciones, preferencia_privacidad) VALUES
  (1, 'dark', 'medium', TRUE, FALSE),
  (2, 'light', 'medium', TRUE, FALSE),
  (3, 'light', 'large', TRUE, TRUE),
  (4, 'dark', 'medium', FALSE, FALSE);

-- Ejercicios
INSERT INTO ejercicios (nombre_ejercicio, descripcion, repeticiones, tiempo, categoria, advertencias, activo) VALUES
  -- PECHO
  ('Press de Banca', 'Ejercicio fundamental para desarrollar el pecho.', 10, 60, 'pecho', 'Usa un ayudante', TRUE),
  ('Flexiones', 'Ejercicio de peso corporal.', 15, 45, 'pecho', 'Mantén la espalda recta', TRUE),
  ('Press Inclinado con Mancuernas', 'Parte superior del pecho.', 12, 60, 'pecho', 'Sin advertencias', TRUE),
  ('Aperturas con Mancuernas', 'Aislamiento de pecho.', 12, 50, 'pecho', 'Evita bajar demasiado', TRUE),

  -- ESPALDA
  ('Dominadas', 'Ejercicio compuesto.', 8, 60, 'espalda', 'Usa banda si eres principiante', TRUE),
  ('Remo con Barra', 'Espalda media.', 10, 60, 'espalda', 'No uses impulso', TRUE),
  ('Peso Muerto', 'Espalda baja y piernas.', 8, 70, 'espalda', 'Cuida técnica', TRUE),
  ('Remo en Polea Baja', 'Máquina.', 12, 55, 'espalda', 'Sin advertencias', TRUE),

  -- PIERNAS
  ('Sentadillas', 'Ejercicio base.', 12, 60, 'piernas', 'Rodillas alineadas', TRUE),
  ('Zancadas', 'Unilateral.', 12, 60, 'piernas', 'Sin advertencias', TRUE),
  ('Prensa de Piernas', 'Máquina.', 15, 60, 'piernas', 'No bloquear rodillas', TRUE),
  ('Curl Femoral', 'Isquiotibiales.', 12, 50, 'piernas', 'Sin advertencias', TRUE),

  -- HOMBROS
  ('Press Militar', 'Hombros.', 10, 60, 'hombros', 'Sin advertencias', TRUE),
  ('Elevaciones Laterales', 'Deltoides.', 15, 45, 'hombros', 'Movimiento controlado', TRUE),
  ('Elevaciones Frontales', 'Deltoide frontal.', 15, 45, 'hombros', 'Sin advertencias', TRUE),

  -- BRAZOS
  ('Curl de Bíceps con Barra', 'Bíceps.', 12, 50, 'brazos', 'No balancear', TRUE),
  ('Curl Martillo', 'Antebrazo.', 12, 50, 'brazos', 'Sin advertencias', TRUE),
  ('Extensiones de Tríceps en Polea', 'Tríceps.', 15, 50, 'brazos', 'Sin advertencias', TRUE),
  ('Fondos en Paralelas', 'Compuesto.', 10, 55, 'brazos', 'Inclínate para pecho', TRUE),

  -- CORE
  ('Plancha', 'Core isométrico.', 0, 60, 'core', 'Cuerpo recto', TRUE),
  ('Abdominales Crunch', 'Abdomen.', 20, 45, 'core', 'Sin advertencias', TRUE),
  ('Russian Twist', 'Oblicuos.', 20, 45, 'core', 'Sin advertencias', TRUE),
  ('Elevación de Piernas', 'Abdomen bajo.', 15, 50, 'core', 'Sin advertencias', TRUE),

  -- CARDIO
  ('Correr', 'Cardio continuo.', 0, 1200, 'cardio', 'Calentar antes', TRUE),
  ('Burpees', 'Alta intensidad.', 15, 60, 'cardio', 'Descansa si mareo', TRUE),
  ('Saltar la Cuerda', 'Cardio.', 0, 300, 'cardio', 'Sin advertencias', TRUE),
  ('Mountain Climbers', 'Cardio + core.', 30, 60, 'cardio', 'Sin advertencias', TRUE),

  -- REHABILITACIÓN
  ('Elevación de Pierna Recta', 'Fortalece cuádriceps sin impacto.', 15, 40, 'rehabilitacion', 'Movimiento controlado', TRUE),
  ('Puente de Glúteos', 'Glúteos y lumbar.', 15, 45, 'rehabilitacion', 'No arquear espalda', TRUE),
  ('Retracción Escapular', 'Postura y hombros.', 12, 40, 'rehabilitacion', 'Movimiento lento', TRUE),
  ('Movilidad de Tobillo', 'Rango de movimiento.', 10, 35, 'rehabilitacion', 'Sin dolor', TRUE),

  -- MOVILIDAD / ADULTO MAYOR
  ('Rotaciones de Cuello', 'Movilidad cervical.', 10, 30, 'movilidad', 'Movimiento suave', TRUE),
  ('Movilidad de Hombros', 'Rotaciones controladas.', 10, 35, 'movilidad', 'Sin dolor', TRUE),
  ('Flexión Extensión de Rodillas', 'Articulación rodilla.', 12, 40, 'movilidad', 'Movimiento lento', TRUE),
  ('Caminata Suave', 'Cardio ligero.', 0, 600, 'movilidad', 'Ritmo cómodo', TRUE),
  ('Elevaciones de Talones', 'Pantorrilla y equilibrio.', 15, 40, 'movilidad', 'Sujétate si es necesario', TRUE);

-- MULTIMEDIA 
INSERT INTO multimedia (id_multimedia, id_ejercicio, tipo, url_archivo) VALUES 
  ('vid_press_banca', 1, 'youtube', 'https://youtu.be/TAH8RxOS0VI'),
  ('vid_flexiones', 2, 'youtube', 'https://youtube.com/shorts/YXI_V2sIO_Y'),
  ('vid_press_inclinado', 3, 'youtube', 'https://youtu.be/PAd6ezGbDUQ'),
  ('vid_aperturas_mancuernas', 4, 'youtube', 'https://youtu.be/OrlXQdNwNwM'),
  ('vid_dominadas', 5, 'youtube', 'https://youtube.com/shorts/BT3CSQKeEww'),
  ('vid_remo_barra', 6, 'youtube', 'https://youtube.com/shorts/sr_U0jBE89A'),
  ('vid_peso_muerto', 7, 'youtube', 'https://youtu.be/0XL4cZR2Ink'),
  ('vid_remo_polea_baja', 8, 'youtube', 'https://youtu.be/iOkQnxUD3no'),
  ('vid_sentadillas', 9, 'youtube', 'https://youtu.be/BjixzWEw4EY'),
  ('vid_zancadas', 10, 'youtube', 'https://youtu.be/uqvt79Uh4o4'),
  ('vid_prensa_piernas', 11, 'youtube', 'https://youtu.be/xvCynwyNoP4'),
  ('vid_curl_femoral', 12, 'youtube', 'https://youtu.be/kmtn5RJkvVE'),
  ('vid_plancha', 13, 'youtube', 'https://youtube.com/shorts/3AM7L2k7BEw'),
  ('vid_crunch_abdominal', 14, 'youtube', 'https://youtube.com/shorts/AYbEbEGdph4'),
  ('vid_russian_twist', 15, 'youtube', 'https://youtube.com/shorts/_BguOZw55-c'),
  ('vid_elevacion_piernas', 16, 'youtube', 'https://youtu.be/mSejp5qK1pc'),
  ('vid_correr', 17, 'youtube', NULL),
  ('vid_burpees', 18, 'youtube', 'https://youtube.com/shorts/EkK3oVBA__Q'),
  ('vid_saltar_cuerda', 19, 'youtube', 'https://youtube.com/shorts/BJiWQxBwJ0I'),
  ('vid_mountain_climbers', 20, 'youtube', 'https://youtube.com/shorts/Fb79R7IUwYE'),
  ('vid_pierna_recta', 21, 'youtube', NULL),
  ('vid_puente_gluteos', 22, 'youtube', NULL),
  ('vid_retraccion_escapular', 23, 'youtube', NULL),
  ('vid_estiramiento_cervical', 24, 'youtube', NULL);

-- Rutinas
INSERT INTO rutinas (nombre_rutina, descripcion, nivel, duracion_estimada, categoria, creado_por) VALUES
  ('Principiantes - Cuerpo Completo', 'Rutina ideal para personas que inician en el gimnasio. 3 veces por semana.', 'beginner', 45, 'fuerza', 4),
  ('Intermedio - Push Pull Legs', 'Rutina dividida en empuje, tirón y piernas. 6 días a la semana.', 'intermediate', 60, 'fuerza', 4),
  ('Avanzado - Hipertrofia', 'Rutina enfocada en ganancia muscular. 5 días a la semana.', 'advanced', 75, 'hipertrofia', 4),
  ('HIIT 20 Minutos', 'Entrenamiento de alta intensidad para quemar grasa.', 'intermediate', 20, 'cardio', 4),
  ('Core y Abdomen', 'Rutina específica para fortalecer el core.', 'beginner', 30, 'core', 4);

-- Rutina_Ejercicios
-- Rutina 1: Principiantes - Cuerpo Completo
INSERT INTO rutina_ejercicio (id_rutina, orden, id_ejercicio, repeticiones, duracion_segundos) VALUES
  (1, 1, 2, 12, NULL),   -- Flexiones
  (1, 2, 9, 10, NULL),   -- Sentadillas
  (1, 3, 6, 10, NULL),   -- Remo con Barra
  (1, 4, 13, 10, NULL),  -- Press Militar
  (1, 5, 20, NULL, 45),  -- Plancha
  (1, 6, 21, 15, NULL);  -- Abdominales

-- Rutina 2: Push (Empuje)
INSERT INTO rutina_ejercicio (id_rutina, orden, id_ejercicio, repeticiones, duracion_segundos) VALUES
  (2, 1, 1, 8, NULL),    -- Press de Banca
  (2, 2, 3, 10, NULL),   -- Press Inclinado
  (2, 3, 13, 10, NULL),  -- Press Militar
  (2, 4, 14, 12, NULL),  -- Elevaciones Laterales
  (2, 5, 18, 12, NULL);  -- Extensiones Tríceps

-- Rutina 3: Avanzado - Día de Pecho
INSERT INTO rutina_ejercicio (id_rutina, orden, id_ejercicio, repeticiones, duracion_segundos) VALUES
  (3, 1, 1, 6, NULL),    -- Press de Banca (pesado)
  (3, 2, 3, 10, NULL),   -- Press Inclinado
  (3, 3, 4, 12, NULL),   -- Aperturas
  (3, 4, 2, 15, NULL),   -- Flexiones
  (3, 5, 19, 10, NULL);  -- Fondos

-- Rutina 4: HIIT
INSERT INTO rutina_ejercicio (id_rutina, orden, id_ejercicio, repeticiones, duracion_segundos) VALUES
  (4, 1, 25, 20, NULL),  -- Burpees
  (4, 2, 27, 30, NULL),  -- Mountain Climbers
  (4, 3, 10, 20, NULL),  -- Zancadas
  (4, 4, 2, 20, NULL),   -- Flexiones
  (4, 5, 26, NULL, 120); -- Saltar cuerda

-- Rutina 5: Core
INSERT INTO rutina_ejercicio (id_rutina, orden, id_ejercicio, repeticiones, duracion_segundos) VALUES
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
INSERT INTO resenas (id_usuario, id_rutina, calificacion, comentario, fecha_resena) VALUES
  (2, 1, 5, 'Excelente rutina para empezar. Muy bien explicada.', CURRENT_DATE - INTERVAL '5 days'),
  (3, 1, 5, 'Perfecta para principiantes como yo. La recomiendo 100%', CURRENT_DATE - INTERVAL '2 days'),
  (2, 4, 4, 'HIIT muy intenso pero efectivo. Me ayudó a quemar grasa.', CURRENT_DATE - INTERVAL '1 day'),
  (3, 5, 5, 'Mi core nunca había estado tan fuerte. Rutina perfecta.', CURRENT_DATE);

-- Perfil Médico
INSERT INTO perfil_medico (id_usuario, condiciones_fisicas, lesiones, limitaciones, cifrado_hash) VALUES
  (3, '["Asma leve controlada"]'::jsonb, '["Esguince de tobillo hace 2 años (recuperado)"]'::jsonb, '["Evitar ejercicios de alto impacto prolongados"]'::jsonb, 'hash-placeholder-123');
-- Auditoría
INSERT INTO auditoria_admin (id_admin, accion, entidad_afectada, descripcion) VALUES
  (1, 'CREAR_EJERCICIO', 'ejercicios', 'Se creó el ejercicio "Press de Banca"'),
  (1, 'CREAR_RUTINA', 'rutinas', 'Se creó la rutina "Principiantes - Cuerpo Completo"'),
  (1, 'MODIFICAR_USUARIO', 'usuarios', 'Se confirmó el email del usuario ID 2');
