import React from "react";
import { Box, Typography, IconButton } from "@mui/material";
import { Facebook, Instagram, Twitter } from "@mui/icons-material";

function Footer() {
  return (
    <Box
      sx={{
        backgroundColor: "#1976d2",
        color: "white",
        textAlign: "center",
            py: 6,
            px: 2,
        mt: "auto",
      }}
    >
      <Typography variant="h2">Pagina de rehabilitacion </Typography>
      <Typography variant="body2" sx={{ mb: 1 }}>
        © {new Date().getFullYear()} Todos los derechos reservados
      </Typography>

      {/* Iconos de redes sociales */}
      <Box>
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
