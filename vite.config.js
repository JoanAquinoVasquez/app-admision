import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        react(),
    ],
    base: '/admision-epg/', // Ruta base para producción
    server: {
        port: 5173,
        host: "0.0.0.0",
        open: false,
        watch: {
            usePolling: true,
            interval: 100,
            ignored: ['**/node_modules/**', '**/.git/**'],
        },
    },
    build: {
        outDir: 'dist',
        assetsDir: 'assets',
        chunkSizeWarningLimit: 1000,
    },
});
