import { Box, Typography, Button } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import Header from '../components/layout/Header';

export default function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: (theme) =>
          `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.secondary.main} 100%)`,
        color: 'text.primary',
      }}
    >
      <Header showSearchBar={false} />

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
          Hola, {user?.nombre || user?.email || 'Usuario'} 👋
        </Typography>

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
