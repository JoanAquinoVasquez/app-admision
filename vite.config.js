import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        react(),
    ],
    base: '/admision-epg/', // Ruta base para producción
    server: {
        port: 5173,
        strictPort: true,
        watch: {
            usePolling: true, // Crucial para WSL2/Linux filesystem performance
            ignored: ['**/node_modules/**', '**/.git/**'],
        },
        hmr: {
            overlay: true,
        },
    },
    build: {
        outDir: 'dist',
        assetsDir: 'assets',
        chunkSizeWarningLimit: 1000,
    },
});
