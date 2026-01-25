# Sistema de Cuidado y Rehabilitación Físico (Modular)

Aplicación web integral para la gestión de rehabilitación física, que conecta a pacientes con especialistas y herramientas de seguimiento automatizado.

## Tecnologías

- **Backend**: FastAPI (Python 3.10+), Pydantic, SQLAlchemy.
- **Frontend**: React 19, Vite, Material UI.
- **Base de Datos**: PostgreSQL (Datos relacionales) + MongoDB (Logs y Analítica).
- **Infraestructura**: Docker & Docker Compose.

## Requisitos Previos

- Docker y Docker Compose
- Node.js 18+ (para desarrollo local sin Docker)
- Python 3.10+ (para desarrollo local sin Docker)

## Guía de Inicio Rápido (Docker)

1. **Clonar el repositorio**:
   ```bash
   git clone <repo-url>
   cd Modular
   ```

2. **Configurar variables de entorno**:
   ```bash
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env
   ```

3. **Iniciar servicios**:
   ```bash
   docker compose up --build
   ```

4. **Acceder a la aplicación**:
   - Frontend:
   - Backend API Docs:

## 📁 Estructura del Proyecto

```
/
├── backend/            # API FastAPI
│   ├── app/
│   │   ├── api/        # Endpoints (v1)
│   │   ├── core/       # Configuración y logging
│   │   ├── db/         # Conexiones DB (Postgres, Mongo)
│   │   ├── middleware/ # Middlewares (Auth, Logs, Seguridad)
│   │   ├── models/     # Modelos SQL
│   │   └── services/   # Lógica de negocio
│   └── tests/          # Tests unitarios/integración
├── frontend/           # App React
│   ├── src/
│   │   ├── components/ # Componentes reutilizables
│   │   ├── context/    # React Context (Auth, Theme)
│   │   ├── pages/      # Vistas principales
│   │   └── services/   # Clientes API
└── db/                 # Scripts de inicialización DB
```

## 🔐 Seguridad y Logs

- **Autenticación**: JWT (JSON Web Tokens).
- **Logs**: Todas las peticiones API se registran asíncronamente en MongoDB (`analytics` collection).
- **Seguridad**: Headers de seguridad (HSTS, X-Frame-Options) configurados por defecto.

## 🧪 Tests

Para correr los tests del backend:
```bash
cd backend
pytest
```
