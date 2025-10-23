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
} from '@mui/material';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Header from '../components/layout/Header';

export default function Register() {
  const [age, setAge] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [openTerms, setOpenTerms] = useState(false);

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

          {/* Inputs personalizados */}
          <Input
            label="Nombre completo"
            labelSize="small"
            placeholder="Introduce tu nombre"
            fullWidth
            sx={{ maxWidth: 400, mx: 'auto', mb: 2 }}
          />

          <Input
            label="Correo electrónico"
            labelSize="small"
            placeholder="Introduce tu correo"
            fullWidth
            sx={{ maxWidth: 400, mx: 'auto', mb: 2 }}
          />

          <Input
            label="Contraseña"
            labelSize="small"
            placeholder="Introduce tu contraseña"
            type="password"
            fullWidth
            sx={{ maxWidth: 400, mx: 'auto', mb: 2 }}
          />

          <Input
            label="Confirmar contraseña"
            labelSize="small"
            placeholder="Confirma tu contraseña"
            type="password"
            fullWidth
            sx={{ maxWidth: 400, mx: 'auto', mb: 2 }}
          />

          <Input
            label="Edad"
            labelSize="small"
            placeholder="Introduce tu edad"
            type="number"
            value={age}
            onChange={handleAgeChange}
            fullWidth
            sx={{ maxWidth: 400, mx: 'auto', mb: 3 }}
            inputProps={{ min: 0, max: 120 }}
          />

          {/* Checkbox con link que abre el modal */}
          <FormControlLabel
            control={
              <Checkbox
                checked={acceptedTerms}
                onChange={handleTermsChange}
                color="primary"
              />
            }
            label={
              <Typography variant="body2" color="text.secondary">
                He leído y acepto los{' '}
                <a
                  href="#"
                  onClick={handleOpenTerms}
                  style={{ color: '#6BAA75', textDecoration: 'none' }}
                >
                  términos y condiciones
                </a>
              </Typography>
            }
            sx={{ mb: 4 }}
          />

          <Button
            variant="primary"
            size="small"
            fullWidth
            sx={{ maxWidth: 400, mx: 'auto' }}
            disabled={!acceptedTerms}
          >
            Registrarse
          </Button>
        </Box>
      </Container>

      {/* Modal de términos y condiciones */}
      <Dialog open={openTerms} onClose={handleCloseTerms} maxWidth="sm" fullWidth>
        <DialogTitle>Términos y Condiciones</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" paragraph>
            Al registrarte en nuestra plataforma, aceptas los siguientes términos:
          </Typography>
          <Typography variant="body2" paragraph>
            1. Tus datos personales serán utilizados únicamente para crear tu cuenta y
            ofrecerte una mejor experiencia.
          </Typography>
          <Typography variant="body2" paragraph>
            2. Te comprometes a usar la aplicación de manera responsable y respetuosa.
          </Typography>
          <Typography variant="body2" paragraph>
            3. Nos reservamos el derecho de actualizar estos términos en cualquier momento. En caso de ser modificados se notificara del cambio para una validacion posterior.
          </Typography>
          <Typography variant="body2" paragraph>
            4. Puedes solicitar la eliminación de tu cuenta en cualquier momento.
          </Typography>
          <Typography variant="body2" paragraph>
            5. El usuario reconoce que toda actividad física conlleva un riesgo de lesión. La plataforma no se hace responsable por accidentes, lesiones o daños derivados del uso de las rutinas o recomendaciones proporcionadas.
          </Typography>
          <Typography variant="body2" paragraph>
            Se recomienda que cualquier entrenamiento se realice bajo la supervisión de un profesional o persona capacitada que pueda asistir en caso de requerir ayuda. 
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center' }}>
          <MuiButton onClick={handleCloseTerms} >Cerrar</MuiButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
