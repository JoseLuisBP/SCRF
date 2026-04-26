/**
 * PhysioDashboard — Panel principal del Fisioterapeuta/Entrenador (Rol 2).
 *
 * Muestra:
 *  - KPI cards: ejercicios verificados, rutinas ML pendientes, rutinas propias
 *  - Tabla de rutinas ML pendientes de validación
 *  - Accesos rápidos a crear ejercicio / crear rutina
 */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box, Grid, Card, CardContent, Typography, Button, Chip,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, Avatar, CircularProgress, Alert, Tooltip, IconButton,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import { useAuth } from '../../context/AuthContext';
import { usePhysioRoutines } from '../../hooks/usePhysioRoutines';
import VerificationBadge from '../../components/common/VerificationBadge';

export default function PhysioDashboard() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { getPendingRoutines, verifyRoutine, loading, error } = usePhysioRoutines();
    const [pendingRoutines, setPendingRoutines] = useState([]);
    const [verifyingId, setVerifyingId] = useState(null);

    useEffect(() => {
        getPendingRoutines().then(setPendingRoutines).catch(() => {});
    }, []);

    const handleVerify = async (id_rutina) => {
        setVerifyingId(id_rutina);
        try {
            const updated = await verifyRoutine(id_rutina);
            setPendingRoutines(prev => prev.filter(r => r.id_rutina !== id_rutina));
        } finally {
            setVerifyingId(null);
        }
    };

    const kpiCards = [
        {
            label: 'Rutinas ML Pendientes',
            value: pendingRoutines.length,
            icon: <HourglassEmptyIcon />,
            color: '#D97706',
            bg: '#FEF3C7',
        },
        {
            label: 'Scope Clínico',
            value: 'Activo',
            icon: <VerifiedUserIcon />,
            color: '#10B981',
            bg: '#D1FAE5',
        },
        {
            label: 'Rol',
            value: 'Fisioterapeuta',
            icon: <PlaylistAddCheckIcon />,
            color: '#6366F1',
            bg: '#E0E7FF',
        },
    ];

    return (
        <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1200, mx: 'auto' }}>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight={700} gutterBottom>
                    Panel del Fisioterapeuta
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Bienvenido, <strong>{user?.nombre ?? 'Fisio'}</strong>. Gestiona rutinas clínicas y valida el contenido generado por IA.
                </Typography>
            </Box>

            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

            {/* KPI Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                {kpiCards.map((card) => (
                    <Grid item xs={12} sm={4} key={card.label}>
                        <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
                            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Avatar sx={{ bgcolor: card.bg, color: card.color, width: 52, height: 52 }}>
                                    {card.icon}
                                </Avatar>
                                <Box>
                                    <Typography variant="h5" fontWeight={700}>{card.value}</Typography>
                                    <Typography variant="body2" color="text.secondary">{card.label}</Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Acciones rápidas */}
            <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => navigate('/physio/exercises/new')}
                    sx={{ bgcolor: '#10B981', '&:hover': { bgcolor: '#059669' }, borderRadius: 2 }}
                >
                    Nuevo Ejercicio
                </Button>
                <Button
                    variant="contained"
                    startIcon={<FitnessCenterIcon />}
                    onClick={() => navigate('/physio/routines/new')}
                    sx={{ bgcolor: '#6366F1', '&:hover': { bgcolor: '#4F46E5' }, borderRadius: 2 }}
                >
                    Nueva Rutina
                </Button>
                <Button
                    variant="outlined"
                    startIcon={<CheckCircleOutlineIcon />}
                    onClick={() => navigate('/physio/routines/pending')}
                    sx={{ borderRadius: 2 }}
                >
                    Ver todas las pendientes
                </Button>
            </Box>

            {/* Tabla de rutinas pendientes */}
            <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                Rutinas ML Pendientes de Verificación
            </Typography>

            {loading && !pendingRoutines.length ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                    <CircularProgress />
                </Box>
            ) : pendingRoutines.length === 0 ? (
                <Alert severity="success" icon={<CheckCircleOutlineIcon />}>
                    ¡Todo al día! No hay rutinas pendientes de verificación.
                </Alert>
            ) : (
                <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ bgcolor: 'grey.50' }}>
                                <TableCell><strong>ID</strong></TableCell>
                                <TableCell><strong>Nombre</strong></TableCell>
                                <TableCell><strong>Nivel</strong></TableCell>
                                <TableCell><strong>Categoría</strong></TableCell>
                                <TableCell><strong>Estado</strong></TableCell>
                                <TableCell align="center"><strong>Acción</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {pendingRoutines.map((rutina) => (
                                <TableRow key={rutina.id_rutina} hover>
                                    <TableCell>#{rutina.id_rutina}</TableCell>
                                    <TableCell>{rutina.nombre_rutina}</TableCell>
                                    <TableCell>
                                        <Chip label={rutina.nivel ?? 'N/A'} size="small" />
                                    </TableCell>
                                    <TableCell>{rutina.categoria ?? '—'}</TableCell>
                                    <TableCell>
                                        <VerificationBadge badge={rutina.verification_badge ?? 'ml_generated'} />
                                    </TableCell>
                                    <TableCell align="center">
                                        <Tooltip title="Marcar como verificada clínicamente">
                                            <span>
                                                <IconButton
                                                    color="success"
                                                    disabled={verifyingId === rutina.id_rutina}
                                                    onClick={() => handleVerify(rutina.id_rutina)}
                                                    size="small"
                                                >
                                                    {verifyingId === rutina.id_rutina
                                                        ? <CircularProgress size={20} />
                                                        : <CheckCircleOutlineIcon />
                                                    }
                                                </IconButton>
                                            </span>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Box>
    );
}
