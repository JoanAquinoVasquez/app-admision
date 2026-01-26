// components/Skeleton/PreinscripcionesTable.jsx
import { Skeleton } from "@nextui-org/react";

export default function PreinscripcionesTable({ rows = 10 }) {
    const columns = 8; // o usa columnas dinámicas si prefieres

    return (
        <div className="w-full overflow-x-auto">
            <table className="min-w-full border-collapse">
                <thead>
                    <tr className="bg-gray-100 dark:bg-neutral-800">
                        {[...Array(columns)].map((_, i) => (
                            <th key={i} className="px-4 py-2">
                                <Skeleton className="h-4 w-24 rounded" />
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {[...Array(rows)].map((_, rowIndex) => (
                        <tr key={rowIndex} className="border-b border-gray-200">
                            {[...Array(columns)].map((_, colIndex) => (
                                <td key={colIndex} className="px-4 py-3">
                                    <Skeleton className="h-4 w-full rounded" />
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
