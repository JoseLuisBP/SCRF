/**
 * PendingValidation — Lista completa de rutinas ML pendientes de verificación.
 * Permite al Fisio revisar y validar cada rutina generada por el algoritmo CART.
 */
import { useState, useEffect } from 'react';
import {
    Box, Typography, Grid, Card, CardContent, CardActions,
    Button, Chip, CircularProgress, Alert, Divider,
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import PsychologyIcon from '@mui/icons-material/Psychology';
import { usePhysioRoutines } from '../../hooks/usePhysioRoutines';
import VerificationBadge from '../../components/common/VerificationBadge';

export default function PendingValidation() {
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
        <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1200, mx: 'auto' }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight={700} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PsychologyIcon sx={{ color: '#D97706', fontSize: 36 }} />
                    Rutinas ML Pendientes
                </Typography>
                <Typography color="text.secondary">
                    Estas rutinas fueron generadas por el algoritmo CART y requieren tu validación clínica.
                </Typography>
            </Box>

            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
            {successMsg && <Alert severity="success" sx={{ mb: 3 }}>{successMsg}</Alert>}

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
                                elevation={0}
                                sx={{
                                    border: '1px solid',
                                    borderColor: '#FCD34D',
                                    borderRadius: 3,
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    transition: 'box-shadow 0.2s',
                                    '&:hover': { boxShadow: '0 4px 20px rgba(251,191,36,0.2)' },
                                }}
                            >
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                        <Chip label={`#${rutina.id_rutina}`} size="small" sx={{ fontWeight: 600 }} />
                                        <VerificationBadge badge="ml_generated" />
                                    </Box>
                                    <Typography variant="h6" fontWeight={700} gutterBottom>
                                        {rutina.nombre_rutina}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                        {rutina.descripcion ?? 'Sin descripción'}
                                    </Typography>
                                    <Divider sx={{ my: 1.5 }} />
                                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                        {rutina.nivel && <Chip label={`Nivel: ${rutina.nivel}`} size="small" variant="outlined" />}
                                        {rutina.categoria && <Chip label={rutina.categoria} size="small" variant="outlined" />}
                                        {rutina.duracion_estimada && (
                                            <Chip label={`${rutina.duracion_estimada} min`} size="small" variant="outlined" />
                                        )}
                                    </Box>
                                </CardContent>
                                <CardActions sx={{ p: 2 }}>
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        startIcon={
                                            verifyingId === rutina.id_rutina
                                                ? <CircularProgress size={16} color="inherit" />
                                                : <CheckCircleOutlineIcon />
                                        }
                                        disabled={verifyingId === rutina.id_rutina}
                                        onClick={() => handleVerify(rutina.id_rutina, rutina.nombre_rutina)}
                                        sx={{
                                            bgcolor: '#10B981',
                                            '&:hover': { bgcolor: '#059669' },
                                            borderRadius: 2,
                                        }}
                                    >
                                        {verifyingId === rutina.id_rutina ? 'Verificando...' : 'Verificar Rutina'}
                                    </Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Box>
    );
}
