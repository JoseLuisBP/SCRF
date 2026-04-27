import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Grid,
  Container,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { authAPI } from "../api";
import axiosInstance from "../api/axios";

import Header from "../components/layout/Header";

// Componentes ML
import RutaCard from "../components/rutinas/RutaCard";
import UserInfo from "../components/rutinas/UserInfo";
import DecisionTree from "../components/rutinas/DecisionTree";
import ExerciseList from "../components/rutinas/EjerciciosList";

// Componentes Galería
import RoutineCard from "../components/rutinas/RoutineCard";
import RoutineDetailsModal from "../components/rutinas/RoutineDetailsModal";

export default function Routines() {
  const { logout } = useAuth();

  const [user, setUser] = useState(null);
  const [rutinaML, setRutinaML] = useState(null);
  const [rutinasCatalogo, setRutinasCatalogo] = useState([]);
  const [filteredRutinas, setFilteredRutinas] = useState([]);
  const [categoriaFilter, setCategoriaFilter] = useState("");

  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingRutinaML, setLoadingRutinaML] = useState(false);
  const [loadingCatalogo, setLoadingCatalogo] = useState(true);

  const [error, setError] = useState(null);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRoutine, setSelectedRoutine] = useState(null);

  // 🔹 1. Obtener usuario
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await authAPI.getCurrentUser();
        setUser(userData);
      } catch (err) {
        console.error(err);
        setError("Error al cargar usuario");
      } finally {
        setLoadingUser(false);
      }
    };

    fetchUser();
  }, []);

  // 🔹 2. Cargar catálogo de rutinas
  useEffect(() => {
    const fetchCatalogo = async () => {
      try {
        const { data } = await axiosInstance.get('/v1/routines');
        setRutinasCatalogo(data);
        setFilteredRutinas(data);
      } catch (err) {
        console.error("Error al cargar catálogo:", err);
      } finally {
        setLoadingCatalogo(false);
      }
    };

    fetchCatalogo();
  }, []);

  // 🔹 3. Filtro por categoría
  useEffect(() => {
    if (categoriaFilter) {
      setFilteredRutinas(rutinasCatalogo.filter((r) => r.categoria === categoriaFilter));
    } else {
      setFilteredRutinas(rutinasCatalogo);
    }
  }, [categoriaFilter, rutinasCatalogo]);

  const categoriasUnicas = [...new Set(rutinasCatalogo.map((r) => r.categoria).filter(Boolean))];

  // 🔹 4. Generar rutina con ML
  const generarRutina = async () => {
    if (!user) return;
    setLoadingRutinaML(true);
    try {
      const res = await axiosInstance.post(`/v1/recommendations/${user.id_usuario}`, {});
      setRutinaML(res.data);
      // Opcional: Hacer scroll suave hacia arriba si el usuario estaba abajo
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error(err);
      setError("Error al generar rutina inteligente");
    }
    setLoadingRutinaML(false);
  };

  const handleOpenModal = (routine) => {
    setSelectedRoutine(routine);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedRoutine(null);
  };

  if (loadingUser) {
    return (
      <Box sx={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: (theme) =>
          theme.palette.mode === "dark"
            ? "#000000"
            : `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.secondary.main} 100%)`,
        pb: 10,
        transition: "background 0.3s ease"
      }}
    >
      <Header showSearchBar={false} />

      <Container maxWidth="lg" sx={{ mt: 10 }}>
        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        {/* 🔹 SECCIÓN 1: Rutina Inteligente (Algoritmo CART) */}
        <Box sx={{ display: "flex", justifyContent: "center", mb: 6 }}>
          <Card sx={{ width: "100%", borderRadius: 4, boxShadow: 3 }}>
            <CardContent sx={{ p: { xs: 2, md: 4 } }}>
              <Typography variant="h4" textAlign="center" mb={1} fontWeight="bold">
                Rutina Inteligente
              </Typography>
              <Typography textAlign="center" color="text.secondary" mb={3}>
                Genera una rutina personalizada basada en tu perfil clínico usando Machine Learning.
              </Typography>

              <Box textAlign="center" mb={rutinaML ? 4 : 0}>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  onClick={generarRutina}
                  disabled={loadingRutinaML}
                  sx={{ px: 4, py: 1.5, borderRadius: 2 }}
                >
                  {loadingRutinaML ? "Generando..." : "+ Generar Rutina Inteligente"}
                </Button>
              </Box>

              {/* Si hay una rutina recién generada, se despliega el visor detallado */}
              {rutinaML && (
                <Box sx={{ mt: 2, p: 2, bgcolor: "rgba(0,0,0,0.02)", borderRadius: 3 }}>
                  <RutaCard
                    ruta={rutinaML.ruta_ml}
                    badge={rutinaML.rutina_generada?.verification_badge}
                    verified={rutinaML.rutina_generada?.is_verified_by_physio}
                  />
                  <UserInfo info={rutinaML.inference_features} />
                  <DecisionTree data={rutinaML} />
                  <ExerciseList exercises={rutinaML.rutina_generada.ejercicios_habilitados} />
                </Box>
              )}
            </CardContent>
          </Card>
        </Box>

        {/* 🔹 SECCIÓN 2: Catálogo / Galería de Rutinas */}
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 4, textAlign: 'center' }}>
          Otras Rutinas Disponibles
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
          <FormControl sx={{ minWidth: 200, bgcolor: 'background.paper', borderRadius: 1 }}>
            <InputLabel id="category-filter-label">Categoría</InputLabel>
            <Select
              labelId="category-filter-label"
              value={categoriaFilter}
              label="Categoría"
              onChange={(e) => setCategoriaFilter(e.target.value)}
            >
              <MenuItem value="">
                <em>Todas</em>
              </MenuItem>
              {categoriasUnicas.map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {cat}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {loadingCatalogo ? (
          <Box display="flex" justifyContent="center" my={4}>
            <CircularProgress color="inherit" />
          </Box>
        ) : (
          <Grid container spacing={4}>
            {filteredRutinas.length > 0 ? (
              filteredRutinas.map((routine) => (
                <Grid item xs={12} sm={6} md={4} key={routine.id_rutina}>
                  <RoutineCard routine={routine} onViewDetails={handleOpenModal} />
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <Typography align="center" color="text.secondary">
                  No hay rutinas disponibles en esta categoría.
                </Typography>
              </Grid>
            )}
          </Grid>
        )}

      </Container>

      {/* 🔹 Modal de Detalles de Rutina */}
      <RoutineDetailsModal
        open={modalOpen}
        onClose={handleCloseModal}
        routine={selectedRoutine}
      />
    </Box>
  );
}