import pandas as pd
import numpy as np
import random
import os

# ── Catálogos (coinciden exactamente con el frontend/backend) ────────────────

LESIONES     = ['Rodilla', 'Espalda', 'Hombro']
CONDICIONES  = ['Hipertension', 'Asma', 'Diabetes', 'Artritis']
LIMITACIONES = ['Impacto', 'Carga']

# ── Targets ──────────────────────────────────────────────────────────────────
# ruta_principal: entrenamiento base del usuario
RUTAS_PRINCIPAL = [
    'Fuerza/Hipertrofia',   # objetivo muscular/fuerza
    'Resistencia',          # cardio, deporte, funcional
    'Salud/Movilidad',      # salud general, movilidad, flexibilidad
    'Bajo Impacto',         # limitaciones físicas sin rehab completa
    'Adulto Mayor',         # edad >= 65 con poca capacidad
]

# ruta_rehab: rehabilitación paralela (None si no aplica)
RUTAS_REHAB = [
    'Rehab_Hombro',
    'Rehab_Rodilla',
    'Rehab_Espalda',
    None,
]


# ── Generador de perfil ───────────────────────────────────────────────────────

def generate_profile():
    edad = random.randint(18, 85)

    # ── Lesiones ──────────────────────────────────────────────────────────────
    prob_lesion = 0.10
    if edad > 50: prob_lesion += 0.15
    if edad > 70: prob_lesion += 0.15

    tiene_lesion = random.random() < prob_lesion

    lesiones = []
    if tiene_lesion:
        num_lesiones = random.choices([1, 2], weights=[0.75, 0.25])[0]
        lesiones = random.sample(LESIONES, k=min(num_lesiones, len(LESIONES)))

    # ── Condiciones médicas ───────────────────────────────────────────────────
    condiciones = []
    prob_cond_base = 0.08
    if edad > 45: prob_cond_base += 0.10
    if edad > 65: prob_cond_base += 0.15

    for condicion in CONDICIONES:
        prob = prob_cond_base
        if condicion == 'Artritis' and edad > 55:
            prob += 0.15
        if condicion in ('Diabetes', 'Hipertension') and edad > 40:
            prob += 0.08
        if random.random() < prob:
            condiciones.append(condicion)

    # Artritis puede generar lesión articular retroactivamente
    if 'Artritis' in condiciones and not tiene_lesion:
        if random.random() < 0.35:
            tiene_lesion = True
            lesiones = random.sample(['Rodilla', 'Hombro'], k=1)

    # ── Limitaciones (derivadas de lesiones y condiciones) ────────────────────
    limitaciones = []

    prob_impacto = 0.0
    if 'Rodilla' in lesiones:      prob_impacto += 0.60
    if 'Artritis' in condiciones:  prob_impacto += 0.35
    if 'Diabetes' in condiciones:  prob_impacto += 0.15
    if edad > 65:                  prob_impacto += 0.20
    if random.random() < min(prob_impacto, 0.95):
        limitaciones.append('Impacto')

    prob_carga = 0.0
    if 'Espalda' in lesiones:     prob_carga += 0.70
    if 'Hombro' in lesiones:      prob_carga += 0.55
    if 'Artritis' in condiciones: prob_carga += 0.20
    if random.random() < min(prob_carga, 0.95):
        limitaciones.append('Carga')

    # ── Nivel físico ──────────────────────────────────────────────────────────
    niveles = ['sedentario', 'ligero', 'moderado', 'intenso']
    if edad > 65:
        pesos_nivel = [0.55, 0.25, 0.15, 0.05]
    elif tiene_lesion:
        pesos_nivel = [0.20, 0.40, 0.30, 0.10]
    else:
        pesos_nivel = [0.25, 0.30, 0.30, 0.15]
    nivel_fisico = random.choices(niveles, weights=pesos_nivel)[0]

    # ── Objetivo principal ────────────────────────────────────────────────────
    objetivos = ['Salud/Movilidad', 'Rehabilitación', 'Fuerza/Hipertrofia', 'Resistencia/Deporte']

    if tiene_lesion:
        pesos_obj = [0.25, 0.45, 0.20, 0.10]
    elif edad > 60:
        pesos_obj = [0.75, 0.10, 0.10, 0.05]
    elif 'Asma' in condiciones:
        pesos_obj = [0.35, 0.05, 0.40, 0.20]
    else:
        pesos_obj = [0.20, 0.05, 0.50, 0.25]

    objetivo_principal = random.choices(objetivos, weights=pesos_obj)[0]

    # ── Asignar los dos targets ───────────────────────────────────────────────
    ruta_principal, ruta_rehab = _assign_rutas(
        edad=edad,
        nivel_fisico=nivel_fisico,
        objetivo_principal=objetivo_principal,
        tiene_lesion=tiene_lesion,
        lesiones=lesiones,
        condiciones=condiciones,
        limitaciones=limitaciones,
    )

    return {
        # ── Features ──────────────────────────────────────────────────────────
        "edad": edad,
        "nivel_fisico": nivel_fisico,
        "objetivo_principal": objetivo_principal,
        "lesion_rodilla":     int('Rodilla'      in lesiones),
        "lesion_espalda":     int('Espalda'      in lesiones),
        "lesion_hombro":      int('Hombro'       in lesiones),
        "cond_hipertension":  int('Hipertension' in condiciones),
        "cond_asma":          int('Asma'         in condiciones),
        "cond_diabetes":      int('Diabetes'     in condiciones),
        "cond_artritis":      int('Artritis'     in condiciones),
        "limit_impacto":      int('Impacto'      in limitaciones),
        "limit_carga":        int('Carga'        in limitaciones),
        # ── Targets ───────────────────────────────────────────────────────────
        "ruta_principal": ruta_principal,
        "ruta_rehab":     ruta_rehab if ruta_rehab else "None",
    }


