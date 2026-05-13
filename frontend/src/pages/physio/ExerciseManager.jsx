import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box, Container, Typography, Button, Chip, TextField,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, Avatar, CircularProgress, Alert, Tooltip, IconButton,
    Stack, Grid, Divider, useTheme, Dialog, DialogTitle, DialogContent,
    DialogActions, FormControl, InputLabel, Select, MenuItem,
    Autocomplete, Switch, FormControlLabel, InputAdornment,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import EditIcon from '@mui/icons-material/Edit';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import SearchIcon from '@mui/icons-material/Search';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FilterListIcon from '@mui/icons-material/FilterList';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import NewReleasesIcon from '@mui/icons-material/NewReleases';

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

const FILTER_ALL = 'all';
const FILTER_VERIFIED = 'verified';
const FILTER_UNVERIFIED = 'unverified';
const FILTER_INACTIVE = 'inactive';

export default function ExerciseManager() {
    const navigate = useNavigate();
    const theme = useTheme();
    const { getAllExercises, verifyExercise, updateExercise, toggleExerciseActive, loading, error } =
        usePhysioRoutines();

    const [exercises, setExercises] = useState([]);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState(FILTER_ALL);
    const [actionId, setActionId] = useState(null);
    const [successMsg, setSuccessMsg] = useState('');

    // ─── Diálogo de verificación con notas ──────────────────────────────────
    const [verifyDialog, setVerifyDialog] = useState({ open: false, exercise: null, notes: '' });

    // ─── Diálogo de edición ─────────────────────────────────────────────────
    const [editDialog, setEditDialog] = useState({ open: false, exercise: null });
    const [editForm, setEditForm] = useState({});

    const loadExercises = useCallback(async () => {
        try {
            const data = await getAllExercises();
            setExercises(data);
        } catch {
            // error manejado por el hook
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        loadExercises();
    }, [loadExercises]);

    const showSuccess = (msg) => {
        setSuccessMsg(msg);
        setTimeout(() => setSuccessMsg(''), 4000);
    };

    // ─── Filtrado + búsqueda ─────────────────────────────────────────────────
    const filtered = exercises.filter((ex) => {
        const matchSearch =
            !search ||
            ex.nombre_ejercicio.toLowerCase().includes(search.toLowerCase()) ||
            ex.categoria?.toLowerCase().includes(search.toLowerCase());

        const matchFilter =
            filter === FILTER_ALL ||
            (filter === FILTER_VERIFIED && ex.is_verified_by_physio && ex.activo) ||
            (filter === FILTER_UNVERIFIED && !ex.is_verified_by_physio && ex.activo) ||
            (filter === FILTER_INACTIVE && !ex.activo);

        return matchSearch && matchFilter;
    });

    // ─── Verificar ──────────────────────────────────────────────────────────
    const handleOpenVerify = (exercise) => {
        setVerifyDialog({ open: true, exercise, notes: '' });
    };

    const handleConfirmVerify = async () => {
        const { exercise, notes } = verifyDialog;
        setActionId(exercise.id_ejercicio);
        setVerifyDialog({ open: false, exercise: null, notes: '' });
        try {
            const updated = await verifyExercise(exercise.id_ejercicio, notes || null);
            setExercises((prev) =>
                prev.map((ex) => (ex.id_ejercicio === updated.id_ejercicio ? updated : ex))
            );
            showSuccess(`✅ Ejercicio "${exercise.nombre_ejercicio}" verificado`);
        } finally {
            setActionId(null);
        }
    };

    // ─── Toggle activo ───────────────────────────────────────────────────────
    const handleToggleActive = async (exercise) => {
        setActionId(exercise.id_ejercicio);
        try {
            const updated = await toggleExerciseActive(exercise.id_ejercicio);
            setExercises((prev) =>
                prev.map((ex) => (ex.id_ejercicio === updated.id_ejercicio ? updated : ex))
            );
            const estado = updated.activo ? 'activado' : 'desactivado';
            showSuccess(`✅ Ejercicio "${exercise.nombre_ejercicio}" ${estado}`);
        } finally {
            setActionId(null);
        }
    };

    // ─── Editar ──────────────────────────────────────────────────────────────
    const handleOpenEdit = (exercise) => {
        setEditForm({
            nombre_ejercicio: exercise.nombre_ejercicio ?? '',
            descripcion: exercise.descripcion ?? '',
            categoria: exercise.categoria ?? '',
            repeticiones: exercise.repeticiones ?? '',
            tiempo: exercise.tiempo ?? '',
            enfoque: exercise.enfoque ?? '',
            nivel_dificultad: exercise.nivel_dificultad ?? '',
            contraindicaciones: exercise.contraindicaciones ?? [],
            advertencias: exercise.advertencias ?? '',
        });
        setEditDialog({ open: true, exercise });
    };

    const handleSaveEdit = async () => {
        const { exercise } = editDialog;
        setActionId(exercise.id_ejercicio);
        const payload = {
            ...editForm,
            repeticiones: editForm.repeticiones !== '' ? parseInt(editForm.repeticiones) : null,
            tiempo: editForm.tiempo !== '' ? parseInt(editForm.tiempo) : null,
        };
        // Elimina campos vacíos para patch parcial
        Object.keys(payload).forEach((k) => {
            if (payload[k] === '' || payload[k] === null) delete payload[k];
        });
        setEditDialog({ open: false, exercise: null });
        try {
            const updated = await updateExercise(exercise.id_ejercicio, payload);
            setExercises((prev) =>
                prev.map((ex) => (ex.id_ejercicio === updated.id_ejercicio ? updated : ex))
            );
            showSuccess(`✅ Ejercicio "${updated.nombre_ejercicio}" actualizado`);
        } finally {
            setActionId(null);
        }
    };

    // ─── Contadores para el resumen ──────────────────────────────────────────
    const totalActivos = exercises.filter((e) => e.activo).length;
    const totalVerificados = exercises.filter((e) => e.is_verified_by_physio && e.activo).length;
    const totalSinVerificar = exercises.filter((e) => !e.is_verified_by_physio && e.activo).length;
    const totalInactivos = exercises.filter((e) => !e.activo).length;

    return (
        <Box
            sx={{
                minHeight: '100vh',
                background: (t) =>
                    t.palette.mode === 'dark'
                        ? '#000000'
                        : `linear-gradient(135deg, ${t.palette.primary.light} 0%, ${t.palette.secondary.main} 100%)`,
                transition: 'background 0.3s ease',
            }}
        >
            <Header />

            <Container maxWidth="xl" sx={{ py: 4 }}>

                {/* Encabezado */}
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={4}>
                    <Stack direction="row" alignItems="center" spacing={2}>
                        <Avatar sx={{ bgcolor: 'success.main', width: 48, height: 48 }}>
                            <FitnessCenterIcon />
                        </Avatar>
                        <Box>
                            <Typography variant="h4" fontWeight={700}>
                                Gestión de Ejercicios
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Verifica, edita y administra el catálogo clínico
                            </Typography>
                        </Box>
                    </Stack>
                    <Stack direction="row" spacing={1}>
                        <Button
                            variant="contained"
                            color="success"
                            startIcon={<AddIcon />}
                            onClick={() => navigate('/physio/exercises/new')}
                            sx={{ borderRadius: 2 }}
                        >
                            Nuevo Ejercicio
                        </Button>
                        <Button
                            variant="outlined"
                            startIcon={<ArrowBackIcon />}
                            onClick={() => navigate('/physio')}
                            sx={{ borderRadius: 2 }}
                        >
                            Volver
                        </Button>
                    </Stack>
                </Stack>

                {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
                {successMsg && <Alert severity="success" sx={{ mb: 3 }}>{successMsg}</Alert>}

                {/* Resumen KPI */}
                <Grid container spacing={2} sx={{ mb: 3 }}>
                    {[
                        { label: 'Total activos', value: totalActivos, color: 'info' },
                        { label: 'Verificados', value: totalVerificados, color: 'success' },
                        { label: 'Sin verificar', value: totalSinVerificar, color: 'warning' },
                        { label: 'Inactivos', value: totalInactivos, color: 'default' },
                    ].map((kpi) => (
                        <Grid item xs={6} sm={3} key={kpi.label}>
                            <Paper
                                elevation={1}
                                sx={{ p: 2, borderRadius: 3, textAlign: 'center', border: `1px solid ${theme.palette.divider}` }}
                            >
                                <Typography variant="h4" fontWeight={700}>
                                    {kpi.value}
                                </Typography>
                                <Chip label={kpi.label} color={kpi.color} size="small" sx={{ mt: 0.5 }} />
                            </Paper>
                        </Grid>
                    ))}
                </Grid>

                {/* Barra de búsqueda y filtros */}
                <Paper
                    elevation={2}
                    sx={{ p: 3, borderRadius: 3, border: `1px solid ${theme.palette.divider}`, mb: 3 }}
                >
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
                        <TextField
                            placeholder="Buscar por nombre o categoría..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            size="small"
                            sx={{ flexGrow: 1 }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon fontSize="small" />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <Stack direction="row" spacing={1} flexWrap="wrap">
                            <FilterListIcon color="action" sx={{ alignSelf: 'center' }} />
                            {[
                                { value: FILTER_ALL, label: 'Todos' },
                                { value: FILTER_VERIFIED, label: 'Verificados', icon: <VerifiedUserIcon fontSize="inherit" /> },
                                { value: FILTER_UNVERIFIED, label: 'Sin verificar', icon: <NewReleasesIcon fontSize="inherit" /> },
                                { value: FILTER_INACTIVE, label: 'Inactivos' },
                            ].map((f) => (
                                <Chip
                                    key={f.value}
                                    label={f.label}
                                    icon={f.icon}
                                    onClick={() => setFilter(f.value)}
                                    color={filter === f.value ? 'primary' : 'default'}
                                    variant={filter === f.value ? 'filled' : 'outlined'}
                                    size="small"
                                    sx={{ cursor: 'pointer' }}
                                />
                            ))}
                        </Stack>
                    </Stack>
                </Paper>

                {/* Tabla de ejercicios */}
                <Paper
                    elevation={2}
                    sx={{ p: 2, borderRadius: 3, border: `1px solid ${theme.palette.divider}` }}
                >
                    <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
                        <Typography variant="h6" fontWeight={600}>
                            Catálogo de ejercicios
                        </Typography>
                        <Chip
                            label={`${filtered.length} resultado${filtered.length !== 1 ? 's' : ''}`}
                            size="small"
                            variant="outlined"
                        />
                    </Stack>

                    <Divider sx={{ mb: 2 }} />

                    {loading && exercises.length === 0 ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                            <CircularProgress />
                        </Box>
                    ) : filtered.length === 0 ? (
                        <Alert severity="info">No hay ejercicios que coincidan con los filtros seleccionados.</Alert>
                    ) : (
                        <TableContainer>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell><strong>ID</strong></TableCell>
                                        <TableCell><strong>Nombre</strong></TableCell>
                                        <TableCell><strong>Categoría</strong></TableCell>
                                        <TableCell><strong>Nivel</strong></TableCell>
                                        <TableCell><strong>Reps / Tiempo</strong></TableCell>
                                        <TableCell><strong>Verificado</strong></TableCell>
                                        <TableCell><strong>Estado</strong></TableCell>
                                        <TableCell align="center"><strong>Acciones</strong></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filtered.map((ex) => (
                                        <TableRow
                                            key={ex.id_ejercicio}
                                            hover
                                            sx={{ opacity: ex.activo ? 1 : 0.55 }}
                                        >
                                            <TableCell>{ex.id_ejercicio}</TableCell>
                                            <TableCell>
                                                <Typography variant="body2" fontWeight={500}>
                                                    {ex.nombre_ejercicio}
                                                </Typography>
                                                {ex.verification_notes && (
                                                    <Typography variant="caption" color="text.secondary">
                                                        Notas: {ex.verification_notes}
                                                    </Typography>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={ex.categoria}
                                                    size="small"
                                                    variant="outlined"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                {ex.nivel_dificultad ? (
                                                    <Chip label={ex.nivel_dificultad} size="small" />
                                                ) : '—'}
                                            </TableCell>
                                            <TableCell>
                                                {ex.repeticiones != null ? `${ex.repeticiones} reps` : ''}
                                                {ex.repeticiones != null && ex.tiempo != null ? ' / ' : ''}
                                                {ex.tiempo != null ? `${ex.tiempo}s` : ''}
                                                {ex.repeticiones == null && ex.tiempo == null ? '—' : ''}
                                            </TableCell>
                                            <TableCell>
                                                {ex.is_verified_by_physio ? (
                                                    <Chip
                                                        label="Verificado"
                                                        color="success"
                                                        size="small"
                                                        icon={<CheckCircleOutlineIcon />}
                                                    />
                                                ) : (
                                                    <Chip
                                                        label="Pendiente"
                                                        color="warning"
                                                        size="small"
                                                        icon={<NewReleasesIcon />}
                                                    />
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={ex.activo ? 'Activo' : 'Inactivo'}
                                                    color={ex.activo ? 'success' : 'default'}
                                                    size="small"
                                                    variant={ex.activo ? 'filled' : 'outlined'}
                                                />
                                            </TableCell>
                                            <TableCell align="center">
                                                <Stack direction="row" spacing={0.5} justifyContent="center">
                                                    {/* Verificar (solo si no verificado) */}
                                                    {!ex.is_verified_by_physio && ex.activo && (
                                                        <Tooltip title="Verificar clínicamente">
                                                            <span>
                                                                <IconButton
                                                                    color="success"
                                                                    size="small"
                                                                    disabled={actionId === ex.id_ejercicio}
                                                                    onClick={() => handleOpenVerify(ex)}
                                                                >
                                                                    {actionId === ex.id_ejercicio
                                                                        ? <CircularProgress size={18} />
                                                                        : <CheckCircleOutlineIcon />
                                                                    }
                                                                </IconButton>
                                                            </span>
                                                        </Tooltip>
                                                    )}

                                                    {/* Editar */}
                                                    <Tooltip title="Editar ejercicio">
                                                        <span>
                                                            <IconButton
                                                                color="primary"
                                                                size="small"
                                                                disabled={actionId === ex.id_ejercicio}
                                                                onClick={() => handleOpenEdit(ex)}
                                                            >
                                                                <EditIcon />
                                                            </IconButton>
                                                        </span>
                                                    </Tooltip>

                                                    {/* Activar / Desactivar */}
                                                    <Tooltip title={ex.activo ? 'Desactivar' : 'Activar'}>
                                                        <span>
                                                            <IconButton
                                                                color={ex.activo ? 'warning' : 'success'}
                                                                size="small"
                                                                disabled={actionId === ex.id_ejercicio}
                                                                onClick={() => handleToggleActive(ex)}
                                                            >
                                                                {ex.activo ? <ToggleOffIcon /> : <ToggleOnIcon />}
                                                            </IconButton>
                                                        </span>
                                                    </Tooltip>
                                                </Stack>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </Paper>
            </Container>

            <Footer />

            {/* ─── Diálogo de verificación con notas ─────────────────────────────── */}
            <Dialog
                open={verifyDialog.open}
                onClose={() => setVerifyDialog({ open: false, exercise: null, notes: '' })}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <VerifiedUserIcon color="success" />
                        <span>Verificar ejercicio clínicamente</span>
                    </Stack>
                </DialogTitle>
                <DialogContent dividers>
                    {verifyDialog.exercise && (
                        <>
                            <Typography variant="body2" mb={2}>
                                Estás a punto de verificar:{' '}
                                <strong>{verifyDialog.exercise.nombre_ejercicio}</strong>
                            </Typography>
                            <TextField
                                fullWidth
                                multiline
                                rows={3}
                                label="Notas clínicas (opcional)"
                                placeholder="Añade observaciones, indicaciones o contraindicaciones específicas..."
                                value={verifyDialog.notes}
                                onChange={(e) =>
                                    setVerifyDialog((prev) => ({ ...prev, notes: e.target.value }))
                                }
                                size="small"
                            />
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setVerifyDialog({ open: false, exercise: null, notes: '' })}
                        color="inherit"
                    >
                        Cancelar
                    </Button>
                    <Button
                        variant="contained"
                        color="success"
                        startIcon={<CheckCircleOutlineIcon />}
                        onClick={handleConfirmVerify}
                    >
                        Verificar
                    </Button>
                </DialogActions>
            </Dialog>

            {/* ─── Diálogo de edición ─────────────────────────────────────────────── */}
            <Dialog
                open={editDialog.open}
                onClose={() => setEditDialog({ open: false, exercise: null })}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <EditIcon color="primary" />
                        <span>Editar ejercicio</span>
                    </Stack>
                </DialogTitle>
                <DialogContent dividers>
                    <Stack spacing={2} mt={1}>
                        <TextField
                            fullWidth
                            label="Nombre del ejercicio"
                            value={editForm.nombre_ejercicio ?? ''}
                            onChange={(e) => setEditForm((f) => ({ ...f, nombre_ejercicio: e.target.value }))}
                            size="small"
                        />
                        <TextField
                            fullWidth
                            multiline
                            rows={3}
                            label="Descripción clínica"
                            value={editForm.descripcion ?? ''}
                            onChange={(e) => setEditForm((f) => ({ ...f, descripcion: e.target.value }))}
                            size="small"
                        />
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth size="small">
                                    <InputLabel>Categoría</InputLabel>
                                    <Select
                                        value={editForm.categoria ?? ''}
                                        onChange={(e) => setEditForm((f) => ({ ...f, categoria: e.target.value }))}
                                        label="Categoría"
                                    >
                                        {CATEGORIAS.map((c) => (
                                            <MenuItem key={c} value={c}>
                                                {c.charAt(0).toUpperCase() + c.slice(1)}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth size="small">
                                    <InputLabel>Nivel de dificultad</InputLabel>
                                    <Select
                                        value={editForm.nivel_dificultad ?? ''}
                                        onChange={(e) =>
                                            setEditForm((f) => ({ ...f, nivel_dificultad: e.target.value }))
                                        }
                                        label="Nivel de dificultad"
                                    >
                                        {NIVELES.map((n) => (
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
                                    value={editForm.repeticiones ?? ''}
                                    onChange={(e) =>
                                        setEditForm((f) => ({ ...f, repeticiones: e.target.value }))
                                    }
                                    inputProps={{ min: 0 }}
                                    size="small"
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    fullWidth
                                    type="number"
                                    label="Tiempo (seg)"
                                    value={editForm.tiempo ?? ''}
                                    onChange={(e) =>
                                        setEditForm((f) => ({ ...f, tiempo: e.target.value }))
                                    }
                                    inputProps={{ min: 0 }}
                                    size="small"
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <FormControl fullWidth size="small">
                                    <InputLabel>Enfoque</InputLabel>
                                    <Select
                                        value={editForm.enfoque ?? ''}
                                        onChange={(e) =>
                                            setEditForm((f) => ({ ...f, enfoque: e.target.value }))
                                        }
                                        label="Enfoque"
                                    >
                                        {ENFOQUES.map((e) => (
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
                            value={editForm.contraindicaciones ?? []}
                            onChange={(_, newVal) =>
                                setEditForm((f) => ({ ...f, contraindicaciones: newVal }))
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
                                    placeholder="Añadir..."
                                    size="small"
                                />
                            )}
                        />
                        <TextField
                            fullWidth
                            multiline
                            rows={2}
                            label="Advertencias clínicas"
                            value={editForm.advertencias ?? ''}
                            onChange={(e) => setEditForm((f) => ({ ...f, advertencias: e.target.value }))}
                            size="small"
                        />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditDialog({ open: false, exercise: null })} color="inherit">
                        Cancelar
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<EditIcon />}
                        onClick={handleSaveEdit}
                    >
                        Guardar cambios
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
