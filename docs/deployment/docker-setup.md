# Configuración y Uso de Docker

Este proyecto incluye configuración completa para Docker Compose, permitiendo levantar todo el stack (Backend, Frontend, Bases de Datos) con un solo comando.

## Servicios Incluidos

1. **`backend`**: Contenedor Python/FastAPI.
   - Puerto: 8000
   - Volume: `./backend:/app` (Hot-reload activado)

2. **`frontend`**: Contenedor Node/React (Vite).
   - Puerto: 5173
   - Volume: `./frontend:/app`

3. **`postgres`**: Base de datos PostgreSQL 17.
   - Puerto: 5432
   - Credenciales (Default): admin/admin

4. **`mongodb`**: Base de datos MongoDB 7.
   - Puerto: 27017
   - Credenciales (Default): admin/admin

## Comandos Principales

### Levantar Servicios
```bash
docker compose up
```
Para correr en segundo plano ("detached mode"):
```bash
docker compose up -d
```

### Detener Servicios
```bash
docker compose down
```
Para detener y eliminar volúmenes (reiniciar bases de datos):
```bash
docker compose down -v
```

### Ver Logs
```bash
docker compose logs -f
```
Ver logs de un servicio específico:
```bash
docker compose logs -f backend
```

## Solución de Problemas

- **Conflicto de puertos**: Si los puertos 8000, 5173, 5432 o 27017 están ocupados, modifica el `docker-compose.yml` sección `ports`.
- **Database Connection Error**: Asegúrate de que los contenedores de DB estén "healthy" antes de que el backend intente conectar (manejado por `depends_on` con `condition: service_healthy`).
