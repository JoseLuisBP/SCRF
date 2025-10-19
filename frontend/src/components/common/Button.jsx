import Button from '@mui/material/Button';
import React from 'react';

const CustomButton = ({
  variant = 'primary',
  size = 'medium',
  startIcon,
  endIcon,
  fullWidth = false,
  component,
  children,
  sx,
  ...props
}) => {
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

  return (
    <Button
      variant={getVariant()}
      color={getColor()}
      size={size}
      startIcon={startIcon}
      endIcon={endIcon}
      fullWidth={fullWidth}
      component={component}
      disabled={variant === 'disabled'}
      sx={{
        borderRadius: '8px',
        textTransform: 'none',
        fontWeight: 500,
        ...sx
      }}
      {...props}
    >
      {children}
    </Button>
  );
};

export default CustomButton;
