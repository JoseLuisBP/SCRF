/**
 * ExerciseCreator — Formulario para crear ejercicios clínicos verificados.
 * Solo accesible para Rol 2 (Fisio) y Rol 3 (Admin).
 * El ejercicio se crea con is_verified_by_physio=True por defecto.
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box, Typography, TextField, Button, Grid, Alert,
    FormControl, InputLabel, Select, MenuItem, Chip,
    Paper, CircularProgress, Autocomplete,
} from '@mui/material';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { usePhysioRoutines } from '../../hooks/usePhysioRoutines';

const CATEGORIAS = ['pecho', 'espalda', 'piernas', 'hombros', 'brazos', 'core', 'cardio', 'rehabilitacion', 'movilidad'];
const NIVELES = ['principiante', 'intermedio', 'avanzado'];
const ENFOQUES = ['fuerza', 'hipertrofia', 'resistencia', 'movilidad', 'rehabilitacion', 'flexibilidad'];
const LESIONES_COMUNES = [
    'Lesión de rodilla', 'Lesión de hombro', 'Dolor lumbar', 'Esguince de tobillo',
    'Hernia discal', 'Tendinitis', 'Lesión de manguito rotador',
];

export default function ExerciseCreator() {
    const navigate = useNavigate();
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
        <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 800, mx: 'auto' }}>
            <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
                <FitnessCenterIcon sx={{ color: '#10B981', fontSize: 36 }} />
                <Box>
                    <Typography variant="h4" fontWeight={700}>Crear Ejercicio Clínico</Typography>
                    <Typography color="text.secondary">
                        El ejercicio se creará con verificación clínica automática (tu aval profesional).
                    </Typography>
                </Box>
            </Box>

            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
            {success && (
                <Alert severity="success" icon={<CheckCircleOutlineIcon />} sx={{ mb: 3 }}>
                    ¡Ejercicio creado y verificado! Redirigiendo al panel...
                </Alert>
            )}

            <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth label="Nombre del Ejercicio" name="nombre_ejercicio"
                                value={form.nombre_ejercicio} onChange={handleChange}
                                required variant="outlined"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth multiline rows={3} label="Descripción clínica"
                                name="descripcion" value={form.descripcion} onChange={handleChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth required>
                                <InputLabel>Categoría</InputLabel>
                                <Select name="categoria" value={form.categoria} onChange={handleChange} label="Categoría">
                                    {CATEGORIAS.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>Nivel de Dificultad</InputLabel>
                                <Select name="nivel_dificultad" value={form.nivel_dificultad} onChange={handleChange} label="Nivel de Dificultad">
                                    {NIVELES.map(n => <MenuItem key={n} value={n}>{n}</MenuItem>)}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth type="number" label="Repeticiones" name="repeticiones"
                                value={form.repeticiones} onChange={handleChange}
                                inputProps={{ min: 0 }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth type="number" label="Tiempo (seg)" name="tiempo"
                                value={form.tiempo} onChange={handleChange}
                                inputProps={{ min: 0 }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <FormControl fullWidth>
                                <InputLabel>Enfoque</InputLabel>
                                <Select name="enfoque" value={form.enfoque} onChange={handleChange} label="Enfoque">
                                    {ENFOQUES.map(e => <MenuItem key={e} value={e}>{e}</MenuItem>)}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <Autocomplete
                                multiple freeSolo
                                options={LESIONES_COMUNES}
                                value={form.contraindicaciones}
                                onChange={(_, newVal) => setForm(prev => ({ ...prev, contraindicaciones: newVal }))}
                                renderTags={(value, getTagProps) =>
                                    value.map((option, index) => (
                                        <Chip variant="outlined" label={option} size="small" color="warning" {...getTagProps({ index })} />
                                    ))
                                }
                                renderInput={(params) => (
                                    <TextField {...params} label="Contraindicaciones" placeholder="Añadir contraindicación..." />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth multiline rows={2} label="Advertencias clínicas"
                                name="advertencias" value={form.advertencias} onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} sx={{ display: 'flex', gap: 2 }}>
                            <Button
                                type="submit" variant="contained" size="large"
                                disabled={loading || success}
                                startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <CheckCircleOutlineIcon />}
                                sx={{ bgcolor: '#10B981', '&:hover': { bgcolor: '#059669' }, borderRadius: 2, px: 4 }}
                            >
                                {loading ? 'Guardando...' : 'Crear y Verificar Ejercicio'}
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
