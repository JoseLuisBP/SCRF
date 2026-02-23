# Actualización de Perfil Médico y Protección de Datos

## Descripción
Se ha refactorizado el manejo de información médica para cumplir con el esquema de base de datos (`perfil_medico`) y mejorar la categorización de datos para el futuro modelo de Machine Learning.

## Estructura de Datos

### Base de Datos (`perfil_medico`)
La información médica ya no reside en la tabla de usuarios, sino en una tabla dedicada con relación 1 a 1:

- **Tabla**: `perfil_medico`
- **Campos**:
    - `id_perfil_medico` (PK)
    - `id_usuario` (FK, Unique)
    - `condiciones_fisicas` (Texto encriptado)
    - `lesiones` (Texto encriptado)
    - `limitaciones` (Texto encriptado)
    - `cifrado_hash` (Opcional, para integridad futura)

### Backend (FastAPI)
- **Modelo**: `MedicalProfile` (`app.models.medical_profile`).
- **Relación**: `User` tiene una propiedad `perfil_medico`.
- **Esquemas**:
    - `MedicalProfileResponse`: Incluye validador para desencriptar automáticamente al enviar al cliente.
    - `UserResponse`: Incluye el objeto anidado `perfil_medico`.
- **Servicio (`UserService`)**:
    - `update_user`: Maneja la creación o actualización del perfil médico si se envían datos.
    - **Seguridad**: Se utiliza `app.core.security.encrypt_value` (Fernet) para cifrar los campos de texto antes de guardar.

## Frontend (React)
- **Página**: `Profile.jsx`
- **Formulario**:
    - Se reemplazó el campo único de texto por tres campos específicos:
        1. **Condiciones Físicas**
        2. **Lesiones**
        3. **Limitaciones**
    - Los datos se envían anidados en el objeto `perfil_medico`.
- **Validación**: Esquema `Yup` actualizado para validar la estructura anidada y longitud de textos.

## Guía de Verificación

### Pruebas Manuales
1. Ingresar al perfil de usuario.
2. Completar los campos de "Condiciones Físicas", "Lesiones" y "Limitaciones".
3. Guardar cambios.
4. Recargar la página y verificar que la información persiste y se muestra correctamente (lo que confirma el flujo de encriptación -> guardado -> lectura -> desencriptación).

### Notas de Despliegue
- El archivo `db/postgresql/init.sql` ya contiene la definición de la tabla `perfil_medico`.
- Si se despliega en un entorno existente, asegurarse de que la tabla `perfil_medico` exista. Si no, ejecutar el script SQL o crear una migración equivalente.
