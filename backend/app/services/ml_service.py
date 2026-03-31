import os
import joblib
import pandas as pd
from typing import Dict, Any

class MLService:
    def __init__(self):
        self.model = None
        # La ruta del modelo asumimos que estará en app/ml/
        current_dir = os.path.dirname(os.path.abspath(__file__))
        self.model_path = os.path.join(current_dir, "..", "ml", "cart_routine_model.pkl")

    def load_model(self):
        if os.path.exists(self.model_path):
            try:
                self.model = joblib.load(self.model_path)
                print(f"Modelo CART cargado correctamente para inferencias.")
            except Exception as e:
                print(f"Error cargando modelo CART: {e}")
        else:
            print(f"Advertencia: Modelo no encontrado en {self.model_path}.")
            
    def predict_routine_path(self, edad: int, nivel_fisico: str, objetivo_principal: str, tiene_lesion: int) -> str:
        """
        Realiza la inferencia utilizando el pipeline de Scikit-Learn.
        Retorna una de las 4 rutas: 'Adulto Mayor', 'Rehabilitación', 'Fuerza/Joven', 'Híbrido'
        """
        if not self.model:
            self.load_model()
            
        if not self.model:
            # Fallback seguro por si el modelo no está entrenado (Cold-Start en producción antes de correr script)
            if edad >= 65: return "Adulto Mayor"
            if tiene_lesion == 1: return "Rehabilitación"
            return "Híbrido"
            
        # Preparar la data estructural para Scikit-Learn Pipeline
        user_data = {
            "edad": [edad],
            "nivel_fisico": [nivel_fisico],
            "objetivo_principal": [objetivo_principal],
            "tiene_lesion": [tiene_lesion]
        }
        
        df = pd.DataFrame(user_data)
        
        # Inferencia rapida (sub 10ms normalmente con CART)
        try:
            prediction = self.model.predict(df)
            return prediction[0]
        except Exception as e:
            print(f"Error de inferencia: {e}")
            return "Híbrido" # Safe Default

ml_service = MLService()
