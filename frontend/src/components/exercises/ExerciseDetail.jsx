import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Chip,
  Box,
} from '@mui/material';

/**
 * Componente ExerciseDetail
 * ------------------------
 * Muestra el detalle completo de un ejercicio en un modal.
 *
 * Props:
 * - exercise: ejercicio seleccionado
 * - onClose: función para cerrar el modal
 */
export default function ExerciseDetail({ exercise, onClose }) {
  return (
    <Dialog open onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{exercise.nombre_ejercicio}</DialogTitle>

      <DialogContent>
        <Chip
          label={exercise.categoria}
          color="success"
          size="small"
          sx={{ mb: 2 }}
        />

        <Typography paragraph>
          {exercise.descripcion}
        </Typography>

        {exercise.repeticiones && (
          <Typography>
            <strong>Repeticiones:</strong> {exercise.repeticiones}
          </Typography>
        )}

        {exercise.tiempo && (
          <Typography>
            <strong>Tiempo:</strong> {exercise.tiempo} segundos
          </Typography>
        )}

        {exercise.advertencias && (
          <Box mt={2}>
            <Typography color="error">
              {exercise.advertencias}
            </Typography>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}
