# Documentación del Backend

## Estructura del Código

```
backend/
├── app/
│   ├── api/         # Endpoints de la API
│   ├── core/        # Configuración central
│   ├── db/          # Conexiones a bases de datos
│   ├── models/      # Modelos de datos
│   ├── schemas/     # Esquemas Pydantic
│   ├── services/    # Lógica de negocio
│   └── utils/       # Utilidades
├── tests/           # Tests
└── alembic/         # Migraciones
```

## Componentes Principales

### API Routes
- `/api/v1/auth`: Autenticación y autorización
- `/api/v1/users`: Gestión de usuarios
- `/api/v1/exercises`: CRUD de ejercicios
- `/api/v1/routines`: CRUD de rutinas
- `/api/v1/progress`: Seguimiento de progreso

### Core
- `config.py`: Configuración de la aplicación
- `security.py`: Funciones de seguridad
- `logging.py`: Configuración de logs

### Base de Datos
- PostgreSQL: Datos estructurados
  - Usuarios
  - Ejercicios
  - Rutinas
  - Progreso
- MongoDB: Datos no estructurados
  - Logs
  - Análisis
  - Datos temporales

## Autenticación

### JWT (JSON Web Tokens)
- Generación de tokens
- Validación
- Refresh tokens
- Manejo de expiración

### Middleware
- Validación de tokens
- CORS
- Rate limiting
- Logging

## Modelos de Datos

### PostgreSQL
```python
# Ejemplo de modelo SQLAlchemy
class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True)
    email = Column(String, unique=True)
    hashed_password = Column(String)
```

### MongoDB
```python
# Ejemplo de modelo PyMongo
user_schema = {
    "email": str,
    "profile": dict,
    "preferences": dict
}
```

## Servicios

### Lógica de Negocio
- Autenticación
- Gestión de usuarios
- Gestión de ejercicios
- Gestión de rutinas
- Análisis de progreso

### Utilidades
- Hashing de contraseñas
- Validación de datos
- Formateo de respuestas
- Manejo de errores

## Migraciones

### Alembic
- Control de versiones de base de datos
- Scripts de migración
- Rollback
- Seed data

## Tests

### Pytest
- Tests unitarios
- Tests de integración
- Fixtures
- Mocking
