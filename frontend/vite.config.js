import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',  // Escucha en todas las interfaces (necesario para Docker)
    port: 5173,
    strictPort: true,
    watch: {
      usePolling: true  // Para hot-reload en Docker
    }
  }
});
