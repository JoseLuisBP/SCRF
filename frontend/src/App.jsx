import { ThemeProvider, CssBaseline } from '@mui/material';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AccessibilityProvider } from './context/AccessibilityContext';

import theme from './styles/theme';
import AppRoutes from './routes';

import {
  createAppTheme,
  getInitialMode,
  saveMode,
} from './styles/theme';

import AppRoutes from './routes';



function App() {

const [mode, setMode] = useState(getInitialMode());
 const theme = useMemo(() => createAppTheme(mode), [mode]);
 const toggleColorMode = () => {
    const newMode = mode === 'light' ? 'dark' : 'light';
    setMode(newMode);
    saveMode(newMode);
  };

  return (
    /* Proveedor de tema para MUI */
    <ThemeProvider theme={theme}>
      {/* Restablece los estilos base de MUI */}
      <CssBaseline />
      {/* Proveedor de autenticación */}
      <AuthProvider>
        {/* Proveedor de accesibilidad */}
        <AccessibilityProvider>
          {/* Enrutador de la aplicación */}
          <BrowserRouter>
            {/* Rutas de la aplicación */}
            <AppRoutes
              mode={mode}
              toggleColorMode={toggleColorMode}
            />
            //<AppRoutes />
          </BrowserRouter>
        </AccessibilityProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
