import TextField from '@mui/material/TextField';
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
  ...props
}) {
  const sizeMap = {
    small: 'small',
    medium: 'medium',
    large: 'large',
  };

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
      {...props}
      InputLabelProps={{
        ...props.InputLabelProps,
        sx: {
          ...(labelSize === 'small' && { fontSize: '1rem' }),
          ...(labelSize === 'medium' && { fontSize: '1.25rem' }),
          ...(labelSize === 'large' && { fontSize: '1.5rem' }),
        },
      }}
    />
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
};
