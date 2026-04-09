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

  // Función para convertir URL de YouTube a formato embed
  const getEmbedUrl = (url) => {
    if (!url) return null;

    if (url.includes("youtu.be")) {
      return url.replace("youtu.be/", "www.youtube.com/embed/");
    }

    if (url.includes("youtube.com/watch?v=")) {
      return url.replace("watch?v=", "embed/");
    }

    return url;
  };

  // Obtener URL del video
  const videoUrl = getEmbedUrl(exercise.videoUrl);

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

        {/* VIDEO DEL EJERCICIO */}
        {videoUrl && (
          <Box mt={3}>
            <Typography variant="subtitle1" gutterBottom>
              Video del ejercicio
            </Typography>

            <Box
              component="iframe"
              width="100%"
              height="250"
              src={videoUrl}
              title="video"
              frameBorder="0"
              allowFullScreen
            />
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}