def _assign_rutas(
    edad, nivel_fisico, objetivo_principal,
    tiene_lesion, lesiones, condiciones, limitaciones
) -> tuple:
    """
    Retorna (ruta_principal, ruta_rehab).

    Principio central:
      - La lesión NO bloquea el entrenamiento principal.
      - ruta_rehab cubre solo la zona lesionada en paralelo.
      - ruta_principal refleja el objetivo del usuario, degradada
        solo si las limitaciones físicas lo impiden realmente.

    Ejemplos:
      Hombro lesionado + objetivo Fuerza
        → ruta_principal = 'Fuerza/Hipertrofia'  (entrena todo excepto hombro)
        → ruta_rehab     = 'Rehab_Hombro'

      Rodilla lesionada + objetivo Resistencia
        → ruta_principal = 'Bajo Impacto'         (cardio sin impacto)
        → ruta_rehab     = 'Rehab_Rodilla'

      Espalda lesionada + objetivo Fuerza
        → ruta_principal = 'Fuerza/Hipertrofia'  (tren inferior libre)
        → ruta_rehab     = 'Rehab_Espalda'
    """

    tiene_limit_impacto = 'Impacto' in limitaciones
    tiene_limit_carga   = 'Carga'   in limitaciones
    tiene_artritis      = 'Artritis' in condiciones
    tiene_asma          = 'Asma'    in condiciones
    tiene_diabetes      = 'Diabetes' in condiciones

    # ── 1. Determinar ruta_rehab ──────────────────────────────────────────────
    # Si hay múltiples lesiones, priorizar la más limitante funcionalmente
    ruta_rehab = None

    if tiene_lesion and lesiones:
        if 'Espalda' in lesiones:
            ruta_rehab = 'Rehab_Espalda'
        elif 'Rodilla' in lesiones:
            ruta_rehab = 'Rehab_Rodilla'
        elif 'Hombro' in lesiones:
            ruta_rehab = 'Rehab_Hombro'

    # Artritis severa en adulto mayor sedentario también genera rehab
    if ruta_rehab is None and tiene_artritis and edad >= 60 and nivel_fisico == 'sedentario':
        ruta_rehab = 'Rehab_Rodilla'

    # ── 2. Determinar ruta_principal ──────────────────────────────────────────

    # Adulto Mayor: edad y nivel físico mandan sobre el objetivo declarado
    if edad >= 65 and nivel_fisico in ['sedentario', 'ligero']:
        return 'Adulto Mayor', ruta_rehab

    if edad >= 65:
        if tiene_limit_impacto or tiene_artritis:
            return 'Bajo Impacto', ruta_rehab
        return 'Salud/Movilidad', ruta_rehab

    # Ambas limitaciones activas → Bajo Impacto sin importar el objetivo
    if tiene_limit_impacto and tiene_limit_carga:
        return 'Bajo Impacto', ruta_rehab

    # ── Mapeo objetivo → ruta_principal ──────────────────────────────────────
    # La lesión ya quedó cubierta en ruta_rehab.
    # Aquí solo decidimos qué entrena el resto del cuerpo.

    if objetivo_principal == 'Fuerza/Hipertrofia':
        # Limitación de impacto sola no impide la fuerza (es de tren superior/inferior libre)
        # Solo baja si hay ambas limitaciones (ya cubierto arriba) o artritis severa
        if tiene_artritis and nivel_fisico == 'sedentario':
            return 'Bajo Impacto', ruta_rehab
        return 'Fuerza/Hipertrofia', ruta_rehab

    if objetivo_principal == 'Resistencia/Deporte':
        # Rodilla lesionada o limitación de impacto → cardio de bajo impacto
        if tiene_limit_impacto or 'Rodilla' in lesiones:
            return 'Bajo Impacto', ruta_rehab
        return 'Resistencia', ruta_rehab

    if objetivo_principal == 'Rehabilitación':
        # Usuario quiere rehab: entrenamiento base suave adaptado a su capacidad
        if tiene_limit_impacto or tiene_limit_carga:
            return 'Bajo Impacto', ruta_rehab
        return 'Salud/Movilidad', ruta_rehab

    if objetivo_principal == 'Salud/Movilidad':
        if tiene_limit_impacto:
            return 'Bajo Impacto', ruta_rehab
        return 'Salud/Movilidad', ruta_rehab

    # Catch-all
    return 'Salud/Movilidad', ruta_rehab


