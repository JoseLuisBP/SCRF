import {
  Card,
  CardContent,
  Typography,
  Chip,
  Button,
  Box,
} from '@mui/material';

/**
 * Componente ExerciseCard
 * -----------------------
 * Representa visualmente un ejercicio individual.
 *
 * Props:
 * - exercise: objeto con la información del ejercicio
 * - onViewDetails: función que se ejecuta al hacer clic en "Ver detalles"
 */
export default function ExerciseCard({ exercise, onViewDetails }) {
  return (
    <Card
      sx={{
        width: '100%',
        height: '100%', // Permite que todas las cards tengan la misma altura
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 3,
        boxShadow: 4,
        backgroundColor: 'rgba(255,255,255,0.95)',
        transition: 'transform 0.2s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
        },
      }}
    >
      {/* Contenido principal de la tarjeta */}
      <CardContent sx={{ flexGrow: 1 }}>
        {/* Nombre del ejercicio */}
        <Typography
          fontWeight="bold"
          sx={{
            fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem' },
            mb: 1,
          }}
        >
          {exercise.nombre_ejercicio}
        </Typography>

        {/* Categoría */}
        <Chip
          label={exercise.categoria}
          color="success"
          size="small"
          sx={{ mb: 1 }}
        />

        {/* Descripción (limitada a 3 líneas para evitar cards desiguales) */}
        <Typography
          color="text.secondary"
          sx={{
            fontSize: { xs: '1.05rem', sm: '1.3rem', md: '1.55' },
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {exercise.descripcion}
        </Typography>
      </CardContent>

      {/* Botón de acción, siempre alineado abajo */}
      <Box sx={{ p: 2 }}>
        <Button
          variant="outlined"
          fullWidth
          onClick={() => onViewDetails(exercise)}
        >
          Ver detalles
        </Button>
      </Box>
    </Card>
  );
}
