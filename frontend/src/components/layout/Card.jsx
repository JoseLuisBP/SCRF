import React from "react";
import { Card as MuiCard, CardContent, Typography, Box } from "@mui/material";
import { useAccessibility } from "../../context/AccessibilityContext";

function Card({ title, description, image, sx = {} }) {
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
        height: "320px",
        position: "relative",
        borderRadius: 3,
        overflow: "hidden",
        boxShadow: 4,
        backgroundImage: `url(${image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        transition: "transform 0.3s ease",
        "&:hover": {
          transform: "translateY(-6px)",
        },
        ...sx,
          }}
    >
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.8))",
        }}
      />

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




