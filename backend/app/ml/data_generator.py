import pandas as pd
import numpy as np
import random
import os

def generate_profile():
    edad = random.randint(18, 85)
    
    # La probabilidad de lesión aumenta con la edad o factores externos
    prob_lesion = 0.1
    if edad > 50: prob_lesion += 0.2
    if edad > 70: prob_lesion += 0.2
    tiene_lesion = 1 if random.random() < prob_lesion else 0
    
    # Determinar el nivel físico basado parcialmente en la edad
    niveles = ['sedentario', 'ligero', 'moderado', 'intenso']
    if edad > 65:
        nivel_fisico = random.choices(niveles, weights=[0.6, 0.2, 0.1, 0.1])[0]
    else:
        nivel_fisico = random.choices(niveles, weights=[0.3, 0.3, 0.3, 0.1])[0]
        
    # Asignar el objetivo principal basado en sus características
    if tiene_lesion:
        objetivos = ['Salud/Movilidad', 'Rehabilitación', 'Fuerza/Hipertrofia', 'Resistencia/Deporte']
        pesos = [0.3, 0.6, 0.05, 0.05]
        objetivo_principal = random.choices(objetivos, weights=pesos)[0]
    elif edad > 60:
        objetivos = ['Salud/Movilidad', 'Rehabilitación', 'Fuerza/Hipertrofia', 'Resistencia/Deporte']
        pesos = [0.8, 0.1, 0.05, 0.05]
        objetivo_principal = random.choices(objetivos, weights=pesos)[0]
    else:
        objetivos = ['Salud/Movilidad', 'Rehabilitación', 'Fuerza/Hipertrofia', 'Resistencia/Deporte']
        pesos = [0.2, 0.05, 0.5, 0.25]
        objetivo_principal = random.choices(objetivos, weights=pesos)[0]
        
    # Asignar la Ruta (Variable Objetivo/Target) basándonos en reglas heurísticas de fisioterapia
    ruta = ""
    
    if objetivo_principal == 'Rehabilitación' and tiene_lesion == 1:
        ruta = 'Rehabilitación'
    elif edad >= 65 and nivel_fisico == 'sedentario':
        # Adultos mayores sin experiencia -> Rutinas de bajo impacto articular
        ruta = 'Adulto Mayor'
    elif edad >= 65 and nivel_fisico in ['ligero', 'moderado', 'intenso'] and not tiene_lesion:
        # Adulto mayor en forma puede hacer entrenamiento combinado
        ruta = 'Híbrido'
    elif edad >= 65:
        ruta = 'Adulto Mayor'
    elif objetivo_principal == 'Fuerza/Hipertrofia' and tiene_lesion == 0:
        # Jóvenes o adultos sanos buscando masa muscular o de fuerza
        ruta = 'Fuerza/Joven'
    elif objetivo_principal == 'Resistencia/Deporte' and tiene_lesion == 0:
        # Atletas o personas buscando resistencia cardiovascular y de fuerza funcional
        ruta = 'Híbrido'
    elif tiene_lesion == 1:
        # Persona joven/adulta con lesión, pero sin requerir rehabilitación per se -> rutina más suave
        ruta = 'Rehabilitación' if random.random() < 0.6 else 'Híbrido'
    elif objetivo_principal == 'Salud/Movilidad':
        # Persona común buscando salud, sedentarismo
        ruta = 'Híbrido'
    else:
        # Catch-all
        ruta = 'Híbrido'
        
    return {
        "edad": edad,
        "nivel_fisico": nivel_fisico,
        "objetivo_principal": objetivo_principal,
        "tiene_lesion": tiene_lesion,
        "ruta": ruta
    }

def generate_dataset(num_samples: int = 5000, output_path: str = "dataset.csv"):
    print(f"Generando {num_samples} perfiles realistas de entrenamiento...")
    data = [generate_profile() for _ in range(num_samples)]
    df = pd.DataFrame(data)
    
    # Asegurar el directorio
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    
    df.to_csv(output_path, index=False)
    print(f"Dataset generado exitosamente en: {output_path}")
    print("\nDistribución de las Clases Generadas:")
    print(df['ruta'].value_counts(normalize=True))

if __name__ == "__main__":
    current_dir = os.path.dirname(os.path.abspath(__file__))
    output_file = os.path.join(current_dir, "dataset_entrenamiento.csv")
    generate_dataset(5000, output_file)
