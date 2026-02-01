# Guía de Instalación

Esta guía cubre los pasos generales para instalar y ejecutar el proyecto "Modular" en un entorno de desarrollo.

## Opciones de Instalación

Existen dos formas principales de ejecutar el proyecto:

1. **Con Docker (Recomendado)**: Ideal para tener el entorno completo listo en minutos sin instalar dependencias locales.
   - 👉 [Ver Guía de Docker](./docker-setup.md)

2. **Instalación Manual**: Ideal si necesitas control total sobre las herramientas instaladas en tu sistema o estás desarrollando solo en una parte (frontend o backend).

## Instalación Manual

### 1. Clonar el repositorio
```bash
git clone <url-del-repo>
cd Modular
```

### 2. Configurar Backend
Sigue las instrucciones detalladas en:
- 👉 [Configuración del Backend](../backend/setup.md)

Resumen rápido:
1. `cd backend`
2. Crear venv y activar.
3. `pip install -r requirements.txt`
4. Configurar `.env`.
5. Levantar bases de datos (Postgres/Mongo) localmente.
6. `uvicorn app.main:app --reload`

### 3. Configurar Frontend
Sigue las instrucciones detalladas en:
- 👉 [Configuración del Frontend](../frontend/setup.md)

Resumen rápido:
1. `cd frontend`
2. `npm install`
3. Configurar `.env`.
4. `npm run dev`

## Verificación

Una vez que ambos servicios estén corriendo:
- Backend: http://localhost:8000/docs (Swagger UI)
- Frontend: http://localhost:5173
