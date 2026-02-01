# Configuración del Backend

## Requisitos Previos

- Python 3.10 o superior
- Docker y Docker Compose (opcional pero recomendado)
- PostgreSQL (si se ejecuta localmente sin Docker)
- MongoDB (si se ejecuta localmente sin Docker)

## Instalación Local (Sin Docker)

1. **Clonar el repositorio** y navegar a la carpeta `backend/`:
   ```bash
   cd backend
   ```

2. **Crear un entorno virtual**:
   ```bash
   python -m venv venv
   source venv/bin/activate  # En Linux/Mac
   # .\venv\Scripts\activate # En Windows
   ```

3. **Instalar dependencias**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Variables de Entorno**:
   Copiar el archivo de ejemplo y configurar las credenciales:
   ```bash
   cp .env.example .env
   ```
   Asegúrate de configurar `DATABASE_URL` y `MONGODB_URL` correctamente.

5. **Ejecutar Migraciones (Alembic)**:
   ```bash
   alembic upgrade head
   ```

6. **Iniciar el Servidor**:
   ```bash
   uvicorn app.main:app --reload
   ```
   El servidor estará corriendo en `http://localhost:8000`.

## Ejecución con Docker

Si prefieres usar Docker, simplemente ejecuta desde la raíz del proyecto:

```bash
docker compose up backend
```

Esto levantará el backend junto con las bases de datos necesarias.

## Estructura de Directorios Clave

- `app/main.py`: Punto de entrada de la aplicación.
- `app/core/config.py`: Gestión de configuración y variables de entorno.
- `app/db/`: Configuración de conexiones a PostgreSQL y MongoDB.
- `app/models/`: Modelos ORM de SQLAlchemy.
- `app/schemas/`: Esquemas Pydantic para validación y serialización.
- `app/api/`: Definición de rutas y endpoints.

## Comandos Útiles

- **Crear una nueva migración**:
  ```bash
  alembic revision --autogenerate -m "descripcion_cambio"
  ```
- **Ejecutar tests**:
  ```bash
  pytest
  ```
