import { Box, Typography, Button, CircularProgress, Alert, Card, CardContent, Avatar, Grid, Chip } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../api';
import axiosInstance from '../api/axios';
import Header from '../components/layout/Header';

//Graficas
import "chart.js/auto";
import { Line, Bar } from "react-chartjs-2";

//Iconos
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import HeightIcon from "@mui/icons-material/Height";
import ScaleIcon from "@mui/icons-material/Scale";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

//jsPDF para generar el PDF
import { jsPDF } from "jspdf";

//URL de la imagen a descargar
const IMAGE_URL =
  "https://wtrekbnyoeenxlzzxnka.supabase.co/storage/v1/object/public/imagenes/ejercicios/onu.jpg";

// ─────────────────────────────────────────────
// Helpers para procesar el historial real
// ─────────────────────────────────────────────

/**
 * Filtra solo registros sin id_rutina (seguimiento real del usuario)
 */
const filtrarProgresosReales = (historial) =>
  historial.filter((h) => h.id_rutina === null || h.id_rutina === undefined);

/**
 * Construye datos para la gráfica de duración por fecha
 */
const buildDuracionData = (progresos) => {
  // Ordenar por fecha ascendente
  const ordenados = [...progresos].sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
  return {
    labels: ordenados.map((h) => h.fecha),
    data: ordenados.map((h) => h.duracion_real),
  };
};

/**
 * Construye datos para la gráfica de grupos musculares
 */
const buildGruposData = (progresos) => {
  const conteo = {};
  progresos.forEach((h) => {
    if (h.grupo_trabajado) {
      const grupo = h.grupo_trabajado.trim().toLowerCase();
      conteo[grupo] = (conteo[grupo] || 0) + 1;
    }
  });
  return {
    labels: Object.keys(conteo).map((g) => g.charAt(0).toUpperCase() + g.slice(1)),
    data: Object.values(conteo),
  };
};

// ─────────────────────────────────────────────
// Componente principal
// ─────────────────────────────────────────────

