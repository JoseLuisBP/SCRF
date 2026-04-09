// React
import { useState, useEffect } from "react";

// Material UI
import {
  Box,
  Container,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

// Layout
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

// Componentes
import ExerciseList from "../components/exercises/ExerciseList";
/**
 * Vista principal de ejercicios
 * - Obtiene ejercicios desde el backend
 * - Permite filtrar por categoría
 * - Muestra la lista usando componentes reutilizables
 */
export default function Exercises() {
  const [category, setCategory] = useState("");
  const [exercises, setExercises] = useState([]);
{/* Lista filtrada */}
  const [filtered, setFiltered] = useState([]);
    {/* Manejo de errores */}
  const [error, setError] = useState(null);

  /**
  * Cargar ejercicios desde la API
  */
  useEffect(() => {
    const loadExercises = async () => {
      try {
        const response = await fetch(
          "http://localhost:8000/api/v1/exercises"
        );

        if (!response.ok) {
          throw new Error("No se pudieron cargar los ejercicios");
        }

        const data = await response.json();

        /**
         * Adaptamos los datos para incluir videoUrl
         * dependiendo de cómo venga del backend
         */
        const mappedData = data.map((e) => ({
          ...e,
          videoUrl:
            e.videoUrl || // si ya viene directo
            e.video ||       // por si tu backend usa otro nombre
            null,
        }));

        setExercises(mappedData);
      } catch (err) {
        console.error("Error cargando ejercicios:", err);
        setError("No se pudieron cargar los ejercicios");
      }
    };

    loadExercises();
  }, []);

  /**
   * Filtrado
   */
  useEffect(() => {
    if (category) {
      setFiltered(exercises.filter((e) => e.categoria === category));
    } else {
      setFiltered(exercises);
    }
  }, [category, exercises]);

  /**
   * Categorías únicas
   */
  const categories = [...new Set(exercises.map((e) => e.categoria))];

  return (
    <Box
      sx={{
        minHeight: "100vh",
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
          sx={{ fontWeight: "bold", mb: 4 }}
        >
          Ejercicios Disponibles
        </Typography>

        {/* Selector */}
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

        {/* Error */}
        {error && (
          <Typography color="error" align="center" sx={{ mb: 3 }}>
            {error}
          </Typography>
        )}

        {/*Mndamos videoUrl implícito*/}
        <ExerciseList exercises={filtered} />
      </Container>

      <Footer />
    </Box>
  );
}