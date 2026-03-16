import { useState, useEffect } from 'react';

// Componentes de Material UI
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

// React Hook Form
import { useForm } from 'react-hook-form';

// Integración Yup
import { yupResolver } from '@hookform/resolvers/yup';

// Validaciones
import * as yup from 'yup';

// Componentes personalizados
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Header from '../components/layout/Header';

// Contexto
import { useAuth } from '../context/AuthContext';

// Navegación
import { useNavigate } from 'react-router-dom';

// API
import authAPI from '../api/auth';

/* Esquema de validación */
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
    mode: 'onBlur',
    defaultValues: {
      correo: '',
      password: '',
    },
  });

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/dashboard');
    }
  }, [isLoggedIn, navigate]);

  const onSubmit = async (formData) => {
    setIsLoading(true);

    try {

      const response = await authAPI.login({
        correo: formData.correo,
        contrasena: formData.password,
      });

      const data = response.data || response;

      if (data?.access_token) {

        login(data);

        setSnackbar({
          open: true,
          message: '¡Inicio de sesión exitoso!',
          severity: 'success',
        });

        setTimeout(() => {
          navigate('/dashboard');
        }, 500);

      } else {

        setSnackbar({
          open: true,
          message: 'Error al iniciar sesión. Verifica tus credenciales.',
          severity: 'error',
        });

      }

    } catch (error) {

      setSnackbar({
        open: true,
        message:
          error.response?.data?.detail ||
          'Error al iniciar sesión. Verifica tus credenciales.',
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

        //cambio de fondo segun modo claro u oscuro
        background: (theme) =>
          theme.palette.mode === "dark"
            ? "#000000"
            : theme.palette.primary.light,

        transition: 'background 0.3s ease'
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
            boxShadow: 1
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
            isLoading={isLoading}
            sx={{ maxWidth: 400, mx: 'auto' }}
          >
            {isLoading ? 'Iniciando...' : 'Iniciar Sesión'}
          </Button>

        </Box>
      </Container>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() =>
          setSnackbar((prev) => ({ ...prev, open: false }))
        }
      >
        <Alert severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>

    </Box>
  );
}