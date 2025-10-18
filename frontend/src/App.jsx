import { ThemeProvider, CssBaseline } from '@mui/material';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import theme from './styles/theme';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
