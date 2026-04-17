import { Card, CardContent, Typography, Stack, Chip } from "@mui/material";

export default function UserInfo({ info }) {
  return (
    <Card sx={{ mb: 3, borderRadius: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Datos analizados
        </Typography>

        <Stack direction="row" spacing={1} flexWrap="wrap">
          <Chip label={`Edad: ${info.edad}`} />
          <Chip label={`Nivel: ${info.nivel_fisico}`} />
          <Chip label={`Objetivo: ${info.objetivo}`} />
          <Chip
            label={info.tiene_lesion ? "Con lesión" : "Sin lesión"}
            color={info.tiene_lesion ? "warning" : "success"}
          />
        </Stack>
      </CardContent>
    </Card>
  );
}