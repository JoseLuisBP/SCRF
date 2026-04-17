import { Card, CardContent, Typography, Chip, Stack } from "@mui/material";

const colores = {
  "Rehabilitación": "success",
  "Adulto Mayor": "primary",
  "Fuerza/Joven": "error",
  "Híbrido": "secondary",
};

export default function RutaCard({ ruta }) {
  return (
    <Card sx={{ mb: 3, borderRadius: 3 }}>
      <CardContent>
        <Stack spacing={2}>
          <Typography variant="h5">
            Ruta recomendada
          </Typography>

          <Chip
            label={ruta}
            color={colores[ruta] || "default"}
            sx={{ fontSize: "1rem", p: 2, width: "fit-content" }}
          />
        </Stack>
      </CardContent>
    </Card>
  );
}