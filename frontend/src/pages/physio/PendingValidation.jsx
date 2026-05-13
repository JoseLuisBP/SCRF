import { useState, useEffect } from 'react';
import {
    Box, Container, Typography, Grid, Card, CardContent, CardActions,
    Button, Chip, CircularProgress, Alert, Divider, Paper, Avatar,
    Stack, useTheme, Dialog, DialogTitle, DialogContent, DialogActions,
    TextField,
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import PsychologyIcon from '@mui/icons-material/Psychology';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import BlockIcon from '@mui/icons-material/Block';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import { usePhysioRoutines } from '../../hooks/usePhysioRoutines';
import VerificationBadge from '../../components/common/VerificationBadge';

export default function PendingValidation() {
    const navigate = useNavigate();
    const theme = useTheme();
    const { getPendingRoutines, verifyRoutine, rejectRoutine, loading, error } = usePhysioRoutines();

    const [routines, setRoutines] = useState([]);
    const [actionId, setActionId] = useState(null);
    const [successMsg, setSuccessMsg] = useState('');

    // Diálogo de rechazo
    const [rejectDialog, setRejectDialog] = useState({ open: false, routine: null, motivo: '' });

    useEffect(() => {
        getPendingRoutines(0, 50).then(setRoutines).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const showSuccess = (msg) => {
        setSuccessMsg(msg);
        setTimeout(() => setSuccessMsg(''), 4000);
    };

    const handleVerify = async (id_rutina, nombre) => {
        setActionId(`verify-${id_rutina}`);
        try {
            await verifyRoutine(id_rutina);
            setRoutines((prev) => prev.filter((r) => r.id_rutina !== id_rutina));
            showSuccess(`✅ Rutina "${nombre}" verificada correctamente`);
        } finally {
            setActionId(null);
        }
    };

    const handleOpenReject = (routine) => {
        setRejectDialog({ open: true, routine, motivo: '' });
    };

    const handleConfirmReject = async () => {
        const { routine, motivo } = rejectDialog;
        if (!motivo.trim()) return;

        setActionId(`reject-${routine.id_rutina}`);
        setRejectDialog({ open: false, routine: null, motivo: '' });
        try {
            await rejectRoutine(routine.id_rutina, motivo.trim());
            setRoutines((prev) => prev.filter((r) => r.id_rutina !== routine.id_rutina));
            showSuccess(`⛔ Rutina "${routine.nombre_rutina}" rechazada y registrada en auditoría`);
        } finally {
            setActionId(null);
        }
    };

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

            <Container maxWidth="lg" sx={{ py: 4 }}>

                {/* Encabezado */}
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={4}>
                    <Stack direction="row" alignItems="center" spacing={2}>
                        <Avatar sx={{ bgcolor: 'warning.main', width: 48, height: 48 }}>
                            <PsychologyIcon />
                        </Avatar>
                        <Box>
                            <Typography variant="h4" fontWeight={700}>
                                Rutinas ML Pendientes
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Valida o rechaza las rutinas generadas por el algoritmo CART
                            </Typography>
                        </Box>
                    </Stack>
                    <Button
                        variant="outlined"
                        startIcon={<ArrowBackIcon />}
                        onClick={() => navigate('/physio')}
                        sx={{ borderRadius: 2 }}
                    >
                        Volver al panel
                    </Button>
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
                            {routines.map((rutina) => {
                                const isActing =
                                    actionId === `verify-${rutina.id_rutina}` ||
                                    actionId === `reject-${rutina.id_rutina}`;
                                return (
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
                                                <Stack
                                                    direction="row"
                                                    justifyContent="space-between"
                                                    alignItems="center"
                                                    mb={1}
                                                >
                                                    <Chip
                                                        label={`#${rutina.id_rutina}`}
                                                        size="small"
                                                        variant="outlined"
                                                    />
                                                    <VerificationBadge badge="ml_generated" />
                                                </Stack>

                                                <Typography variant="h6" fontWeight={700} gutterBottom>
                                                    {rutina.nombre_rutina}
                                                </Typography>

                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                    gutterBottom
                                                >
                                                    {rutina.descripcion ?? 'Sin descripción'}
                                                </Typography>

                                                <Divider sx={{ my: 1.5 }} />

                                                <Stack
                                                    direction="row"
                                                    spacing={1}
                                                    flexWrap="wrap"
                                                    useFlexGap
                                                >
                                                    {rutina.nivel && (
                                                        <Chip
                                                            label={`Nivel: ${rutina.nivel}`}
                                                            size="small"
                                                            variant="outlined"
                                                        />
                                                    )}
                                                    {rutina.categoria && (
                                                        <Chip
                                                            label={rutina.categoria}
                                                            size="small"
                                                            variant="outlined"
                                                        />
                                                    )}
                                                    {rutina.duracion_estimada && (
                                                        <Chip
                                                            label={`${rutina.duracion_estimada} min`}
                                                            size="small"
                                                            variant="outlined"
                                                        />
                                                    )}
                                                </Stack>
                                            </CardContent>

                                            <CardActions sx={{ p: 2, gap: 1 }}>
                                                {/* Verificar */}
                                                <Button
                                                    variant="contained"
                                                    color="success"
                                                    size="small"
                                                    startIcon={
                                                        actionId === `verify-${rutina.id_rutina}`
                                                            ? <CircularProgress size={16} color="inherit" />
                                                            : <CheckCircleOutlineIcon />
                                                    }
                                                    disabled={isActing}
                                                    onClick={() =>
                                                        handleVerify(rutina.id_rutina, rutina.nombre_rutina)
                                                    }
                                                    sx={{ borderRadius: 2, flex: 1 }}
                                                >
                                                    {actionId === `verify-${rutina.id_rutina}`
                                                        ? 'Verificando...'
                                                        : 'Verificar'}
                                                </Button>

                                                {/* Rechazar */}
                                                <Button
                                                    variant="outlined"
                                                    color="error"
                                                    size="small"
                                                    startIcon={
                                                        actionId === `reject-${rutina.id_rutina}`
                                                            ? <CircularProgress size={16} color="inherit" />
                                                            : <BlockIcon />
                                                    }
                                                    disabled={isActing}
                                                    onClick={() => handleOpenReject(rutina)}
                                                    sx={{ borderRadius: 2, flex: 1 }}
                                                >
                                                    {actionId === `reject-${rutina.id_rutina}`
                                                        ? 'Rechazando...'
                                                        : 'Rechazar'}
                                                </Button>
                                            </CardActions>
                                        </Card>
                                    </Grid>
                                );
                            })}
                        </Grid>
                    )}
                </Paper>
            </Container>

            <Footer />

            {/* ─── Diálogo de rechazo ─────────────────────────────────────────────── */}
            <Dialog
                open={rejectDialog.open}
                onClose={() => setRejectDialog({ open: false, routine: null, motivo: '' })}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <BlockIcon color="error" />
                        <span>Rechazar rutina ML</span>
                    </Stack>
                </DialogTitle>
                <DialogContent dividers>
                    {rejectDialog.routine && (
                        <>
                            <Typography variant="body2" mb={2}>
                                Estás a punto de rechazar:{' '}
                                <strong>{rejectDialog.routine.nombre_rutina}</strong>.
                                El rechazo quedará registrado en el log clínico de auditoría.
                            </Typography>
                            <TextField
                                fullWidth
                                required
                                multiline
                                rows={3}
                                label="Motivo del rechazo *"
                                placeholder="Describe por qué esta rutina no es clínicamente apta..."
                                value={rejectDialog.motivo}
                                onChange={(e) =>
                                    setRejectDialog((prev) => ({ ...prev, motivo: e.target.value }))
                                }
                                error={rejectDialog.motivo.trim() === ''}
                                helperText={
                                    rejectDialog.motivo.trim() === ''
                                        ? 'El motivo es obligatorio para rechazar una rutina'
                                        : ''
                                }
                                size="small"
                            />
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setRejectDialog({ open: false, routine: null, motivo: '' })}
                        color="inherit"
                    >
                        Cancelar
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        startIcon={<BlockIcon />}
                        disabled={!rejectDialog.motivo.trim()}
                        onClick={handleConfirmReject}
                    >
                        Confirmar rechazo
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
