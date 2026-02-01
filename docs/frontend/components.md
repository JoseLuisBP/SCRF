# Componentes del Frontend

Esta guía detalla los componentes reutilizables disponibles en el proyecto React.

## Componentes Comunes (`models/common/`)

### `Button`
Botón reutilizable que soporta variantes, tamaños y estados.

**Props:**
- `variant`: `contained` | `outlined` | `text`
- `color`: `primary` | `secondary` | `error`
- `size`: `small` | `medium` | `large`
- `onClick`: Función manejadora de eventos.
- `disabled`: Booleano para deshabilitar.

### `Input`
Campo de entrada de texto con soporte para etiquetas y errores de validación.

**Props:**
- `label`: Etiqueta del input.
- `type`: Tipo de input (`text`, `password`, `email`).
- `value`: Valor controlado.
- `onChange`: Función de cambio.
- `error`: Mensaje de error (opcional).

## Componentes de Layout (`models/layout/`)

### `Header`
Barra de navegación superior. Contiene enlaces principales y menú de usuario.

### `Footer`
Pie de página con información legal y enlaces secundarios.

## Estructura de Páginas (`controllers/pages/`)

- **Home**: Landing page pública.
- **Login/Register**: Formularios de autenticación.
- **Dashboard**: Vista principal para usuarios autenticados.
- **Profile**: Edición de datos del usuario, incluyendo información física.
- **Exercises**: Listado y detalle de ejercicios.