# ── Generador de dataset ──────────────────────────────────────────────────────

def generate_dataset(num_samples: int = 5000, output_path: str = "dataset.csv"):
    print(f"Generando {num_samples} perfiles realistas de entrenamiento...")
    data = [generate_profile() for _ in range(num_samples)]
    df = pd.DataFrame(data)

    os.makedirs(os.path.dirname(os.path.abspath(output_path)), exist_ok=True)
    df.to_csv(output_path, index=False)

    print(f"\nDataset generado en: {output_path}")
    print(f"Shape: {df.shape}")

    print("\n── Distribución ruta_principal ──────────────────────────")
    dist = df['ruta_principal'].value_counts()
    pct  = df['ruta_principal'].value_counts(normalize=True).mul(100).round(1)
    for r in dist.index:
        print(f"  {r:<25} {dist[r]:>5}  ({pct[r]}%)")

    print("\n── Distribución ruta_rehab ──────────────────────────────")
    dist2 = df['ruta_rehab'].value_counts()
    pct2  = df['ruta_rehab'].value_counts(normalize=True).mul(100).round(1)
    for r in dist2.index:
        print(f"  {r:<25} {dist2[r]:>5}  ({pct2[r]}%)")

    print("\n── Combinaciones más frecuentes ─────────────────────────")
    combos = (
        df.groupby(['ruta_principal', 'ruta_rehab'])
        .size()
        .sort_values(ascending=False)
        .head(15)
    )
    print(combos.to_string())


if __name__ == "__main__":
    current_dir = os.path.dirname(os.path.abspath(__file__))
    output_file = os.path.join(current_dir, "dataset_entrenamiento.csv")
    generate_dataset(5000, output_file)