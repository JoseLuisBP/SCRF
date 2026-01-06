// React
import { useState, useEffect } from 'react';

// Material UI
import {
  Box,
  Container,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';

// Layout
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

// Componentes de ejercicios
import ExerciseList from '../components/exercises/ExerciseList';

/**
 * Vista principal de ejercicios
 * - Obtiene ejercicios desde el backend
 * - Permite filtrar por categoría
 * - Muestra la lista usando componentes reutilizables
 */
export default function Exercises() {
  // Categoría seleccionada
  const [category, setCategory] = useState('');

  // Lista completa de ejercicios
  const [exercises, setExercises] = useState([]);

  // Lista filtrada
  const [filtered, setFiltered] = useState([]);

  // Manejo de errores
  const [error, setError] = useState(null);

  /**
   * Cargar ejercicios desde la API
   */
  useEffect(() => {
    const loadExercises = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/v1/exercises');

        if (!response.ok) {
          throw new Error('No se pudieron cargar los ejercicios');
        }

        const data = await response.json();
        setExercises(data);
      } catch (err) {
        console.error('Error cargando ejercicios:', err);
        setError('No se pudieron cargar los ejercicios');
      }
    };

    loadExercises();
  }, []);

  /**
   * Filtrar ejercicios por categoría
   */
  useEffect(() => {
    if (category) {
      setFiltered(exercises.filter((e) => e.categoria === category));
    } else {
      setFiltered(exercises);
    }
  }, [category, exercises]);

  /**
   * Obtener categorías únicas
   */
  const categories = [...new Set(exercises.map((e) => e.categoria))];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: (theme) =>
          `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.secondary.main} 100%)`,
      }}
    >
      <Header />

      <Container maxWidth="lg" sx={{ mt: 10, mb: 6 }}>
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          sx={{ fontWeight: 'bold', mb: 4 }}
        >
          Ejercicios Disponibles
        </Typography>

        {/* Selector de categoría */}
        <Box display="flex" justifyContent="center" mb={4}>
          <FormControl sx={{ minWidth: 220 }}>
            <InputLabel>Categoría</InputLabel>
            <Select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              label="Categoría"
            >
              <MenuItem value="">Todas</MenuItem>
              {categories.map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Mensaje de error */}
        {error && (
          <Typography color="error" align="center" sx={{ mb: 3 }}>
            {error}
          </Typography>
        )}

        {/* Lista de ejercicios */}
        <ExerciseList exercises={filtered} />
      </Container>

      <Footer />
    </Box>
  );
}
