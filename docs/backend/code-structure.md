# Documentación del Backend

## Estructura del Código

```
backend/
├── app/
│   ├── api/         # Endpoints de la API (v1)
│   ├── core/        # Configuración central y logging
│   ├── db/          # Conexiones a bases de datos (Postgres, Mongo)
│   ├── middleware/  # Middleware personalizado (Log, Security)
│   ├── models/      # Modelos SQLAlchemy (DB Relacional)
│   ├── schemas/     # Esquemas Pydantic (Validación)
│   ├── services/    # Lógica de negocio (Service Layer)
│   └── main.py      # Entry point de la aplicación
├── tests/           # Tests unitarios y de integración
└── alembic/         # Migraciones de base de datos
```

## Servicios (Service Layer)

La lógica de negocio se centraliza en la capa de servicios, ubicada en `app/services/`. Esto desacopla los controladores (endpoints) de la lógica compleja.

### UserService (`user_service.py`)
Maneja todas las operaciones relacionadas con usuarios:
- **CRUD Completo**: Crear, Leer, Actualizar, Borrar.
- **Gestión de Cuentas**: Activación (`activate_user`), desactivación (`deactivate_user`).
- **Seguridad**: Cambio de contraseñas, gestión de roles Admin.
- **Validaciones**: Verifica unicidad de correos, permisos de edición.

### AuthService (`auth_service.py`)
Maneja el flujo de autenticación:
- **Login**: Verificación de credenciales (`authenticate_user`).
- **Registro**: Orquesta la creación de usuarios delegando a `UserService`.
- **Tokens**: Generación de JWT (`create_token`) con expiración configurable.

## Middleware

El backend utiliza una serie de middlewares para procesar las peticiones antes de llegar a los controladores. Configurables en `app/main.py` y `app/middleware/`.

### 1. SecurityHeadersMiddleware (`security.py`)
Añade cabeceras de seguridad HTTP a todas las respuestas:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Strict-Transport-Security` (HSTS)

### 2. LogRequestsMiddleware (`logging.py`)
Sistema de logging de peticiones:
- Genera un `request_id` único para trazar la petición.
- Loguea método, path, ip del cliente y tiempo de procesamiento.
- Captura excepciones no controladas y las loguea antes de devolver 500.

### 3. CORSMiddleware
Configurado en `app/middleware/cors.py`.
- Define orígenes permitidos (`allow_origins`).
- Controla métodos y headers permitidos.
- Fundamental para permitir que el frontend (puerto 5173) se comunique con el backend (puerto 8000).

### 4. Error Handling (`error_handler.py`)
Manejadores de excepciones globales que transforman errores de Python en respuestas JSON estructuradas.

## Core

Componentes centrales transversales a toda la aplicación.

### Configuración (`config.py`)
Utiliza `pydantic-settings` para cargar variables de entorno:
- Valida tipos de datos (int vs str).
- Define valores por defecto.
- Centraliza secrets, URLs de base de datos y configuraciones de entorno (`ENVIRONMENT`, `DEBUG`).

### Logging (`logging.py`)
Configuración centralizada del logger de Python (`logging` module):
- Formato estándar: `%(asctime)s - %(name)s - %(levelname)s - %(message)s`.
- Niveles configurables por entorno (DEBUG en dev, INFO en prod).
- Integración con el middleware para logging de requests.

## Base de Datos

### PostgreSQL (Datos Estructurados)
Utilizado para el núcleo del negocio:
- **Usuarios**: Perfiles, roles, auth.
- **Catálogos**: Ejercicios, Rutinas.
- **Relaciones**: Asignación de rutinas, historial.

### MongoDB (Datos Flexibles)
Utilizado para:
- Logs de auditoría.
- Datos analíticos no estructurados.
- Eventos temporales.
