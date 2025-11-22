import { useState } from 'react';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import PropTypes from 'prop-types';

export default function Input({
  labelSize = 'medium',
  label,
  value,
  onChange,
  variant = 'outlined',
  size = 'medium',
  fullWidth = false,
  disabled = false,
  placeholder = '',
  error = false,
  helperText = '',
  type = 'text',
  showPasswordToggle = false,
  select = false,
  options = [],
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false);

  const sizeMap = {
    small: 'small',
    medium: 'medium',
    large: 'large',
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const inputType = type === 'password' && showPasswordToggle
    ? (showPassword ? 'text' : 'password')
    : type;

  return (
    <TextField
      label={label}
      value={value}
      onChange={onChange}
      variant={variant}
      size={sizeMap[labelSize]}
      fullWidth={fullWidth}
      disabled={disabled}
      placeholder={placeholder}
      error={error}
      helperText={helperText}
      type={inputType}
      select={select}
      {...props}
      slotProps={{
        inputLabel: {
          sx: {
            ...(labelSize === 'small' && { fontSize: '1rem' }),
            ...(labelSize === 'medium' && { fontSize: '1.25rem' }),
            ...(labelSize === 'large' && { fontSize: '1.5rem' }),
          },
        },
        input: {
          ...props.slotProps?.input,
          ...(showPasswordToggle && type === 'password' && {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleTogglePassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }),
        },
      }}
    >
      {select && options.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </TextField>
  );
}

Input.propTypes = {
  label: PropTypes.string,
  value: PropTypes.any,
  onChange: PropTypes.func,
  variant: PropTypes.oneOf(['outlined', 'filled', 'standard']),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  fullWidth: PropTypes.bool,
  disabled: PropTypes.bool,
  placeholder: PropTypes.string,
  error: PropTypes.bool,
  helperText: PropTypes.string,
  type: PropTypes.string,
  showPasswordToggle: PropTypes.bool,
  select: PropTypes.bool,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ),
};
