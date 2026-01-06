// Importa React y los componentes de MUI necesarios.
import React from "react";
import { Card as MuiCard, CardContent, Typography, Box } from "@mui/material";
// Importa el contexto de accesibilidad, para obtener el tamaño de fuente dinámico.
import { useAccessibility } from "../../context/AccessibilityContext";

// Componente Card que recibe título, descripción, imagen y estilos extra (sx)
function Card({ title, description, image, sx = {} }) {
  // Obtiene el tamaño de fuente global definido en el contexto de accesibilidad.
  const { fontSize } = useAccessibility(); 

  // Mapa que asocia nombres de tamaños con valores reales en "rem"
  const fontSizeMap = {
    small: "0.9rem",
    medium: "1rem",
    large: "1.2rem",
    xlarge: "1.4rem",
  };

   // Determina el tamaño de fuente que usará la tarjeta.
  // Si no encuentra el tamaño, usa 1rem por defecto.
  const appliedFontSize = fontSizeMap[fontSize] || "1rem";

  return (

    <MuiCard
      sx={{
        width: "clamp(250px, 30vw, 350px)",
        height: "320px",
        position: "relative",
        borderRadius: 3,
        overflow: "hidden",
        boxShadow: 4,
        backgroundImage: `url(${image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        transition: "transform 0.3s ease",      // Animación en hover  
        "&:hover": {
          transform: "translateY(-6px)",        // Efecto elevar tarjeta
        },
        ...sx,
          }}
    >

       {/* Capa oscura encima de la imagen para mejorar la legibilidad del texto */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.8))",
        }}
      />

 {/* Contenedor del contenido textual (título y descripción) */}
      <CardContent
        sx={{
          position: "absolute",
          bottom: 0,
          color: "white",
          p: 3,
        }}
      >
        
        {title && (
          <Typography
            variant="h6"
            gutterBottom
            sx={{
              fontSize: `calc(${appliedFontSize} + 0.25rem)`,
              fontWeight: "bold",
            }}
          >
            {title}
          </Typography>
        )}

        <Typography
          variant="body2"
          sx={{
            fontSize: appliedFontSize,
            lineHeight: 1.5,
            color: "rgba(255,255,255,0.9)",
          }}
        >
          {description}
        </Typography>
      </CardContent>
    </MuiCard>
  );
}

export default Card;




