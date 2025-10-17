# Visión General de la Arquitectura

## Arquitectura del Sistema

La aplicación sigue una arquitectura moderna de tres capas:

```
[Cliente Web] <-> [API Backend] <-> [Bases de Datos]
```

### Frontend (Cliente Web)
- Framework: React + Vite
- Estado: Context API
- Routing: React Router
- HTTP Cliente: Axios
- Estilos: CSS Modules + CSS personalizado

### Backend (API)
- Framework: FastAPI
- Autenticación: JWT
- ORM: SQLAlchemy
- Bases de datos:
  - PostgreSQL: Datos principales
  - MongoDB: Datos no estructurados

### Infraestructura
- Contenedores: Docker
- Orquestación: Docker Compose
- Proxy Inverso: Nginx (producción)

## Diagrama de Componentes

```
Frontend
├── Componentes de UI
│   ├── Común
│   ├── Layout
│   └── Específicos
├── Estado Global
│   ├── Contexto de Auth
│   └── Contexto de Tema
└── Servicios
    └── Cliente API

Backend
├── API Routes
│   ├── Auth
│   ├── Usuarios
│   ├── Ejercicios
│   └── Rutinas
├── Servicios
│   ├── Autenticación
│   └── Base de datos
└── Modelos
    ├── PostgreSQL
    └── MongoDB
```

## Flujo de Datos

1. El cliente hace peticiones HTTP a la API
2. La API valida la autenticación via JWT
3. Se procesan las solicitudes en los controladores
4. Los servicios manejan la lógica de negocio
5. Los modelos interactúan con las bases de datos
6. La respuesta se envía de vuelta al cliente

## Consideraciones de Seguridad

- Autenticación basada en JWT
- CORS configurado para orígenes específicos
- Validación de datos en frontend y backend
- Sanitización de entradas
- Rate limiting en la API
