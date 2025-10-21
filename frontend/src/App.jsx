import { ThemeProvider, CssBaseline } from '@mui/material';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AccessibilityProvider } from './context/AccessibilityContext';

import theme from './styles/theme';
import AppRoutes from './routes';

function App() {
  return (
    // Proveedor de tema para MUI
    <ThemeProvider theme={theme}>
      // Restablece los estilos base de MUI
      <CssBaseline />
      // Proveedor de autenticación y accesibilidad
      <AuthProvider>
        // Proveedor de accesibilidad
        <AccessibilityProvider>
          // Enrutador de la aplicación
          <BrowserRouter>
            // Rutas de la aplicación
            <AppRoutes />
          </BrowserRouter>
        </AccessibilityProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
