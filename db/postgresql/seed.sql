-- ============================================================
-- SEED COMPLETO Y UNIFICADO
-- Ejercicios IDs 1-36 (originales) + 37-57 (nuevos rehab)
-- Multimedia corregida para coincidir con IDs reales
-- ============================================================

-- ── Roles ────────────────────────────────────────────────────
INSERT INTO roles (nombre_rol, descripcion) VALUES
  ('user',        'Usuario normal'),
  ('entrenador',  'Entrenador profesional'),
  ('admin',       'Administrador');

-- ── Usuarios ─────────────────────────────────────────────────
INSERT INTO usuarios (nombre, correo, contrasena_hash, edad, peso, estatura, nivel_fisico, tiempo_disponible, objetivo_principal, confirmado, is_active, id_rol) VALUES
  -- Usuarios originales
  ('Admin Sistema',    'admin@fitness.com',  '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYILSdGeQNm', 30, 75.0, 175.0, 'advanced',     60, 'Administración',      TRUE, TRUE, 3),
  ('Juan Pérez',       'juan@example.com',   '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYILSdGeQNm', 25, 70.0, 180.0, 'intermediate', 45, 'Ganar Masa',          TRUE, TRUE, 1),
  ('María González',   'maria@example.com',  '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYILSdGeQNm', 28, 60.0, 165.0, 'beginner',     30, 'Salud',               TRUE, TRUE, 1),
  ('Carlos Entrenador','carlos@fitness.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYILSdGeQNm', 35, 80.0, 178.0, 'advanced',     90, 'Entrenamiento',       TRUE, TRUE, 2),
  -- Usuarios adicionales
  ('luis2',            'hola@gmail.com',     '$2b$12$4hMAx0E7VBQQgCO5fsb49uMvznMJc0XB1.AJ6hfqKHi7WBRy2JPTS', 21, 95.0, 190.0, 'intermediate', 30, 'Bajar peso',          TRUE, TRUE, 1),
  ('luis2',            'hola2@gmail.com',    '$2b$12$aLR6oEadbypTDDmMIlrxMe/Tu8.vF.rYr4QaFooACTUwZRusSAA0q', 21, 95.0, 190.0, 'advanced',     30, 'Competencia',         TRUE, TRUE, 3),
  ('luis2',            'hola4@gmail.com',    '$2b$12$JkAAbyuqMNEcMFzwHwnXGuQ.7LRAFHIpoOtWWpZfRbcAZjFK/BKf2', 21, 95.0, 190.0, 'beginner',     30, 'Salud',               TRUE, TRUE, 1),
  ('Gym Bro',          'fuerza@test.com',    '$2b$12$JkAAbyuqMNEcMFzwHwnXGuQ.7LRAFHIpoOtWWpZfRbcAZjFK/BKf2', 25, 80.0, 175.0, 'intenso',      60, 'Fuerza/Hipertrofia',  TRUE, TRUE, 1),
  ('Adulto Mayor Test','adulto@test.com',    '$2b$12$JkAAbyuqMNEcMFzwHwnXGuQ.7LRAFHIpoOtWWpZfRbcAZjFK/BKf2', 72, 68.0, 165.0, 'sedentario',   30, 'movilidad',           TRUE, TRUE, 1),
  ('Rehab Test',       'rehab@test.com',     '$2b$12$JkAAbyuqMNEcMFzwHwnXGuQ.7LRAFHIpoOtWWpZfRbcAZjFK/BKf2', 40, 75.0, 170.0, 'ligero',       30, 'Rehabilitación',      TRUE, TRUE, 1),
  ('Atleta Test',      'atleta@test.com',    '$2b$12$JkAAbyuqMNEcMFzwHwnXGuQ.7LRAFHIpoOtWWpZfRbcAZjFK/BKf2', 30, 78.0, 178.0, 'moderado',     60, 'Resistencia/Deporte', TRUE, TRUE, 1);

-- ── Configuración por Usuario ─────────────────────────────────
INSERT INTO configuracion (id_usuario, modo_visual, tamano_fuente, notificaciones, preferencia_privacidad) VALUES
  (1, 'dark',  'medium', TRUE,  FALSE),
  (2, 'light', 'medium', TRUE,  FALSE),
  (3, 'light', 'large',  TRUE,  TRUE),
  (4, 'dark',  'medium', FALSE, FALSE);

