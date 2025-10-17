# Documentación de la API

## Información General
- Base URL: `http://localhost:5000/api`
- Versión actual: `v1`
- Formato: JSON

## Autenticación
La API utiliza autenticación JWT (JSON Web Tokens).

### Headers Requeridos
```
Authorization: Bearer <token>
```

## Endpoints

### Autenticación

#### POST /api/v1/auth/login
Login de usuario.
```json
{
  "email": "string",
  "password": "string"
}
```

#### POST /api/v1/auth/register
Registro de nuevo usuario.
```json
{
  "email": "string",
  "password": "string",
  "name": "string"
}
```

### Usuarios

#### GET /api/v1/users/me
Obtener perfil del usuario actual.

#### PUT /api/v1/users/me
Actualizar perfil del usuario.
```json
{
  "name": "string",
  "email": "string"
}
```

### Ejercicios

#### GET /api/v1/exercises
Listar ejercicios.

#### POST /api/v1/exercises
Crear nuevo ejercicio.
```json
{
  "name": "string",
  "description": "string",
  "type": "string",
  "difficulty": "string"
}
```

#### GET /api/v1/exercises/{id}
Obtener detalles de un ejercicio.

#### PUT /api/v1/exercises/{id}
Actualizar ejercicio.

#### DELETE /api/v1/exercises/{id}
Eliminar ejercicio.

### Rutinas

#### GET /api/v1/routines
Listar rutinas.

#### POST /api/v1/routines
Crear nueva rutina.
```json
{
  "name": "string",
  "description": "string",
  "exercises": [
    {
      "exercise_id": "string",
      "sets": "number",
      "reps": "number"
    }
  ]
}
```

#### GET /api/v1/routines/{id}
Obtener detalles de una rutina.

#### PUT /api/v1/routines/{id}
Actualizar rutina.

#### DELETE /api/v1/routines/{id}
Eliminar rutina.

### Progreso

#### GET /api/v1/progress
Obtener historial de progreso.

#### POST /api/v1/progress
Registrar nuevo progreso.
```json
{
  "routine_id": "string",
  "exercise_id": "string",
  "sets_completed": "number",
  "reps_completed": "number",
  "weight": "number"
}
```

## Códigos de Estado

- 200: OK
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

## Rate Limiting

- 100 requests por minuto por IP
- 1000 requests por hora por usuario

## Errores

Formato de respuesta de error:
```json
{
  "error": {
    "code": "string",
    "message": "string",
    "details": {}
  }
}
```
