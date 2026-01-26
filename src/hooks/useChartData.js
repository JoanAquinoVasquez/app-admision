import { useMemo } from 'react';

/**
 * Custom hook to optimize chart data
 * Reduces re-renders and expensive calculations
 */
export const useChartData = (rawData, groupByKey = 'created_at') => {
    const processedData = useMemo(() => {
        if (!rawData || rawData.length === 0) return [];

        // Group data by date
        const grouped = rawData.reduce((acc, item) => {
            // Extract date part from ISO string
            const dateStr = item[groupByKey]?.split('T')[0] || item[groupByKey]?.substring(0, 10);

            if (!dateStr) return acc;

            if (!acc[dateStr]) {
                acc[dateStr] = 0;
            }
            acc[dateStr]++;

            return acc;
        }, {});

        // Convert to array and sort by date
        return Object.entries(grouped)
            .map(([date, count]) => ({ date, count }))
            .sort((a, b) => new Date(a.date) - new Date(b.date));
    }, [rawData, groupByKey]);

    const chartLabels = useMemo(
        () => processedData.map(item => item.date),
        [processedData]
    );

    const chartValues = useMemo(
        () => processedData.map(item => item.count),
        [processedData]
    );

    return {
        processedData,
        chartLabels,
        chartValues,
    };
};
