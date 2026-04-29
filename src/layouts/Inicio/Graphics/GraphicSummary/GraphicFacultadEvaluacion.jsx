import { useMemo } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import DashboardCard from "../../../../components/Cards/DashboardCard";
import { MdOutlineAnalytics } from "react-icons/md";
import { Skeleton } from "@heroui/react";

export default function GraphicFacultadEvaluacion({ data, loading }) {
    const facultyData = useMemo(() => {
        if (!data || data.length === 0) return [];

        const faculties = {};
        data.forEach(item => {
            const fac = item.facultad || "Otras";
            // Usar siglas o nombres un poco más largos pero controlados
            const label = fac.length > 12 ? fac.substring(0, 10) + ".." : fac;
            if (!faculties[label]) {
                faculties[label] = { name: label, fullName: fac, totalAptos: 0, totalCV: 0, totalEnt: 0 };
            }
            faculties[label].totalAptos += Number(item.aptos || 0);
            faculties[label].totalCV += Number(item.evaluados_cv || 0);
            faculties[label].totalEnt += Number(item.evaluados_entrevista || 0);
        });

        return Object.values(faculties).map(f => ({
            name: f.name,
            fullName: f.fullName,
            cv: f.totalAptos > 0 ? Math.round((f.totalCV / f.totalAptos) * 100) : 0,
            ent: f.totalAptos > 0 ? Math.round((f.totalEnt / f.totalAptos) * 100) : 0,
        })).sort((a, b) => b.cv - a.cv);
    }, [data]);

    return (
        <DashboardCard 
            title="Avance Área (%)" 
            icon={<MdOutlineAnalytics className="text-blue-500 text-sm" />}
            className="h-full shadow-none border border-slate-100 p-2" // Añadido padding general
        >
            {loading ? (
                <div className="p-2 h-full"><Skeleton className="h-full w-full rounded-lg" /></div>
            ) : (
                <div className="w-full h-full min-h-0 flex-1 pr-2">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={facultyData}
                            layout="vertical"
                            margin={{ top: 10, right: 30, left: 10, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                            <XAxis type="number" domain={[0, 100]} hide />
                            <YAxis 
                                dataKey="name" 
                                type="category" 
                                width={75} // Aumentado el ancho del eje Y para evitar cortes
                                tick={{ fontSize: 9, fontWeight: 700, fill: '#475569' }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <Tooltip 
                                contentStyle={{ fontSize: '10px', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                cursor={{ fill: '#f8fafc' }}
                                formatter={(val, name) => [val + '%', name === 'cv' ? 'CV' : 'Entr.']}
                            />
                            <Bar dataKey="cv" name="CV" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={10} />
                            <Bar dataKey="ent" name="Entr." fill="#a855f7" radius={[0, 4, 4, 0]} barSize={10} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}
        </DashboardCard>
    );
}
