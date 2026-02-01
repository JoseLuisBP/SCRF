# Guía de Desarrollo

Estándares y flujos de trabajo recomendados para contribuir al proyecto.

## Flujo de Trabajo con Git

1. **Rama Principal**: `main` contiene el código estable de producción.
2. **Ramas de Feature**: Crear ramas para nuevas funcionalidades.
   ```bash
   git checkout -b feature/nueva-funcionalidad
   ```
3. **Commits**: Usar mensajes descriptivos.
   - `feat: agregar login`
   - `fix: corregir error en validación`
   - `docs: actualizar readme`

## Backend (Python)

### Linting y Formateo
Se utiliza `black` y `flake8` (o `ruff`).

```bash
# Formatear código
black .

# Verificar estilo
flake8 .
```

### Tests
Ejecutar tests con `pytest`:
```bash
pytest
```

## Frontend (React)

### Linting y Formateo
Se utiliza `ESLint` y `Prettier`.

```bash
# Verificar errores
npm run lint

# Formatear código
npm run format
```

## Estructura de Directorios

Mantener la separación de responsabilidades:
- **Backend logic** en `app/services` o `app/core`.
- **Frontend logic** en custom hooks (`src/hooks`) o stores.
- **Componentes** deben ser puros y enfocados en presentación cuando sea posible.

## Pull Requests

Antes de enviar un PR:
1. Asegurarse que el código está formateado.
2. Ejecutar tests locales.
3. Actualizar documentación si hubo cambios en funcionalidad.
