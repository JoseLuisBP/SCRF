import { useEffect, useState } from 'react';
import { Box, Container, Typography, Avatar, Paper, Grid, Divider, Alert, CircularProgress } from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Header from '../components/layout/Header';
import { useAuth } from '../context/AuthContext';
import { usersAPI } from '../api';
import PersonIcon from '@mui/icons-material/Person';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import LockIcon from '@mui/icons-material/Lock';

//  Esquemas de Validación 

// Esquema para Información Personal y Física
const profileSchema = yup.object({
    nombre: yup.string().required('El nombre es obligatorio'),
    correo: yup.string().email('Correo inválido').required('El correo es obligatorio'),
    edad: yup.number()
        .typeError('La edad debe ser un número')
        .positive('Debe ser mayor a 0')
        .integer('Debe ser un número entero')
        .nullable()
        .transform((value, originalValue) => (String(originalValue).trim() === '' ? null : value)),
    peso: yup.number()
        .typeError('El peso debe ser un número')
        .positive('Debe ser mayor a 0')
        .nullable()
        .transform((value, originalValue) => (String(originalValue).trim() === '' ? null : value)),
    estatura: yup.number()
        .typeError('La estatura debe ser un número')
        .positive('Debe ser mayor a 0')
        .nullable()
        .transform((value, originalValue) => (String(originalValue).trim() === '' ? null : value)),
}).required();

// Esquema para Cambio de Contraseña
const passwordSchema = yup.object({
    currentPassword: yup.string().required('La contraseña actual es obligatoria'),
    newPassword: yup
        .string()
        .min(6, 'La nueva contraseña debe tener al menos 6 caracteres')
        .required('La nueva contraseña es obligatoria'),
    confirmNewPassword: yup
        .string()
        .oneOf([yup.ref('newPassword'), null], 'Las contraseñas no coinciden')
        .required('Debe confirmar la nueva contraseña'),
}).required();

