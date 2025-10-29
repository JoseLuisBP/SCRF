import React from "react";
import { Card as MuiCard, CardContent, CardMedia, Typography } from "@mui/material";
import { useAccessibility } from "../../context/AccessibilityContext"; 
function Card({ title, description, image }) {
  const { fontSize } = useAccessibility(); 
 
  const fontSizeMap = {
    small: "0.9rem",
    medium: "1rem",
    large: "1.2rem",
    xlarge: "1.4rem",
  };

  const appliedFontSize = fontSizeMap[fontSize] || "1rem";

  return (

       
  

    <MuiCard
      sx={{
        width: "clamp(250px, 30vw, 350px)",
        boxShadow: 3,
        borderRadius: 2,
        transition: "transform 0.3s ease",
        "&:hover": {
          transform: "translateY(-5px)",
        },
      }}
    >
      <CardMedia
        component="img"
        height="180"
        image={image}
        alt={title}
        sx={{
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
          objectFit: "cover",
        }}
      />

      <CardContent>
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
          color="text.secondary"
          sx={{
            fontSize: appliedFontSize,
            lineHeight: 1.5,
          }}
        >
          {description}
        </Typography>
      </CardContent>
    </MuiCard>
  );
}

export default Card;
