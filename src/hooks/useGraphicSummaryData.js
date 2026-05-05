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
            if (isNaN(dateObj.getTime())) return acc;

            const dateKey = `${dateObj.getFullYear()}-${String(
                dateObj.getMonth() + 1
            ).padStart(2, "0")}-${String(dateObj.getDate()).padStart(
                2,
                "0"
            )}`;

            if (!acc[dateKey]) acc[dateKey] = { date: dateKey, conteo_total: 0 };

            const grado = pre.programa?.grado?.nombre ?? "Sin Grado";
            acc[dateKey][grado] = (acc[dateKey][grado] || 0) + 1;
            acc[dateKey].conteo_total += 1;

            return acc;
        }, {});

        const dates = Object.keys(grouped).sort(
            (a, b) => new Date(a) - new Date(b)
        );

        const gradoNames = grados.map(g => g.nombre || g);
        const allGrados = [...gradoNames, "conteo_total"];
        const filled = dates.map((date) => {
            const data = { ...grouped[date] }; // Evitar mutar el objeto original
            allGrados.forEach((g) => (data[g] ??= 0));
            return data;
        });

        if (showAccumulated) {
            let runningTotal = 0;
            const runningGrados = Object.fromEntries(gradoNames.map(g => [g, 0]));

            return filled.map((d) => {
                runningTotal += d.conteo_total;
                gradoNames.forEach(g => runningGrados[g] += (d[g] || 0));

                return {
                    ...d,
                    conteo_total: runningTotal,
                    ...Object.fromEntries(
                        gradoNames.map((g) => [g, runningGrados[g]])
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
