import { useState, useEffect } from 'react';
import { Box, Container, Typography, Snackbar, Alert } from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Header from '../components/layout/Header';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import authAPI from '../api/auth';

// Esquema de validación
const loginSchema = yup.object({
  correo: yup
    .string()
    .email('Debe ser un correo electrónico válido')
    .required('El correo es obligatorio'),
  password: yup
    .string()
    .required('La contraseña es obligatoria'),
}).required();

export default function Login() {
  const { login, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info',
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      correo: '',
      password: '',
    },
  });

  // Si ya está logueado, redirigir automáticamente
  useEffect(() => {
    if (isLoggedIn) {
      navigate('/dashboard');
    }
  }, [isLoggedIn, navigate]);

  const onSubmit = async (formData) => {
    setIsLoading(true);
    try {
      // Llamada real a la API
      const response = await authAPI.login({
        correo: formData.correo,
        contrasena: formData.password,
      });

      const data = response.data || response;
      console.log('📦 Respuesta del login:', data);

      // Validar respuesta correcta
      if (data?.access_token) {
        login(data);
        setSnackbar({
          open: true,
          message: `¡Inicio de sesión exitoso!`,
          severity: 'success',
        });
        // Navegar al dashboard
        setTimeout(() => {
          navigate('/dashboard');
        }, 500);
      } else {
        console.error('❌ No se recibió access_token en la respuesta');
        setSnackbar({
          open: true,
          message: 'Error al iniciar sesión. Verifica tus credenciales.',
          severity: 'error',
        });
      }
    } catch (error) {
      console.error('❌ Error en el login:', error);
      setSnackbar({
        open: true,
        message: error.response?.data?.detail || 'Error al iniciar sesión. Verifica tus credenciales.',
        severity: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        minWidth: '100vw',
        background: (theme) =>
          `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.secondary.main} 100%)`,
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
            sx={{
              fontSize: { xs: '2.5rem', md: '3.75rem' },
              fontWeight: 'bold',
            }}
          >
            Iniciar Sesión
          </Typography>

          <Input
            label="Correo Electrónico"
            labelSize="small"
            placeholder="Introduce tu correo"
            fullWidth
            error={!!errors.correo}
            helperText={errors.correo?.message}
            {...register('correo')}
            sx={{ maxWidth: 400, mx: 'auto', mb: 3 }}
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
            sx={{ maxWidth: 400, mx: 'auto', mb: 4 }}
          />

          <Button
            variant="primary"
            size="small"
            fullWidth
            type="submit"
            disabled={isLoading}
            sx={{ maxWidth: 400, mx: 'auto' }}
          >
            {isLoading ? 'Iniciando...' : 'Iniciar Sesión'}
          </Button>
        </Box>
      </Container>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}
