import { Box, Container, Typography } from '@mui/material';
import Header from '../components/layout/Header';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Card from '../components/layout/Card';
import { useAuth } from '../context/AuthContext';
import { useAccessibility } from '../context/AccessibilityContext';

import gimnasioImg from '../assets/images/gimnasio.jpg';
import ejercicioImg from '../assets/images/ejercicios.jpg';
import onuImg from '../assets/images/onu.jpg';
import cuerpoImg from '../assets/images/cuerpo.jpg';
import funcionImg from '../assets/images/funcion.jpg';
import Footer from '../components/layout/Footer';

export default function Home() {
  const { isLoggedIn, toggleLogin } = useAuth();
  const { fontSize } = useAccessibility();

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

      <Container maxWidth="md" sx={{ mt: 12, mb: 4 }}>

        {/*  INICIO */}
        <Box id="inicio" sx={{ mt: 8 }}>
          <Card
            title="Tu cuerpo no necesita un gimnasio, solo ganas de moverse."
            description="¿Quieres sentirte mejor, tener más energía y cuidar tu salud sin salir de casa? ¡Estás en el lugar correcto!"
            image={cuerpoImg}
          />
        </Box>

        {/*  SOBRE NOSOTROS */}
        <Box id="sobre-nosotros" sx={{ mt: 10 }}>
          <Card
            title="Sobre Nosotros"
            description="Esta página está diseñada para ayudar a cualquier persona en su proceso de rehabilitación física desde casa, de forma accesible y segura."
            image={funcionImg}
          />
        </Box>

        {/*  BENEFICIOS */}
        <Box id="beneficios" sx={{ mt: 10 }}>
          <Card
            title="Beneficios"
            description="Facilita la recuperación, conservación y fortalecimiento de la movilidad, fuerza y flexibilidad en adultos mayores y personas en rehabilitación."
            image={ejercicioImg}
          />
        </Box>

        {/*  CONTACTO */}
        <Box id="contacto" sx={{ mt: 10 }}>
          <Card
            title="Contáctanos"
            description="¿Tienes dudas o comentarios? Escríbenos para obtener más información sobre nuestros programas de rehabilitación."
            image={onuImg}
          />
        </Box>

        {/* Bienvenida */}
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
            mt: 12,
          }}
        >
          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            sx={{
              fontSize: { xs: `${fontSize * 2}px`, md: `${fontSize * 2.5}px` },
              fontWeight: 'bold',
            }}
          >
            Bienvenido :)
          </Typography>

          <Typography
            variant="h5"
            component="h2"
            gutterBottom
            color="text.secondary"
            sx={{
              mb: 4,
              fontSize: `${fontSize * 1.2}px`,
            }}
          >
            Adaptado para tus necesidades
          </Typography>

          <Input
            label="Correo Electrónico"
            labelSize="small"
            placeholder="Introduce tu correo"
            fullWidth
            sx={{ maxWidth: 400, mx: 'auto', mb: 3 }}
          />

          <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button variant={isLoggedIn ? 'secondary' : 'primary'} onClick={toggleLogin} size="small">
              {isLoggedIn ? 'Cerrar Sesión' : 'Iniciar Sesión'} (Demo)
            </Button>

            <Button variant="primary" size="small">
              Explorar
            </Button>
          </Box>
        </Box>
      </Container>

      <Footer />
    </Box>
  );
}
