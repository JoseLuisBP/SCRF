import { useState, useEffect } from 'react';
import {
    Box, Container, Typography, Grid, Card, CardContent, CardActions,
    Button, Chip, CircularProgress, Alert, Divider, Paper, Avatar,
    Stack, useTheme,
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import PsychologyIcon from '@mui/icons-material/Psychology';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';

import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import { usePhysioRoutines } from '../../hooks/usePhysioRoutines';
import VerificationBadge from '../../components/common/VerificationBadge';

export default function PendingValidation() {
    const theme = useTheme();
    const { getPendingRoutines, verifyRoutine, loading, error } = usePhysioRoutines();
    const [routines, setRoutines] = useState([]);
    const [verifyingId, setVerifyingId] = useState(null);
    const [successMsg, setSuccessMsg] = useState('');

    useEffect(() => {
        getPendingRoutines(0, 50).then(setRoutines).catch(() => {});
    }, []);

    const handleVerify = async (id_rutina, nombre) => {
        setVerifyingId(id_rutina);
        try {
            await verifyRoutine(id_rutina);
            setRoutines(prev => prev.filter(r => r.id_rutina !== id_rutina));
            setSuccessMsg(`✅ Rutina "${nombre}" verificada correctamente`);
            setTimeout(() => setSuccessMsg(''), 4000);
        } finally {
            setVerifyingId(null);
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
                    <Avatar sx={{ bgcolor: 'warning.main', width: 48, height: 48 }}>
                        <PsychologyIcon />
                    </Avatar>
                    <Box>
                        <Typography variant="h4" fontWeight={700}>
                            Rutinas ML Pendientes
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Valida las rutinas generadas por el algoritmo CART antes de que lleguen a los usuarios
                        </Typography>
                    </Box>
                </Stack>

                {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
                {successMsg && <Alert severity="success" sx={{ mb: 3 }}>{successMsg}</Alert>}

                {/* Contenedor principal */}
                <Paper
                    elevation={2}
                    sx={{ p: 3, borderRadius: 3, border: `1px solid ${theme.palette.divider}` }}
                >
                    <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
                        <Typography variant="h6" fontWeight={600}>
                            Rutinas pendientes de verificación
                        </Typography>
                        <Chip
                            label={`${routines.length} pendiente${routines.length !== 1 ? 's' : ''}`}
                            color={routines.length > 0 ? 'warning' : 'success'}
                            size="small"
                        />
                    </Stack>

                    <Divider sx={{ mb: 3 }} />

                    {loading && !routines.length ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                            <CircularProgress size={48} />
                        </Box>
                    ) : routines.length === 0 ? (
                        <Alert severity="success" icon={<CheckCircleOutlineIcon />} sx={{ fontSize: '1rem' }}>
                            ¡Excelente! No hay rutinas pendientes de verificación.
                        </Alert>
                    ) : (
                        <Grid container spacing={3}>
                            {routines.map((rutina) => (
                                <Grid item xs={12} md={6} lg={4} key={rutina.id_rutina}>
                                    <Card
                                        elevation={1}
                                        sx={{
                                            borderRadius: 3,
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            border: `1px solid ${theme.palette.divider}`,
                                            transition: 'box-shadow 0.2s ease',
                                            '&:hover': { boxShadow: 4 },
                                        }}
                                    >
                                        <CardContent sx={{ flexGrow: 1 }}>
                                            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                                                <Chip label={`#${rutina.id_rutina}`} size="small" variant="outlined" />
                                                <VerificationBadge badge="ml_generated" />
                                            </Stack>

                                            <Typography variant="h6" fontWeight={700} gutterBottom>
                                                {rutina.nombre_rutina}
                                            </Typography>

                                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                                {rutina.descripcion ?? 'Sin descripción'}
                                            </Typography>

                                            <Divider sx={{ my: 1.5 }} />

                                            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                                                {rutina.nivel && (
                                                    <Chip label={`Nivel: ${rutina.nivel}`} size="small" variant="outlined" />
                                                )}
                                                {rutina.categoria && (
                                                    <Chip label={rutina.categoria} size="small" variant="outlined" />
                                                )}
                                                {rutina.duracion_estimada && (
                                                    <Chip label={`${rutina.duracion_estimada} min`} size="small" variant="outlined" />
                                                )}
                                            </Stack>
                                        </CardContent>

                                        <CardActions sx={{ p: 2 }}>
                                            <Button
                                                fullWidth
                                                variant="contained"
                                                color="success"
                                                startIcon={
                                                    verifyingId === rutina.id_rutina
                                                        ? <CircularProgress size={16} color="inherit" />
                                                        : <CheckCircleOutlineIcon />
                                                }
                                                disabled={verifyingId === rutina.id_rutina}
                                                onClick={() => handleVerify(rutina.id_rutina, rutina.nombre_rutina)}
                                                sx={{ borderRadius: 2 }}
                                            >
                                                {verifyingId === rutina.id_rutina ? 'Verificando...' : 'Verificar Rutina'}
                                            </Button>
                                        </CardActions>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    )}
                </Paper>

            </Container>

            <Footer />
        </Box>
    );
}
