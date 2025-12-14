import { Box } from '@mui/material';
import { useState } from 'react';
import ExerciseCard from './ExerciseCard';
import ExerciseDetail from './ExerciseDetail';

/**
 * ExerciseList
 * ------------
 * Renderiza los ejercicios usando CSS Grid para que
 * siempre ocupen todo el ancho disponible.
 */
export default function ExerciseList({ exercises }) {
  const [selectedExercise, setSelectedExercise] = useState(null);

  return (
    <>
      {/* Grid responsivo real */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',                          // 1 columna en móvil
            sm: 'repeat(2, 1fr)',               // 2 columnas
            md: 'repeat(3, 1fr)',               // 3 columnas
            lg: 'repeat(auto-fit, minmax(280px, 1fr))',
          },
          gap: 3,
          alignItems: 'stretch',
        }}
      >
        {exercises.map((exercise) => (
          <ExerciseCard
            key={exercise.id_ejercicio}
            exercise={exercise}
            onViewDetails={setSelectedExercise}
          />
        ))}
      </Box>

      {/* Modal de detalles */}
      {selectedExercise && (
        <ExerciseDetail
          exercise={selectedExercise}
          onClose={() => setSelectedExercise(null)}
        />
      )}
    </>
  );
}
