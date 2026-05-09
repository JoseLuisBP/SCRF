import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
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

export default function Routines() {
  const { logout } = useAuth();

  const [user, setUser] = useState(null);
  const [rutinaML, setRutinaML] = useState(null);

  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingRutinaML, setLoadingRutinaML] = useState(false);

  const [error, setError] = useState(null);

  // 🔥 Modal estado
  const [openModal, setOpenModal] = useState(false);
  const [duracion, setDuracion] = useState("");
  const [notas, setNotas] = useState("");

  // 🔹 Obtener usuario
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

  // 🔹 Generar rutina ML
  const generarRutina = async () => {
    if (!user) return;

    setLoadingRutinaML(true);
    setError(null);

    try {
      const res = await axiosInstance.post(
        `/v1/recommendations/${user.id_usuario}`,
        {}
      );

      setRutinaML(res.data);
      window.scrollTo({ top: 0, behavior: "smooth" });

    } catch (err) {
      console.error(err);
      setError("Error al generar rutina inteligente");
    }

    setLoadingRutinaML(false);
  };

  // 🔥 Guardar progreso
  const guardarProgreso = async () => {
    try {
      await axiosInstance.post("/v1/progreso", {
        id_rutina: rutinaML?.rutina_generada?.id_rutina || null,
        duracion_real: Number(duracion),
        estado: "completado",
        notas,
        grupo_trabajado: rutinaML?.grupo_objetivo,
      });

      // reset
      setOpenModal(false);
      setDuracion("");
      setNotas("");

      // 🔥 generar siguiente rutina automáticamente
      generarRutina();

    } catch (err) {
      console.error(err);
      setError("Error al guardar progreso");
    }
  };

  if (loadingUser) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",

          background: (theme) =>
            theme.palette.mode === "dark"
              ? "#000000"
              : "#ffffff",
        }}
      >
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

        color: (theme) =>
          theme.palette.mode === "dark"
            ? "#ffffff"
            : "#000000",

        transition: "all 0.3s ease",

        pb: 10,
      }}
    >
      <Header showSearchBar={false} />

      <Container
        maxWidth="lg"
        sx={{
          mt: 10,
          transition: "all 0.3s ease",
        }}
      >
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* 🔹 Rutina Inteligente */}
        <Box sx={{ display: "flex", justifyContent: "center", mb: 6 }}>
          <Card
            sx={{
              width: "100%",
              borderRadius: 4,
              boxShadow: 3,

              backgroundColor: (theme) =>
                theme.palette.mode === "dark"
                  ? "#111111"
                  : "#ffffff",

              color: (theme) =>
                theme.palette.mode === "dark"
                  ? "#ffffff"
                  : "#000000",

              transition: "all 0.3s ease",
            }}
          >
            <CardContent sx={{ p: { xs: 2, md: 4 } }}>

              <Typography
                variant="h4"
                textAlign="center"
                mb={1}
                fontWeight="bold"
              >
                Rutina Inteligente
              </Typography>

              <Typography
                textAlign="center"
                mb={3}
                sx={{
                  color: (theme) =>
                    theme.palette.mode === "dark"
                      ? "#cccccc"
                      : "text.secondary",
                }}
              >
                Genera una rutina personalizada basada en tu perfil clínico usando Machine Learning.
              </Typography>

              <Box textAlign="center" mb={rutinaML ? 4 : 0}>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  onClick={generarRutina}
                  disabled={loadingRutinaML}
                  sx={{
                    px: 4,
                    py: 1.5,
                    borderRadius: 2,
                    transition: "all 0.3s ease",
                  }}
                >
                  {loadingRutinaML
                    ? "Generando..."
                    : "+ Generar Rutina Inteligente"}
                </Button>
              </Box>

              {rutinaML && (
                <Box
                  sx={{
                    mt: 2,
                    p: 2,

                    bgcolor: (theme) =>
                      theme.palette.mode === "dark"
                        ? "#1a1a1a"
                        : "rgba(0,0,0,0.02)",

                    borderRadius: 3,

                    transition: "all 0.3s ease",
                  }}
                >

                  {/* 🔥 Ruta + badge */}
                  <RutaCard
                    ruta={rutinaML.ruta_ml}
                    badge={rutinaML.rutina_generada?.verification_badge}
                    verified={rutinaML.rutina_generada?.is_verified_by_physio}
                  />

                  {/* 🔥 Zona del día */}
                  <Typography
                    variant="h5"
                    textAlign="center"
                    mt={2}
                    fontWeight="bold"
                  >
                    Zona del día: {rutinaML.grupo_objetivo?.toUpperCase()}
                  </Typography>

                  {/* 🔹 Info usuario */}
                  <UserInfo info={rutinaML.inference_features} />

                  {/* 🔹 Árbol decisión */}
                  <DecisionTree data={rutinaML} />

                  {/* 🔹 Ejercicios */}
                  <ExerciseList
                    exercises={rutinaML.rutina_generada.ejercicios_habilitados}
                  />

                  {/* 🔥 Botón terminar */}
                  <Button
                    variant="contained"
                    color="success"
                    fullWidth
                    sx={{
                      mt: 4,
                      transition: "all 0.3s ease",
                    }}
                    onClick={() => setOpenModal(true)}
                  >
                    Terminar rutina
                  </Button>

                </Box>
              )}
            </CardContent>
          </Card>
        </Box>
      </Container>

      {/* 🔥 MODAL */}
      <Dialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        PaperProps={{
          sx: {
            backgroundColor: (theme) =>
              theme.palette.mode === "dark"
                ? "#111111"
                : "#ffffff",

            color: (theme) =>
              theme.palette.mode === "dark"
                ? "#ffffff"
                : "#000000",

            transition: "all 0.3s ease",
          },
        }}
      >
        <DialogTitle>Registrar progreso</DialogTitle>

        <DialogContent>
          <TextField
            label="Duración (minutos)"
            fullWidth
            value={duracion}
            onChange={(e) => setDuracion(e.target.value)}
            sx={{
              mb: 2,
              mt: 1,

              input: {
                color: (theme) =>
                  theme.palette.mode === "dark"
                    ? "#ffffff"
                    : "#000000",
              },

              label: {
                color: (theme) =>
                  theme.palette.mode === "dark"
                    ? "#cccccc"
                    : "#000000",
              },

              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: (theme) =>
                    theme.palette.mode === "dark"
                      ? "#555"
                      : "#ccc",
                },

                "&:hover fieldset": {
                  borderColor: (theme) =>
                    theme.palette.mode === "dark"
                      ? "#888"
                      : "#000",
                },
              },
            }}
          />

          <TextField
            label="Notas"
            fullWidth
            multiline
            rows={3}
            value={notas}
            onChange={(e) => setNotas(e.target.value)}
            sx={{
              input: {
                color: (theme) =>
                  theme.palette.mode === "dark"
                    ? "#ffffff"
                    : "#000000",
              },

              textarea: {
                color: (theme) =>
                  theme.palette.mode === "dark"
                    ? "#ffffff"
                    : "#000000",
              },

              label: {
                color: (theme) =>
                  theme.palette.mode === "dark"
                    ? "#cccccc"
                    : "#000000",
              },

              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: (theme) =>
                    theme.palette.mode === "dark"
                      ? "#555"
                      : "#ccc",
                },

                "&:hover fieldset": {
                  borderColor: (theme) =>
                    theme.palette.mode === "dark"
                      ? "#888"
                      : "#000",
                },
              },
            }}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenModal(false)}>
            Cancelar
          </Button>

          <Button
            onClick={guardarProgreso}
            variant="contained"
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}