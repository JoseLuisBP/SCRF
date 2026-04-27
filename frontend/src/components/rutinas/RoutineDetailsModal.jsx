import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  Typography,
  Box,
  Alert
} from "@mui/material";
import { useEffect, useState } from "react";
import axiosInstance from "../../api/axios";
import ExerciseList from "./EjerciciosList";

export default function RoutineDetailsModal({ open, onClose, routine }) {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (open && routine) {
      const fetchExercises = async () => {
        setLoading(true);
        setError(null);
        try {
          const { data } = await axiosInstance.get(`/v1/routines/${routine.id_rutina}/exercises`);
          setExercises(data);
        } catch (err) {
          setError(err.response?.data?.detail || "Error al cargar los ejercicios");
        } finally {
          setLoading(false);
        }
      };

      fetchExercises();
    } else {
      setExercises([]);
    }
  }, [open, routine]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle sx={{ pb: 1 }}>
        Ejercicios de la Rutina: {routine?.nombre_rutina}
      </DialogTitle>
      
      <DialogContent dividers sx={{ minHeight: "300px", bgcolor: "#f9f9f9" }}>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : exercises.length === 0 ? (
          <Typography textAlign="center" color="text.secondary" mt={4}>
            Esta rutina no tiene ejercicios asignados actualmente.
          </Typography>
        ) : (
          <ExerciseList exercises={exercises} />
        )}
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose} color="primary" variant="contained">
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