-- ── Ejercicios ───────────────────────────────────────────────
INSERT INTO ejercicios (nombre_ejercicio, descripcion, repeticiones, tiempo, categoria, advertencias, activo) VALUES
  -- PECHO (IDs 1-4)
  ('Press de Banca',
   '1. Acuéstate en el banco con los pies apoyados en el suelo.
    ' || CHR(10) || '2. Agarra la barra con las manos un poco más anchas que los hombros.
    ' || CHR(10) || '3. Baja la barra lentamente hasta rozar el pecho.
    ' || CHR(10) || '4. Empuja hacia arriba hasta extender los codos.
    ' || CHR(10) || '5. Mantén los omóplatos apretados contra el banco en todo momento.',
   10, 60, 'pecho', 'Usa un ayudante para mayor seguridad', TRUE),

  ('Flexiones',
   '1. Apoya las manos en el suelo a la altura de los hombros, un poco más abiertas.
    ' || CHR(10) || '2. Extiende las piernas hacia atrás formando una línea recta cabeza-talones.
    ' || CHR(10) || '3. Baja el pecho hacia el suelo doblando los codos.
    ' || CHR(10) || '4. Empuja hacia arriba hasta extender los brazos.
    ' || CHR(10) || '5. Mantén el abdomen contraído durante todo el movimiento.',
   15, 45, 'pecho', 'Mantén la espalda recta, no dejes caer las caderas', TRUE),

  ('Press Inclinado con Mancuernas',
   '1. Ajusta el banco a 30-45° de inclinación y siéntate con una mancuerna en cada mano.
    ' || CHR(10) || '2. Lleva las mancuernas a la altura del pecho con los codos a 45°.
    ' || CHR(10) || '3. Empuja hacia arriba y al centro hasta casi juntar las mancuernas.
    ' || CHR(10) || '4. Baja de forma controlada hasta sentir estiramiento en la parte superior del pecho.',
   12, 60, 'pecho', 'No arquees en exceso la zona lumbar', TRUE),

  ('Aperturas con Mancuernas',
   '1. Acuéstate en el banco con una mancuerna en cada mano y los brazos extendidos arriba.
    ' || CHR(10) || '2. Abre los brazos hacia los lados con una leve flexión en los codos.
    ' || CHR(10) || '3. Baja hasta sentir un buen estiramiento en el pecho.
    ' || CHR(10) || '4. Regresa al punto inicial contrayendo el pecho como si abrazaras un árbol.',
   12, 50, 'pecho', 'Evita bajar demasiado para no sobrecargar el hombro', TRUE),

  -- ESPALDA (IDs 5-8)
  ('Dominadas',
   '1. Agarra la barra con las manos más anchas que los hombros, palmas hacia afuera.
    ' || CHR(10) || '2. Cuelga con los brazos completamente extendidos.
    ' || CHR(10) || '3. Jala tu cuerpo hacia arriba llevando los codos hacia las caderas.
    ' || CHR(10) || '4. Sube hasta que la barbilla supere la barra.
    ' || CHR(10) || '5. Baja de forma lenta y controlada.',
   8, 60, 'espalda', 'Usa banda elástica si eres principiante', TRUE),

  ('Remo con Barra',
   '1. Párate con los pies a la altura de los hombros y agarra la barra con las dos manos.
    ' || CHR(10) || '2. Inclina el torso hacia adelante a unos 45° manteniendo la espalda recta.
    ' || CHR(10) || '3. Jala la barra hacia el abdomen apretando los codos cerca del cuerpo.
    ' || CHR(10) || '4. Baja la barra de forma controlada hasta extender los brazos.',
   10, 60, 'espalda', 'No uses impulso del torso para subir el peso', TRUE),

  ('Peso Muerto',
   '1. Párate frente a la barra con los pies a la altura de la cadera.
    ' || CHR(10) || '2. Baja doblando rodillas y cadera, agarra la barra con las manos fuera de las rodillas.
    ' || CHR(10) || '3. Mantén la espalda recta y el pecho hacia arriba.
    ' || CHR(10) || '4. Empuja el suelo con los pies y extiende caderas y rodillas a la vez para levantar.
    ' || CHR(10) || '5. Baja la barra siguiendo el mismo camino de forma controlada.',
   8, 70, 'espalda', 'Nunca redondees la espalda baja al levantar', TRUE),

  ('Remo en Polea Baja',
   '1. Siéntate frente a la máquina con las rodillas ligeramente dobladas y agarra el mango.
    ' || CHR(10) || '2. Mantén el torso erguido y jala el mango hacia el abdomen.
    ' || CHR(10) || '3. Aprieta los omóplatos al final del movimiento.
    ' || CHR(10) || '4. Extiende los brazos de forma lenta para regresar al inicio.',
   12, 55, 'espalda', 'No te inclines hacia atrás para ayudarte con el peso', TRUE),

  -- PIERNAS (IDs 9-12)
  ('Sentadillas',
   '1. Párate con los pies a la altura de los hombros y los pies ligeramente hacia afuera.
    ' || CHR(10) || '2. Lleva la cadera hacia atrás y abajo como si fueras a sentarte en una silla.
    ' || CHR(10) || '3. Baja hasta que los muslos estén paralelos al suelo (o más si puedes).
    ' || CHR(10) || '4. Empuja el suelo con los talones para subir.
    ' || CHR(10) || '5. Mantén el pecho arriba y las rodillas alineadas con los pies.',
   12, 60, 'piernas', 'No dejes que las rodillas colapsen hacia adentro', TRUE),

  ('Zancadas',
   '1. Párate erguido con los pies juntos.
    ' || CHR(10) || '2. Da un paso largo hacia adelante con una pierna.
    ' || CHR(10) || '3. Baja la rodilla trasera hacia el suelo sin tocarlo.
    ' || CHR(10) || '4. Empuja con el pie delantero para volver a la posición inicial.
    ' || CHR(10) || '5. Alterna piernas en cada repetición.',
   12, 60, 'piernas', 'Mantén el torso erguido y la rodilla delantera alineada con el pie', TRUE),

  ('Prensa de Piernas',
   '1. Siéntate en la máquina y apoya los pies en la plataforma a la altura de los hombros.
    ' || CHR(10) || '2. Suelta los seguros y baja la plataforma doblando las rodillas hacia el pecho.
    ' || CHR(10) || '3. Empuja la plataforma hacia arriba extendiendo las piernas sin bloquear las rodillas.
    ' || CHR(10) || '4. Baja de forma controlada y repite.',
   15, 60, 'piernas', 'Nunca bloquees completamente las rodillas al extender', TRUE),

  ('Curl Femoral',
   '1. Acuéstate boca abajo en la máquina y coloca los tobillos bajo el rodillo.
    ' || CHR(10) || '2. Desde las piernas extendidas, dobla las rodillas jalando los talones hacia los glúteos.
    ' || CHR(10) || '3. Sube hasta que las piernas formen un ángulo de 90° o más.
    ' || CHR(10) || '4. Baja lentamente hasta casi extender las piernas.',
   12, 50, 'piernas', 'Evita levantar las caderas del banco al subir', TRUE),

  -- HOMBROS (IDs 13-15)
  ('Press Militar',
   '1. De pie o sentado, sostén la barra a la altura de los hombros con las manos un poco más anchas.
    ' || CHR(10) || '2. Empuja la barra hacia arriba por encima de la cabeza hasta extender los codos.
    ' || CHR(10) || '3. Mantén el abdomen contraído para proteger la zona lumbar.
    ' || CHR(10) || '4. Baja la barra lentamente hasta la posición inicial.',
   10, 60, 'hombros', 'No arqueés la zona lumbar al empujar', TRUE),

  ('Elevaciones Laterales',
   '1. De pie con una mancuerna en cada mano a los costados.
    ' || CHR(10) || '2. Con los codos ligeramente doblados, eleva los brazos hacia los lados hasta la altura de los hombros.
    ' || CHR(10) || '3. Mantén la posición un segundo en la cima.
    ' || CHR(10) || '4. Baja lentamente y repite.',
   15, 45, 'hombros', 'No uses impulso ni eleves más allá de los hombros', TRUE),

  ('Elevaciones Frontales',
   '1. De pie, sostén las mancuernas frente a los muslos con las palmas hacia abajo.
    ' || CHR(10) || '2. Eleva un brazo (o ambos) hacia adelante hasta la altura de los hombros.
    ' || CHR(10) || '3. Mantén el codo ligeramente doblado durante todo el movimiento.
    ' || CHR(10) || '4. Baja de forma controlada y alterna brazos.',
   15, 45, 'hombros', 'Evita balancear el torso para generar impulso', TRUE),

  -- BRAZOS (IDs 16-19)
  ('Curl de Bíceps con Barra',
   '1. De pie, agarra la barra con las palmas hacia arriba a la altura de los hombros.
    ' || CHR(10) || '2. Mantén los codos pegados a los costados del cuerpo.
    ' || CHR(10) || '3. Dobla los codos y sube la barra hacia los hombros contrayendo el bíceps.
    ' || CHR(10) || '4. Baja la barra lentamente hasta estirar casi por completo los brazos.',
   12, 50, 'brazos', 'No balancees el torso ni despegues los codos del cuerpo', TRUE),

  ('Curl Martillo',
   '1. De pie con una mancuerna en cada mano, palmas hacia adentro (agarre neutro).
    ' || CHR(10) || '2. Mantén los codos pegados al cuerpo.
    ' || CHR(10) || '3. Sube las mancuernas hacia los hombros sin rotar las muñecas.
    ' || CHR(10) || '4. Baja de forma lenta y controlada. Puedes alternar brazos.',
   12, 50, 'brazos', 'Mantén las muñecas neutras durante todo el movimiento', TRUE),

  ('Extensiones de Tríceps en Polea',
   '1. De pie frente a la polea alta, agarra la cuerda o barra con las manos juntas.
    ' || CHR(10) || '2. Mantén los codos pegados a los costados y ligeramente adelantados.
    ' || CHR(10) || '3. Empuja hacia abajo extendiendo los codos completamente.
    ' || CHR(10) || '4. Regresa lentamente a la posición inicial sin mover los codos.',
   15, 50, 'brazos', 'No muevas los codos; el movimiento es solo de antebrazo', TRUE),

  ('Fondos en Paralelas',
   '1. Apóyate en las barras paralelas con los brazos extendidos.
    ' || CHR(10) || '2. Inclina ligeramente el torso hacia adelante para enfatizar el pecho.
    ' || CHR(10) || '3. Baja el cuerpo doblando los codos hasta que los hombros queden al nivel de los codos.
    ' || CHR(10) || '4. Empuja hacia arriba hasta extender los brazos y repite.',
   10, 55, 'brazos', 'No bajes demasiado si tienes inestabilidad en el hombro', TRUE),

  -- CORE (IDs 20-23)
  ('Plancha',
   '1. Apóyate en los antebrazos y las puntas de los pies.
    ' || CHR(10) || '2. Forma una línea recta desde la cabeza hasta los talones.
    ' || CHR(10) || '3. Contrae el abdomen y los glúteos durante toda la posición.
    ' || CHR(10) || '4. Mantén la posición el tiempo indicado sin dejar caer las caderas.',
   0, 60, 'core', 'No dejes que las caderas suban ni bajen', TRUE),

  ('Abdominales Crunch',
   '1. Acuéstate boca arriba con las rodillas dobladas y los pies en el suelo.
    ' || CHR(10) || '2. Coloca las manos detrás de la cabeza sin jalar el cuello.
    ' || CHR(10) || '3. Contrae el abdomen y eleva los hombros del suelo.
    ' || CHR(10) || '4. Baja lentamente sin dejar que la cabeza toque el suelo.',
   20, 45, 'core', 'No jales el cuello con las manos al subir', TRUE),

  ('Russian Twist',
   '1. Siéntate en el suelo con las rodillas dobladas y los pies elevados.
    ' || CHR(10) || '2. Inclina el torso ligeramente hacia atrás.
    ' || CHR(10) || '3. Gira el torso de un lado al otro tocando el suelo con las manos.
    ' || CHR(10) || '4. Mantén el abdomen contraído durante todo el movimiento.',
   20, 45, 'core', 'Puedes usar un peso para mayor dificultad', TRUE),

  ('Elevación de Piernas',
   '1. Acuéstate boca arriba con las piernas extendidas y las manos bajo la zona lumbar o a los lados.
    ' || CHR(10) || '2. Contrae el abdomen y eleva ambas piernas juntas hasta los 90°.
    ' || CHR(10) || '3. Baja lentamente sin dejar que los pies toquen el suelo.
    ' || CHR(10) || '4. Mantén la zona lumbar pegada al suelo en todo momento.',
   15, 50, 'core', 'Si sientes dolor lumbar, dobla ligeramente las rodillas', TRUE),

  -- CARDIO (IDs 24-27)
  ('Correr',
   '1. Comienza caminando 2-3 minutos para calentar.
    ' || CHR(10) || '2. Aumenta el ritmo gradualmente hasta trotar.
    ' || CHR(10) || '3. Mantén una postura erguida con los brazos relajados.
    ' || CHR(10) || '4. Respira de forma rítmica por la nariz y la boca.
    ' || CHR(10) || '5. Al terminar, baja el ritmo progresivamente durante 2 minutos.',
   0, 1200, 'cardio', 'Calienta siempre antes de correr para evitar lesiones', TRUE),

  ('Burpees',
   '1. De pie, baja las manos al suelo y lanza los pies hacia atrás quedando en posición de plancha.
    ' || CHR(10) || '2. Haz una flexión (opcional según nivel).
    ' || CHR(10) || '3. Jala los pies hacia las manos.
    ' || CHR(10) || '4. Salta explosivamente hacia arriba con los brazos extendidos.
    ' || CHR(10) || '5. Aterriza suavemente y repite.',
   15, 60, 'cardio', 'Detente y descansa si sientes mareo o falta de aire', TRUE),

  ('Saltar la Cuerda',
   '1. Sostén las asas de la cuerda a la altura de las caderas.
    ' || CHR(10) || '2. Párate en el centro de la cuerda con los pies juntos.
    ' || CHR(10) || '3. Gira la cuerda con las muñecas y salta con ambos pies.
    ' || CHR(10) || '4. Mantén los saltos pequeños, aterrizando en la parte delantera del pie.
    ' || CHR(10) || '5. Mantén un ritmo constante durante el tiempo indicado.',
   0, 300, 'cardio', 'Usa calzado con amortiguación adecuada', TRUE),

  ('Mountain Climbers',
   '1. Comienza en posición de plancha con los brazos extendidos.
    ' || CHR(10) || '2. Lleva una rodilla hacia el pecho de forma explosiva.
    ' || CHR(10) || '3. Regresa esa pierna atrás mientras llevas la otra rodilla al pecho.
    ' || CHR(10) || '4. Alterna de forma rápida simulando una carrera en el suelo.
    ' || CHR(10) || '5. Mantén las caderas niveladas durante todo el ejercicio.',
   30, 60, 'cardio', 'No dejes que las caderas suban durante el movimiento', TRUE),

  -- REHABILITACIÓN GENERAL (IDs 28-31)
  ('Elevación de Pierna Recta',
   '1. Acuéstate boca arriba con una pierna doblada y la otra extendida.
    ' || CHR(10) || '2. Contrae el cuádriceps de la pierna extendida.
    ' || CHR(10) || '3. Eleva la pierna recta hasta la altura de la rodilla contraria (unos 45°).
    ' || CHR(10) || '4. Mantén 2 segundos arriba y baja lentamente.
    ' || CHR(10) || '5. Cambia de pierna al terminar las repeticiones.',
   15, 40, 'rehabilitacion', 'Movimiento lento y controlado en todo momento', TRUE),

  ('Puente de Glúteos',
   '1. Acuéstate boca arriba con las rodillas dobladas y los pies apoyados en el suelo.
    ' || CHR(10) || '2. Apoya los brazos a los lados del cuerpo.
    ' || CHR(10) || '3. Empuja con los talones y eleva las caderas hasta formar una línea desde hombros hasta rodillas.
    ' || CHR(10) || '4. Aprieta los glúteos en la cima y mantén 2 segundos.
    ' || CHR(10) || '5. Baja lentamente.',
   15, 45, 'rehabilitacion', 'No arquees en exceso la zona lumbar al subir', TRUE),

  ('Retracción Escapular',
   '1. Siéntate o párate con la espalda erguida.
    ' || CHR(10) || '2. Con los brazos relajados a los lados, lleva los omóplatos hacia adentro y hacia abajo.
    ' || CHR(10) || '3. Mantén la contracción 3-5 segundos apretando bien.
    ' || CHR(10) || '4. Suelta lentamente y repite.
    ' || CHR(10) || '5. Evita encoger los hombros hacia las orejas.',
   12, 40, 'rehabilitacion', 'Movimiento lento, sin tensar el cuello', TRUE),

  ('Movilidad de Tobillo',
   '1. Siéntate en una silla con un pie apoyado en el suelo.
    ' || CHR(10) || '2. Eleva el otro pie y realiza círculos lentos con el tobillo en el aire.
    ' || CHR(10) || '3. Haz 5 círculos en un sentido y 5 en el otro.
    ' || CHR(10) || '4. Luego flexiona y extiende el pie hacia arriba y hacia abajo.
    ' || CHR(10) || '5. Cambia de pie al terminar.',
   10, 35, 'rehabilitacion', 'Detente si sientes dolor agudo en la articulación', TRUE),

  -- MOVILIDAD / ADULTO MAYOR (IDs 32-36)
  ('Rotaciones de Cuello',
   '1. Siéntate erguido con los hombros relajados.
    ' || CHR(10) || '2. Lleva la barbilla lentamente hacia el pecho.
    ' || CHR(10) || '3. Gira la cabeza hacia la derecha hasta mirar por encima del hombro.
    ' || CHR(10) || '4. Regresa al centro y repite hacia la izquierda.
    ' || CHR(10) || '5. Realiza el movimiento de forma suave y sin prisas.',
   10, 30, 'movilidad', 'Nunca hagas círculos completos de cuello; evita la extensión máxima hacia atrás', TRUE),

  ('Movilidad de Hombros',
   '1. De pie o sentado, lleva un brazo extendido a través del pecho.
    ' || CHR(10) || '2. Con el otro brazo presiona suavemente para aumentar el estiramiento.
    ' || CHR(10) || '3. Mantén 10-15 segundos.
    ' || CHR(10) || '4. Luego realiza círculos lentos con el brazo extendido hacia adelante y hacia atrás.
    ' || CHR(10) || '5. Alterna brazos.',
   10, 35, 'movilidad', 'Detente si sientes dolor o pinzamiento en el hombro', TRUE),

  ('Flexión Extensión de Rodillas',
   '1. Siéntate en el borde de una silla con los pies en el suelo.
    ' || CHR(10) || '2. Eleva lentamente un pie extendiendo la rodilla hasta quedar casi recto.
    ' || CHR(10) || '3. Mantén 2 segundos arriba.
    ' || CHR(10) || '4. Baja lentamente hasta apoyar el pie.
    ' || CHR(10) || '5. Alterna piernas en cada repetición.',
   12, 40, 'movilidad', 'Movimiento lento y sin dolor; no bloquees la rodilla', TRUE),

  ('Caminata Suave',
   '1. Comienza caminando a un ritmo cómodo.
    ' || CHR(10) || '2. Mantén la espalda erguida y los hombros relajados.
    ' || CHR(10) || '3. Balancear los brazos de forma natural.
    ' || CHR(10) || '4. Respira de forma tranquila y constante.
    ' || CHR(10) || '5. Si te cansas, reduce el paso pero no te detengas bruscamente.',
   0, 600, 'movilidad', 'Usa calzado cómodo y camina en superficies planas', TRUE),

  ('Elevaciones de Talones',
   '1. Párate detrás de una silla y apoya las manos en el respaldo para equilibrio.
    ' || CHR(10) || '2. Sube lentamente sobre las puntas de los pies elevando ambos talones.
    ' || CHR(10) || '3. Mantén la posición 2 segundos en la cima.
    ' || CHR(10) || '4. Baja lentamente hasta apoyar los talones.
    ' || CHR(10) || '5. Repite de forma controlada.',
   15, 40, 'movilidad', 'Sujétate si necesitas apoyo para el equilibrio', TRUE),

  -- REHAB HOMBRO (IDs 37-43)
  ('Rotación Interna con Banda',
   '1. Fija la banda a una altura media a tu lado.
    ' || CHR(10) || '2. Con el codo doblado a 90° y pegado al costado, agarra la banda.
    ' || CHR(10) || '3. Gira el antebrazo hacia el abdomen de forma lenta.
    ' || CHR(10) || '4. Regresa al inicio sin soltar la tensión.
    ' || CHR(10) || '5. Mantén el codo quieto durante todo el movimiento.',
   15, 45, 'rehab_hombro', 'Movimiento lento y controlado; detente si sientes dolor', TRUE),

  ('Rotación Externa con Banda',
   '1. Fija la banda frente a ti a altura de la cadera.
    ' || CHR(10) || '2. Con el codo doblado a 90° y pegado al costado, agarra la banda.
    ' || CHR(10) || '3. Gira el antebrazo hacia afuera alejándolo del cuerpo.
    ' || CHR(10) || '4. Regresa lentamente al inicio.
    ' || CHR(10) || '5. No separes el codo del costado en ningún momento.',
   15, 45, 'rehab_hombro', 'No fuerces el rango de movimiento; trabaja sin dolor', TRUE),

  ('Pendulares de Codman',
   '1. Inclínate hacia adelante apoyando la mano sana en una mesa o silla.
    ' || CHR(10) || '2. Deja que el brazo afectado cuelgue libre hacia el suelo.
    ' || CHR(10) || '3. Realiza pequeños círculos con el brazo usando solo el movimiento del tronco.
    ' || CHR(10) || '4. Haz círculos en ambas direcciones.
    ' || CHR(10) || '5. No contraigas el hombro; deja que la gravedad haga el trabajo.',
   10, 60, 'rehab_hombro', 'Sin peso en la mano; detener inmediatamente si hay dolor agudo', TRUE),

  ('Elevación Frontal con Banda (Rehab)',
   '1. Pisa la banda con el pie del mismo lado del brazo que trabajas.
    ' || CHR(10) || '2. Con el brazo extendido y el pulgar hacia arriba, eleva el brazo hacia adelante.
    ' || CHR(10) || '3. Sube hasta los 90° (hombro) de forma lenta y controlada.
    ' || CHR(10) || '4. Baja lentamente resistiendo la banda.
    ' || CHR(10) || '5. No superes los 90° durante la fase de rehabilitación.',
   12, 40, 'rehab_hombro', 'No superar los 90° en fase aguda de la lesión', TRUE),

  ('Press de Hombro con Banda Ligera',
   '1. De pie, pisa la banda y agarra los extremos a la altura de los hombros.
    ' || CHR(10) || '2. Con los codos ligeramente adelantados, empuja hacia arriba extendiendo los brazos.
    ' || CHR(10) || '3. Sube de forma lenta y controlada sin arquear la espalda.
    ' || CHR(10) || '4. Baja lentamente hasta la posición inicial.',
   12, 50, 'rehab_hombro', 'Solo en fase avanzada de rehabilitación y sin dolor previo', TRUE),

  ('Retracción Escapular con Banda',
   '1. Fija la banda frente a ti a la altura del pecho y agarra un extremo con cada mano.
    ' || CHR(10) || '2. Con los codos ligeramente doblados, jala la banda hacia atrás llevando los omóplatos juntos.
    ' || CHR(10) || '3. Mantén la contracción 2-3 segundos.
    ' || CHR(10) || '4. Regresa lentamente al inicio.
    ' || CHR(10) || '5. Mantén los hombros alejados de las orejas.',
   15, 40, 'rehab_hombro', 'Mantén hombros bajos; no encojas el cuello', TRUE),

  ('Wall Slides',
   '1. Párate de espaldas a la pared con la espalda y la zona lumbar bien apoyadas.
    ' || CHR(10) || '2. Eleva los brazos doblados a 90° con los codos y las muñecas tocando la pared.
    ' || CHR(10) || '3. Desliza los brazos lentamente hacia arriba manteniéndolos en contacto con la pared.
    ' || CHR(10) || '4. Sube hasta donde puedas sin perder el contacto.
    ' || CHR(10) || '5. Baja lentamente y repite.',
   10, 50, 'rehab_hombro', 'La espalda baja y los brazos deben permanecer en contacto con la pared', TRUE),

  -- REHAB RODILLA (IDs 44-50)
  ('Extensión de Rodilla en Silla',
   '1. Siéntate en una silla con los pies colgando.
    ' || CHR(10) || '2. Contrae el cuádriceps y eleva lentamente una pierna hasta casi extenderla.
    ' || CHR(10) || '3. Mantén 2 segundos con la pierna extendida.
    ' || CHR(10) || '4. Baja lentamente sin llegar a apoyar el pie.
    ' || CHR(10) || '5. Cambia de pierna al terminar las repeticiones.',
   15, 45, 'rehab_rodilla', 'Movimiento lento; no bloquees la rodilla al extender', TRUE),

  ('Mini Sentadilla (0-45°)',
   '1. Párate con los pies a la altura de los hombros y los brazos extendidos al frente para equilibrio.
    ' || CHR(10) || '2. Dobla las rodillas lentamente bajando solo 30-45°.
    ' || CHR(10) || '3. Mantén el pecho arriba y las rodillas alineadas con los pies.
    ' || CHR(10) || '4. Regresa a la posición de pie empujando con los talones.
    ' || CHR(10) || '5. No sobrepasar los 45° en la fase inicial de rehab.',
   12, 50, 'rehab_rodilla', 'No pasar de 45° de flexión en la fase inicial', TRUE),

  ('Paso Lateral con Banda',
   '1. Coloca la banda elástica por encima de los tobillos o las rodillas.
    ' || CHR(10) || '2. Dobla ligeramente las rodillas en posición atlética.
    ' || CHR(10) || '3. Da pasos laterales hacia la derecha manteniendo tensión en la banda.
    ' || CHR(10) || '4. Haz el mismo número de pasos hacia la izquierda.
    ' || CHR(10) || '5. Mantén las rodillas alineadas con los pies en todo momento.',
   12, 45, 'rehab_rodilla', 'No dejes que las rodillas colapsen hacia adentro', TRUE),

  ('Curl Femoral en Decúbito',
   '1. Acuéstate boca abajo con las piernas extendidas.
    ' || CHR(10) || '2. Coloca un tobillera o usa la máquina de curl si está disponible.
    ' || CHR(10) || '3. Dobla lentamente las rodillas llevando los talones hacia los glúteos.
    ' || CHR(10) || '4. Mantén 1-2 segundos en la cima.
    ' || CHR(10) || '5. Baja lentamente hasta casi extender las piernas.',
   15, 40, 'rehab_rodilla', 'Detente si sientes dolor en la articulación de la rodilla', TRUE),

  ('Step Up Controlado',
   '1. Colócate frente a un escalón o plataforma de 15-20 cm.
    ' || CHR(10) || '2. Sube un pie al escalón y empuja con ese talón para subir el cuerpo.
    ' || CHR(10) || '3. Lleva el otro pie al escalón de forma controlada.
    ' || CHR(10) || '4. Baja el pie inicial muy lentamente hacia el suelo.
    ' || CHR(10) || '5. Alterna el pie que inicia el movimiento.',
   10, 55, 'rehab_rodilla', 'Escalón bajo (15-20 cm) y bajar siempre de forma muy lenta', TRUE),

  ('Estiramiento de Isquiotibiales en Pared',
   '1. Acuéstate boca arriba cerca de una pared.
    ' || CHR(10) || '2. Eleva una pierna y apoya el talón en la pared.
    ' || CHR(10) || '3. Estira la pierna lo más posible sin que el dolor sea intenso.
    ' || CHR(10) || '4. Mantén la posición 20-30 segundos.
    ' || CHR(10) || '5. Baja la pierna lentamente y cambia de lado.',
   10, 40, 'rehab_rodilla', 'Sin rebotes; mantén la posición de forma pasiva y relajada', TRUE),

  ('Terminal Knee Extension (TKE) con Banda',
   '1. Fija la banda a la altura de la corva desde un punto fijo.
    ' || CHR(10) || '2. De pie, coloca la corva de una pierna contra la banda.
    ' || CHR(10) || '3. Dobla ligeramente la rodilla y luego extiéndela completamente contrayendo el cuádriceps.
    ' || CHR(10) || '4. Mantén la extensión 1-2 segundos.
    ' || CHR(10) || '5. Dobla nuevamente y repite sin mover la cadera.',
   15, 45, 'rehab_rodilla', 'Extensión completa pero sin bloqueo forzado de la rodilla', TRUE),

  -- REHAB ESPALDA (IDs 51-57)
  ('Cat-Cow (Gato-Vaca)',
   '1. Colócate en cuadrupedia con manos bajo los hombros y rodillas bajo las caderas.
    ' || CHR(10) || '2. Inhala y deja caer el abdomen hacia el suelo arqueando la espalda (posición vaca).
    ' || CHR(10) || '3. Exhala y redondea la espalda llevando el ombligo hacia arriba (posición gato).
    ' || CHR(10) || '4. Realiza el movimiento de forma lenta y fluida coordinando con la respiración.',
   12, 45, 'rehab_espalda', 'Respiración coordinada con el movimiento en todo momento', TRUE),

  ('Bird Dog',
   '1. Colócate en cuadrupedia con espalda neutral.
    ' || CHR(10) || '2. Simultáneamente extiende el brazo derecho hacia adelante y la pierna izquierda hacia atrás.
    ' || CHR(10) || '3. Mantén la cadera nivelada y el abdomen contraído durante 3-5 segundos.
    ' || CHR(10) || '4. Regresa al inicio de forma controlada.
    ' || CHR(10) || '5. Alterna con el brazo izquierdo y la pierna derecha.',
   10, 50, 'rehab_espalda', 'No rotar la cadera; mantenerla nivelada en todo momento', TRUE),

  ('Puente de Glúteos (Rehab Espalda)',
   '1. Acuéstate boca arriba con rodillas dobladas y pies apoyados cerca de los glúteos.
    ' || CHR(10) || '2. Contrae el abdomen y los glúteos.
    ' || CHR(10) || '3. Eleva las caderas lentamente hasta formar una línea recta hombros-caderas-rodillas.
    ' || CHR(10) || '4. Mantén 2-3 segundos en la cima.
    ' || CHR(10) || '5. Baja lentamente vértebra por vértebra.',
   15, 45, 'rehab_espalda', 'No hiperextiendas la zona lumbar en el punto más alto', TRUE),

  ('Plancha Modificada (Rodillas)',
   '1. Apóyate en los antebrazos y las rodillas en el suelo.
    ' || CHR(10) || '2. Eleva las caderas formando una línea recta desde rodillas hasta hombros.
    ' || CHR(10) || '3. Contrae el abdomen y mantén la posición el tiempo indicado.
    ' || CHR(10) || '4. Respira de forma constante sin contener el aire.
    ' || CHR(10) || '5. No dejes caer las caderas ni elevarlas.',
   0, 30, 'rehab_espalda', 'Mantén la alineación cabeza-hombros-caderas-rodillas', TRUE),

  ('Remo con Banda (Rehab Espalda)',
   '1. Fija la banda frente a ti a la altura del pecho.
    ' || CHR(10) || '2. Siéntate o párate con el torso erguido y agarra la banda.
    ' || CHR(10) || '3. Jala la banda hacia el abdomen llevando los codos hacia atrás.
    ' || CHR(10) || '4. Aprieta los omóplatos al final del movimiento durante 2 segundos.
    ' || CHR(10) || '5. Regresa lentamente al inicio.',
   15, 45, 'rehab_espalda', 'No encorvar los hombros; retrae siempre las escápulas al finalizar', TRUE),

  ('Estiramiento de Piriforme',
   '1. Acuéstate boca arriba con las rodillas dobladas.
    ' || CHR(10) || '2. Cruza el tobillo derecho sobre la rodilla izquierda.
    ' || CHR(10) || '3. Agarra el muslo izquierdo y jala ambas piernas hacia el pecho.
    ' || CHR(10) || '4. Mantén la posición 20-30 segundos sintiendo el estiramiento en el glúteo.
    ' || CHR(10) || '5. Cambia de lado.',
   10, 40, 'rehab_espalda', 'Sin rebotes; estiramiento pasivo y relajado', TRUE),

  ('Marcha en Decúbito Supino',
   '1. Acuéstate boca arriba con las rodillas dobladas y los pies en el suelo.
    ' || CHR(10) || '2. Contrae el abdomen presionando la zona lumbar contra el suelo.
    ' || CHR(10) || '3. Eleva lentamente una rodilla hacia el pecho.
    ' || CHR(10) || '4. Baja ese pie y eleva la rodilla contraria.
    ' || CHR(10) || '5. Alterna de forma lenta manteniendo la lumbar pegada al suelo.',
   15, 45, 'rehab_espalda', 'La zona lumbar debe permanecer pegada al suelo en todo momento', TRUE);

