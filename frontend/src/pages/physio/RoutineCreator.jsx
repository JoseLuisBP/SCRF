import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box, Container, Typography, TextField, Button, Grid, Alert,
    FormControl, InputLabel, Select, MenuItem, Paper, Avatar,
    CircularProgress, Chip, Autocomplete, Stack, Divider, useTheme,
} from '@mui/material';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import { usePhysioRoutines } from '../../hooks/usePhysioRoutines';
import axiosInstance from '../../api/axios';

const NIVELES = ['beginner', 'intermediate', 'advanced'];
const CATEGORIAS_RUTINA = [
    'fuerza', 'cardio', 'hipertrofia', 'movilidad',
    'rehabilitacion', 'core', 'hibrido',
];

export default function RoutineCreator() {
    const navigate = useNavigate();
    const theme = useTheme();
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

    // Cargar catálogo de ejercicios verificados
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
        <Box
            sx={{
                minHeight: '100vh',
                background: (theme) =>
                    theme.palette.mode === 'dark'
                        ? '#000000'
                        : `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.secondary.main} 100%)`,
                transition: 'background 0.3s ease',
            }}
        >
            <Header />

            <Container maxWidth="lg" sx={{ py: 4 }}>

                {/* Encabezado — mismo patrón que AdminPanel */}
                <Stack direction="row" alignItems="center" spacing={2} mb={4}>
                    <Avatar sx={{ bgcolor: 'primary.main', width: 48, height: 48 }}>
                        <PlaylistAddCheckIcon />
                    </Avatar>
                    <Box>
                        <Typography variant="h4" fontWeight={700}>
                            Crear Rutina Clínica
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            La rutina se creará con tu sello profesional de verificación de forma automática
                        </Typography>
                    </Box>
                </Stack>

                {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
                {success && (
                    <Alert severity="success" icon={<CheckCircleOutlineIcon />} sx={{ mb: 3 }}>
                        ¡Rutina creada y verificada! Redirigiendo al panel...
                    </Alert>
                )}

                <Paper
                    elevation={2}
                    sx={{ p: 3, borderRadius: 3, border: `1px solid ${theme.palette.divider}` }}
                >
                    <Stack direction="row" alignItems="center" spacing={1} mb={3}>
                        <PlaylistAddCheckIcon color="primary" />
                        <Typography variant="h6" fontWeight={600}>
                            Datos de la Rutina
                        </Typography>
                    </Stack>

                    <Alert severity="info" sx={{ mb: 3 }}>
                        La rutina se creará con <strong>is_machine_learning_generated = False</strong> e <strong>is_verified_by_physio = True</strong> — tu aval profesional queda registrado.
                    </Alert>

                    <Box component="form" onSubmit={handleSubmit} autoComplete="off">
                        <Stack spacing={2.5}>
                            <TextField
                                fullWidth
                                label="Nombre de la Rutina"
                                name="nombre_rutina"
                                value={form.nombre_rutina}
                                onChange={handleChange}
                                required
                                size="small"
                            />

                            <TextField
                                fullWidth
                                multiline
                                rows={3}
                                label="Descripción clínica"
                                name="descripcion"
                                value={form.descripcion}
                                onChange={handleChange}
                                size="small"
                            />

                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={4}>
                                    <FormControl fullWidth size="small">
                                        <InputLabel>Nivel</InputLabel>
                                        <Select
                                            name="nivel"
                                            value={form.nivel}
                                            onChange={handleChange}
                                            label="Nivel"
                                        >
                                            {NIVELES.map(n => (
                                                <MenuItem key={n} value={n}>
                                                    {n.charAt(0).toUpperCase() + n.slice(1)}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <FormControl fullWidth size="small">
                                        <InputLabel>Categoría</InputLabel>
                                        <Select
                                            name="categoria"
                                            value={form.categoria}
                                            onChange={handleChange}
                                            label="Categoría"
                                        >
                                            {CATEGORIAS_RUTINA.map(c => (
                                                <MenuItem key={c} value={c}>
                                                    {c.charAt(0).toUpperCase() + c.slice(1)}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <TextField
                                        fullWidth
                                        type="number"
                                        label="Duración estimada (min)"
                                        name="duracion_estimada"
                                        value={form.duracion_estimada}
                                        onChange={handleChange}
                                        inputProps={{ min: 1 }}
                                        size="small"
                                    />
                                </Grid>
                            </Grid>

                            <Autocomplete
                                multiple
                                options={exercises}
                                getOptionLabel={(opt) =>
                                    `${opt.nombre_ejercicio} (${opt.categoria})`
                                }
                                value={exercises.filter(e =>
                                    form.ejercicio_ids.includes(e.id_ejercicio)
                                )}
                                onChange={(_, newVal) =>
                                    setForm(prev => ({
                                        ...prev,
                                        ejercicio_ids: newVal.map(e => e.id_ejercicio),
                                    }))
                                }
                                renderTags={(value, getTagProps) =>
                                    value.map((opt, index) => (
                                        <Chip
                                            variant="outlined"
                                            size="small"
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
                                        size="small"
                                    />
                                )}
                            />

                            <Divider />

                            <Stack direction="row" spacing={2}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    size="large"
                                    disabled={loading || success}
                                    startIcon={
                                        loading
                                            ? <CircularProgress size={18} color="inherit" />
                                            : <CheckCircleOutlineIcon />
                                    }
                                    sx={{ px: 4 }}
                                >
                                    {loading ? 'Guardando...' : 'Crear Rutina Verificada'}
                                </Button>
                                <Button
                                    variant="outlined"
                                    size="large"
                                    startIcon={<ArrowBackIcon />}
                                    onClick={() => navigate('/physio')}
                                >
                                    Cancelar
                                </Button>
                            </Stack>
                        </Stack>
                    </Box>
                </Paper>

            </Container>

            <Footer />
        </Box>
    );
}
