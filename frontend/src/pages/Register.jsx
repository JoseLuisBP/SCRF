import { useState } from 'react';
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
} from '@mui/material';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Header from '../components/layout/Header';

export default function Register() {
  // Estados para los campos del formulario
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [age, setAge] = useState('');
  const [peso, setPeso] = useState('');
  const [estatura, setEstatura] = useState('');
  const [nivelFisico, setNivelFisico] = useState('');
  const [tiempoDisponible, setTiempoDisponible] = useState('');

  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [openTerms, setOpenTerms] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleAgeChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    const numberValue = Number(value);
    if (numberValue > 120) value = '120';
    setAge(value);
  };

  const handleTermsChange = (e) => {
    setAcceptedTerms(e.target.checked);
  };

  const handleOpenTerms = () => setOpenTerms(true);
  const handleCloseTerms = () => setOpenTerms(false);

  // Envío de datos al backend
  const handleRegister = async () => {
    if (!acceptedTerms) {
      setSnackbar({ open: true, message: 'Debes aceptar los términos y condiciones.', severity: 'error' });
      return;
    }

    if (password !== confirmPassword) {
      setSnackbar({ open: true, message: 'Las contraseñas no coinciden.', severity: 'error' });
      return;
    }

    try {
      const res = await fetch(`/api/v1/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre,
          correo,
          contrasena: password,
          edad: parseInt(age),
          peso: parseFloat(peso) || null,
          estatura: parseFloat(estatura) || null,
          nivel_fisico: nivelFisico || null,
          tiempo_disponible: parseInt(tiempoDisponible) || 0,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('token', data.access_token);
        setSnackbar({ open: true, message: 'Usuario registrado correctamente.', severity: 'success' });

        // Limpia los campos
        setNombre('');
        setCorreo('');
        setPassword('');
        setConfirmPassword('');
        setAge('');
        setPeso('');
        setEstatura('');
        setNivelFisico('');
        setTiempoDisponible('');
        setAcceptedTerms(false);
      } else {
        setSnackbar({ open: true, message: data.detail || 'Error al registrar usuario.', severity: 'error' });
      }
    } catch (error) {
      console.error(error);
      setSnackbar({ open: true, message: 'Error de conexión con el servidor.', severity: 'error' });
    }
  };

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
          <Input label="Nombre completo" labelSize="small" placeholder="Introduce tu nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} fullWidth sx={{ maxWidth: 400, mx: 'auto', mb: 2 }} />

          <Input label="Correo electrónico" labelSize="small" placeholder="Introduce tu correo" value={correo} onChange={(e) => setCorreo(e.target.value)} fullWidth sx={{ maxWidth: 400, mx: 'auto', mb: 2 }} />

          <Input label="Contraseña" labelSize="small" placeholder="Introduce tu contraseña" type="password" value={password} onChange={(e) => setPassword(e.target.value)} fullWidth sx={{ maxWidth: 400, mx: 'auto', mb: 2 }} />

          <Input label="Confirmar contraseña" labelSize="small" placeholder="Confirma tu contraseña" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} fullWidth sx={{ maxWidth: 400, mx: 'auto', mb: 2 }} />

          <Input label="Edad" labelSize="small" placeholder="Introduce tu edad" type="number" value={age} onChange={handleAgeChange} fullWidth sx={{ maxWidth: 400, mx: 'auto', mb: 2 }} inputProps={{ min: 0, max: 120 }} />

          <Input label="Peso (kg)" labelSize="small" placeholder="Introduce tu peso" type="number" value={peso} onChange={(e) => setPeso(e.target.value)} fullWidth sx={{ maxWidth: 400, mx: 'auto', mb: 2 }} />

          <Input label="Estatura (cm)" labelSize="small" placeholder="Introduce tu estatura" type="number" value={estatura} onChange={(e) => setEstatura(e.target.value)} fullWidth sx={{ maxWidth: 400, mx: 'auto', mb: 2 }} />

          <Input label="Nivel físico" labelSize="small" placeholder="Ej. Principiante, Intermedio, Avanzado" value={nivelFisico} onChange={(e) => setNivelFisico(e.target.value)} fullWidth sx={{ maxWidth: 400, mx: 'auto', mb: 2 }} />

          <Input label="Tiempo disponible (minutos)" labelSize="small" placeholder="Ej. 30" type="number" value={tiempoDisponible} onChange={(e) => setTiempoDisponible(e.target.value)} fullWidth sx={{ maxWidth: 400, mx: 'auto', mb: 3 }} />

          {/* Checkbox de términos */}
          <FormControlLabel
            control={<Checkbox checked={acceptedTerms} onChange={handleTermsChange} color="primary" />}
            label={
              <Typography variant="body2" color="text.secondary">
                He leído y acepto los{' '}
                <a href="#" onClick={handleOpenTerms} style={{ color: '#6BAA75', textDecoration: 'none' }}>
                  términos y condiciones
                </a>
              </Typography>
            }
            sx={{ mb: 4 }}
          />

          <Button variant="primary" size="small" fullWidth sx={{ maxWidth: 400, mx: 'auto' }} disabled={!acceptedTerms} onClick={handleRegister}>
            Registrarse
          </Button>
        </Box>
      </Container>

      {/* Modal de términos y condiciones (SIN CAMBIOS) */}
      <Dialog open={openTerms} onClose={handleCloseTerms} maxWidth="sm" fullWidth>
        <DialogTitle>Términos y Condiciones</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" paragraph>
            Al registrarte en nuestra plataforma, aceptas los siguientes términos:
          </Typography>
          <Typography variant="body2" paragraph>
            1. Tus datos personales serán utilizados únicamente para crear tu cuenta y ofrecerte una mejor experiencia.
          </Typography>
          <Typography variant="body2" paragraph>
            2. Te comprometes a usar la aplicación de manera responsable y respetuosa.
          </Typography>
          <Typography variant="body2" paragraph>
            3. Nos reservamos el derecho de actualizar estos términos en cualquier momento.
          </Typography>
          <Typography variant="body2" paragraph>
            4. Puedes solicitar la eliminación de tu cuenta en cualquier momento.
          </Typography>
          <Typography variant="body2" paragraph>
            5. El usuario reconoce que toda actividad física conlleva un riesgo de lesión.
          </Typography>
          <Typography variant="body2" paragraph>
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
