import { useMemo } from 'react';

/**
 * Custom hook for date formatting
 * Centralizes date formatting logic with memoization
 */
export const useDateFormat = () => {
    return useMemo(() => ({
        /**
         * Format date to DD-MM-YYYY
         */
        formatDate: (date) => {
            if (!date) return '';
            const d = new Date(date);
            if (isNaN(d.getTime())) return '';

            const day = String(d.getDate()).padStart(2, '0');
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const year = d.getFullYear();

            return `${day}-${month}-${year}`;
        },

        /**
         * Format date and time to DD-MM-YYYY HH:mm
         */
        formatDateTime: (date) => {
            if (!date) return '';
            const d = new Date(date);
            if (isNaN(d.getTime())) return '';

            const day = String(d.getDate()).padStart(2, '0');
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const year = d.getFullYear();
            const hours = String(d.getHours()).padStart(2, '0');
            const minutes = String(d.getMinutes()).padStart(2, '0');

            return `${day}-${month}-${year} ${hours}:${minutes}`;
        },

        /**
         * Format time to HH:mm:ss
         */
        formatTime: (date) => {
            if (!date) return '';
            const d = new Date(date);
            if (isNaN(d.getTime())) return '';

            return d.toLocaleTimeString('es-PE', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
            });
        },

        /**
         * Format relative time (e.g., "hace 2 horas")
         */
        formatRelative: (date) => {
            if (!date) return '';
            const d = new Date(date);
            const now = new Date();
            const diffMs = now - d;
            const diffMins = Math.floor(diffMs / 60000);
            const diffHours = Math.floor(diffMs / 3600000);
            const diffDays = Math.floor(diffMs / 86400000);

            if (diffMins < 1) return 'Justo ahora';
            if (diffMins < 60) return `Hace ${diffMins} min`;
            if (diffHours < 24) return `Hace ${diffHours}h`;
            if (diffDays < 7) return `Hace ${diffDays}d`;

            return formatDate(date);
        },
    }), []);
};
