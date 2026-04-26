import { Card, CardContent, Typography, Chip, Stack, Box } from "@mui/material";
import VerificationBadge from "../common/VerificationBadge";

const colores = {
  "Rehabilitación": "success",
  "Adulto Mayor": "primary",
  "Fuerza/Joven": "error",
  "Híbrido": "secondary",
};

/**
 * @param {string} ruta          - Ruta ML predicha por CART
 * @param {string} [badge]       - "ml_generated" | "ml_verified" | "physio_verified"
 * @param {boolean} [verified]   - is_verified_by_physio flag
 */
export default function RutaCard({ ruta, badge, verified }) {
  return (
    <Card sx={{ mb: 3, borderRadius: 3 }}>
      <CardContent>
        <Stack spacing={2}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 1 }}>
            <Typography variant="h5">
              Ruta recomendada
            </Typography>
            {/* Badge de estado de verificación clínica */}
            <VerificationBadge badge={badge ?? "ml_generated"} />
          </Box>

          <Chip
            label={ruta}
            color={colores[ruta] || "default"}
            sx={{ fontSize: "1rem", p: 2, width: "fit-content" }}
          />

          {verified && (
            <Typography variant="body2" color="success.main" sx={{ fontWeight: 600 }}>
              ✔ Esta rutina fue revisada por un Fisioterapeuta certificado
            </Typography>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}