import { createTheme } from '@mui/material/styles';

const lightPalette = {
  mode: 'light',
  primary: {
    main: '#6BAA75',
    contrastText: '#ffffff',
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
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '10px',
          padding: '8px 20px',
        },
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
