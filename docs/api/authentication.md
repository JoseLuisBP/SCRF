# Autenticación

El sistema utiliza **JSON Web Tokens (JWT)** para asegurar los endpoints de la API.

## Flujo de Autenticación

1. **Login**: El cliente envía `email` y `password` al endpoint `/auth/login`.
2. **Generación de Token**: Si las credenciales son válidas, el servidor retorna:
   - `access_token`: Token de corta duración (ej. 30 min) para firmar peticiones.
   - `refresh_token`: Token de larga duración para obtener nuevos access tokens.
3. **Uso del Token**: El cliente debe incluir el `access_token` en el header `Authorization` de cada petición protegida.

## Header de Autorización

Formato estándar:
```http
Authorization: Bearer <tu_access_token>
```

## Renovación de Tokens (Refresh)

Cuando el `access_token` expira (código 401), el cliente puede usar el endpoint de refresh enviando el `refresh_token` para obtener un par nuevo de tokens sin forzar al usuario a loguearse nuevamente.

## Seguridad

- Las contraseñas se almacenan hasheadas (bcrypt/argon2).
- Los tokens están firmados con una clave secreta (`SECRET_KEY` en variables de entorno).
- Se recomienda usar HTTPS en producción para evitar intercepción de tokens.
