import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

// Se eliminaron los 4 imports bloqueantes de @fontsource/roboto.
// La fuente ahora se carga de forma no bloqueante desde index.html
// usando Google Fonts con font-display:swap y el media="print" + onload.

// StrictMode solo en desarrollo para evitar el overhead de
// react-stack-top-frame que consumía ~8s en el LCP de dev.
const app = <App />;

createRoot(document.getElementById('root')).render(
  import.meta.env.DEV ? <StrictMode>{app}</StrictMode> : app
);
