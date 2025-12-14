//Importaciones de librerias como: react, material ui, contexto
import { Box, Container, Typography } from '@mui/material';
import Header from '../components/layout/Header';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Card from '../components/layout/Card';
import { useAuth } from '../context/AuthContext';
import { useAccessibility } from '../context/AccessibilityContext';

{/*Librerias de Carrusel */}
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

{/*Imagenes*/}
import gimnasioImg from '../assets/images/gimnasio.jpg';
import ejercicioImg from '../assets/images/ejercicios.jpg';
import onuImg from '../assets/images/onu.jpg';
import cuerpoImg from '../assets/images/cuerpo.jpg';
import cuerpo2Img from '../assets/images/cuerpo2.jpg';
import cuerpo3Img from '../assets/images/cuerpo3.jpg';
import funcionImg from '../assets/images/funcion.jpg';
import nosotrosImg from '../assets/images/nosotros.jpg';
import beneficioImg from '../assets/images/beneficio.jpg';
import contactoImg from '../assets/images/contacto.jpg';

import Footer from '../components/layout/Footer';
//componentes home 
export default function Home() {
  const { isLoggedIn, toggleLogin } = useAuth();
  const { fontSize } = useAccessibility();

  //configuracion del carrusel 
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 700,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: true,
    adaptiveHeight: true,
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

      <Container maxWidth="lg" sx={{ mt: 12, mb: 4 }}>
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: fontSize > 18 ? 5 : 3,
          }}
        >
          //Contenido carrusel
          <Box
            sx={{
              position: 'relative',
              width: '100%',
              maxWidth: '1000px',
              height: '450px',
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '0 6px 18px rgba(0,0,0,0.25)',
            }}
          >
            {/* Carrusel de imágenes */}
            <Slider
              autoplay
              autoplaySpeed={2500}
              dots={false}
              arrows={false}
              infinite
              speed={800}
              slidesToShow={1}
              slidesToScroll={1}
            >
              {[cuerpoImg, cuerpo2Img, cuerpo3Img,onuImg,ejercicioImg].map((img, i) => (
                <Box
                  key={i}
                  component="img"
                  src={img}
                  alt={`Imagen ${i + 1}`}
                  sx={{
                    width: '100%',
                    height: '450px',
                    objectFit: 'cover',
                  }}
                />
              ))}
            </Slider>


            {/* Texto fijo sobre las imágenes del carrusel*/}
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'rgba(0, 0, 0, 0.45)',
                color: 'white',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                px: 3,
              }}
            >
              <Typography
                variant="h4"
                sx={{
                  mb: 2,
                  fontWeight: 'bold',
                  textShadow: '2px 2px 4px rgba(0,0,0,0.6)',
                  fontSize: { xs: '1.6rem', md: '2rem' },
                }}
              >
               “Tu cuerpo no necesita un gimnasio, solo ganas de moverse.”
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  maxWidth: '700px',
                  fontSize: { xs: '1rem', md: '1.2rem' },
                  textShadow: '1px 1px 3px rgba(0,0,0,0.5)',
                }}
              >
                ¿Quieres sentirte mejor, tener más energía y cuidar tu salud sin salir de casa?
                ¡Estás en el lugar correcto! En  <b>esta pagina</b> encontrarás rutinas simples,
                efectivas y adaptadas para cualquier persona, sin importar la edad o condición física.
              </Typography>
            </Box>
          </Box>
        </Box>
       
       {/*Seccion de Inicio*/}   
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
            description=" Nuestro objetivo es mejorar la calidad de vida de distintos sectores de la población: adultos mayores, personas en recuperación física y aquellos que buscan mantener un estilo de vida saludable y prevenir riesgos futuros. Que ayude a la conservación y el fortalecimiento de capacidades físicas, se reducen riesgos de salud tanto físicos como emocionales, fomentando la independencia y bienestar. Generando asimismo, beneficios indirectos en las familias. "
            image= {nosotrosImg}
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

         {/*Seccion Beneficios */}   
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
            description=" ¿Buscas mejorar tu salud física sin salir de casa? Nuestra página web te ofrece una solución completa con ejercicios diseñados especialmente para la rehabilitación y el bienestar. Aquí tienes lo que te espera:
            • 	 Comodidad total: Realiza rutinas adaptadas desde tu hogar, sin necesidad de equipo especializado.
            • 	 Ejercicios guiados por expertos: Videos y planes creados por profesionales en fisioterapia y entrenamiento funcional.
            • 	 Rehabilitación progresiva: Programas pensados para recuperar movilidad, fuerza y confianza paso a paso.
            • 	 A tu ritmo: Accede a las sesiones cuando quieras, sin presiones ni horarios fijos.
            • 	 Seguimiento personalizado: Herramientas para monitorear tu avance y ajustar tus rutinas según tus necesidades.
            • 	 Bienestar integral: Mejora tu calidad de vida, reduce el dolor y fortalece tu cuerpo con seguridad. "
            image={beneficioImg}
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
        
        {/*Seccion de Contacto*/}
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
            title="Contacto"
            description=" Nos podren encontrar en nuestras redes sociales, correo electronico y en nuestro numero telefonico que se encuentra abajo"
            image={contactoImg}
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