-- ── Multimedia ────────────────────────────────────────────────
-- Los IDs de ejercicio aquí coinciden con el orden real del INSERT anterior.
-- IMPORTANTE: el seed original tenía multimedia mal referenciada (core/cardio/rehab
-- usaban IDs 13-24 en multimedia pero los ejercicios reales son 20-31).
-- Esta versión tiene todos los IDs corregidos.

INSERT INTO multimedia (id_multimedia, id_ejercicio, tipo, url_archivo) VALUES
  -- PECHO (1-4)
  ('vid_press_banca',          1,  'youtube', 'https://youtu.be/TAH8RxOS0VI'),
  ('vid_flexiones',            2,  'youtube', 'https://youtube.com/shorts/YXI_V2sIO_Y'),
  ('vid_press_inclinado',      3,  'youtube', 'https://youtu.be/PAd6ezGbDUQ'),
  ('vid_aperturas_mancuernas', 4,  'youtube', 'https://youtu.be/OrlXQdNwNwM'),

  -- ESPALDA (5-8)
  ('vid_dominadas',            5,  'youtube', 'https://youtube.com/shorts/BT3CSQKeEww'),
  ('vid_remo_barra',           6,  'youtube', 'https://youtube.com/shorts/sr_U0jBE89A'),
  ('vid_peso_muerto',          7,  'youtube', 'https://youtu.be/0XL4cZR2Ink'),
  ('vid_remo_polea_baja',      8,  'youtube', 'https://youtu.be/iOkQnxUD3no'),

  -- PIERNAS (9-12)
  ('vid_sentadillas',          9,  'youtube', 'https://youtu.be/BjixzWEw4EY'),
  ('vid_zancadas',             10, 'youtube', 'https://youtu.be/uqvt79Uh4o4'),
  ('vid_prensa_piernas',       11, 'youtube', 'https://youtu.be/xvCynwyNoP4'),
  ('vid_curl_femoral',         12, 'youtube', 'https://youtu.be/kmtn5RJkvVE'),

  -- HOMBROS (13-15)
  ('vid_press_militar',        13, 'youtube', 'https://youtu.be/2yjwXTZQDDI'),
  ('vid_elev_laterales',       14, 'youtube', 'https://youtu.be/3VcKaXpzqRo'),
  ('vid_elev_frontales',       15, 'youtube', 'https://youtu.be/sOkBxSWABSk'),

  -- BRAZOS (16-19)
  ('vid_curl_biceps',          16, 'youtube', 'https://youtu.be/ykJmrZ5v0Oo'),
  ('vid_curl_martillo',        17, 'youtube', 'https://youtu.be/TwD-YGVP4Bk'),
  ('vid_ext_triceps_polea',    18, 'youtube', 'https://youtu.be/2-LAMcpzODU'),
  ('vid_fondos_paralelas',     19, 'youtube', 'https://youtu.be/dX_nXpXZejo'),

  -- CORE (20-23)
  ('vid_plancha',              20, 'youtube', 'https://youtube.com/shorts/3AM7L2k7BEw'),
  ('vid_crunch_abdominal',     21, 'youtube', 'https://youtube.com/shorts/AYbEbEGdph4'),
  ('vid_russian_twist',        22, 'youtube', 'https://youtube.com/shorts/_BguOZw55-c'),
  ('vid_elevacion_piernas',    23, 'youtube', 'https://youtu.be/mSejp5qK1pc'),

  -- CARDIO (24-27)
  ('vid_correr',               24, 'youtube', NULL),
  ('vid_burpees',              25, 'youtube', 'https://youtube.com/shorts/EkK3oVBA__Q'),
  ('vid_saltar_cuerda',        26, 'youtube', 'https://youtube.com/shorts/BJiWQxBwJ0I'),
  ('vid_mountain_climbers',    27, 'youtube', 'https://youtube.com/shorts/Fb79R7IUwYE'),

  -- REHABILITACIÓN GENERAL (28-31)
  ('vid_elev_pierna_recta',    28, 'youtube', 'https://youtu.be/l4kQd9eWclE'),
  ('vid_puente_gluteos_r',     29, 'youtube', 'https://youtu.be/wPM8icPu6H8'),
  ('vid_retraccion_escapular', 30, 'youtube', 'https://youtu.be/z5cqL4vm9iE'),
  ('vid_movilidad_tobillo',    31, 'youtube', 'https://youtu.be/ldyHBZyFMDQ'),

  -- MOVILIDAD / ADULTO MAYOR (32-36)
  ('vid_rotacion_cuello',      32, 'youtube', 'https://youtu.be/3K0OC7gEpzc'),
  ('vid_movilidad_hombros',    33, 'youtube', 'https://youtu.be/BdMTSKyQREE'),
  ('vid_flex_ext_rodillas',    34, 'youtube', 'https://youtu.be/iGFVoXFbgOo'),
  ('vid_caminata_suave',       35, 'youtube', NULL),
  ('vid_elev_talones',         36, 'youtube', 'https://youtu.be/YfqvKYSNxFo'),

  -- REHAB HOMBRO (37-43)
  ('vid_rot_interna_banda',    37, 'youtube', 'https://youtu.be/GJNKMhCpBLI'),
  ('vid_rot_externa_banda',    38, 'youtube', 'https://youtu.be/0Dny9AkVTxE'),
  ('vid_pendulares_codman',    39, 'youtube', 'https://youtu.be/kEBDa7XjBiU'),
  ('vid_elev_frontal_banda',   40, 'youtube', 'https://youtu.be/sOkBxSWABSk'),
  ('vid_press_hombro_banda',   41, 'youtube', 'https://youtu.be/B-aVuyhvLHU'),
  ('vid_retrac_escap_banda',   42, 'youtube', 'https://youtu.be/z5cqL4vm9iE'),
  ('vid_wall_slides',          43, 'youtube', 'https://youtu.be/bO4RoMEfHpk'),

  -- REHAB RODILLA (44-50)
  ('vid_ext_rodilla_silla',    44, 'youtube', 'https://youtu.be/YyvNsHFCvOs'),
  ('vid_mini_sentadilla',      45, 'youtube', 'https://youtu.be/aclHkVaku9U'),
  ('vid_paso_lateral_banda',   46, 'youtube', 'https://youtu.be/Qi9NGoKyTn4'),
  ('vid_curl_femoral_dec',     47, 'youtube', 'https://youtu.be/1Tq3QdYUuHs'),
  ('vid_step_up_controlado',   48, 'youtube', 'https://youtu.be/dQqApCGd5Ss'),
  ('vid_estir_isquiotibiales', 49, 'youtube', 'https://youtu.be/VseLWMSGCtk'),
  ('vid_tke_banda',            50, 'youtube', 'https://youtu.be/VePpQ1BZWOM'),

  -- REHAB ESPALDA (51-57)
  ('vid_cat_cow',              51, 'youtube', 'https://youtu.be/kqnua4rHVVA'),
  ('vid_bird_dog',             52, 'youtube', 'https://youtu.be/wiFNA3sqjCA'),
  ('vid_puente_glut_espalda',  53, 'youtube', 'https://youtu.be/wPM8icPu6H8'),
  ('vid_plancha_modificada',   54, 'youtube', 'https://youtu.be/FbcTOqhqbSA'),
  ('vid_remo_banda_espalda',   55, 'youtube', 'https://youtu.be/xQNrFHEMhI4'),
  ('vid_estir_piriforme',      56, 'youtube', 'https://youtu.be/4v4NXXsDrFY'),
  ('vid_marcha_decubito',      57, 'youtube', 'https://youtu.be/Ke6t4yNODBA');

