import { useState, useEffect } from "react";
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
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

export default function Exercises() {
  const [category, setCategory] = useState("");
  const [exercises, setExercises] = useState([]);
  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/api/v1/exercises")
      .then((res) => res.json())
      .then((data) => setExercises(data))
      .catch((err) => console.error("Error cargando ejercicios:", err));
  }, []);

  useEffect(() => {
    if (category) {
      setFiltered(exercises.filter((e) => e.categoria === category));
    } else {
      setFiltered(exercises);
    }
  }, [category, exercises]);

  const categories = [...new Set(exercises.map((e) => e.categoria))];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: (theme) =>
          `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.secondary.main} 100%)`,

        color: "text.primary",
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

        {/* Grid de tarjetas */}
        <Grid container spacing={3} justifyContent="center">
          {filtered.length > 0 ? (
            filtered.map((ex) => (
              <Grid
                item
                key={ex.id_ejercicio}
                xs={12}
                sm={6}
                md={4}
                lg={3}
                sx={{ display: "flex", justifyContent: "center" }}
              >
                <Card
                  sx={{
                    width: "100%",
                    maxWidth: 320,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    height: "100%",
                    borderRadius: 3,
                    boxShadow: 4,
                    backgroundColor: "rgba(255,255,255,0.9)",
                    p: 2,
                    transition: "transform 0.2s, box-shadow 0.2s",
                    "&:hover": {
                      transform: "translateY(-5px)",
                      boxShadow: 6,
                    },
                  }}
                >
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      {ex.nombre_ejercicio}
                    </Typography>
                    <Chip
                      label={ex.categoria}
                      color="success"
                      size="small"
                      sx={{ mb: 1 }}
                    />
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                      sx={{ mb: 1 }}
                    >
                      {ex.descripcion}
                    </Typography>

                    {ex.repeticiones && (
                      <Typography>
                        <b>Repeticiones:</b> {ex.repeticiones}
                      </Typography>
                    )}
                    {ex.tiempo && (
                      <Typography>
                        <b>Tiempo:</b> {ex.tiempo} seg
                      </Typography>
                    )}

                    {ex.advertencias && (
                      <Typography
                        variant="body2"
                        color="error"
                        sx={{ mt: 1, fontStyle: "italic" }}
                      >
                        {ex.advertencias}
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ mt: 4, textAlign: "center", width: "100%" }}
            >
              No hay ejercicios en esta categoría.
            </Typography>
          )}
        </Grid>
      </Container>

      <Footer />
    </Box>
  );
}
