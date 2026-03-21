import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  build: {
    rollupOptions: {
      output: {
        // manualChunks separa vendor libs para cache HTTP de larga duración.
        // El browser re-descarga un chunk solo si ese vendor cambia de versión,
        // no cuando cambia el código de la app.
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'mui-vendor': ['@mui/material', '@mui/icons-material', '@emotion/react', '@emotion/styled'],
          'chart-vendor': ['chart.js', 'react-chartjs-2'],
          'pdf-vendor': ['jspdf'],
        },
      },
    },
    // Mejora el tiempo de build y reduce el bundle en producción
    sourcemap: false,
    // Avisa si algún chunk supera 600KB
    chunkSizeWarningLimit: 600,
  },

  server: {
    host: '0.0.0.0',  // Escucha en todas las interfaces (necesario para Docker)
    port: 5173,
    strictPort: true,
    watch: {
      usePolling: true  // Para hot-reload en Docker
    },
    proxy: {
      '/api': {
        target: 'http://backend:8000',
        changeOrigin: true,
      }
    }
  }
});
