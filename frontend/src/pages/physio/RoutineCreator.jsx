/**
 * RoutineCreator — Formulario para crear rutinas manuales verificadas.
 * is_machine_learning_generated = False, is_verified_by_physio = True (automático).
 */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box, Typography, TextField, Button, Grid, Alert,
    FormControl, InputLabel, Select, MenuItem, Paper,
    CircularProgress, Chip, Autocomplete,
} from '@mui/material';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { usePhysioRoutines } from '../../hooks/usePhysioRoutines';
import axiosInstance from '../../api/axios';

const NIVELES = ['beginner', 'intermediate', 'advanced'];
const CATEGORIAS_RUTINA = ['fuerza', 'cardio', 'hipertrofia', 'movilidad', 'rehabilitacion', 'core', 'hibrido'];

export default function RoutineCreator() {
    const navigate = useNavigate();
    const { createRoutine, loading, error } = usePhysioRoutines();
    const [success, setSuccess] = useState(false);
    const [exercises, setExercises] = useState([]);
    const [form, setForm] = useState({
        nombre_rutina: '',
        descripcion: '',
        nivel: '',
        duracion_estimada: '',
        categoria: '',
        ejercicio_ids: [],
    });

    // Cargar catálogo de ejercicios
    useEffect(() => {
        axiosInstance.get('/v1/exercises')
            .then(res => setExercises(res.data))
            .catch(() => {});
    }, []);

    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            ...form,
            duracion_estimada: form.duracion_estimada ? parseInt(form.duracion_estimada) : null,
        };
        try {
            await createRoutine(payload);
            setSuccess(true);
            setTimeout(() => navigate('/physio'), 2000);
        } catch {
            // error manejado por el hook
        }
    };

    return (
        <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 800, mx: 'auto' }}>
            <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
                <PlaylistAddCheckIcon sx={{ color: '#6366F1', fontSize: 36 }} />
                <Box>
                    <Typography variant="h4" fontWeight={700}>Crear Rutina Clínica</Typography>
                    <Typography color="text.secondary">
                        La rutina se creará con tu sello profesional de verificación automáticamente.
                    </Typography>
                </Box>
            </Box>

            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
            {success && (
                <Alert severity="success" icon={<CheckCircleOutlineIcon />} sx={{ mb: 3 }}>
                    ¡Rutina creada y verificada! Redirigiendo al panel...
                </Alert>
            )}

            <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth label="Nombre de la Rutina" name="nombre_rutina"
                                value={form.nombre_rutina} onChange={handleChange} required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth multiline rows={3} label="Descripción clínica"
                                name="descripcion" value={form.descripcion} onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <FormControl fullWidth>
                                <InputLabel>Nivel</InputLabel>
                                <Select name="nivel" value={form.nivel} onChange={handleChange} label="Nivel">
                                    {NIVELES.map(n => <MenuItem key={n} value={n}>{n}</MenuItem>)}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <FormControl fullWidth>
                                <InputLabel>Categoría</InputLabel>
                                <Select name="categoria" value={form.categoria} onChange={handleChange} label="Categoría">
                                    {CATEGORIAS_RUTINA.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth type="number" label="Duración (min)"
                                name="duracion_estimada" value={form.duracion_estimada}
                                onChange={handleChange} inputProps={{ min: 1 }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Autocomplete
                                multiple
                                options={exercises}
                                getOptionLabel={(opt) => `${opt.nombre_ejercicio} (${opt.categoria})`}
                                value={exercises.filter(e => form.ejercicio_ids.includes(e.id_ejercicio))}
                                onChange={(_, newVal) =>
                                    setForm(prev => ({ ...prev, ejercicio_ids: newVal.map(e => e.id_ejercicio) }))
                                }
                                renderTags={(value, getTagProps) =>
                                    value.map((opt, index) => (
                                        <Chip
                                            variant="outlined" size="small"
                                            label={opt.nombre_ejercicio}
                                            color="primary"
                                            {...getTagProps({ index })}
                                        />
                                    ))
                                }
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Ejercicios de la Rutina"
                                        placeholder="Buscar ejercicio..."
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} sx={{ display: 'flex', gap: 2 }}>
                            <Button
                                type="submit" variant="contained" size="large"
                                disabled={loading || success}
                                startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <CheckCircleOutlineIcon />}
                                sx={{ bgcolor: '#6366F1', '&:hover': { bgcolor: '#4F46E5' }, borderRadius: 2, px: 4 }}
                            >
                                {loading ? 'Guardando...' : 'Crear Rutina Verificada'}
                            </Button>
                            <Button variant="outlined" size="large" onClick={() => navigate('/physio')} sx={{ borderRadius: 2 }}>
                                Cancelar
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Box>
    );
}
