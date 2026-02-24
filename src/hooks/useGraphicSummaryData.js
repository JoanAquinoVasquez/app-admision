import { useMemo } from 'react';

export function capitalize(s) {
    if (typeof s !== "string") return s;
    return s.charAt(0).toUpperCase() + s.slice(1);
}

export const useGraphicSummaryData = (preInscripciones, grados, showAccumulated, selectedGrados) => {

    // --- Data Processing Logic ---
    const groupedData = useMemo(() => {
        if (!preInscripciones || preInscripciones.length === 0) return [];

        const grouped = preInscripciones.reduce((acc, pre) => {
            const dateObj = new Date(pre.created_at);
            if (isNaN(dateObj)) return acc;

            dateObj.setHours(dateObj.getHours() - 5);
            const date = `${dateObj.getDate()}/${dateObj.getMonth() + 1}`;
            const grado = pre.programa?.grado?.nombre ?? "Sin Grado";

            acc[date] ??= { date, conteo_total: 0 };
            acc[date][grado] = (acc[date][grado] || 0) + 1;
            acc[date].conteo_total += 1;

            return acc;
        }, {});

        const dates = Object.keys(grouped).sort((a, b) => {
            const [dA, mA] = a.split("/").map(Number);
            const [dB, mB] = b.split("/").map(Number);
            return new Date(2025, mA - 1, dA) - new Date(2025, mB - 1, dB);
        });

        const gradoNames = grados.map(g => g.nombre || g);
        const allGrados = [...gradoNames, "conteo_total"];
        const filled = dates.map((date) => {
            const data = { ...grouped[date] }; // Evitar mutar el objeto original
            allGrados.forEach((g) => (data[g] ??= 0));
            return data;
        });

        if (showAccumulated) {
            return filled.map((d, i) => {
                if (i === 0) return d;
                const prev = filled[i - 1];
                return {
                    ...d,
                    conteo_total: d.conteo_total + prev.conteo_total,
                    ...Object.fromEntries(
                        gradoNames.map((g) => [g, d[g] + (prev[g] || 0)])
                    ),
                };
            });
        }

        return filled;
    }, [preInscripciones, grados, showAccumulated]);

    // --- Filtering Logic ---
    const filteredData = useMemo(() => {
        if (selectedGrados.size === 0) return groupedData;

        return groupedData.map((data) => {
            const filtered = {
                date: data.date,
                conteo_total: data.conteo_total,
            };
            selectedGrados.forEach((grado) => {
                if (grado in data) filtered[grado] = data[grado];
            });
            return filtered;
        });
    }, [groupedData, selectedGrados]);

    return { filteredData, capitalize };
};