-- ── Rutinas ───────────────────────────────────────────────────
INSERT INTO rutinas (nombre_rutina, descripcion, nivel, duracion_estimada, categoria, creado_por) VALUES
  ('Principiantes - Cuerpo Completo', 'Rutina ideal para personas que inician en el gimnasio. 3 veces por semana.', 'beginner',     45, 'fuerza',     4),
  ('Intermedio - Push Pull Legs',     'Rutina dividida en empuje, tirón y piernas. 6 días a la semana.',           'intermediate', 60, 'fuerza',     4),
  ('Avanzado - Hipertrofia',          'Rutina enfocada en ganancia muscular. 5 días a la semana.',                 'advanced',     75, 'hipertrofia',4),
  ('HIIT 20 Minutos',                 'Entrenamiento de alta intensidad para quemar grasa.',                       'intermediate', 20, 'cardio',     4),
  ('Core y Abdomen',                  'Rutina específica para fortalecer el core.',                                'beginner',     30, 'core',       4);

-- ── Rutina_Ejercicios ─────────────────────────────────────────
-- Rutina 1: Principiantes - Cuerpo Completo
INSERT INTO rutina_ejercicio (id_rutina, orden, id_ejercicio, repeticiones, duracion_segundos) VALUES
  (1, 1,  2, 12,   NULL),  -- Flexiones
  (1, 2,  9, 10,   NULL),  -- Sentadillas
  (1, 3,  6, 10,   NULL),  -- Remo con Barra
  (1, 4, 13, 10,   NULL),  -- Press Militar
  (1, 5, 20, NULL, 45),    -- Plancha
  (1, 6, 21, 15,   NULL);  -- Abdominales Crunch

