import { createTheme } from '@mui/material/styles';

const lightPalette = {
  mode: 'light',
  primary: {
    main: '#6BAA75',
    contrastText: '#283f4dff',
  },
  secondary: {
    main: '#A0CED9',
    contrastText: '#1F1F1F',
  },
  background: {
    default: '#F7F9F8',
    paper: '#FFFFFF',
  },
  text: {
    primary: '#1F1F1F',
    secondary: '#555555',
  },
};

const darkPalette = {
  mode: 'dark',
  primary: {
    main: '#88C68A',
    contrastText: '#1E1E1E',
  },
  secondary: {
    main: '#B8E0E6',
    contrastText: '#1E1E1E',
  },
  background: {
    default: '#1E1E1E',
    paper: '#2C2C2C',
  },
  text: {
    primary: '#F1F1F1',
    secondary: '#B0B0B0',
  },
};

const baseTypography = {
  fontFamily: ['Roboto', 'Helvetica', 'Arial', 'sans-serif'].join(','),
  h1: { fontWeight: 600, fontSize: '2.2rem' },
  h2: { fontWeight: 600, fontSize: '1.8rem' },
  h3: { fontWeight: 500, fontSize: '1.5rem' },
  body1: { fontSize: '1rem', lineHeight: 1.6 },
  button: { textTransform: 'none', fontWeight: 500 },
};

export const getDesignTokens = mode => ({
  palette: mode === 'light' ? lightPalette : darkPalette,
  typography: baseTypography,
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        '*': {
          boxSizing: 'border-box',
          margin: 0,
          padding: 0
        },
        html: {
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
          height: '100%',
          width: '100%'
        },
        body: {
          height: '100%',
          width: '100%',
          // Personalización del scrollbar
          '&::-webkit-scrollbar': {
            width: '8px',
            height: '8px'
          },
          '&::-webkit-scrollbar-track': {
            background: mode === 'light' ? '#f1f1f1' : '#2c2c2c'
          },
          '&::-webkit-scrollbar-thumb': {
            background: mode === 'light' ? '#888' : '#555',
            borderRadius: '4px',
            '&:hover': {
              background: mode === 'light' ? '#555' : '#888'
            }
          }
        },
        // Clase de utilidad para elementos que solo deben ser visibles para lectores de pantalla
        '.sr-only': {
          position: 'absolute',
          width: '1px',
          height: '1px',
          padding: '0',
          margin: '-1px',
          overflow: 'hidden',
          clip: 'rect(0,0,0,0)',
          border: '0'
        }
      }
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: ({ ownerState }) => ({
          ...(ownerState.size === 'small' && {
            fontSize: '1rem',
          }),
          ...(ownerState.size === 'medium' && {
            fontSize: '1.25rem',
          }),
          ...(ownerState.size === 'large' && {
            fontSize: '1.5rem',
          }),
        }),
        input: {
          padding: 'auto',
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: ({ ownerState }) => ({
          ...(ownerState.size === 'small' && {
            fontSize: '1rem',
          }),
          ...(ownerState.size === 'medium' && {
            fontSize: '1.25rem',
          }),
          ...(ownerState.size === 'large' && {
            fontSize: '1.5rem',
          }),
          '&.MuiInputLabel-shrink': {
            ...(ownerState.size === 'small' && {
              fontSize: '0.75rem',
              transform: 'translate(14px, -8px) scale(1)',
            }),
            ...(ownerState.size === 'medium' && {
              fontSize: '0.95rem',
              transform: 'translate(14px, -12px) scale(1)',
            }),
            ...(ownerState.size === 'large' && {
              fontSize: '1.15rem',
              transform: 'translate(14px, -14px) scale(1)',
            }),
          },
        }),
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '20px',
          textTransform: 'none',
          transition: 'all .2s ease-in-out',
          minHeight: 'auto',
        },
        sizeSmall: {
          fontSize: '1rem',
          padding: '3px 9px',
        },
        sizeMedium: {
          fontSize: '1.25rem',
          padding: '4px 12px',
        },
        sizeLarge: {
          fontSize: '1.5rem',
          padding: '5px 15px',
        },
      },
      defaultProps: {
        disableElevation: false,
        variant: 'contained',
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
        },
      },
    },
  },
});

const theme = createTheme(getDesignTokens('light'));
export default theme;
