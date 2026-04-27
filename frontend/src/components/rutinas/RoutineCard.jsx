import { Card, CardContent, Typography, Chip, Button, Box, Stack } from '@mui/material';
import VerificationBadge from '../common/VerificationBadge';

/**
 * Componente RoutineCard
 * ----------------------
 * Representa visualmente una rutina en el catálogo.
 *
 * Props:
 * - routine: objeto con la información de la rutina (RutinaPublicOut)
 * - onViewDetails: función que se ejecuta al hacer clic en "Ver Ejercicios"
 */
export default function RoutineCard({ routine, onViewDetails }) {
  return (
    <Card
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 3,
        boxShadow: 2,
        backgroundColor: 'rgba(255,255,255,0.95)',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Typography
            fontWeight="bold"
            sx={{
              fontSize: { xs: '1.25rem', sm: '1.5rem' },
              lineHeight: 1.2,
              mb: 1,
              flex: 1,
              pr: 1
            }}
          >
            {routine.nombre_rutina}
          </Typography>
        </Box>

        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 2 }}>
          {routine.categoria && (
            <Chip label={routine.categoria} color="primary" size="small" variant="outlined" />
          )}
          {routine.nivel && (
            <Chip label={`Nivel: ${routine.nivel}`} color="default" size="small" />
          )}
          {routine.duracion_estimada && (
            <Chip label={`${routine.duracion_estimada} min`} color="default" size="small" />
          )}
        </Stack>

        <Box sx={{ mb: 2 }}>
            <VerificationBadge badge={routine.verification_badge || "ml_generated"} />
        </Box>

        <Typography
          color="text.secondary"
          sx={{
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {routine.descripcion || "Sin descripción disponible."}
        </Typography>

      </CardContent>

      <Box sx={{ p: 2, pt: 0 }}>
        <Button
          variant="outlined"
          fullWidth
          onClick={() => onViewDetails(routine)}
        >
          Ver Ejercicios
        </Button>
      </Box>
    </Card>
  );
}