-- Rutina 2: Push (Empuje)
INSERT INTO rutina_ejercicio (id_rutina, orden, id_ejercicio, repeticiones, duracion_segundos) VALUES
  (2, 1,  1,  8,   NULL),  -- Press de Banca
  (2, 2,  3, 10,   NULL),  -- Press Inclinado
  (2, 3, 13, 10,   NULL),  -- Press Militar
  (2, 4, 14, 12,   NULL),  -- Elevaciones Laterales
  (2, 5, 18, 12,   NULL);  -- Extensiones Tríceps

-- Rutina 3: Avanzado - Día de Pecho
INSERT INTO rutina_ejercicio (id_rutina, orden, id_ejercicio, repeticiones, duracion_segundos) VALUES
  (3, 1,  1,  6,   NULL),  -- Press de Banca (pesado)
  (3, 2,  3, 10,   NULL),  -- Press Inclinado
  (3, 3,  4, 12,   NULL),  -- Aperturas
  (3, 4,  2, 15,   NULL),  -- Flexiones
  (3, 5, 19, 10,   NULL);  -- Fondos en Paralelas

-- Rutina 4: HIIT
INSERT INTO rutina_ejercicio (id_rutina, orden, id_ejercicio, repeticiones, duracion_segundos) VALUES
  (4, 1, 25, 20,   NULL),  -- Burpees
  (4, 2, 27, 30,   NULL),  -- Mountain Climbers
  (4, 3, 10, 20,   NULL),  -- Zancadas
  (4, 4,  2, 20,   NULL),  -- Flexiones
  (4, 5, 26, NULL, 120);   -- Saltar la Cuerda

