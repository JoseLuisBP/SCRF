// Importamos el botón de Material UI — direct import para menor costo de compilación
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import React from 'react';

/**
 * CustomButton — Botón reutilizable con soporte para estado de carga (isLoading).
 * Cuando isLoading=true, muestra un spinner y deshabilita el botón para
 * evitar clics múltiples que saturen el CPU.
 */
const CustomButton = ({
  variant = 'primary',        // Tipo de botón: primary, secondary o disabled.
  size = 'medium',            // Tamaño del botón.
  startIcon,                  // Ícono al inicio.
  endIcon,                    // Ícono al final.
  fullWidth = false,          // Si ocupa todo el ancho.
  component,                  // Permite cambiar el tipo de etiqueta.
  children,                   // El texto o contenido que va dentro del botón.
  sx,                         // Estilos adicionales.
  isLoading = false,          // Estado de carga: deshabilita el botón y muestra spinner.
  ...props                    // Todas las demás props.
}) => {

  // Determinar el estilo visual del botón según el tipo (variant).
  const getVariant = () => {
    switch (variant) {
      case 'primary':
        return 'contained';
      case 'secondary':
        return 'outlined';
      case 'disabled':
        return 'contained';
      default:
        return 'contained';
    }
  };

  // Determina el color del botón según el tipo.
  const getColor = () => {
    switch (variant) {
      case 'primary':
        return 'primary';
      case 'secondary':
        return 'secondary';
      default:
        return 'primary';
    }
  };

  // El botón está deshabilitado si variant='disabled' O si isLoading=true
  const isDisabled = variant === 'disabled' || isLoading || props.disabled;

  return (
    <Button
      variant={getVariant()}
      color={getColor()}
      size={size}
      startIcon={!isLoading ? startIcon : undefined}
      endIcon={!isLoading ? endIcon : undefined}
      fullWidth={fullWidth}
      component={component}
      disabled={isDisabled}

      sx={{
        borderRadius: '8px',
        textTransform: 'none',
        fontWeight: 500,
        ...sx
      }}
      {...props}
    >
      {isLoading ? (
        <>
          <CircularProgress
            size={16}
            color="inherit"
            sx={{ mr: 1 }}
          />
          {children}
        </>
      ) : (
        children
      )}
    </Button>
  );
};

export default CustomButton;
