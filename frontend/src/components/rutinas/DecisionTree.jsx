import { Card, CardContent, Typography, Stack, Divider } from "@mui/material";

export default function DecisionTree({ data }) {
  const { edad, tiene_lesion, nivel_fisico } = data.inference_features;

  return (
    <Card sx={{ mb: 3, borderRadius: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Decisión del modelo
        </Typography>

        <Stack spacing={1}>
          <Typography>Edad evaluada: {edad}</Typography>
          <Divider />

          <Typography>Nivel físico: {nivel_fisico}</Typography>
          <Divider />

          <Typography>
            ¿Tiene lesión?: {tiene_lesion ? "Sí" : "No"}
          </Typography>
          <Divider />

          <Typography fontWeight="bold">
            Resultado → {data.ruta_ml}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}