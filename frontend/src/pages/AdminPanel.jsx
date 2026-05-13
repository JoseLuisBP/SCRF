import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import usersAPI from '../api/users';
import Header from '../components/layout/Header';
import {
    Box, Container, Typography, Paper, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Chip, Button, TextField,
    Divider, Alert, CircularProgress, Stack, Avatar, Tooltip,
    useTheme, Grid, Card, CardContent, IconButton, TablePagination,
    Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText,
    Select, MenuItem, FormControl, InputLabel, Snackbar,
} from '@mui/material';
import {
    AdminPanelSettings as AdminIcon,
    PersonAdd as PersonAddIcon,
    CheckCircle as ActiveIcon,
    Cancel as InactiveIcon,
    Shield as ShieldIcon,
    Person as PersonIcon,
    FitnessCenter as FitnessCenterIcon,
    People as PeopleIcon,
    HowToReg as HowToRegIcon,
    Block as BlockIcon,
    Delete as DeleteIcon,
    ManageAccounts as ManageAccountsIcon,
    History as HistoryIcon,
    Search as SearchIcon,
    Refresh as RefreshIcon,
} from '@mui/icons-material';

const ROL_LABELS = { 1: 'Usuario', 2: 'Físioterapeuta', 3: 'Admin' };

export default function AdminPanel() {
    const { user } = useAuth();
    const theme = useTheme();

    // ── Stats ─────────────────────────────────────────────────────────────────
    const [stats, setStats] = useState(null);
    const [loadingStats, setLoadingStats] = useState(true);

    // ── Lista de usuarios ─────────────────────────────────────────────────────
    const [users, setUsers] = useState([]);
    const [loadingUsers, setLoadingUsers] = useState(true);
    const [usersError, setUsersError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // ── Acciones por fila ─────────────────────────────────────────────────────
    const [actionLoading, setActionLoading] = useState({});
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    // ── Diálogo de confirmación de eliminación ────────────────────────────────
    const [deleteDialog, setDeleteDialog] = useState({ open: false, userId: null, userName: '' });

    // ── Diálogo de cambio de rol ──────────────────────────────────────────────
    const [roleDialog, setRoleDialog] = useState({ open: false, userId: null, userName: '', currentRole: 1 });
    const [newRole, setNewRole] = useState(1);

    // ── Formulario crear admin ────────────────────────────────────────────────
    const [form, setForm] = useState({ nombre: '', correo: '', contrasena: '', confirmado: true });
    const [formLoading, setFormLoading] = useState(false);
    const [formSuccess, setFormSuccess] = useState('');
    const [formError, setFormError] = useState('');

    // ── Audit log ─────────────────────────────────────────────────────────────
    const [auditLogs, setAuditLogs] = useState([]);
    const [loadingAudit, setLoadingAudit] = useState(true);

    // ─────────────────────────────────────────────────────────────────────────
    // Carga inicial
    // ─────────────────────────────────────────────────────────────────────────
    useEffect(() => {
        loadStats();
        loadUsers();
        loadAuditLogs();
    }, []);

    const loadStats = async () => {
        setLoadingStats(true);
        try {
            const data = await usersAPI.getStats();
            setStats(data);
        } catch {
            // stats no críticas, fallo silencioso
        } finally {
            setLoadingStats(false);
        }
    };

    const loadUsers = async () => {
        setLoadingUsers(true);
        setUsersError('');
        try {
            const data = await usersAPI.getAdminUsers();
            setUsers(data);
        } catch (err) {
            setUsersError(err?.response?.data?.detail || 'Error al cargar los usuarios.');
        } finally {
            setLoadingUsers(false);
        }
    };

    const loadAuditLogs = async () => {
        setLoadingAudit(true);
        try {
            const data = await usersAPI.getAuditLogs();
            setAuditLogs(data);
        } catch {
            // audit log no crítico, fallo silencioso
        } finally {
            setLoadingAudit(false);
        }
    };

    const refreshAll = () => {
        loadStats();
        loadUsers();
        loadAuditLogs();
    };

    const showSnackbar = (message, severity = 'success') =>
        setSnackbar({ open: true, message, severity });

    // ─────────────────────────────────────────────────────────────────────────
    // Filtrado y paginación
    // ─────────────────────────────────────────────────────────────────────────
    const filteredUsers = users.filter((u) => {
        const q = searchTerm.toLowerCase();
        return (
            u.nombre?.toLowerCase().includes(q) ||
            u.correo?.toLowerCase().includes(q)
        );
    });
    const paginatedUsers = filteredUsers.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    // ─────────────────────────────────────────────────────────────────────────
    // Handlers de acciones
    // ─────────────────────────────────────────────────────────────────────────
    const handleToggleActive = async (u) => {
        setActionLoading((prev) => ({ ...prev, [u.id_usuario]: true }));
        try {
            if (u.is_active) {
                await usersAPI.deactivateUser(u.id_usuario);
                showSnackbar(`Cuenta de "${u.nombre}" desactivada.`);
            } else {
                await usersAPI.activateUser(u.id_usuario);
                showSnackbar(`Cuenta de "${u.nombre}" activada.`);
            }
            await loadUsers();
            await loadStats();
            await loadAuditLogs();
        } catch (err) {
            showSnackbar(err?.response?.data?.detail || 'Error al cambiar el estado.', 'error');
        } finally {
            setActionLoading((prev) => ({ ...prev, [u.id_usuario]: false }));
        }
    };

    const handleOpenRoleDialog = (u) => {
        setRoleDialog({ open: true, userId: u.id_usuario, userName: u.nombre, currentRole: u.id_rol });
        setNewRole(u.id_rol);
    };

    const handleChangeRole = async () => {
        const { userId, userName } = roleDialog;
        setRoleDialog((prev) => ({ ...prev, open: false }));
        setActionLoading((prev) => ({ ...prev, [userId]: true }));
        try {
            await usersAPI.changeUserRole(userId, newRole);
            showSnackbar(`Rol de "${userName}" actualizado a ${ROL_LABELS[newRole]}.`);
            await loadUsers();
            await loadStats();
            await loadAuditLogs();
        } catch (err) {
            showSnackbar(err?.response?.data?.detail || 'Error al cambiar el rol.', 'error');
        } finally {
            setActionLoading((prev) => ({ ...prev, [userId]: false }));
        }
    };

    const handleOpenDeleteDialog = (u) =>
        setDeleteDialog({ open: true, userId: u.id_usuario, userName: u.nombre });

    const handleDeleteUser = async () => {
        const { userId, userName } = deleteDialog;
        setDeleteDialog({ open: false, userId: null, userName: '' });
        setActionLoading((prev) => ({ ...prev, [userId]: true }));
        try {
            await usersAPI.deleteUser(userId);
            showSnackbar(`Usuario "${userName}" eliminado.`);
            await loadUsers();
            await loadStats();
            await loadAuditLogs();
        } catch (err) {
            showSnackbar(err?.response?.data?.detail || 'Error al eliminar el usuario.', 'error');
        } finally {
            setActionLoading((prev) => ({ ...prev, [userId]: false }));
        }
    };

    const handleFormChange = (e) =>
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    const handleCreateAdmin = async (e) => {
        e.preventDefault();
        setFormLoading(true);
        setFormError('');
        setFormSuccess('');
        try {
            const newAdmin = await usersAPI.createAdmin(form);
            setFormSuccess(
                `Administrador "${newAdmin.nombre}" (${newAdmin.correo}) creado exitosamente.`
            );
            setForm({ nombre: '', correo: '', contrasena: '', confirmado: true });
            await loadUsers();
            await loadStats();
            await loadAuditLogs();
        } catch (err) {
            setFormError(err?.response?.data?.detail || 'Error al crear el administrador.');
        } finally {
            setFormLoading(false);
        }
    };

    // ─────────────────────────────────────────────────────────────────────────
    // Helpers de UI
    // ─────────────────────────────────────────────────────────────────────────
    const getRolChip = (id_rol) => {
        if (id_rol === 3)
            return <Chip icon={<ShieldIcon />} label="Admin" color="error" size="small" />;
        if (id_rol === 2)
            return <Chip icon={<FitnessCenterIcon />} label="Físioterapeuta" color="warning" size="small" />;
        return <Chip icon={<PersonIcon />} label="Usuario" color="default" size="small" />;
    };

    const isCurrentUser = (userId) => userId === user?.id_usuario;

    // ─────────────────────────────────────────────────────────────────────────
    // Render
    // ─────────────────────────────────────────────────────────────────────────
    return (
        <Box
            sx={{
                minHeight: '100vh',
                background:
                    theme.palette.mode === 'dark'
                        ? '#000000'
                        : `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.secondary.main} 100%)`,
                transition: 'background 0.3s ease',
            }}
        >
            <Header />
            <Container maxWidth="lg" sx={{ py: 4 }}>

                {/* ── Encabezado ─────────────────────────────────────────── */}
                <Stack direction="row" alignItems="center" spacing={2} mb={4}>
                    <Avatar sx={{ bgcolor: 'error.main', width: 48, height: 48 }}>
                        <AdminIcon />
                    </Avatar>
                    <Box>
                        <Typography variant="h4" fontWeight={700}>
                            Panel de Administración
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Sesión de: <strong>{user?.nombre || user?.correo}</strong>
                        </Typography>
                    </Box>
                </Stack>

                {/* ── Tarjetas de estadísticas ───────────────────────────── */}
                <Grid container spacing={2} mb={4}>
                    {[
                        {
                            label: 'Total Usuarios',
                            value: stats?.total_usuarios,
                            icon: <PeopleIcon />,
                            color: 'primary',
                        },
                        {
                            label: 'Activos',
                            value: stats?.usuarios_activos,
                            icon: <ActiveIcon />,
                            color: 'success',
                        },
                        {
                            label: 'Administradores',
                            value: stats?.total_admins,
                            icon: <ShieldIcon />,
                            color: 'error',
                        },
                        {
                            label: 'Fisioterapeutas',
                            value: stats?.total_entrenadores,
                            icon: <FitnessCenterIcon />,
                            color: 'warning',
                        },
                    ].map((stat) => (
                        <Grid item xs={6} sm={3} key={stat.label}>
                            <Card elevation={2} sx={{ borderRadius: 3, textAlign: 'center' }}>
                                <CardContent>
                                    <Avatar
                                        sx={{
                                            bgcolor: `${stat.color}.main`,
                                            mx: 'auto',
                                            mb: 1,
                                        }}
                                    >
                                        {stat.icon}
                                    </Avatar>
                                    <Typography variant="h4" fontWeight={700}>
                                        {loadingStats ? (
                                            <CircularProgress size={24} />
                                        ) : (
                                            stat.value ?? '—'
                                        )}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {stat.label}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                {/* ── Tabla de usuarios ──────────────────────────────────── */}
                <Paper
                    elevation={2}
                    sx={{
                        p: 3,
                        mb: 4,
                        borderRadius: 3,
                        border: `1px solid ${theme.palette.divider}`,
                    }}
                >
                    <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                        flexWrap="wrap"
                        gap={1}
                        mb={2}
                    >
                        <Typography variant="h6" fontWeight={600}>
                            Gestión de Usuarios
                        </Typography>
                        <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                            <TextField
                                size="small"
                                placeholder="Buscar por nombre o correo…"
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setPage(0);
                                }}
                                InputProps={{
                                    startAdornment: (
                                        <SearchIcon
                                            fontSize="small"
                                            sx={{ mr: 0.5, color: 'text.secondary' }}
                                        />
                                    ),
                                }}
                                sx={{ width: 240 }}
                            />
                            <Button
                                size="small"
                                variant="outlined"
                                startIcon={<RefreshIcon />}
                                onClick={refreshAll}
                                disabled={loadingUsers}
                            >
                                Actualizar
                            </Button>
                        </Stack>
                    </Stack>

                    {usersError && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {usersError}
                        </Alert>
                    )}

                    {loadingUsers ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <>
                            <TableContainer>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell><strong>ID</strong></TableCell>
                                            <TableCell><strong>Nombre</strong></TableCell>
                                            <TableCell><strong>Correo</strong></TableCell>
                                            <TableCell><strong>Rol</strong></TableCell>
                                            <TableCell><strong>Estado</strong></TableCell>
                                            <TableCell><strong>Registro</strong></TableCell>
                                            <TableCell align="center"><strong>Acciones</strong></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {paginatedUsers.map((u) => (
                                            <TableRow
                                                key={u.id_usuario}
                                                hover
                                                sx={{
                                                    bgcolor:
                                                        u.id_rol === 3
                                                            ? 'rgba(211,47,47,0.05)'
                                                            : 'inherit',
                                                }}
                                            >
                                                <TableCell>{u.id_usuario}</TableCell>
                                                <TableCell>
                                                    <Stack direction="row" alignItems="center" spacing={1}>
                                                        <Avatar sx={{ width: 28, height: 28, fontSize: 12 }}>
                                                            {u.nombre?.[0]?.toUpperCase() ?? '?'}
                                                        </Avatar>
                                                        <span>{u.nombre}</span>
                                                    </Stack>
                                                </TableCell>
                                                <TableCell>{u.correo}</TableCell>
                                                <TableCell>{getRolChip(u.id_rol)}</TableCell>
                                                <TableCell>
                                                    <Tooltip title={u.is_active ? 'Activo' : 'Inactivo'}>
                                                        {u.is_active ? (
                                                            <ActiveIcon color="success" fontSize="small" />
                                                        ) : (
                                                            <InactiveIcon color="error" fontSize="small" />
                                                        )}
                                                    </Tooltip>
                                                </TableCell>
                                                <TableCell>
                                                    {u.fecha_registro
                                                        ? new Date(u.fecha_registro).toLocaleDateString('es-MX')
                                                        : '—'}
                                                </TableCell>
                                                <TableCell align="center">
                                                    {isCurrentUser(u.id_usuario) ? (
                                                        <Typography variant="caption" color="text.secondary">
                                                            (tú)
                                                        </Typography>
                                                    ) : actionLoading[u.id_usuario] ? (
                                                        <CircularProgress size={20} />
                                                    ) : (
                                                        <Stack direction="row" spacing={0.5} justifyContent="center">
                                                            <Tooltip
                                                                title={u.is_active ? 'Desactivar cuenta' : 'Activar cuenta'}
                                                            >
                                                                <IconButton
                                                                    size="small"
                                                                    color={u.is_active ? 'warning' : 'success'}
                                                                    onClick={() => handleToggleActive(u)}
                                                                >
                                                                    {u.is_active ? (
                                                                        <BlockIcon fontSize="small" />
                                                                    ) : (
                                                                        <HowToRegIcon fontSize="small" />
                                                                    )}
                                                                </IconButton>
                                                            </Tooltip>
                                                            <Tooltip title="Cambiar rol">
                                                                <IconButton
                                                                    size="small"
                                                                    color="info"
                                                                    onClick={() => handleOpenRoleDialog(u)}
                                                                >
                                                                    <ManageAccountsIcon fontSize="small" />
                                                                </IconButton>
                                                            </Tooltip>
                                                            <Tooltip title="Eliminar usuario">
                                                                <IconButton
                                                                    size="small"
                                                                    color="error"
                                                                    onClick={() => handleOpenDeleteDialog(u)}
                                                                >
                                                                    <DeleteIcon fontSize="small" />
                                                                </IconButton>
                                                            </Tooltip>
                                                        </Stack>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                        {filteredUsers.length === 0 && (
                                            <TableRow>
                                                <TableCell colSpan={7} align="center">
                                                    <Typography
                                                        variant="body2"
                                                        color="text.secondary"
                                                        sx={{ py: 2 }}
                                                    >
                                                        {searchTerm
                                                            ? 'No se encontraron usuarios con ese criterio.'
                                                            : 'No hay usuarios registrados.'}
                                                    </Typography>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <TablePagination
                                component="div"
                                count={filteredUsers.length}
                                page={page}
                                onPageChange={(_, newPage) => setPage(newPage)}
                                rowsPerPage={rowsPerPage}
                                onRowsPerPageChange={(e) => {
                                    setRowsPerPage(parseInt(e.target.value, 10));
                                    setPage(0);
                                }}
                                rowsPerPageOptions={[5, 10, 25, 50]}
                                labelRowsPerPage="Filas:"
                                labelDisplayedRows={({ from, to, count }) =>
                                    `${from}–${to} de ${count}`
                                }
                            />
                        </>
                    )}
                </Paper>

                {/* ── Formulario crear administrador ─────────────────────── */}
                <Paper
                    elevation={2}
                    sx={{
                        p: 3,
                        mb: 4,
                        borderRadius: 3,
                        border: `1px solid ${theme.palette.divider}`,
                    }}
                >
                    <Stack direction="row" alignItems="center" spacing={1} mb={3}>
                        <PersonAddIcon color="error" />
                        <Typography variant="h6" fontWeight={600}>
                            Crear Nuevo Administrador
                        </Typography>
                    </Stack>

                    <Alert severity="info" sx={{ mb: 3 }}>
                        El nuevo usuario recibirá automáticamente el{' '}
                        <strong>rol de Administrador (id_rol=3)</strong>. La acción quedará
                        registrada en el log de auditoría.
                    </Alert>

                    {formSuccess && (
                        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setFormSuccess('')}>
                            {formSuccess}
                        </Alert>
                    )}
                    {formError && (
                        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setFormError('')}>
                            {formError}
                        </Alert>
                    )}

                    <Box component="form" onSubmit={handleCreateAdmin} autoComplete="off">
                        <Stack spacing={2.5}>
                            <TextField
                                label="Nombre completo"
                                name="nombre"
                                value={form.nombre}
                                onChange={handleFormChange}
                                required
                                inputProps={{ minLength: 4, maxLength: 100 }}
                                fullWidth
                                size="small"
                            />
                            <TextField
                                label="Correo electrónico"
                                name="correo"
                                type="email"
                                value={form.correo}
                                onChange={handleFormChange}
                                required
                                fullWidth
                                size="small"
                            />
                            <TextField
                                label="Contraseña"
                                name="contrasena"
                                type="password"
                                value={form.contrasena}
                                onChange={handleFormChange}
                                required
                                inputProps={{ minLength: 8, maxLength: 50 }}
                                fullWidth
                                size="small"
                                helperText="Mínimo 8 caracteres"
                            />
                            <Divider />
                            <Button
                                type="submit"
                                variant="contained"
                                color="error"
                                size="large"
                                disabled={formLoading}
                                startIcon={
                                    formLoading ? (
                                        <CircularProgress size={18} />
                                    ) : (
                                        <PersonAddIcon />
                                    )
                                }
                                sx={{ alignSelf: 'flex-start', px: 4 }}
                            >
                                {formLoading ? 'Creando…' : 'Crear Administrador'}
                            </Button>
                        </Stack>
                    </Box>
                </Paper>

                {/* ── Registro de auditoría ──────────────────────────────── */}
                <Paper
                    elevation={2}
                    sx={{
                        p: 3,
                        borderRadius: 3,
                        border: `1px solid ${theme.palette.divider}`,
                    }}
                >
                    <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                        <HistoryIcon color="action" />
                        <Typography variant="h6" fontWeight={600}>
                            Registro de Auditoría
                        </Typography>
                    </Stack>

                    {loadingAudit ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <TableContainer>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell><strong>Fecha</strong></TableCell>
                                        <TableCell><strong>Acción</strong></TableCell>
                                        <TableCell><strong>Entidad</strong></TableCell>
                                        <TableCell><strong>Descripción</strong></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {auditLogs.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={4} align="center">
                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                    sx={{ py: 2 }}
                                                >
                                                    Sin registros de auditoría.
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        auditLogs.map((log) => (
                                            <TableRow key={log.id_auditoria} hover>
                                                <TableCell sx={{ whiteSpace: 'nowrap' }}>
                                                    {log.fecha_accion
                                                        ? new Date(log.fecha_accion).toLocaleString('es-MX')
                                                        : '—'}
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={log.accion}
                                                        size="small"
                                                        variant="outlined"
                                                        color={
                                                            log.accion.includes('DELETE')
                                                                ? 'error'
                                                                : log.accion.includes('DEACTIVATE')
                                                                ? 'warning'
                                                                : 'default'
                                                        }
                                                    />
                                                </TableCell>
                                                <TableCell>{log.entidad_afectada}</TableCell>
                                                <TableCell
                                                    sx={{
                                                        maxWidth: 320,
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap',
                                                    }}
                                                >
                                                    <Tooltip title={log.descripcion || ''}>
                                                        <span>{log.descripcion || '—'}</span>
                                                    </Tooltip>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </Paper>
            </Container>

            {/* ── Diálogo: confirmar eliminación ─────────────────────────── */}
            <Dialog
                open={deleteDialog.open}
                onClose={() => setDeleteDialog({ open: false, userId: null, userName: '' })}
            >
                <DialogTitle>Confirmar eliminación</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        ¿Estás seguro de que deseas eliminar al usuario{' '}
                        <strong>{deleteDialog.userName}</strong>? Esta acción es permanente y no
                        se puede deshacer.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() =>
                            setDeleteDialog({ open: false, userId: null, userName: '' })
                        }
                    >
                        Cancelar
                    </Button>
                    <Button onClick={handleDeleteUser} color="error" variant="contained">
                        Eliminar
                    </Button>
                </DialogActions>
            </Dialog>

            {/* ── Diálogo: cambiar rol ───────────────────────────────────── */}
            <Dialog
                open={roleDialog.open}
                onClose={() => setRoleDialog((prev) => ({ ...prev, open: false }))}
                maxWidth="xs"
                fullWidth
            >
                <DialogTitle>Cambiar rol — {roleDialog.userName}</DialogTitle>
                <DialogContent sx={{ pt: 2 }}>
                    <FormControl fullWidth size="small">
                        <InputLabel>Nuevo rol</InputLabel>
                        <Select
                            value={newRole}
                            label="Nuevo rol"
                            onChange={(e) => setNewRole(e.target.value)}
                        >
                            <MenuItem value={1}>
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <PersonIcon fontSize="small" />
                                    <span>Usuario</span>
                                </Stack>
                            </MenuItem>
                            <MenuItem value={2}>
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <FitnessCenterIcon fontSize="small" />
                                    <span>Físioterapeuta</span>
                                </Stack>
                            </MenuItem>
                            <MenuItem value={3}>
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <ShieldIcon fontSize="small" />
                                    <span>Administrador</span>
                                </Stack>
                            </MenuItem>
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setRoleDialog((prev) => ({ ...prev, open: false }))}>
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleChangeRole}
                        variant="contained"
                        disabled={newRole === roleDialog.currentRole}
                    >
                        Guardar
                    </Button>
                </DialogActions>
            </Dialog>

            {/* ── Snackbar de notificaciones ─────────────────────────────── */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
                    severity={snackbar.severity}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}
