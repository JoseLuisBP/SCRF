{/* Importaciones */}
import { Box, Typography, Button, CircularProgress, Alert, Card, CardContent, Avatar, Grid } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import { authAPI } from '../api'
import Header from '../components/layout/Header';


{/* Iconos */}

//Graficas
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from "chart.js";
import { Line } from "react-chartjs-2";

//Iconos

import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import HeightIcon from "@mui/icons-material/Height";
import ScaleIcon from "@mui/icons-material/Scale";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";

{/* ===== AÑADIDO: jsPDF para generar el PDF ===== */}
import { jsPDF } from "jspdf";
import DownloadIcon from "@mui/icons-material/Download";

//* ===== AÑADIDO: URL de la imagen a descargar ===== */}
//AÑADIDO: jsPDF para generar el PDF
//import { jsPDF } from "jspdf";
//import DownloadIcon from "@mui/icons-material/Download";

ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);


//AÑADIDO: URL de la imagen a descargar

const IMAGE_URL =
  "https://wtrekbnyoeenxlzzxnka.supabase.co/storage/v1/object/public/imagenes/ejercicios/onu.jpg";

{/*Componente Dashboard */}
export default function Dashboard() {
  //Contexto de autenticacion
  const { logout } = useAuth();

  {/*Estados */}
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  {/* AÑADIDO: función para descargar el PDF */}

  // controla qué gráfica se muestra
  const [activeChart, setActiveChart] = useState("peso");

  // datos de ejemplo para cada tipo de gráfica

  const chartDataMap = {
    peso: {
      label: "Peso (kg)",
      data: [80, 78, 76, user?.peso || 75],
    },
    repeticiones: {
      label: "Repeticiones",
      data: [10, 12, 15, 18],
    },
    tiempo: {
      label: "Tiempo (min)",
      data: [20, 25, 30, 35],
    },
  };

  // data final que usa la gráfica
  const progressData = {
    labels: ["Semana 1", "Semana 2", "Semana 3", "Semana 4"],
    datasets: [
      {
        label: chartDataMap[activeChart].label,
        data: chartDataMap[activeChart].data,
        borderWidth: 2,
        tension: 0.4,
      },
    ],
  };


  //función para descargar el PDF

  const handleDownloadPDF = async () => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = IMAGE_URL;

    img.onload = () => {
      const doc = new jsPDF("p", "mm", "a4");

      {/* Tamaño de la página A4 */}
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      {/* Proporción de la imagen */}
      const imgWidth = img.width;
      const imgHeight = img.height;
      const ratio = imgHeight / imgWidth;

      {/* Ajustar al ancho de la página */}
      const pdfImgWidth = pageWidth;
      const pdfImgHeight = pdfImgWidth * ratio;

      {/* Centrar verticalmente si sobra espacio */}
      const y = pdfImgHeight < pageHeight
        ? (pageHeight - pdfImgHeight) / 2
        : 0;

      doc.addImage(
        img,
        "JPEG",
        0,
        y,
        pdfImgWidth,
        pdfImgHeight
      );

      doc.save("imagen-dashboard.pdf");
    };
  };

  {/*Efecto: Obtener usuario al cargar */}



  //Efecto: Obtener usuario al cargar

  useEffect(() => {
    const fetchUser = async () => {
      try {
        {/* Log para verificar el token */}
        const token = localStorage.getItem('token');
        console.log('Token en localStorage:', token ? 'Existe' : 'No existe');
        console.log('Token length:', token?.length);

        {/* Decodificar el token manualmente para ver el payload */}
        if (token) {
          try {
            const parts = token.split('.');
            const payload = JSON.parse(atob(parts[1]));
            console.log('Payload del token:', payload);
          } catch (e) {
            console.error('Error al decodificar token:', e);
          }
        }

        console.log('Llamando a getCurrentUser...');
        const userData = await authAPI.getCurrentUser();
        console.log('Usuario obtenido:', userData);
        setUser(userData);
      } catch (err) {
        console.error('Error completo:', err);
        console.error('Error response:', err.response);
        setError('Error al cargar datos del usuario');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  {/* Pantalla de carga */}
  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  {/* Pantalla de error */}
  if (error) {
    return (
      <Box sx={{ minHeight: '100vh', p: 4 }}>
        <Alert severity='error'>{error}</Alert>
      </Box>
    );
  }

  {/* Contenido principal */}
  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: (theme) =>
          `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.secondary.main} 100%)`,
        color: 'white',
        pb: 10,
      }}
    >
      <Header showSearchBar={true} />

      {/*Tarjeta central*/}
      <Box sx={{ mt: 8, display: "flex", justifyContent: "center" }}>
        <Card
          sx={{
            width: "90%",
            maxWidth: 900,
            borderRadius: 4,
            boxShadow: 6,
            backdropFilter: "blur(16px)",
            backgroundColor: "#d4e9f8ff",
          }}
        >
          <CardContent justifyContent="center">
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
            </Box>

            {/*Datos del usuario*/}
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

            {/*AÑADIDO: Botón Descargar PDF 
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Button
                variant="contained"
                startIcon={<DownloadIcon />}
                onClick={handleDownloadPDF}
              >
                Descargar
              </Button>
            </Box>*/}

            {/* Gráfica de progreso */}
            <Card sx={{ mt: 4, p: 3, borderRadius: 3 }}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                Progreso de peso
              </Typography>
              {/* AÑADIDO: botones para cambiar gráfica */}
              <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mb: 3 }}>
                <Button
                  variant={activeChart === "peso" ? "contained" : "outlined"}
                  onClick={() => setActiveChart("peso")}
                >
                  Peso
                </Button>

                <Button
                  variant={activeChart === "repeticiones" ? "contained" : "outlined"}
                  onClick={() => setActiveChart("repeticiones")}
                >
                  Repeticiones
                </Button>

                <Button
                  variant={activeChart === "tiempo" ? "contained" : "outlined"}
                  onClick={() => setActiveChart("tiempo")}
                >
                  Tiempo
                </Button>
              </Box>

              <Line data={progressData} />
            </Card>



          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
