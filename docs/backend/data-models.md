# Modelos de Datos

## Base de Datos Relacional (PostgreSQL)

### 1. Usuario (`User`)
Representa a los usuarios registrados en el sistema.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id_usuario` | Integer (PK) | Identificador único del usuario. |
| `nombre` | String(200) | Nombre completo del usuario. |
| `correo` | String(255) | Correo electrónico (único). |
| `contrasena_hash` | String(512) | Hash de la contraseña. |
| `edad` | Integer | Edad del usuario. |
| `peso` | Float | Peso en kg. |
| `estatura` | Float | Estatura en m/cm. |
| `nivel_fisico` | String(100) | Nivel de actividad física (Sedentario, Ligero, etc). |
| `tiempo_disponible` | Integer | Tiempo disponible para ejercitarse (minutos). |
| `fecha_registro` | Date | Fecha de creación de la cuenta. |
| `id_rol` | Integer (FK) | ID del rol asignado. |

### 2. Rol (`Rol`)
Define los roles y permisos dentro del sistema.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id_rol` | Integer (PK) | Identificador único del rol. |
| `nombre_rol` | String(100) | Nombre del rol (e.g., "admin", "usuario"). |
| `descripcion` | Text | Descripción de las capacidades del rol. |

### 3. Ejercicio (`Ejercicio`)
Catálogo de ejercicios disponibles.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id_ejercicio` | Integer (PK) | Identificador único del ejercicio. |
| `nombre_ejercicio` | String(100) | Nombre del ejercicio. |
| `descripcion` | Text | Instrucciones detalladas. |
| `repeticiones` | Integer | Número de repeticiones sugeridas (opcional). |
| `tiempo` | Integer | Tiempo sugerido en segundos/minutos (opcional). |
| `categoria` | String(50) | Categoría (e.g., Fuerza, Cardio). |
| `advertencias` | Text | Precauciones de seguridad. |
| `activo` | Boolean | Si el ejercicio está disponible para asignación. |

## Base de Datos NoSQL (MongoDB)

(Estructura flexible, esquemas principales identificados)

### Logs
- `timestamp`: Fecha hora del evento.
- `user_id`: ID del usuario asociado.
- `action`: Acción realizada.
- `details`: Objeto JSON con detalles adicionales.

### Analytics
- Métricas de uso y rendimiento almacenadas en formato JSON.
