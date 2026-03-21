// Se eliminó CssBaseline duplicado.
// ThemeModeProvider ya renderiza <CssBaseline /> internamente.
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AccessibilityProvider } from './context/AccessibilityContext';
import { ThemeModeProvider } from './context/ThemeContext';
import AppRoutes from './routes';

function App() {
  return (
    <ThemeModeProvider>
      <AuthProvider>
        <AccessibilityProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </AccessibilityProvider>
      </AuthProvider>
    </ThemeModeProvider>
  );
}

export default App;
