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
import cuerpo2Img from '../assets/images/cuerpo2.jpg';
import cuerpo3Img from '../assets/images/cuerpo3.jpg';
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

      <Container maxWidth="lg" sx={{ mt: 12, mb: 4 }}>

      

       
          
          <Box id="inicio" sx={{ textAlign: 'center', mb: 8 }}>
          <Box
            id="sobre-nosotros"
          sx={{
           mt: 8,
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: fontSize > 18 ? 5 : 3, 
            
          }}
        >
           
          <Card
            
            title="Sobre Nosotros"
            description=" ¿Quieres sentirte mejor, tener mas energia y cuida tu salud sin salir de casa ? ¡Estas en el lugar correcto! Activate en casa encontraras rutinas simples, efectivas y adaptadas para cualquier persona, sin importar la edad o condicion fisica."
             image={cuerpoImg}
            sx={{
              flexBasis: {
                xs: '100%',
                sm: fontSize > 18 ? '100%' : '80%',
                md: fontSize > 20 ? '100%' : '90%',
              },
              maxWidth: {
                xs: '100%',
                sm: fontSize > 18 ? '100%' : '80%',
                md: fontSize > 20 ? '100%' : '90%',
              },
              flexGrow: 1,
            }}
          />
          </Box>
          
               <Box
            id="beneficios"
          sx={{
           mt: 8,
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: fontSize > 18 ? 5 : 3, 
            
          }}
        >
           <Card
            title="Beneficios"
            description="Es un sistema accesible que facilite la recuperación, conservación y fortalecimiento de movilidad, fuerza y flexibilidad en adultos mayores, personas en rehabilitación física y población interesada en prevenir riesgos de salud."
            image={ejercicioImg}
            sx={{
              flexBasis: {
                xs: '100%',
                sm: fontSize > 18 ? '100%' : '80%',
                md: fontSize > 20 ? '100%' : '90%',
              },
              maxWidth: {
                xs: '100%',
                sm: fontSize > 18 ? '100%' : '80%',
                md: fontSize > 20 ? '100%' : '90%',
              },
              flexGrow: 1,
            }}
          />
          </Box>

             <Box
            id="contacto"
          sx={{
           mt: 8,
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: fontSize > 18 ? 5 : 3, 
            
          }}
        >
         

          <Card
            title="contacto"
            description=" La importancia de la actividad física en la prevención  de enfermedades crónicas y en la mejora de la calidad de vida en adultos mayores. Según la Organización Mundial de la Salud (OMS), el envejecimiento activo se basa en la optimización de las oportunidades de salud, participación y seguridad. Proyectos tecnológicos similares, como aplicaciones de fisioterapia o plataformas de ejercicio, suelen carecer de una orientación especializada hacia personas mayores o en rehabilitación, por lo que el presente sistema busca cubrir esa brecha mediante un enfoque inclusivo, accesible y sustentado en inteligencia artificial."
            image={onuImg}
            sx={{
              flexBasis: {
                xs: '100%',
                sm: fontSize > 18 ? '100%' : '80%',
                md: fontSize > 20 ? '100%' : '90%',
              },
              maxWidth: {
                xs: '100%',
                sm: fontSize > 18 ? '100%' : '80%',
                md: fontSize > 20 ? '100%' : '90%',
              },
              flexGrow: 1,
            }}
          />
        </Box> 
          
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
            <Button
              variant={isLoggedIn ? 'secondary' : 'primary'}
              onClick={toggleLogin}
              size="small"
            >
              {isLoggedIn ? 'Cerrar Sesión' : 'Iniciar Sesión'} (Demo)
            </Button>

            <Button variant="primary" size="small">
              Explorar
            </Button>
          </Box>
        </Box>
        </Box>
      
      
      </Container>
      <Footer />
    </Box>
    
  );
}