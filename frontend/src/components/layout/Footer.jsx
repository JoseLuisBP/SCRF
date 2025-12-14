
import React from "react";
import { Box, Typography, IconButton } from "@mui/material";
// Importa los íconos que se usarán en el footer
import { Facebook, Instagram, Email, Phone, Twitter } from "@mui/icons-material";

// Define el componente Footer como una función.
function Footer ()  {
  return (
     // Caja principal que contiene todo el footer.
    // Se usa Box porque permite aplicar estilos fácilmente con sx.
    //Como fondo, texto, centrar texto, sombra de texto
    <Box
      sx={{
        backgroundColor: "#1976d2",
        color: "white",
        textAlign: "center",
            py: 6,
            px: 2,
            
        mt: "auto",
        boxShadow: (theme) => `0 -8px 24px ${theme.palette.primary.main}40`,
      }}
    >

      // Título principal del footer
      <Typography variant="h6" gutterBottom>
        Pagina de rehabilitación
      </Typography>

// Texto secundario (derechos reservados)
      <Typography 
        variant="h4"
        sx={{
          fontWeight:"bold",
          mb: 2,
          fontSize: {xs: "0.9rem", md: "1rem"},
          opacity: 0.9,
        }}
      >
        © {new Date().getFullYear()} Todos los derechos reservados
      </Typography>

      {/* Iconos de redes sociales */}
      <Box>
        <IconButton
          href="paginacontacto@rehabilitacion.com"
          color="inherit"
        >
          <Email />
        </IconButton>

        <IconButton
          href="tel:3314789570"
          color="inherit"
        >
          <Phone />
        </IconButton>

        <IconButton
          href="https://www.facebook.com"
          target="_blank"
          rel="noopener"
          color="inherit"
        >
          <Facebook />
        </IconButton>
        <IconButton
          href="https://www.instagram.com"
          target="_blank"
          rel="noopener"
          color="inherit"
        >
          <Instagram />
        </IconButton>
        
      </Box>
    </Box>
  );
}

export default Footer;
