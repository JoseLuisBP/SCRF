import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import usersAPI from '../api/users';
import Header from '../components/layout/Header';
import {
    Box, Container, Typography, Paper, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Chip, Button, TextField,
    Divider, Alert, CircularProgress, Stack, Avatar, Tooltip,
    useTheme
} from '@mui/material';
import {
    AdminPanelSettings as AdminIcon,
    PersonAdd as PersonAddIcon,
    CheckCircle as ActiveIcon,
    Cancel as InactiveIcon,
    Shield as ShieldIcon,
    Person as PersonIcon
} from '@mui/icons-material';

export default function AdminPanel() {
    const { user } = useAuth();
    const theme = useTheme();

    // --- Estado: Lista de usuarios ---
    const [users, setUsers] = useState([]);
    const [loadingUsers, setLoadingUsers] = useState(true);
    const [usersError, setUsersError] = useState('');

    // --- Estado: Formulario crear admin ---
    const [form, setForm] = useState({
        nombre: '',
        correo: '',
        contrasena: '',
        confirmado: true,
    });
    const [formLoading, setFormLoading] = useState(false);
    const [formSuccess, setFormSuccess] = useState('');
    const [formError, setFormError] = useState('');

    // Cargar usuarios al montar el componente
    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        setLoadingUsers(true);
        setUsersError('');
        try {
            const data = await usersAPI.getAdminUsers();
            setUsers(data);
        } catch (err) {
            setUsersError(
                err?.response?.data?.detail || 'Error al cargar los usuarios.'
            );
        } finally {
            setLoadingUsers(false);
        }
    };

    const handleFormChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleCreateAdmin = async (e) => {
        e.preventDefault();
        setFormLoading(true);
        setFormError('');
        setFormSuccess('');

        try {
            const newAdmin = await usersAPI.createAdmin(form);
            setFormSuccess(
                `✅ Administrador "${newAdmin.nombre}" (${newAdmin.correo}) creado exitosamente.`
            );
            setForm({ nombre: '', correo: '', contrasena: '', confirmado: true });
            // Recargar lista de usuarios para reflejar el nuevo admin
            await loadUsers();
        } catch (err) {
            setFormError(
                err?.response?.data?.detail || 'Error al crear el administrador.'
            );
        } finally {
            setFormLoading(false);
        }
    };

    const getRolChip = (id_rol) => {
        if (id_rol === 3) return <Chip icon={<ShieldIcon />} label="Admin" color="error" size="small" />;
        if (id_rol === 2) return <Chip icon={<PersonIcon />} label="Entrenador" color="warning" size="small" />;
        return <Chip icon={<PersonIcon />} label="Usuario" color="default" size="small" />;
    };

    // //cambia el fondo dependiendo si el usuario usa el modo claro u oscuro 
    return (
        <Box sx={{ minHeight: '100vh',
            // bgcolor: 'background.default' 
            background: (theme) =>
        theme.palette.mode === "dark"
          ? "#000000"
          : `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.secondary.main} 100%)`,
      transition: 'background 0.3s ease'
    }}
  >
            
            <Header />
            <Container maxWidth="lg" sx={{ py: 4 }}>

                {/* Encabezado del panel */}
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

                {/* ============================
                    SECCIÓN 1: Lista de Usuarios
                    ============================ */}
                <Paper
                    elevation={2}
                    sx={{
                        p: 3,
                        mb: 4,
                        borderRadius: 3,
                        border: `1px solid ${theme.palette.divider}`
                    }}
                >
                    <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
                        <Typography variant="h6" fontWeight={600}>
                            Gestión de Usuarios
                        </Typography>
                        <Button
                            size="small"
                            variant="outlined"
                            onClick={loadUsers}
                            disabled={loadingUsers}
                        >
                            Actualizar lista
                        </Button>
                    </Stack>

                    {usersError && (
                        <Alert severity="error" sx={{ mb: 2 }}>{usersError}</Alert>
                    )}

                    {loadingUsers ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                            <CircularProgress />
                        </Box>
                    ) : (
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
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {users.map((u) => (
                                        <TableRow
                                            key={u.id_usuario}
                                            hover
                                            sx={{
                                                bgcolor: u.id_rol === 3
                                                    ? 'rgba(211,47,47,0.05)'
                                                    : 'inherit'
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
                                                    {u.is_active
                                                        ? <ActiveIcon color="success" fontSize="small" />
                                                        : <InactiveIcon color="error" fontSize="small" />
                                                    }
                                                </Tooltip>
                                            </TableCell>
                                            <TableCell>
                                                {u.fecha_registro
                                                    ? new Date(u.fecha_registro).toLocaleDateString('es-MX')
                                                    : '—'}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </Paper>

                {/* ===================================
                    SECCIÓN 2: Crear Nuevo Administrador
                    =================================== */}
                <Paper
                    elevation={2}
                    sx={{
                        p: 3,
                        borderRadius: 3,
                        border: `1px solid ${theme.palette.divider}`
                    }}
                >
                    <Stack direction="row" alignItems="center" spacing={1} mb={3}>
                        <PersonAddIcon color="error" />
                        <Typography variant="h6" fontWeight={600}>
                            Crear Nuevo Administrador
                        </Typography>
                    </Stack>

                    <Alert severity="info" sx={{ mb: 3 }}>
                        El nuevo usuario recibirá automáticamente el <strong>rol de Administrador (id_rol=3)</strong>.
                        La acción quedará registrada en el log de auditoría.
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

                    <Box
                        component="form"
                        onSubmit={handleCreateAdmin}
                        autoComplete="off"
                    >
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
                                startIcon={formLoading ? <CircularProgress size={18} /> : <PersonAddIcon />}
                                sx={{ alignSelf: 'flex-start', px: 4 }}
                            >
                                {formLoading ? 'Creando...' : 'Crear Administrador'}
                            </Button>
                        </Stack>
                    </Box>
                </Paper>

            </Container>
        </Box>
    );
}
