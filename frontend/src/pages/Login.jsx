import { Box, Container, Typography } from '@mui/material';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Header from '../components/layout/Header';

export default function Login() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        minWidth: '100vw',
        background: theme => `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.secondary.main} 100%)`,
        color: 'text.primary',
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
            boxShadow: theme => `0 8px 32px ${theme.palette.primary.main}20`,
            transition: 'transform 0.2s ease',
            '&:hover': { transform: 'translateY(-3px)' },
          }}
        >
          <Typography variant="h2" component="h1" gutterBottom
            sx={{ fontSize: { xs: '2.5rem', md: '3.75rem' }, fontWeight: 'bold' }}
          >
            Iniciar Sesión
          </Typography>

          <Input
            label="Correo Electrónico"
            labelSize="small"
            placeholder="Introduce tu correo"
            fullWidth
            sx={{ maxWidth: 400, mx: 'auto', mb: 3 }}
          />

          <Input
            label="Contraseña"
            labelSize="small"
            placeholder="Introduce tu contraseña"
            type="password"
            fullWidth
            sx={{ maxWidth: 400, mx: 'auto', mb: 4 }}
          />

          <Button variant="primary" size="small" fullWidth sx={{ maxWidth: 400, mx: 'auto' }}>
            Iniciar Sesión
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
