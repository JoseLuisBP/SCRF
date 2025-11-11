import { useState, useEffect } from 'react';
import { Box, Container, Typography, Snackbar, Alert } from '@mui/material';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Header from '../components/layout/Header';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import authAPI from '../api/auth';

export default function Login() {
  const { login, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info',
  });

  // 🚀 Si ya está logueado, redirigir automáticamente
  useEffect(() => {
    if (isLoggedIn) {
      navigate('/dashboard');
    }
  }, [isLoggedIn, navigate]);

  const handleLogin = async () => {
    try {
      // Llamada real a la API
      const response = await authAPI.login({
        correo,
        contrasena: password,
      });

      const data = response.data;

      // Validar respuesta correcta
      if (data?.access_token && data?.user) {
        login(data);
        setSnackbar({
          open: true,
          message: `¡Bienvenido ${data.user.nombre}!`,
          severity: 'success',
        });
      } else {
        setSnackbar({
          open: true,
          message: 'Credenciales inválidas',
          severity: 'error',
        });
      }
    } catch (error) {
      console.error('Error en el login:', error);
      setSnackbar({
        open: true,
        message: 'Error al iniciar sesión. Verifica tus credenciales.',
        severity: 'error',
      });
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
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            fullWidth
            sx={{ maxWidth: 400, mx: 'auto', mb: 3 }}
          />

          <Input
            label="Contraseña"
            labelSize="small"
            placeholder="Introduce tu contraseña"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            sx={{ maxWidth: 400, mx: 'auto', mb: 4 }}
          />

          <Button
            variant="primary"
            size="small"
            fullWidth
            sx={{ maxWidth: 400, mx: 'auto' }}
            onClick={handleLogin}
          >
            Iniciar Sesión
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