-- Rutina 5: Core y Abdomen
INSERT INTO rutina_ejercicio (id_rutina, orden, id_ejercicio, repeticiones, duracion_segundos) VALUES
  (5, 1, 20, NULL, 60),    -- Plancha
  (5, 2, 21, 25,   NULL),  -- Abdominales Crunch
  (5, 3, 22, 30,   NULL),  -- Russian Twist
  (5, 4, 23, 20,   NULL),  -- Elevación de Piernas
  (5, 5, 20, NULL, 45);    -- Plancha (vuelta)

-- ── Historial_Progreso ────────────────────────────────────────
INSERT INTO historial_progreso (id_rutina, id_usuario, fecha, duracion_real, estado, notas) VALUES
  (1, 2, CURRENT_DATE - INTERVAL '7 days', 48, 'completado', 'Primera semana, me costó pero lo terminé'),
  (1, 2, CURRENT_DATE - INTERVAL '5 days', 45, 'completado', 'Mucho mejor que la primera vez'),
  (1, 2, CURRENT_DATE - INTERVAL '3 days', 43, 'completado', 'Aumenté peso en sentadillas'),
  (1, 3, CURRENT_DATE - INTERVAL '2 days', 50, 'completado', 'Excelente rutina para principiantes'),
  (4, 2, CURRENT_DATE - INTERVAL '1 day',  22, 'completado', 'HIIT brutal pero efectivo');

