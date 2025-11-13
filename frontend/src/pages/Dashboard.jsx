import { Box, Typography, Button, CircularProgress, Alert } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import { authAPI } from '../api'
import Header from '../components/layout/Header';

export default function Dashboard() {
  const { logout } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
  const fetchUser = async () => {
    try {
      // Log para verificar el token
      const token = localStorage.getItem('token');
      console.log('Token en localStorage:', token ? 'Existe' : 'No existe');
      console.log('Token length:', token?.length);
      
      // Decodificar el token manualmente para ver el payload
      if (token) {
        try {
          const parts = token.split('.');
          const payload = JSON.parse(atob(parts[1]));
          console.log('Payload del token:', payload);
        } catch (e) {
          console.error('Error al decodificar token:', e);
        }
      }
      
      console.log('Llamando a getCurrentUser...');
      const userData = await authAPI.getCurrentUser();
      console.log('Usuario obtenido:', userData);
      setUser(userData);
    } catch (err) {
      console.error('Error completo:', err);
      console.error('Error response:', err.response);
      setError('Error al cargar datos del usuario');
    } finally {
      setLoading(false);
    }
  };
  fetchUser();
}, []);

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CircularProgress/>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{minHeight: '100vh', p:4}}>
        <Alert severity='error'>{error}</Alert>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: (theme) =>
          `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.secondary.main} 100%)`,
        color: 'text.primary',
      }}
    >
      <Header showSearchBar={true} />

      <Box
        sx={{
          textAlign: 'center',
          mt: 10,
          py: 6,
          px: 4,
          backgroundColor: 'background.paper',
          borderRadius: 2,
          boxShadow: (theme) => `0 8px 32px ${theme.palette.primary.main}20`,
          width: '80%',
          mx: 'auto',
        }}
      >
        <Typography variant="h3" sx={{ mb: 3 }}>
          Bienvenido al Dashboard
        </Typography>

        <Typography variant="h6" sx={{ mb: 2 }}>
          Hola, {user?.nombre || user?.correo || 'Usuario'} 👋
        </Typography>

        {user?.edad && (
          <Typography variant="body1" sx={{ mb: 1 }}>
            Edad: {user.edad} años
          </Typography>
        )}

        {user?.nivel_fisico && (
          <Typography variant="body1" sx={{ mb: 1 }}>
            Nivel físico: {user.nivel_fisico}
          </Typography>
        )}

        {user?.peso && (
          <Typography variant="body1" sx={{ mb: 1 }}>
            Peso: {user.peso} kg
          </Typography>
        )}

        {user?.estatura && (
          <Typography variant="body1" sx={{ mb: 1 }}>
            Estatura: {user.estatura} cm
          </Typography>
        )}

        <Typography variant="body1" sx={{ mb: 4 }}>
          Aquí podrás ver tu progreso y datos de rehabilitación.
        </Typography>

        <Button
          variant="contained"
          color="error"
          onClick={logout}
        >
          Cerrar Sesión
        </Button>
      </Box>
    </Box>
  );
}
