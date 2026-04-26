import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box, Container, Typography, TextField, Button, Grid, Alert,
    FormControl, InputLabel, Select, MenuItem, Paper, Avatar,
    CircularProgress, Chip, Autocomplete, Stack, Divider, useTheme,
} from '@mui/material';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import { usePhysioRoutines } from '../../hooks/usePhysioRoutines';

const CATEGORIAS = [
    'pecho', 'espalda', 'piernas', 'hombros', 'brazos',
    'core', 'cardio', 'rehabilitacion', 'movilidad',
];
const NIVELES = ['principiante', 'intermedio', 'avanzado'];
const ENFOQUES = ['fuerza', 'hipertrofia', 'resistencia', 'movilidad', 'rehabilitacion', 'flexibilidad'];
const LESIONES_COMUNES = [
    'Lesión de rodilla', 'Lesión de hombro', 'Dolor lumbar', 'Esguince de tobillo',
    'Hernia discal', 'Tendinitis', 'Lesión de manguito rotador',
];

export default function ExerciseCreator() {
    const navigate = useNavigate();
    const theme = useTheme();
    const { createExercise, loading, error } = usePhysioRoutines();
    const [success, setSuccess] = useState(false);
    const [form, setForm] = useState({
        nombre_ejercicio: '',
        descripcion: '',
        categoria: '',
        repeticiones: '',
        tiempo: '',
        enfoque: '',
        nivel_dificultad: '',
        contraindicaciones: [],
        advertencias: '',
    });

    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            ...form,
            repeticiones: form.repeticiones ? parseInt(form.repeticiones) : null,
            tiempo: form.tiempo ? parseInt(form.tiempo) : null,
        };
        try {
            await createExercise(payload);
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
                    <Avatar sx={{ bgcolor: 'success.main', width: 48, height: 48 }}>
                        <FitnessCenterIcon />
                    </Avatar>
                    <Box>
                        <Typography variant="h4" fontWeight={700}>
                            Crear Ejercicio Clínico
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            El ejercicio se creará con tu verificación clínica de forma automática
                        </Typography>
                    </Box>
                </Stack>

                {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
                {success && (
                    <Alert severity="success" icon={<CheckCircleOutlineIcon />} sx={{ mb: 3 }}>
                        ¡Ejercicio creado y verificado! Redirigiendo al panel...
                    </Alert>
                )}

                <Paper
                    elevation={2}
                    sx={{ p: 3, borderRadius: 3, border: `1px solid ${theme.palette.divider}` }}
                >
                    <Stack direction="row" alignItems="center" spacing={1} mb={3}>
                        <FitnessCenterIcon color="success" />
                        <Typography variant="h6" fontWeight={600}>
                            Datos del Ejercicio
                        </Typography>
                    </Stack>

                    <Alert severity="info" sx={{ mb: 3 }}>
                        El ejercicio se creará con <strong>is_verified_by_physio = True</strong> de forma automática — tu aval profesional queda registrado.
                    </Alert>

                    <Box component="form" onSubmit={handleSubmit} autoComplete="off">
                        <Stack spacing={2.5}>
                            <TextField
                                fullWidth
                                label="Nombre del Ejercicio"
                                name="nombre_ejercicio"
                                value={form.nombre_ejercicio}
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
                                required
                                size="small"
                            />

                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth required size="small">
                                        <InputLabel>Categoría</InputLabel>
                                        <Select
                                            name="categoria"
                                            value={form.categoria}
                                            onChange={handleChange}
                                            label="Categoría"
                                        >
                                            {CATEGORIAS.map(c => (
                                                <MenuItem key={c} value={c}>
                                                    {c.charAt(0).toUpperCase() + c.slice(1)}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth size="small">
                                        <InputLabel>Nivel de Dificultad</InputLabel>
                                        <Select
                                            name="nivel_dificultad"
                                            value={form.nivel_dificultad}
                                            onChange={handleChange}
                                            label="Nivel de Dificultad"
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
                                    <TextField
                                        fullWidth
                                        type="number"
                                        label="Repeticiones"
                                        name="repeticiones"
                                        value={form.repeticiones}
                                        onChange={handleChange}
                                        inputProps={{ min: 0 }}
                                        size="small"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <TextField
                                        fullWidth
                                        type="number"
                                        label="Tiempo (seg)"
                                        name="tiempo"
                                        value={form.tiempo}
                                        onChange={handleChange}
                                        inputProps={{ min: 0 }}
                                        size="small"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <FormControl fullWidth size="small">
                                        <InputLabel>Enfoque</InputLabel>
                                        <Select
                                            name="enfoque"
                                            value={form.enfoque}
                                            onChange={handleChange}
                                            label="Enfoque"
                                        >
                                            {ENFOQUES.map(e => (
                                                <MenuItem key={e} value={e}>
                                                    {e.charAt(0).toUpperCase() + e.slice(1)}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>

                            <Autocomplete
                                multiple
                                freeSolo
                                options={LESIONES_COMUNES}
                                value={form.contraindicaciones}
                                onChange={(_, newVal) =>
                                    setForm(prev => ({ ...prev, contraindicaciones: newVal }))
                                }
                                renderTags={(value, getTagProps) =>
                                    value.map((option, index) => (
                                        <Chip
                                            variant="outlined"
                                            label={option}
                                            size="small"
                                            color="warning"
                                            {...getTagProps({ index })}
                                        />
                                    ))
                                }
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Contraindicaciones"
                                        placeholder="Añadir contraindicación..."
                                        size="small"
                                    />
                                )}
                            />

                            <TextField
                                fullWidth
                                multiline
                                rows={2}
                                label="Advertencias clínicas"
                                name="advertencias"
                                value={form.advertencias}
                                onChange={handleChange}
                                size="small"
                            />

                            <Divider />

                            <Stack direction="row" spacing={2}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="success"
                                    size="large"
                                    disabled={loading || success}
                                    startIcon={
                                        loading
                                            ? <CircularProgress size={18} color="inherit" />
                                            : <CheckCircleOutlineIcon />
                                    }
                                    sx={{ px: 4 }}
                                >
                                    {loading ? 'Guardando...' : 'Crear y Verificar Ejercicio'}
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
