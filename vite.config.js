import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        react(),
    ],
    base: '/admision-epg/', // Ruta base para producción
    server: {
        port: 5173,
        open: true,
    },
    build: {
        outDir: 'dist',
        assetsDir: 'assets',
        chunkSizeWarningLimit: 1000,
    },
});
