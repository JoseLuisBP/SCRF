import {
  Card,
  CardContent,
  Typography,
  Chip,
  Button,
  Box,
  IconButton,
} from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useState } from 'react';

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
  console.log(exercise);

  // Estado para mostrar/ocultar video
  const [showVideo, setShowVideo] = useState(false);

  // Convertir URL de YouTube a embed
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

  const videoUrl = getEmbedUrl(exercise.videoUrl);
  console.log(exercise);
  return (
    <Card
      sx={{
        width: '100%',
        height: '100%',
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

        {/* Descripción */}
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

        {/*  FLECHA PARA VIDEO */}
        {videoUrl && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                setShowVideo(!showVideo);
              }}
              sx={{
                transform: showVideo ? 'rotate(90deg)' : 'rotate(0deg)',
                transition: '0.3s',
              }}
            >
              <ArrowForwardIosIcon />
            </IconButton>
          </Box>
        )}

        {/* VIDEO */}
        {showVideo && videoUrl && (
          <Box mt={2}>
            <Box
              component="iframe"
              width="100%"
              height="200"
              src={videoUrl}
              title="video"
              frameBorder="0"
              allowFullScreen
            />
          </Box>
        )}
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