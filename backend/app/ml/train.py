import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
import joblib
import os

def train_and_save_model(data_path: str, model_path: str):
    print(f"Cargando conjunto de datos desde {data_path}...")
    df = pd.read_csv(data_path)
    
    # Separación de características (X) y objetivo (y)
    X = df.drop(columns=['ruta'])
    y = df['ruta']
    
    # Procesamiento para características categóricas
    categorical_features = ['nivel_fisico', 'objetivo_principal']
    categorical_transformer = OneHotEncoder(handle_unknown='ignore')
    
    preprocessor = ColumnTransformer(
        transformers=[
            ('cat', categorical_transformer, categorical_features)
        ],
        remainder='passthrough' # 'edad' y 'tiene_lesion' pasan directo
    )
    
    # Construcción de pipeline con el modelo CART (Random Seed para reproducibilidad)
    # Usamos class_weight='balanced' para compensar desequilibrios en la generación
    # Limitamos max_depth a 4 para prevenir subórdenes muy especializadas (overfitting) que ignorarían a la mayoría de la base
    pipeline = Pipeline(steps=[
        ('preprocessor', preprocessor),
        ('classifier', DecisionTreeClassifier(max_depth=4, random_state=42, class_weight='balanced'))
    ])
    
    # Segmentación
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    print("Entrenando el modelo CART...")
    pipeline.fit(X_train, y_train)
    
    # Métricas sencillas
    acc = pipeline.score(X_test, y_test)
    print(f"Exactitud del modelo en el test set: {acc:.2f}")
    
    # Exportar serialización en Joblib (.pkl)
    os.makedirs(os.path.dirname(model_path), exist_ok=True)
    joblib.dump(pipeline, model_path)
    print(f"Modelo CART guardado con éxito en: {model_path}")

if __name__ == "__main__":
    current_dir = os.path.dirname(os.path.abspath(__file__))
    data_file = os.path.join(current_dir, "dataset_entrenamiento.csv")
    model_file = os.path.join(current_dir, "cart_routine_model.pkl")
    
    if not os.path.exists(data_file):
        print(f"No se encontró {data_file}. Ejecuta data_generator.py primero.")
    else:
        train_and_save_model(data_file, model_file)
