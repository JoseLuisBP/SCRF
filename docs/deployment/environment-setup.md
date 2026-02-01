# Configuración de Variables de Entorno

El proyecto utiliza archivos `.env` para manejar configuraciones sensibles y específicas del entorno.

## Backend (`backend/.env`)

| Variable | Descripción | Valor Ejemplo/Default |
|----------|-------------|-----------------------|
| `PROJECT_NAME` | Nombre del proyecto API | "Modular API" |
| `POSTGRES_SERVER` | Host de PostgreSQL | `db` (docker) o `localhost` |
| `POSTGRES_USER` | Usuario de BD | `postgres` |
| `POSTGRES_PASSWORD` | Contraseña de BD | `changethis` |
| `POSTGRES_DB` | Nombre de la BD | `app` |
| `MONGODB_URL` | String de conexión Mongo | `mongodb://localhost:27017` |
| `SECRET_KEY` | Llave para firmar JWT | `supersecretkey` |
| `ALGORITHM` | Algoritmo de encripción | `HS256` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Duración del token | `30` |

## Frontend (`frontend/.env`)

Nota: En Vite, las variables deben comenzar con `VITE_`.

| Variable | Descripción | Valor Ejemplo |
|----------|-------------|---------------|
| `VITE_API_URL` | URL base del backend | `http://localhost:8000` |

## Base de Datos (Docker)

Definidas en `docker-compose.yml`:
- `POSTGRES_USER`
- `POSTGRES_PASSWORD`
- `POSTGRES_DB`
- `MONGO_INITDB_ROOT_USERNAME`
- `MONGO_INITDB_ROOT_PASSWORD`

> **Importante**: No subir archivos `.env` al control de versiones. Usar `.env.example` como plantilla.
