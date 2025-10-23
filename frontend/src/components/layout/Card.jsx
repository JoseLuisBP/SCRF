import React from "react";
import { Card as MuiCard, CardContent, CardMedia, Typography } from "@mui/material";

function Card({ title, description, image }) {
  return (
    <MuiCard
      sx={{
        width: 300,
        borderRadius: 3,
        boxShadow: 3,
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
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
        }}
      />

      <CardContent>
        <Typography
          variant="h6"
          gutterBottom
          sx={{
            fontSize: "clamp(16px, 1.2vw, 20px)", // 🔹 Tamaño mínimo de 16 px
            fontWeight: "bold",
          }}
        >
          {title}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            fontSize: "clamp(16px, 1vw, 18px)", // 🔹 También mínimo 16 px
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