//Importamos el boton de Material UI, que es el componentes base.
import Button from '@mui/material/Button';
import React from 'react';

//Desestructuramos los props y asignamos valores por defecto a algunas de ellas.
const CustomButton = ({
  variant = 'primary',        //Tipo de boton: primary, secondary o disabled.
  size = 'medium',            //Tamaño del boton.
  startIcon,                  //Icono al inicio.
  endIcon,                    //Icono al final.
  fullWidth = false,          //Si ocupa todo el ancho.
  component,                  //Permite cambiar el tipo de etiqueta
  children,                   //El texto o contenido que va dentro del boton.
  sx,                         //Estilos adicionales.
  ...props                    //Todas las demas props.
}) => {

  //Determinar el estilo visual del boton segun el tipo (variant).
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

  //Determina el color del boton segun el tipo.
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

  // Retornamos el Button de MUI configurado con nuestras reglas personalizadas.
  return (
    <Button
      variant={getVariant()}                  // Le pasamos la variante procesada.
      color={getColor()}                      // Le pasamos el color correspondiente.
      size={size}                             // Tamaño del botón.
      startIcon={startIcon}                   // Icono al inicio (si lo hay).
      endIcon={endIcon}                       // Icono final (si lo hay).
      fullWidth={fullWidth}                   // Expande el ancho completo si es true.
      component={component}                   // Permite que el botón se renderice como otro componente.
      disabled={variant === 'disabled'}       // Se desactiva si variant es "disabled" 
      
      // Estilos personalizados del botón usando sx.
      sx={{
        borderRadius: '8px',
        textTransform: 'none',
        fontWeight: 500,
        ...sx
      }}
      {...props}    // Cualquier prop adicional se pasa al componente Button.
    >
      {children}      {/* Contenido interno del botón */}
    </Button>
  );
};

// Exportamos el componente para usarlo en todo el proyecto.
export default CustomButton;