export default function Dashboard() {

  const { logout, isPhysio } = useAuth();
  const navigate = useNavigate();

  // Estados
  const [user, setUser] = useState(null);
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(true);
  const [historialLoading, setHistorialLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeChart, setActiveChart] = useState("duracion");

  // Datos procesados del historial real (sin id_rutina)
  const progresosReales = filtrarProgresosReales(historial);
  const duracionData = buildDuracionData(progresosReales);
  const gruposData = buildGruposData(progresosReales);

  // Stats rápidas del historial
  const totalSesiones = progresosReales.length;
  const duracionPromedio =
    totalSesiones > 0
      ? Math.round(progresosReales.reduce((sum, h) => sum + h.duracion_real, 0) / totalSesiones)
      : 0;

  // ── Configuración de cada gráfica ──────────────────────────────────────────

  const chartConfig = {
    duracion: {
      label: "Duración (min)",
      type: "line",
      chartData: {
        labels: duracionData.labels,
        datasets: [
          {
            label: "Duración real (min)",
            data: duracionData.data,
            borderWidth: 2,
            tension: 0.4,
            fill: false,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
          x: { title: { display: true, text: "Fecha" } },
          y: { title: { display: true, text: "Minutos" }, beginAtZero: true },
        },
      },
    },

    grupos: {
      label: "Grupos musculares",
      type: "bar",
      chartData: {
        labels: gruposData.labels,
        datasets: [
          {
            label: "Sesiones",
            data: gruposData.data,
            borderWidth: 1,
            borderRadius: 6,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
          y: {
            title: { display: true, text: "Nº de sesiones" },
            beginAtZero: true,
            ticks: { stepSize: 1 },
          },
        },
      },
    },
  };

  // ── Función PDF ─────────────────────────────────────────────────────────────

  const handleDownloadPDF = () => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = IMAGE_URL;

    img.onload = () => {
      const doc = new jsPDF("p", "mm", "a4");
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const ratio = img.height / img.width;
      const pdfImgWidth = pageWidth;
      const pdfImgHeight = pdfImgWidth * ratio;
      const y = pdfImgHeight < pageHeight ? (pageHeight - pdfImgHeight) / 2 : 0;
      doc.addImage(img, "JPEG", 0, y, pdfImgWidth, pdfImgHeight);
      doc.save("imagen-dashboard.pdf");
    };
  };

  // ── Efectos ─────────────────────────────────────────────────────────────────

  // Obtener datos del usuario autenticado
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        console.log('Token en localStorage:', token ? 'Existe' : 'No existe');

        if (token) {
          try {
            const parts = token.split('.');
            const payload = JSON.parse(atob(parts[1]));
            console.log('Payload del token:', payload);
          } catch (e) {
            console.error('Error al decodificar token:', e);
          }
        }

        const userData = await authAPI.getCurrentUser();
        setUser(userData);
      } catch (err) {
        console.error(err);
        setError('Error al cargar datos del usuario');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // Obtener historial real una vez que tenemos el id del usuario
  useEffect(() => {
    if (!user) return;

    const fetchHistorial = async () => {
      setHistorialLoading(true);

      // /v1/auth/me puede devolver el id con distintos nombres según el backend.
      // Logueamos el objeto completo para que sea fácil de debuggear en consola.
      const userId = user.id_usuario ?? user.id ?? user.sub ?? null;
      console.log('Dashboard — objeto user completo:', user);
      console.log('Dashboard — userId resuelto:', userId);

      if (!userId) {
        console.warn('No se encontró el ID del usuario. Revisa los campos que devuelve /v1/auth/me');
        setHistorialLoading(false);
        return;
      }

      try {
        // Misma convención /v1/ que el resto de rutas del backend
        const { data } = await axiosInstance.get(`/v1/progress/${userId}`);
        console.log('Historial recibido:', data);
        setHistorial(data);
      } catch (err) {
        console.error('Error al cargar historial:', err);
        // No bloqueamos toda la pantalla; la gráfica mostrará estado vacío
      } finally {
        setHistorialLoading(false);
      }
    };

    fetchHistorial();
  }, [user]);

  // ── Pantallas de carga / error ───────────────────────────────────────────────

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ minHeight: '100vh', p: 4 }}>
        <Alert severity='error'>{error}</Alert>
      </Box>
    );
  }

  const activeConfig = chartConfig[activeChart];

  // ── Render principal ─────────────────────────────────────────────────────────

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: (theme) =>
          theme.palette.mode === "dark"
            ? "#000000"
            : `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.secondary.main} 100%)`,
        color: 'white',
        pb: 10,
        transition: 'background 0.3s ease'
      }}
    >
      <Header showSearchBar={true} />

      <Box sx={{ mt: 8, display: "flex", justifyContent: "center" }}>
        <Card
          sx={{
            width: "90%",
            maxWidth: 900,
            borderRadius: 4,
            boxShadow: 6,
            backdropFilter: "blur(16px)",
            backgroundColor: (theme) =>
              theme.palette.mode === "dark"
                ? "rgba(30,30,30,0.85)"
                : "#d4e9f8ff",
          }}
        >
          <CardContent>

            {/* ── Cabecera / Avatar ─────────────────────────────────────── */}
            <Box sx={{ textAlign: "center", mb: 4 }}>
              <Avatar
                sx={{ width: 100, height: 100, mx: "auto", mb: 2, bgcolor: "secondary.main", fontSize: 40 }}
              >
                {user?.nombre?.charAt(0)?.toUpperCase() || "U"}
              </Avatar>

              <Typography variant="h4" fontWeight="bold" sx={{ mb: 1 }}>
                Hola, {user?.nombre || user?.correo || "Usuario"}
              </Typography>

              <Typography variant="h6" sx={{ opacity: 0.9 }}>
                Bienvenido a tu panel de progreso
              </Typography>

              {/* Acceso rápido al Panel del Fisioterapeuta — solo Rol 2 y 3 */}
              {isPhysio && (
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 1, flexWrap: 'wrap' }}>
                  <Chip
                    label="Panel Fisioterapeuta"
                    onClick={() => navigate('/physio')}
                    sx={{
                      bgcolor: '#10B981', color: 'white', fontWeight: 700,
                      cursor: 'pointer', px: 1,
                      '&:hover': { bgcolor: '#059669' },
                    }}
                    icon={<span style={{ color: 'white', fontSize: 16, marginLeft: 6 }}>✦</span>}
                  />
                  <Chip
                    label="Rutinas pendientes"
                    onClick={() => navigate('/physio/routines/pending')}
                    variant="outlined"
                    sx={{ fontWeight: 600, cursor: 'pointer', borderColor: '#D97706', color: '#D97706' }}
                  />
                </Box>
              )}
            </Box>

            {/* ── Stats del perfil ──────────────────────────────────────── */}
            <Grid container justifyContent="center" spacing={3} sx={{ mb: 4 }}>
              {user?.peso && (
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ p: 2, textAlign: "center", borderRadius: 3 }}>
                    <ScaleIcon sx={{ fontSize: 40, mb: 1 }} />
                    <Typography variant="h6">Peso</Typography>
                    <Typography variant="h5" fontWeight="bold">{user.peso} kg</Typography>
                  </Card>
                </Grid>
              )}

              {user?.estatura && (
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ p: 2, textAlign: "center", borderRadius: 3 }}>
                    <HeightIcon sx={{ fontSize: 40, mb: 1 }} />
                    <Typography variant="h6">Estatura</Typography>
                    <Typography variant="h5" fontWeight="bold">{user.estatura} cm</Typography>
                  </Card>
                </Grid>
              )}

              {user?.nivel_fisico && (
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ p: 2, textAlign: "center", borderRadius: 3 }}>
                    <FitnessCenterIcon sx={{ fontSize: 40, mb: 1 }} />
                    <Typography variant="h6">Nivel físico</Typography>
                    <Typography variant="h5" fontWeight="bold">{user.nivel_fisico}</Typography>
                  </Card>
                </Grid>
              )}

              {user?.edad && (
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ p: 2, textAlign: "center", borderRadius: 3 }}>
                    <EmojiEventsIcon sx={{ fontSize: 40, mb: 1 }} />
                    <Typography variant="h6">Edad</Typography>
                    <Typography variant="h5" fontWeight="bold">{user.edad} años</Typography>
                  </Card>
                </Grid>
              )}
            </Grid>

            {/* ── Stats rápidas del historial real ─────────────────────── */}
            {!historialLoading && totalSesiones > 0 && (
              <Grid container justifyContent="center" spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={4}>
                  <Card sx={{ p: 2, textAlign: "center", borderRadius: 3 }}>
                    <CalendarTodayIcon sx={{ fontSize: 36, mb: 1 }} />
                    <Typography variant="h6">Sesiones registradas</Typography>
                    <Typography variant="h5" fontWeight="bold">{totalSesiones}</Typography>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Card sx={{ p: 2, textAlign: "center", borderRadius: 3 }}>
                    <AccessTimeIcon sx={{ fontSize: 36, mb: 1 }} />
                    <Typography variant="h6">Duración promedio</Typography>
                    <Typography variant="h5" fontWeight="bold">{duracionPromedio} min</Typography>
                  </Card>
                </Grid>
              </Grid>
            )}

            {/* ── Gráficas ──────────────────────────────────────────────── */}
            <Card sx={{ mt: 4, p: 3, borderRadius: 3 }}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                Progreso
              </Typography>

              <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mb: 3 }}>
                <Button
                  variant={activeChart === "duracion" ? "contained" : "outlined"}
                  onClick={() => setActiveChart("duracion")}
                >
                  Duración
                </Button>

                <Button
                  variant={activeChart === "grupos" ? "contained" : "outlined"}
                  onClick={() => setActiveChart("grupos")}
                >
                  Grupos musculares
                </Button>
              </Box>

              {/* Estado de carga del historial */}
              {historialLoading ? (
                <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                  <CircularProgress size={32} />
                </Box>
              ) : progresosReales.length === 0 ? (
                <Box sx={{ textAlign: "center", py: 4, opacity: 0.6 }}>
                  <Typography variant="body1">
                    Aún no tienes sesiones registradas. ¡Completa tu primera rutina!
                  </Typography>
                </Box>
              ) : (
                activeChart === "duracion" ? (
                  <Line data={activeConfig.chartData} options={activeConfig.options} />
                ) : (
                  <Bar data={activeConfig.chartData} options={activeConfig.options} />
                )
              )}
            </Card>

          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}