-- ── Reseñas ───────────────────────────────────────────────────
INSERT INTO resenas (id_usuario, id_rutina, calificacion, comentario, fecha_resena) VALUES
  (2, 1, 5, 'Excelente rutina para empezar. Muy bien explicada.',            CURRENT_DATE - INTERVAL '5 days'),
  (3, 1, 5, 'Perfecta para principiantes como yo. La recomiendo 100%',       CURRENT_DATE - INTERVAL '2 days'),
  (2, 4, 4, 'HIIT muy intenso pero efectivo. Me ayudó a quemar grasa.',      CURRENT_DATE - INTERVAL '1 day'),
  (3, 5, 5, 'Mi core nunca había estado tan fuerte. Rutina perfecta.',       CURRENT_DATE);

-- ── Perfil Médico ─────────────────────────────────────────────
INSERT INTO perfil_medico (id_usuario, condiciones_fisicas, lesiones, limitaciones, cifrado_hash) VALUES
  (3,
   '["Asma leve controlada"]'::jsonb,
   '["Esguince de tobillo hace 2 años (recuperado)"]'::jsonb,
   '["Evitar ejercicios de alto impacto prolongados"]'::jsonb,
   'hash-placeholder-123');

-- ── Auditoría ─────────────────────────────────────────────────
INSERT INTO auditoria_admin (id_admin, accion, entidad_afectada, descripcion) VALUES
  (1, 'CREAR_EJERCICIO', 'ejercicios', 'Se creó el ejercicio "Press de Banca"'),
  (1, 'CREAR_RUTINA',    'rutinas',    'Se creó la rutina "Principiantes - Cuerpo Completo"'),
  (1, 'MODIFICAR_USUARIO','usuarios',  'Se confirmó el email del usuario ID 2');