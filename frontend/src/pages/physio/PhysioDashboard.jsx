import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box, Container, Typography, Button, Chip,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, Avatar, CircularProgress, Alert, Tooltip, IconButton,
    Stack, Grid, Card, CardContent, Divider, useTheme,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';

import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import { useAuth } from '../../context/AuthContext';
import { usePhysioRoutines } from '../../hooks/usePhysioRoutines';
import VerificationBadge from '../../components/common/VerificationBadge';

export default function PhysioDashboard() {
    const navigate = useNavigate();
    const theme = useTheme();
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
            await verifyRoutine(id_rutina);
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

                {/* Encabezado del panel — mismo patrón que AdminPanel */}
                <Stack direction="row" alignItems="center" spacing={2} mb={4}>
                    <Avatar sx={{ bgcolor: 'success.main', width: 48, height: 48 }}>
                        <MedicalServicesIcon />
                    </Avatar>
                    <Box>
                        <Typography variant="h4" fontWeight={700}>
                            Panel del Fisioterapeuta
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Sesión de: <strong>{user?.nombre || user?.correo}</strong>
                        </Typography>
                    </Box>
                </Stack>

                {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

                {/* KPI Cards */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    {kpiCards.map((card) => (
                        <Grid item xs={12} sm={4} key={card.label}>
                            <Paper
                                elevation={2}
                                sx={{
                                    p: 2,
                                    borderRadius: 3,
                                    border: `1px solid ${theme.palette.divider}`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 2,
                                }}
                            >
                                <Avatar sx={{ bgcolor: card.bg, color: card.color, width: 52, height: 52 }}>
                                    {card.icon}
                                </Avatar>
                                <Box>
                                    <Typography variant="h5" fontWeight={700}>{card.value}</Typography>
                                    <Typography variant="body2" color="text.secondary">{card.label}</Typography>
                                </Box>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>

                {/* Acciones rápidas */}
                <Paper
                    elevation={2}
                    sx={{ p: 3, mb: 4, borderRadius: 3, border: `1px solid ${theme.palette.divider}` }}
                >
                    <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                        Acciones Rápidas
                    </Typography>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} flexWrap="wrap">
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => navigate('/physio/exercises/new')}
                            color="success"
                            sx={{ borderRadius: 2 }}
                        >
                            Nuevo Ejercicio
                        </Button>
                        <Button
                            variant="contained"
                            startIcon={<FitnessCenterIcon />}
                            onClick={() => navigate('/physio/routines/new')}
                            color="primary"
                            sx={{ borderRadius: 2 }}
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
                    </Stack>
                </Paper>

                {/* Tabla de rutinas pendientes */}
                <Paper
                    elevation={2}
                    sx={{ p: 3, borderRadius: 3, border: `1px solid ${theme.palette.divider}` }}
                >
                    <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
                        <Typography variant="h6" fontWeight={600}>
                            Rutinas ML Pendientes de Verificación
                        </Typography>
                        <Chip
                            label={`${pendingRoutines.length} pendiente${pendingRoutines.length !== 1 ? 's' : ''}`}
                            color={pendingRoutines.length > 0 ? 'warning' : 'success'}
                            size="small"
                        />
                    </Stack>

                    <Divider sx={{ mb: 2 }} />

                    {loading && !pendingRoutines.length ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                            <CircularProgress />
                        </Box>
                    ) : pendingRoutines.length === 0 ? (
                        <Alert severity="success" icon={<CheckCircleOutlineIcon />}>
                            ¡Todo al día! No hay rutinas pendientes de verificación.
                        </Alert>
                    ) : (
                        <TableContainer>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
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
                                            <TableCell>{rutina.id_rutina}</TableCell>
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
                </Paper>

            </Container>

            <Footer />
        </Box>
    );
}
