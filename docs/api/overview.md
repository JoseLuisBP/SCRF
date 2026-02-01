# Visión General de la API

La API del proyecto Modular está construida sobre REST (Representational State Transfer) y utiliza JSON como formato estándar para el intercambio de datos.

## Servidor Base
- **URL Base (Local)**: `http://localhost:8000/api/v1`
- **Documentación Interactiva**:
  - Swagger UI: `http://localhost:8000/docs`
  - ReDoc: `http://localhost:8000/redoc`

## Convenciones

### Formato de Respuestas
Todas las respuestas exitosas devuelven un objeto JSON o un array JSON, dependiendo del endpoint.

```json
{
  "data": { ... },
  "message": "Operación existosa"
}
```

### Manejo de Fechas
Las fechas se manejan en formato ISO 8601 (UTC).
Ejemplo: `2023-10-27T10:00:00Z`

### Paginación
Para endpoints que devuelven listas, se utiliza paginación por `limit` y `offset` (o `page`).
Ejemplo query params: `?limit=10&offset=0`

## Versionado
La API está versionada en la URL. La versión actual es `v1`.
Cualquier cambio que rompa la compatibilidad introducirá una nueva versión (`v2`).
