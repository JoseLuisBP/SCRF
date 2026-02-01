# Configuración del Frontend

## Requisitos Previos

- Node.js (v18 o superior recomendado)
- npm o yarn

## Instalación

1. **Navegar al directorio del frontend**:
   ```bash
   cd frontend
   ```

2. **Instalar dependencias**:
   ```bash
   npm install
   ```
   Las dependencias principales incluyen React 19, Vite, Material UI, Axios, y React Router.

## Variables de Entorno

Crear un archivo `.env` en la raíz de `frontend/` (basado en `.env.example` si existe, o crear uno nuevo):

```ini
VITE_API_URL=http://localhost:8000
```

## Scripts Disponibles

En el archivo `package.json`, encontrarás los siguientes scripts:

- **Iniciar servidor de desarrollo**:
  ```bash
  npm run dev
  ```
  Inicia la aplicación en `http://localhost:5173`.

- **Construir para producción**:
  ```bash
  npm run build
  ```
  Genera los archivos estáticos optimizados en la carpeta `dist/`.

- **Previsualizar producción**:
  ```bash
  npm run preview
  ```

- **Linting y Formateo**:
  ```bash
  npm run lint
  npm run format
  ```

## Estructura de Directorios

- `src/api/`: Configuración de Axios y funciones para llamadas al backend.
- `src/components/`: Componentes de UI reutilizables (Botones, Inputs, Layouts).
- `src/context/`: Contextos de React (AuthContext, ThemeContext).
- `src/pages/`: Componentes de página completa (Login, Dashboard, Profile).
- `src/routes/`: Definición de rutas de la aplicación.
- `src/styles/`: Archivos CSS y configuración de temas.

## Tecnologías Clave

- **Vite**: Build tool y servidor de desarrollo rápido.
- **React Router**: Manejo de navegación SPA.
- **Material UI**: Librería de componentes visuales.
- **Axios**: Cliente HTTP.
- **React Context**: Gestión de estado global (Auth, Theme).
