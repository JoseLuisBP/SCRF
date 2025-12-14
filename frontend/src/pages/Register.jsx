//Hook de estado de React
import { useState } from 'react';
// Componentes de Material UI
import {
  Box,
  Container,
  Typography,
  FormControlLabel,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button as MuiButton,
  Snackbar,
  Alert,
  FormHelperText,
} from '@mui/material';
// React Hook Form para manejo del formulario
import { useForm } from 'react-hook-form';
// Integración de Yup con React Hook Form
import { yupResolver } from '@hookform/resolvers/yup';
// Librería Yup para validaciones
import * as yup from 'yup';
// Componentes personalizados
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Header from '../components/layout/Header';
import { authAPI } from '../api';

// Esquema de validación
// Define las reglas que deben cumplir los campos del registro
const registerSchema = yup.object({
  nombre: yup.string().required('El nombre es obligatorio'),
  correo: yup
    .string()
    .email('Debe ser un correo electrónico válido')
    .required('El correo es obligatorio'),
  password: yup
    .string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .required('La contraseña es obligatoria'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Las contraseñas no coinciden')
    .required('Debes confirmar tu contraseña'),
  age: yup
    .number()
    .transform((value) => (isNaN(value) ? undefined : value))
    .min(0, 'La edad no puede ser negativa')
    .max(80, 'La edad no puede ser mayor a 80')
    .required('La edad es obligatoria'),
  peso: yup
    .number()
    .transform((value) => (isNaN(value) ? undefined : value))
    .positive('Ingresa un valor valido')
    .nullable(),
  estatura: yup
    .number()
    .transform((value) => (isNaN(value) ? undefined : value))
    .positive('Ingresa un valor valido')
    .nullable(),
  nivelFisico: yup.string().nullable(),
  tiempoDisponible: yup
    .number()
    .transform((value) => (isNaN(value) ? undefined : value))
    .min(0, 'Ingresa un valor valido')
    .nullable(),
  acceptedTerms: yup
    .boolean()
    .oneOf([true], 'Debes aceptar los términos y condiciones'),
}).required();

//Componentes registro como: terminos, mensaje emergente
export default function Register() {
  const [openTerms, setOpenTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Configuración del formulario
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm({
    resolver: yupResolver(registerSchema),
    defaultValues: {
      nombre: '',
      correo: '',
      password: '',
      confirmPassword: '',
      age: '',
      peso: '',
      estatura: '',
      nivelFisico: '',
      tiempoDisponible: '',
      acceptedTerms: false,
    },
  });

    // Observa si los términos están aceptados
  const acceptedTerms = watch('acceptedTerms');

    // Abre el modal de términos
  const handleOpenTerms = (e) => {
    e.preventDefault();
    setOpenTerms(true);
  };
  // Cierra el modal de términos
  const handleCloseTerms = () => setOpenTerms(false);

  //Funcion al enviar formulario 
  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
       // Datos enviados a la API
      const userData = {
        nombre: data.nombre,
        correo: data.correo,
        contrasena: data.password,
        edad: parseInt(data.age),
        peso: data.peso ? parseFloat(data.peso) : null,
        estatura: data.estatura ? parseFloat(data.estatura) : null,
        nivel_fisico: data.nivelFisico || null,
        tiempo_disponible: data.tiempoDisponible ? parseInt(data.tiempoDisponible) : 0,
      };
// Llamada a la API
      await authAPI.register(userData);
// Mensaje de éxito
      setSnackbar({ open: true, message: 'Usuario registrado correctamente.', severity: 'success' });
      reset();
    } catch (error) {
      console.error(error);
      const errorMessage = error.response?.data?.detail || 'Error al registrar usuario.';
      setSnackbar({ open: true, message: errorMessage, severity: 'error' });
    } finally {
      setIsLoading(false);
    }
  };
//Interfaz
  return (
    <Box
      sx={{
        minHeight: '100vh',
        minWidth: '100vw',
        background: (theme) =>
          `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.secondary.main} 100%)`,
        color: 'text.primary',
      }}
    >
      <Header showSearchBar={false} />

      <Container maxWidth="sm" sx={{ mt: 12, mb: 4 }}>
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{
            textAlign: 'center',
            py: 6,
            px: 2,
            backgroundColor: 'background.paper',
            borderRadius: 2,
            boxShadow: (theme) => `0 8px 32px ${theme.palette.primary.main}20`,
            transition: 'transform 0.2s ease',
            '&:hover': { transform: 'translateY(-3px)' },
          }}
        >
          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            sx={{ fontSize: { xs: '2.5rem', md: '3.75rem' }, fontWeight: 'bold' }}
          >
            Crear Cuenta
          </Typography>

          {/* Campos de entrada */}
          <Input
            label="Nombre completo"
            labelSize="small"
            placeholder="Introduce tu nombre"
            fullWidth
            error={!!errors.nombre}
            helperText={errors.nombre?.message}
            {...register('nombre')}
            sx={{ maxWidth: 400, mx: 'auto', mb: 2 }}
          />

          <Input
            label="Correo electrónico"
            labelSize="small"
            placeholder="Introduce tu correo"
            fullWidth
            error={!!errors.correo}
            helperText={errors.correo?.message}
            {...register('correo')}
            sx={{ maxWidth: 400, mx: 'auto', mb: 2 }}
          />

          <Input
            label="Contraseña"
            labelSize="small"
            placeholder="Introduce tu contraseña"
            type="password"
            showPasswordToggle={true}
            fullWidth
            error={!!errors.password}
            helperText={errors.password?.message}
            {...register('password')}
            sx={{ maxWidth: 400, mx: 'auto', mb: 2 }}
          />

          <Input
            label="Confirmar contraseña"
            labelSize="small"
            placeholder="Confirma tu contraseña"
            type="password"
            showPasswordToggle={true}
            fullWidth
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message}
            {...register('confirmPassword')}
            sx={{ maxWidth: 400, mx: 'auto', mb: 2 }}
          />

          <Input
            label="Edad"
            labelSize="small"
            placeholder="Introduce tu edad"
            type="number"
            fullWidth
            error={!!errors.age}
            helperText={errors.age?.message}
            {...register('age')}
            sx={{ maxWidth: 400, mx: 'auto', mb: 2 }}
            inputProps={{ min: 0, max: 120 }}
          />

          <Input
            label="Peso (kg)"
            labelSize="small"
            placeholder="Introduce tu peso"
            type="number"
            fullWidth
            error={!!errors.peso}
            helperText={errors.peso?.message}
            {...register('peso')}
            sx={{ maxWidth: 400, mx: 'auto', mb: 2 }}
          />

          <Input
            label="Estatura (cm)"
            labelSize="small"
            placeholder="Introduce tu estatura"
            type="number"
            fullWidth
            error={!!errors.estatura}
            helperText={errors.estatura?.message}
            {...register('estatura')}
            sx={{ maxWidth: 400, mx: 'auto', mb: 2 }}
          />

          <Input
            label="Nivel físico"
            labelSize="small"
            select={true}
            options={[
              { value: 'principiante', label: 'Principiante' },
              { value: 'intermedio', label: 'Intermedio' },
              { value: 'avanzado', label: 'Avanzado' },
            ]}
            fullWidth
            error={!!errors.nivelFisico}
            helperText={errors.nivelFisico?.message}
            {...register('nivelFisico')}
            sx={{ maxWidth: 400, mx: 'auto', mb: 2 }}
          />

          <Input
            label="Tiempo disponible (minutos)"
            labelSize="small"
            placeholder="Ej. 30"
            type="number"
            fullWidth
            error={!!errors.tiempoDisponible}
            helperText={errors.tiempoDisponible?.message}
            {...register('tiempoDisponible')}
            sx={{ maxWidth: 400, mx: 'auto', mb: 3 }}
          />

          {/* Checkbox de términos */}
          <Box sx={{ maxWidth: 400, mx: 'auto', mb: 4, textAlign: 'left' }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={acceptedTerms}
                  onChange={(e) => setValue('acceptedTerms', e.target.checked, { shouldValidate: true })}
                  color="primary"
                />
              }
              label={
                <Typography variant="body2" color="text.secondary">
                  He leído y acepto los{' '}
                  <a href="#" onClick={handleOpenTerms} style={{ color: '#6BAA75', textDecoration: 'none' }}>
                    términos y condiciones
                  </a>
                </Typography>
              }
            />
            {errors.acceptedTerms && (
              <FormHelperText error>{errors.acceptedTerms.message}</FormHelperText>
            )}
          </Box>

          <Button
            variant="primary"
            size="small"
            fullWidth
            type="submit"
            disabled={isLoading}
            sx={{ maxWidth: 400, mx: 'auto' }}
          >
            {isLoading ? 'Registrando...' : 'Registrarse'}
          </Button>
        </Box>
      </Container>

      {/* Modal de términos y condiciones (SIN CAMBIOS) */}
      <Dialog open={openTerms} onClose={handleCloseTerms} maxWidth="sm" fullWidth>
        <DialogTitle>Términos y Condiciones</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" component="p" sx={{ mb: 2 }}>
            Al registrarte en nuestra plataforma, aceptas los siguientes términos:
          </Typography>
          <Typography variant="body2" component="p" sx={{ mb: 2 }}>
            1. Tus datos personales serán utilizados únicamente para crear tu cuenta y ofrecerte una mejor experiencia.
          </Typography>
          <Typography variant="body2" component="p" sx={{ mb: 2 }}>
            2. Te comprometes a usar la aplicación de manera responsable y respetuosa.
          </Typography>
          <Typography variant="body2" component="p" sx={{ mb: 2 }}>
            3. Nos reservamos el derecho de actualizar estos términos en cualquier momento.
          </Typography>
          <Typography variant="body2" component="p" sx={{ mb: 2 }}>
            4. Puedes solicitar la eliminación de tu cuenta en cualquier momento.
          </Typography>
          <Typography variant="body2" component="p" sx={{ mb: 2 }}>
            5. El usuario reconoce que toda actividad física conlleva un riesgo de lesión.
          </Typography>
          <Typography variant="body2" component="p" sx={{ mb: 2 }}>
            Se recomienda que cualquier entrenamiento se realice bajo la supervisión de un profesional o persona capacitada que pueda asistir en caso de requerir ayuda.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center' }}>
          <MuiButton onClick={handleCloseTerms}>Cerrar</MuiButton>
        </DialogActions>
      </Dialog>

      {/* Snackbar de mensajes */}
      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}>
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}
