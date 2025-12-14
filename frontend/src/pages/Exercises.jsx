
//Importaciones 
import { useState, useEffect } from "react";
//Componentes de Material UI

import { useState, useEffect } from 'react';

import {
  Box,
  Container,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,

  Grid,
  Card,
  CardContent,
  Chip,
} from "@mui/material";
//Componentes de Layout
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

//Componentes exercises
//Mustra ejercicios y permite mostrarlos por categoria 
export default function Exercises() {
 // Categoría seleccionada en el filtro
  const [category, setCategory] = useState("");
  // Lista completa de ejercicios obtenidos del backend

} //from '@mui/material';

import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import ExerciseList from '../components/exercises/ExerciseList';

/**
 * Vista principal de ejercicios
 */
export default function Exercises() {
  const [category, setCategory] = useState('');

  const [exercises, setExercises] = useState([]);
  // Lista filtrada según la categoría
  const [filtered, setFiltered] = useState([]);
  const [error, setError] = useState(null);


  //Obtener ejercicios del backend

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

  //Filtra ejercicios por categoria seleccionado

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

  //Componentes 
  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: (theme) =>
          `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.secondary.main} 100%)`,
        color: 'text.primary',
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