export default function Profile() {

    const { user, updateUser } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    //  Hooks del Formulario de Perfil 
    const {
        register: registerProfile,
        handleSubmit: handleSubmitProfile,
        formState: { errors: profileErrors, isDirty: isProfileDirty },
        reset: resetProfile,
    } = useForm({
        resolver: yupResolver(profileSchema),
        defaultValues: {
            nombre: '',
            correo: '',
            edad: null,
            peso: null,
            estatura: null,
        }
    });

    //  Hooks del Formulario de Contraseña 
    const {
        register: registerPassword,
        handleSubmit: handleSubmitPassword,
        formState: { errors: passwordErrors },
        reset: resetPassword,
    } = useForm({
        resolver: yupResolver(passwordSchema),
    });

    //  Cargar datos del usuario 
    useEffect(() => {
        if (user) {
            resetProfile({
                nombre: user.nombre || '',
                correo: user.correo || '',
                edad: user.edad || '',
                peso: user.peso || '',
                estatura: user.estatura || user.altura || '',
            });
        }
    }, [user, resetProfile]);

    // Limpiar mensajes después de unos segundos
    useEffect(() => {
        if (successMessage || errorMessage) {
            const timer = setTimeout(() => {
                setSuccessMessage('');
                setErrorMessage('');
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [successMessage, errorMessage]);

    const onSubmitProfile = async (formData) => {
        setIsLoading(true);
        setErrorMessage('');
        setSuccessMessage('');
        try {
            const response = await usersAPI.updateProfile(formData);

            if (response.data) {
                updateUser(response.data);
            } else if (response.user) {
                updateUser(response.user);
            } else {
                updateUser(response);
            }

            setSuccessMessage('¡Perfil actualizado con éxito!');
            resetProfile(formData);

        } catch (error) {
            setErrorMessage('Error al actualizar el perfil. Intente nuevamente.');
        } finally {
            setIsLoading(false);
        }
    };

    const onSubmitPassword = async (formData) => {
        setIsLoading(true);
        setErrorMessage('');
        setSuccessMessage('');
        try {
            await usersAPI.changePassword(formData);
            resetPassword();
            setSuccessMessage('¡Contraseña cambiada correctamente!');
        } catch (error) {
            setErrorMessage(
                error.response?.data?.detail ||
                'Error al cambiar la contraseña. Verifique su contraseña actual.'
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                background: (theme) =>
                    `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.secondary.main} 100%)`, // Diseño consistente con Home/Dashboard
                pb: 8
            }}
        >
            <Header />

            <Container maxWidth="lg" sx={{ mt: 12, mb: 4 }}>
                {/* Feedback Messages */}
                {(successMessage || errorMessage) && (
                    <Box sx={{ mb: 2, position: 'fixed', top: 100, right: 20, zIndex: 9999 }}>
                        {successMessage && <Alert severity="success" sx={{ mb: 1 }}>{successMessage}</Alert>}
                        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
                    </Box>
                )}

                <Paper
                    elevation={6}
                    sx={{
                        p: { xs: 3, md: 5 },
                        borderRadius: 4,
                        backdropFilter: "blur(16px)", // Glassmorphism consistente
                        backgroundColor: "#d4e9f8ff", // Color base consistente con Dashboard
                        opacity: 0.95
                    }}
                >
                    <Grid container spacing={4}>

                        {/*  Columna Izquierda: Avatar y Resumen  */}
                        <Grid item xs={12} md={4} sx={{ textAlign: 'center', borderRight: { md: '1px solid rgba(0,0,0,0.1)' } }}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'center' }}>
                                <Avatar
                                    sx={{
                                        width: 150,
                                        height: 150,
                                        mb: 2,
                                        fontSize: '4rem',
                                        bgcolor: 'primary.main',
                                        boxShadow: 3
                                    }}
                                >
                                    {user?.nombre?.charAt(0)?.toUpperCase() || <PersonIcon fontSize="inherit" />}
                                </Avatar>
                                <Typography variant="h5" fontWeight="bold" gutterBottom>
                                    {user?.nombre || "Usuario"}
                                </Typography>
                                <Typography variant="body1" color="text.secondary">
                                    {user?.correo}
                                </Typography>

                                <Box sx={{ mt: 4, width: '100%' }}>
                                    <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                                        "Mantén tus datos actualizados para un mejor seguimiento de tu progreso."
                                    </Typography>
                                </Box>
                            </Box>
                        </Grid>

                        {/*  Columna Derecha: Formularios  */}
                        <Grid item xs={12} md={8}>

                            {/*  Categoría 1: Información Personal  */}
                            <Box component="section" sx={{ mb: 5 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                    <PersonIcon color="primary" sx={{ mr: 1, fontSize: 30 }} />
                                    <Typography variant="h5" fontWeight="600" color="primary.dark">
                                        Información Personal
                                    </Typography>
                                </Box>

                                <form onSubmit={handleSubmitProfile(onSubmitProfile)}>
                                    <Grid container spacing={3}>
                                        <Grid item xs={12}>
                                            <Input
                                                label="Nombre Completo"
                                                {...registerProfile('nombre')}
                                                error={profileErrors.nombre?.message}
                                                fullWidth
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Input
                                                label="Correo Electrónico"
                                                {...registerProfile('correo')}
                                                error={profileErrors.correo?.message}
                                                fullWidth
                                            // Correo usualmente no debería editarse tan fácil, pero lo permitimos si el backend lo soporta
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Input
                                                label="Edad (años)"
                                                type="number"
                                                {...registerProfile('edad')}
                                                error={profileErrors.edad?.message}
                                                fullWidth
                                            />
                                        </Grid>

                                        {/*  Categoría 2: Información Física / Médica  */}
                                        <Grid item xs={12}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, mb: 1 }}>
                                                <MedicalServicesIcon color="primary" sx={{ mr: 1, fontSize: 30 }} />
                                                <Typography variant="h5" fontWeight="600" color="primary.dark">
                                                    Información Física y Médica
                                                </Typography>
                                            </Box>
                                            <Divider sx={{ mb: 3 }} />
                                        </Grid>

                                        <Grid item xs={12} sm={6}>
                                            <Input
                                                label="Peso (kg)"
                                                type="number"
                                                step="0.1"
                                                {...registerProfile('peso')}
                                                error={profileErrors.peso?.message}
                                                fullWidth
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Input
                                                label="Estatura (cm)"
                                                type="number"
                                                {...registerProfile('estatura')}
                                                error={profileErrors.estatura?.message}
                                                fullWidth
                                                helperText="Ingrese su estatura en centímetros"
                                            />
                                        </Grid>

                                        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                                            <Button
                                                variant="primary"
                                                type="submit"
                                                disabled={isLoading || !isProfileDirty}
                                                sx={{ minWidth: 200 }}
                                            >
                                                {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Guardar Cambios'}
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </form>
                            </Box>

                            <Divider sx={{ my: 4 }} />

                            {/*  Categoría 3: Preferencias y Seguridad  */}
                            <Box component="section">
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                    <LockIcon color="primary" sx={{ mr: 1, fontSize: 30 }} />
                                    <Typography variant="h5" fontWeight="600" color="primary.dark">
                                        Seguridad y Contraseña
                                    </Typography>
                                </Box>

                                <form onSubmit={handleSubmitPassword(onSubmitPassword)}>
                                    <Grid container spacing={3}>
                                        <Grid item xs={12}>
                                            <Input
                                                label="Contraseña Actual"
                                                type="password"
                                                {...registerPassword('currentPassword')}
                                                error={passwordErrors.currentPassword?.message}
                                                fullWidth
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Input
                                                label="Nueva Contraseña"
                                                type="password"
                                                {...registerPassword('newPassword')}
                                                error={passwordErrors.newPassword?.message}
                                                fullWidth
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Input
                                                label="Confirmar Nueva Contraseña"
                                                type="password"
                                                {...registerPassword('confirmNewPassword')}
                                                error={passwordErrors.confirmNewPassword?.message}
                                                fullWidth
                                            />
                                        </Grid>

                                        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                                            <Button
                                                variant="secondary"
                                                type="submit"
                                                disabled={isLoading}
                                                sx={{ minWidth: 200 }}
                                            >
                                                {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Cambiar Contraseña'}
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </form>
                            </Box>

                        </Grid>
                    </Grid>
                </Paper>
            </Container>
        </Box>
    );
}
