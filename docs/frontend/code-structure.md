# Documentación del Frontend

## Estructura del Código

```
frontend/
├── src/
│   ├── api/          # Configuración y servicios de API
│   ├── components/   # Componentes reutilizables
│   ├── context/      # Contextos de React
│   ├── hooks/        # Hooks personalizados
│   ├── pages/        # Páginas/Rutas principales
│   ├── routes/       # Configuración de rutas
│   ├── styles/       # Estilos globales y temas
│   └── utils/        # Utilidades y helpers
├── public/           # Archivos estáticos
└── tests/            # Tests
```

## Componentes Principales

### Páginas
- `Home.jsx`: Página principal
- `Login.jsx`: Página de inicio de sesión
- `Register.jsx`: Página de registro
- `Profile.jsx`: Perfil de usuario
- `Dashboard.jsx`: Panel principal
- `Exercises.jsx`: Gestión de ejercicios
- `Routines.jsx`: Gestión de rutinas

### Componentes Comunes
- `Button.jsx`: Botón personalizable
- `Input.jsx`: Campo de entrada
- `Header.jsx`: Encabezado de la aplicación
- `Footer.jsx`: Pie de página

### Contextos
- `AuthContext.jsx`: Manejo de autenticación
- `ThemeContext.jsx`: Gestión del tema

## API y Servicios

### Configuración de Axios
```javascript
// api/axios.js
const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
    },
});
```

### Servicios Disponibles
- `auth.js`: Autenticación y manejo de usuarios
- `exercises.js`: CRUD de ejercicios
- `routines.js`: CRUD de rutinas
- `progress.js`: Seguimiento de progreso

## Estilos y Temas

### Sistema de Temas
- Temas claro/oscuro
- Variables CSS personalizadas
- Diseño responsive

### Estilos Globales
- Reset CSS
- Tipografía
- Colores base
- Espaciado

## Estado Global

### Contexto de Autenticación
- Manejo de tokens
- Estado de usuario
- Permisos

### Contexto de Tema
- Preferencias de tema
- Cambio de tema
- Persistencia de preferencias

## Enrutamiento

### Configuración de Rutas
- Rutas públicas
- Rutas protegidas
- Redirecciones

### Protección de Rutas
- HOC de autenticación
- Validación de permisos
