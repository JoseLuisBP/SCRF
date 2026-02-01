# Documentación de la API

## Información General
- Base URL: `http://localhost:8000/api/v1`
- Versión actual: `v1`
- Formato: JSON

## Autenticación
La API utiliza autenticación JWT (JSON Web Tokens).

### Headers Requeridos
Para endpoints protegidos:
```
Authorization: Bearer <token>
```

## Endpoints

### Autenticación (`/auth`)

#### POST /auth/register
Registrar un nuevo usuario y obtener token.
```json
// Request
{
  "nombre": "Juan Perez",
  "correo": "juan@example.com",
  "contrasena": "securePa$$word123",
  "edad": 25,
  "peso": 75.5,
  "estatura": 1.75,
  "nivel_fisico": "Intermedio",
  "tiempo_disponible": 60
}

// Response (201 Created)
{
  "access_token": "eyJhbGciOiJI...",
  "token_type": "bearer",
  "expires_in": 1800
}
```

#### POST /auth/login
Iniciar sesión.
```json
// Request
{
  "correo": "juan@example.com",
  "contrasena": "securePa$$word123"
}

// Response (200 OK)
{
  "access_token": "eyJhbGciOiJI...",
  "token_type": "bearer",
  "expires_in": 1800
}
```

#### GET /auth/verify
Verificar validez del token actual. Retorna los datos del usuario.

#### GET /auth/me
Alias para obtener información del usuario actual.

#### POST /auth/logout
Cierre de sesión simbólico (el cliente debe descartar el token).

### Usuarios (`/users`)

#### GET /users/me
Obtener perfil completo del usuario autenticado.

#### PUT /users/me
Actualizar perfil del usuario.
```json
// Request (campos opcionales)
{
  "nombre": "Juan P.",
  "peso": 74.0,
  "nivel_fisico": "Avanzado"
}
```

#### DELETE /users/me
Eliminar cuenta del usuario actual.

#### POST /users/me/change-password
Cambiar contraseña.
```json
// Request
{
  "contrasena_actual": "oldPass",
  "nueva_contrasena": "newPass"
}
```

### Gestión de Usuarios (Requiere Rol Admin)

#### GET /users/
Listar todos los usuarios (paginado).
- Query params: `skip` (default: 0), `limit` (default: 100)

#### GET /users/{user_id}
Obtener detalle de un usuario específico.

#### PUT /users/{user_id}
Actualizar un usuario específico.

#### POST /users/{user_id}/activate
Activar un usuario suspendido.

#### POST /users/{user_id}/deactivate
Suspender un usuario.

#### POST /users/{user_id}/toggle-admin
Otorgar o revocar permisos de administrador.

#### POST /users/{user_id}/change-password
Cambiar contraseña de un usuario (no requiere contraseña anterior).

### Ejercicios (`/exercises`)

#### GET /exercises
Obtener lista de ejercicios activos.

### Progreso (`/progress`)

#### GET /progress/{id_usuario}
Obtener historial de progreso de un usuario.

## Códigos de Estado Comunes

- 200: OK
- 201: Created
- 400: Bad Request (Datos inválidos)
- 401: Unauthorized (Token faltante o inválido)
- 403: Forbidden (Permisos insuficientes)
- 404: Not Found
- 500: Internal Server Error

## Rate Limiting
- Configurado vía middleware (ver documentación de infraestructura).
