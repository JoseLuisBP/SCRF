import { Box, Container, Typography } from '@mui/material';
import Header from '../components/layout/Header';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { useAuth } from '../context/AuthContext';

import ejercicioImg from '../assets/images/ejercicio.jpeg';

import Card from '../components/layout/Card';

export default function Home() {
  const { isLoggedIn, toggleLogin } = useAuth();

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
      
      <Container maxWidth='md' sx={{ mt: 12, mb: 4 }}>
        <Box sx={{ 
          textAlign: 'center', 
          py: 6,
          px: 2,
          backgroundColor: 'background.paper',
          borderRadius: 2,
          boxShadow: theme => `0 8px 32px ${theme.palette.primary.main}20`,
          transition: 'transform 0.2s ease',
          '&:hover': {
            transform: 'translateY(-3px)'
          }
        }}>
          <Typography 
            variant="h2" 
            component="h1" 
            gutterBottom
            sx={{
              fontSize: { xs: '2.5rem', md: '3.75rem' },
              fontWeight: 'bold'
            }}
          >
            Bienvenido :)
          </Typography>
          
          <Typography 
            variant="h5" 
            component="h2" 
            gutterBottom 
            color="text.secondary"
            sx={{ mb: 4 }}
          >
            Adaptado para tus necesidades
          </Typography>

          <Input
            label="Correo Electrónico"
            labelSize='small'
            placeholder="introduce tu correo"
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

            <Button 
              variant="primary"
              size="small"
            >
              Explorar
            </Button>
          </Box> 
        </Box>

         <Box
          sx={{
            mt: 8,
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: 3,
          }}
        >
          <Card
            title="Que es "
            description="Es un sistema accesible que facilite la recuperación, conservación y fortalecimiento de movilidad, fuerza y flexibilidad en adultos mayores, personas en rehabilitación física y población interesada en prevenir riesgos de salud."
            image={ejercicioImg}
          />
          <Card
            title="Para que"
            description="Ejercicios"
            image={ejercicioImg}
          />  
           </Box>

       


      </Container>
    </Box>
  );
}
