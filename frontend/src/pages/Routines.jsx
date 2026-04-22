import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Card,
  CardContent
} from "@mui/material";

import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { authAPI } from "../api";
import axios from "axios";

import Header from "../components/layout/Header";

// Componentes
import RutaCard from "../components/rutinas/RutaCard";
import UserInfo from "../components/rutinas/UserInfo";
import DecisionTree from "../components/rutinas/DecisionTree";
import ExerciseList from "../components/rutinas/EjerciciosList";

export default function Routines() {
  const { logout } = useAuth();

  const [user, setUser] = useState(null);
  const [rutina, setRutina] = useState(null);

  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingRutina, setLoadingRutina] = useState(false);

  const [error, setError] = useState(null);

  // 🔹 1. Obtener usuario (igual que Dashboard)
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

  // 🔹 2. Generar rutina con ML
  const generarRutina = async () => {
    if (!user) return;

    setLoadingRutina(true);

    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        `http://localhost:8000/api/v1/recommendations/${user.id_usuario}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setRutina(res.data);
    } catch (err) {
      console.error(err);
      setError("Error al generar rutina");
    }

    setLoadingRutina(false);
  };

  // 🔹 Loading usuario
  if (loadingUser) {
    return (
      <Box sx={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  // 🔹 Error
  if (error) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  //cambia el fondo dependiendo si el usuario usa el modo claro u oscuro
  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: (theme) =>
          `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.secondary.main} 100%)`,
        pb: 10,
        transition: "background 0.3s ease"
      }}
    >
      <Header showSearchBar={false} />

      <Box sx={{ mt: 8, display: "flex", justifyContent: "center" }}>
        <Card sx={{ width: "90%", maxWidth: 1000, borderRadius: 4 }}>
          <CardContent>

            {/* 🔹 Header */}
            <Typography variant="h4" textAlign="center" mb={3}>
              Rutina Inteligente
            </Typography>

            <Typography textAlign="center" mb={3}>
              Genera una rutina personalizada basada en tu perfil
            </Typography>

            {/* 🔹 Botón */}
            <Box textAlign="center" mb={3}>
              <Button
                variant="contained"
                onClick={generarRutina}
                disabled={loadingRutina}
              >
                {loadingRutina ? "Generando..." : "Generar rutina"}
              </Button>
            </Box>

            {/* 🔹 Resultado */}
            {rutina && (
              <>
                <RutaCard ruta={rutina.ruta_ml} />

                <UserInfo info={rutina.inference_features} />

                <DecisionTree data={rutina} />

                <ExerciseList
                  exercises={rutina.rutina_generada.ejercicios_habilitados}
                />
              </>
            )}

          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}