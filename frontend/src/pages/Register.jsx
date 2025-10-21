import { Box, Container, Typography } from '@mui/material';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Header from '../components/layout/Header';
import { useState } from 'react';

export default function Register() {
    const [age, setAge] = useState('');

    const handleAgeChange = (e) => {
        let value = e.target.value.replace(/\D/g, ''); // solo dígitos
        const numberValue = Number(value);
        if (numberValue > 120) value = '120';
        setAge(value);
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                minWidth: '100vw',
                background: theme => `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.secondary.main} 100%)`,
                color: 'text.primary',
            }}
        >
            <Header showSearchBar={false} />

            <Container maxWidth="sm" sx={{ mt: 12, mb: 4 }}>
                <Box
                    sx={{
                        textAlign: 'center',
                        py: 6,
                        px: 2,
                        backgroundColor: 'background.paper',
                        borderRadius: 2,
                        boxShadow: theme => `0 8px 32px ${theme.palette.primary.main}20`,
                        transition: 'transform 0.2s ease',
                        '&:hover': { transform: 'translateY(-3px)' },
                    }}
                >
                    <Typography variant="h2" component="h1" gutterBottom
                        sx={{ fontSize: { xs: '2.5rem', md: '3.75rem' }, fontWeight: 'bold' }}
                    >
                        Crear Cuenta
                    </Typography>

                    <Input
                        label="Nombre completo"
                        labelSize="small"
                        placeholder="Introduce tu nombre"
                        fullWidth
                        sx={{ maxWidth: 400, mx: 'auto', mb: 2 }}
                    />

                    <Input
                        label="Edad"
                        labelSize="small"
                        placeholder="Introduce tu edad"
                        type="number"
                        value={age}
                        onChange={handleAgeChange}
                        fullWidth
                        sx={{ maxWidth: 400, mx: 'auto', mb: 4 }}
                        inputProps={{ min: 18, max: 120 }}
                    />

                    <Input
                        label="Correo electrónico"
                        labelSize="small"
                        placeholder="Introduce tu correo"
                        fullWidth
                        sx={{ maxWidth: 400, mx: 'auto', mb: 2 }}
                    />

                    <Input
                        label="Contraseña"
                        labelSize="small"
                        placeholder="Introduce tu contraseña"
                        type="password"
                        fullWidth
                        sx={{ maxWidth: 400, mx: 'auto', mb: 2 }}
                    />

                    <Input
                        label="Confirmar contraseña"
                        labelSize="small"
                        placeholder="Confirma tu contraseña"
                        type="password"
                        fullWidth
                        sx={{ maxWidth: 400, mx: 'auto', mb: 2 }}
                    />

                    <Button
                        variant="primary"
                        size="small"
                        fullWidth
                        sx={{ maxWidth: 400, mx: 'auto' }}
                    >
                        Registrarse
                    </Button>
                </Box>
            </Container>
        </Box>
    );
}
