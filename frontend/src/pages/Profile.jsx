import { useEffect, useState } from 'react';
import {
    Box, Container, Typography, Avatar, Paper, Grid, Divider, Alert, CircularProgress,
    Tabs, Tab, Autocomplete, TextField, Chip
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
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
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

// --- Esquemas de Validación ---

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
    nivel_fisico: yup.string()
        .nullable()
        .oneOf(['sedentario', 'ligero', 'moderado', 'intenso'], 'Seleccione un nivel válido'),
    tiempo_disponible: yup.number()
        .typeError('El tiempo debe ser un número')
        .positive('Debe ser mayor a 0')
        .integer('Debe ser un número entero')
        .nullable()
        .transform((value, originalValue) => (String(originalValue).trim() === '' ? null : value)),
    objetivo_principal: yup.string().nullable(),
    perfil_medico: yup.object({
        condiciones_fisicas: yup.array().of(yup.string()).nullable(),
        lesiones: yup.array().of(yup.string()).nullable(),
        limitaciones: yup.array().of(yup.string()).nullable(),
    }),
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

// Helper para Tabs
function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`profile-tabpanel-${index}`}
            aria-labelledby={`profile-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ pt: 3, pb: 2 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

// Opciones Médicas
const opcionesCondiciones = [
    { value: 'Hipertension', label: 'Hipertensión o Problemas Cardíacos' },
    { value: 'Asma', label: 'Asma o Complicaciones Respiratorias' },
    { value: 'Diabetes', label: 'Diabetes' },
    { value: 'Artritis', label: 'Artritis / Osteoartritis' },
    { value: 'Ninguna', label: 'Ninguna de las Anteriores' },
];
const opcionesLesiones = [
    { value: 'Rodilla', label: 'Rodilla (Esguinces, Meniscos)' },
    { value: 'Espalda_Baja', label: 'Espalda Baja / Zona Lumbar' },
    { value: 'Espalda_Alta_Cuello', label: 'Cervical / Espalda Alta' },
    { value: 'Hombro', label: 'Hombro (Manguito Rotador)' },
    { value: 'Tobillo', label: 'Tobillos / Pies' },
    { value: 'Muneca', label: 'Muñecas / Codos' },
    { value: 'Cadera', label: 'Cadera / Pelvis' },
    { value: 'Ninguna', label: 'Ninguna Lesión Relevante' }
];
const opcionesLimitaciones = [
    { value: 'Impacto', label: 'Prohibido ejercicios con Saltos/Impacto' },
    { value: 'Carga_Pesada_Axial', label: 'Evitar cargas pesadas sobre la columna' },
    { value: 'Rotacion', label: 'Restricción en rotaciones de torso bruscas' },
    { value: 'Rango_Movimiento', label: 'Rango de movimiento limitado' },
    { value: 'Ninguna', label: 'Sin limitaciones' }
];

export default function Profile() {

    const { user, updateUser } = useAuth();

    // Estados generales
    const [tabValue, setTabValue] = useState(0);
    const [errorMessage, setErrorMessage] = useState('');

    // Estados visuales de botones
    const [profileSaveStatus, setProfileSaveStatus] = useState('idle'); // 'idle' | 'loading' | 'success'
    const [passwordSaveStatus, setPasswordSaveStatus] = useState('idle');

    // --- Hooks del Formulario de Perfil ---
    const {
        register: registerProfile,
        handleSubmit: handleSubmitProfile,
        formState: { errors: profileErrors, isDirty: isProfileDirty },
        reset: resetProfile,
        control: controlProfile,
    } = useForm({
        resolver: yupResolver(profileSchema),
        mode: 'onChange', // Validación en tiempo real
        defaultValues: {
            nombre: '', correo: '', edad: null, peso: null, estatura: null,
            nivel_fisico: 'sedentario', tiempo_disponible: null, objetivo_principal: '',
            perfil_medico: { condiciones_fisicas: [], lesiones: [], limitaciones: [] }
        }
    });

    // --- Hooks del Formulario de Contraseña ---
    const {
        register: registerPassword,
        handleSubmit: handleSubmitPassword,
        formState: { errors: passwordErrors },
        reset: resetPassword,
    } = useForm({
        resolver: yupResolver(passwordSchema),
        mode: 'onChange', // Validación en tiempo real
    });

    // --- Cargar datos del usuario ---
    useEffect(() => {
        if (user) {
            resetProfile({
                nombre: user.nombre || '',
                correo: user.correo || '',
                edad: user.edad || '',
                peso: user.peso || '',
                estatura: user.estatura || user.altura || '',
                nivel_fisico: user.nivel_fisico || 'sedentario',
                tiempo_disponible: user.tiempo_disponible || '',
                objetivo_principal: user.objetivo_principal || '',
                perfil_medico: {
                    condiciones_fisicas: user.perfil_medico?.condiciones_fisicas || [],
                    lesiones: user.perfil_medico?.lesiones || [],
                    limitaciones: user.perfil_medico?.limitaciones || [],
                }
            });
        }
    }, [user, resetProfile]);

    // Limpiar mensaje de error
    useEffect(() => {
        if (errorMessage) {
            const timer = setTimeout(() => setErrorMessage(''), 5000);
            return () => clearTimeout(timer);
        }
    }, [errorMessage]);

    // --- Handlers ---
    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    // Actualizar Perfil
    const onSubmitProfile = async (formData) => {
        setProfileSaveStatus('loading');
        setErrorMessage('');
        try {
            const response = await usersAPI.updateProfile(formData);
            if (response.data) updateUser(response.data);
            else if (response.user) updateUser(response.user);
            else updateUser(response);

            setProfileSaveStatus('success');
            resetProfile(formData);

            setTimeout(() => setProfileSaveStatus('idle'), 3000);
        } catch (error) {
            setProfileSaveStatus('idle');
            setErrorMessage('Error al actualizar el perfil. Intente nuevamente.');
        }
    };

    // Actualizar Contraseña
    const onSubmitPassword = async (formData) => {
        setPasswordSaveStatus('loading');
        setErrorMessage('');
        try {
            await usersAPI.changePassword(formData);
            resetPassword();
            setPasswordSaveStatus('success');

            setTimeout(() => setPasswordSaveStatus('idle'), 3000);
        } catch (error) {
            setPasswordSaveStatus('idle');
            setErrorMessage(error.response?.data?.detail || 'Error al cambiar la contraseña.');
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                background: (theme) =>
                    `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.secondary.main} 100%)`,
                pb: 8
            }}
        >
            <Header />

            <Container maxWidth="lg" sx={{ mt: 12, mb: 4 }}>
                {errorMessage && (
                    <Box sx={{ mb: 2, position: 'fixed', top: 100, right: 20, zIndex: 9999 }}>
                        <Alert severity="error">{errorMessage}</Alert>
                    </Box>
                )}

                <Paper
                    elevation={6}
                    sx={{
                        p: { xs: 2, md: 5 },
                        borderRadius: 4,
                        backdropFilter: "blur(16px)",
                        backgroundColor: "rgba(255, 255, 255, 0.8)", // Mejor contraste para glassmorphism
                        border: '1px solid rgba(255,255,255,0.4)', // Refinado
                        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.15)',
                    }}
                >
                    <Grid container spacing={4}>
                        {/* Columna Izquierda: Avatar y Resumen */}
                        <Grid item xs={12} md={4} sx={{ textAlign: 'center', borderRight: { md: '1px solid rgba(0,0,0,0.1)' } }}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>

                                {/* Avatar Dinámico con Hover Effect */}
                                <Box sx={{ position: 'relative', display: 'inline-block', mb: 2, cursor: 'pointer' }}>
                                    <Avatar
                                        sx={{
                                            width: 150,
                                            height: 150,
                                            fontSize: '4rem',
                                            bgcolor: 'primary.main',
                                            boxShadow: 3,
                                            transition: '0.3s ease',
                                            '&:hover': { filter: 'brightness(0.7)' }
                                        }}
                                    >
                                        {user?.nombre?.charAt(0)?.toUpperCase() || <PersonIcon fontSize="inherit" />}
                                    </Avatar>
                                    <Box
                                        sx={{
                                            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            opacity: 0, transition: 'opacity 0.3s', borderRadius: '50%',
                                            '&:hover': { opacity: 1 }
                                        }}
                                    >
                                        <PhotoCameraIcon sx={{ color: 'white', fontSize: 40 }} />
                                    </Box>
                                </Box>

                                <Typography variant="h5" fontWeight="bold" gutterBottom>
                                    {user?.nombre || "Usuario"}
                                </Typography>
                                <Typography variant="body1" color="text.secondary">
                                    {user?.correo}
                                </Typography>

                                <Box sx={{ mt: 4, width: '100%', display: { xs: 'none', md: 'block' } }}>
                                    <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                                        "Mantén tus datos actualizados para un seguimiento preciso de tu progreso."
                                    </Typography>
                                </Box>
                            </Box>
                        </Grid>

                        {/* Columna Derecha: Sistema de Pestañas y Formularios */}
                        <Grid item xs={12} md={8}>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                <Tabs
                                    value={tabValue}
                                    onChange={handleTabChange}
                                    aria-label="perfil tabs"
                                    variant="scrollable"
                                    scrollButtons="auto"
                                    textColor="primary"
                                    indicatorColor="primary"
                                >
                                    <Tab icon={<PersonIcon />} iconPosition="start" label="Mi Perfil" id="profile-tab-0" />
                                    <Tab icon={<MedicalServicesIcon />} iconPosition="start" label="Salud y Fitness" id="profile-tab-1" />
                                    <Tab icon={<LockIcon />} iconPosition="start" label="Seguridad" id="profile-tab-2" />
                                </Tabs>
                            </Box>

                            {/* --- Pestaña 1: Información Personal --- */}
                            <CustomTabPanel value={tabValue} index={0}>
                                <form onSubmit={handleSubmitProfile(onSubmitProfile)}>
                                    <Grid container spacing={3}>
                                        <Grid item xs={12}>
                                            <Input
                                                label="Nombre Completo"
                                                {...registerProfile('nombre')}
                                                error={!!profileErrors.nombre}
                                                helperText={profileErrors.nombre?.message}
                                                fullWidth
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Input
                                                label="Correo Electrónico"
                                                {...registerProfile('correo')}
                                                error={!!profileErrors.correo}
                                                helperText={profileErrors.correo?.message}
                                                fullWidth
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Input
                                                label="Edad (años)"
                                                type="number"
                                                {...registerProfile('edad')}
                                                error={!!profileErrors.edad}
                                                helperText={profileErrors.edad?.message}
                                                fullWidth
                                            />
                                        </Grid>
                                        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                                            <Button
                                                variant="primary"
                                                type="submit"
                                                disabled={profileSaveStatus === 'loading' || profileSaveStatus === 'success' || !isProfileDirty}
                                                sx={{ minWidth: 200, transition: '0.3s' }}
                                            >
                                                {profileSaveStatus === 'loading' && <CircularProgress size={24} color="inherit" />}
                                                {profileSaveStatus === 'success' && <><CheckCircleIcon sx={{ mr: 1 }} /> ¡Guardado!</>}
                                                {profileSaveStatus === 'idle' && 'Guardar General'}
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </form>
                            </CustomTabPanel>

                            {/* --- Pestaña 2: Información Física y Médica --- */}
                            <CustomTabPanel value={tabValue} index={1}>
                                <form onSubmit={handleSubmitProfile(onSubmitProfile)}>
                                    <Grid container spacing={3}>
                                        <Grid item xs={12} sm={6}>
                                            <Input
                                                label="Peso (kg)"
                                                type="number" step="0.1"
                                                {...registerProfile('peso')}
                                                error={!!profileErrors.peso}
                                                helperText={profileErrors.peso?.message}
                                                fullWidth
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Input
                                                label="Estatura (cm)"
                                                type="number"
                                                {...registerProfile('estatura')}
                                                error={!!profileErrors.estatura}
                                                helperText={profileErrors.estatura?.message}
                                                fullWidth
                                            />
                                        </Grid>

                                        <Grid item xs={12} sm={6}>
                                            <Controller
                                                name="nivel_fisico"
                                                control={controlProfile}
                                                render={({ field }) => (
                                                    <Input
                                                        {...field}
                                                        select
                                                        label="Nivel Físico"
                                                        error={!!profileErrors.nivel_fisico}
                                                        helperText={profileErrors.nivel_fisico?.message}
                                                        fullWidth
                                                        options={[
                                                            { value: 'sedentario', label: 'Sedentario' },
                                                            { value: 'ligero', label: 'Ligero (1-3 días/sem)' },
                                                            { value: 'moderado', label: 'Moderado (3-5 días/sem)' },
                                                            { value: 'intenso', label: 'Intenso (6-7 días/sem)' },
                                                        ]}
                                                    />
                                                )}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Input
                                                label="Tiempo Disponible (min/día)"
                                                type="number"
                                                {...registerProfile('tiempo_disponible')}
                                                error={!!profileErrors.tiempo_disponible}
                                                helperText={profileErrors.tiempo_disponible?.message}
                                                fullWidth
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Controller
                                                name="objetivo_principal"
                                                control={controlProfile}
                                                render={({ field }) => (
                                                    <Input
                                                        {...field}
                                                        select
                                                        label="Objetivo Principal"
                                                        error={!!profileErrors.objetivo_principal}
                                                        helperText={profileErrors.objetivo_principal?.message}
                                                        fullWidth
                                                        options={[
                                                            { value: 'Salud/Movilidad', label: 'Salud / Prevención' },
                                                            { value: 'Fuerza/Hipertrofia', label: 'Construcción Muscular / Fuerza' },
                                                            { value: 'Resistencia/Deporte', label: 'Capacidad Aeróbica / Deportiva' },
                                                            { value: 'Rehabilitación', label: 'Rehabilitación Funcional' }
                                                        ]}
                                                    />
                                                )}
                                            />
                                        </Grid>

                                        <Grid item xs={12}>
                                            <Divider sx={{ my: 1 }} />
                                            <Typography variant="subtitle2" color="primary" sx={{ mb: 2 }}>
                                                Perfil Médico (Selecciona todas las que apliquen)
                                            </Typography>

                                            {/* Condiciones Médicas (Autocomplete Chips) */}
                                            <Controller
                                                name="perfil_medico.condiciones_fisicas"
                                                control={controlProfile}
                                                render={({ field: { onChange, value } }) => (
                                                    <Autocomplete
                                                        multiple
                                                        options={opcionesCondiciones}
                                                        getOptionLabel={(option) => option.label || option}
                                                        isOptionEqualToValue={(option, val) => option.value === val}
                                                        value={opcionesCondiciones.filter(opt => (value || []).includes(opt.value))}
                                                        onChange={(event, newValue) => {
                                                            onChange(newValue.map(item => item.value));
                                                        }}
                                                        renderTags={(tagValue, getTagProps) =>
                                                            tagValue.map((option, index) => {
                                                                const { key, ...tagProps } = getTagProps({ index });
                                                                return (
                                                                    <Chip
                                                                        variant="filled"
                                                                        label={option.label}
                                                                        key={key}
                                                                        {...tagProps}
                                                                        color="primary"
                                                                        size="small"
                                                                    />
                                                                );
                                                            })
                                                        }
                                                        renderInput={(params) => (
                                                            <TextField
                                                                {...params}
                                                                variant="outlined"
                                                                label="Condiciones Médicas Preexistentes"
                                                                placeholder="Añadir..."
                                                                error={!!profileErrors.perfil_medico?.condiciones_fisicas}
                                                                helperText={profileErrors.perfil_medico?.condiciones_fisicas?.message}
                                                                sx={{ mb: 2 }}
                                                            />
                                                        )}
                                                    />
                                                )}
                                            />

                                            {/* Lesiones (Autocomplete Chips) */}
                                            <Controller
                                                name="perfil_medico.lesiones"
                                                control={controlProfile}
                                                render={({ field: { onChange, value } }) => (
                                                    <Autocomplete
                                                        multiple
                                                        options={opcionesLesiones}
                                                        getOptionLabel={(option) => option.label || option}
                                                        isOptionEqualToValue={(option, val) => option.value === val}
                                                        value={opcionesLesiones.filter(opt => (value || []).includes(opt.value))}
                                                        onChange={(event, newValue) => {
                                                            onChange(newValue.map(item => item.value));
                                                        }}
                                                        renderTags={(tagValue, getTagProps) =>
                                                            tagValue.map((option, index) => {
                                                                const { key, ...tagProps } = getTagProps({ index });
                                                                return (
                                                                    <Chip variant="filled" label={option.label} key={key} {...tagProps} color="secondary" size="small" />
                                                                );
                                                            })
                                                        }
                                                        renderInput={(params) => (
                                                            <TextField
                                                                {...params}
                                                                variant="outlined"
                                                                label="Lesiones Recientes o Crónicas"
                                                                placeholder="Añadir..."
                                                                error={!!profileErrors.perfil_medico?.lesiones}
                                                                helperText={profileErrors.perfil_medico?.lesiones?.message}
                                                                sx={{ mb: 2 }}
                                                            />
                                                        )}
                                                    />
                                                )}
                                            />

                                            {/* Limitaciones (Autocomplete Chips) */}
                                            <Controller
                                                name="perfil_medico.limitaciones"
                                                control={controlProfile}
                                                render={({ field: { onChange, value } }) => (
                                                    <Autocomplete
                                                        multiple
                                                        options={opcionesLimitaciones}
                                                        getOptionLabel={(option) => option.label || option}
                                                        isOptionEqualToValue={(option, val) => option.value === val}
                                                        value={opcionesLimitaciones.filter(opt => (value || []).includes(opt.value))}
                                                        onChange={(event, newValue) => {
                                                            onChange(newValue.map(item => item.value));
                                                        }}
                                                        renderTags={(tagValue, getTagProps) =>
                                                            tagValue.map((option, index) => {
                                                                const { key, ...tagProps } = getTagProps({ index });
                                                                return (
                                                                    <Chip variant="filled" label={option.label} key={key} {...tagProps} color="error" size="small" />
                                                                );
                                                            })
                                                        }
                                                        renderInput={(params) => (
                                                            <TextField
                                                                {...params}
                                                                variant="outlined"
                                                                label="Restricciones de Entrenamiento"
                                                                placeholder="Añadir..."
                                                                error={!!profileErrors.perfil_medico?.limitaciones}
                                                                helperText={profileErrors.perfil_medico?.limitaciones?.message}
                                                            />
                                                        )}
                                                    />
                                                )}
                                            />
                                        </Grid>

                                        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                                            <Button
                                                variant="primary"
                                                type="submit"
                                                disabled={profileSaveStatus === 'loading' || profileSaveStatus === 'success' || !isProfileDirty}
                                                sx={{ minWidth: 200, transition: '0.3s' }}
                                            >
                                                {profileSaveStatus === 'loading' && <CircularProgress size={24} color="inherit" />}
                                                {profileSaveStatus === 'success' && <><CheckCircleIcon sx={{ mr: 1 }} /> ¡Guardado!</>}
                                                {profileSaveStatus === 'idle' && 'Guardar Salud'}
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </form>
                            </CustomTabPanel>

                            {/* --- Pestaña 3: Seguridad --- */}
                            <CustomTabPanel value={tabValue} index={2}>
                                <form onSubmit={handleSubmitPassword(onSubmitPassword)}>
                                    <Grid container spacing={3}>
                                        <Grid item xs={12}>
                                            <Alert severity="info" sx={{ mb: 2 }}>
                                                Usa una contraseña fuerte con al menos 6 caracteres.
                                            </Alert>
                                            <Input
                                                label="Contraseña Actual"
                                                type="password"
                                                {...registerPassword('currentPassword')}
                                                error={!!passwordErrors.currentPassword}
                                                helperText={passwordErrors.currentPassword?.message}
                                                fullWidth
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Input
                                                label="Nueva Contraseña"
                                                type="password"
                                                {...registerPassword('newPassword')}
                                                error={!!passwordErrors.newPassword}
                                                helperText={passwordErrors.newPassword?.message}
                                                fullWidth
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Input
                                                label="Confirmar Nueva Contraseña"
                                                type="password"
                                                {...registerPassword('confirmNewPassword')}
                                                error={!!passwordErrors.confirmNewPassword}
                                                helperText={passwordErrors.confirmNewPassword?.message}
                                                fullWidth
                                            />
                                        </Grid>

                                        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                                            <Button
                                                variant="secondary"
                                                type="submit"
                                                disabled={passwordSaveStatus === 'loading' || passwordSaveStatus === 'success'}
                                                sx={{ minWidth: 200, transition: '0.3s' }}
                                            >
                                                {passwordSaveStatus === 'loading' && <CircularProgress size={24} color="inherit" />}
                                                {passwordSaveStatus === 'success' && <><CheckCircleIcon sx={{ mr: 1 }} /> ¡Actualizada!</>}
                                                {passwordSaveStatus === 'idle' && 'Cambiar Contraseña'}
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </form>
                            </CustomTabPanel>

                        </Grid>
                    </Grid>
                </Paper>
            </Container>
        </Box>
    );
}
