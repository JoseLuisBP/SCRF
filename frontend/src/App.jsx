import { ThemeProvider, CssBaseline } from '@mui/material';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AccessibilityProvider } from './context/AccessibilityContext';


import theme from './styles/theme';
import AppRoutes from './routes';
import Footer from './components/layout/Footer';

function App() {
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

          <div 
          style={{
            display:"flex",
            flexDirection: "column",
            minHeight: '100vh',
            minWidth: '100vw',
          }}
          >
            {/*Contenido Principal */}
            <main style={{ flex: 1, padding: "2rem", textAlign: "center"}}>
              <h1>Pagina de rehabilitacion</h1>
           
            {/* Rutas de la aplicación */}
            <AppRoutes />
             </main>
             <Footer />
          </div>
          </BrowserRouter>
        </AccessibilityProvider>
      </AuthProvider>
    </ThemeProvider>


    

 

  );
}

export default App;
