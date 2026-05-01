import { Box, Typography } from '@mui/material';
import { useState } from 'react';
import ExerciseCard from '../exercises/ExerciseCard';
import ExerciseDetail from '../exercises/ExerciseDetail';

export default function ExerciseList({ exercises }) {
  const [selectedExercise, setSelectedExercise] = useState(null);

  if (!exercises || Object.keys(exercises).length === 0) {
    return (
      <Typography textAlign="center" color="text.secondary">
        No hay ejercicios disponibles
      </Typography>
    );
  }

  return (
    <>
      {Object.entries(exercises).map(([grupo, lista]) => {
        if (!lista || lista.length === 0) return null;

        return (
          <Box key={grupo} sx={{ mb: 4 }}>
            
            {/* 🔥 Título del grupo */}
            <Typography
              variant="h5"
              sx={{
                mb: 2,
                fontWeight: 'bold',
                textTransform: 'capitalize',
              }}
            >
              {grupo}
            </Typography>

            {/* 🔹 Grid */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: 'repeat(2, 1fr)',
                  md: 'repeat(3, 1fr)',
                  lg: 'repeat(auto-fit, minmax(280px, 1fr))',
                },
                gap: 3,
                alignItems: 'stretch',
              }}
            >
              {lista.map((exercise) => (
                <ExerciseCard
                  key={exercise.id_ejercicio}
                  exercise={exercise}
                  onViewDetails={setSelectedExercise}
                />
              ))}
            </Box>
          </Box>
        );
      })}

      {/* 🔥 Modal */}
      {selectedExercise && (
        <ExerciseDetail
          exercise={selectedExercise}
          onClose={() => setSelectedExercise(null)}
        />
      )}
    </>
  );
}