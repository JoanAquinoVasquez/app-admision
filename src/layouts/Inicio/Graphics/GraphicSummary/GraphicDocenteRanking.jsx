import { useState, useMemo } from "react";
import { Skeleton, Chip } from "@heroui/react";
import DashboardCard from "../../../../components/Cards/DashboardCard";
import { MdOutlineAnalytics, MdWarning } from "react-icons/md";
import useDocenteResumen from "../../../../data/Evaluacion/dataDocenteResumen";

export default function GraphicDocenteRanking() {
    const { docenteResumen, loading } = useDocenteResumen();
    const [activeTab, setActiveTab] = useState("cv");

    const docentesFiltrados = useMemo(() => {
        if (!docenteResumen || !Array.isArray(docenteResumen)) return [];

        // Convierte "BURGA CABEZAS, CARLOS" → "Burga Cabezas, Carlos"
        const toTitleCase = (str) =>
            str.toLowerCase().replace(/(^|\s|,\s*)(\w)/g, (_, sep, letter) => sep + letter.toUpperCase());

        return docenteResumen
            .filter(d => d.docente?.tipo === activeTab)
            .map(d => {
                const total = d.resumen_general?.total_postulantes ?? 0;
                const evaluados = d.resumen_general?.evaluados ?? 0;
                const pendientes = d.resumen_general?.pendientes ?? 0;
                const pct = total > 0 ? Math.round((evaluados / total) * 100) : 0;
                const rawName = d.docente?.nombre ?? "Sin nombre";
                // "BURGA CABEZAS, CARLOS" → "Burga Cabezas, Carlos"
                const fullName = toTitleCase(rawName);
                // Apellidos solamente (antes de la coma) para etiqueta compacta
                const shortName = fullName.split(",")[0]?.trim() ?? fullName;
                // Nombres solamente (después de la coma)
                const firstNames = fullName.split(",")[1]?.trim() ?? "";

                return { fullName, shortName, firstNames, total, evaluados, pendientes, pct };
            })
            // Ordenar ASC por % → los cuellos de botella arriba
            .sort((a, b) => a.pct - b.pct);
    }, [docenteResumen, activeTab]);

    const getBarColor = (pct) => {
        if (pct < 50) return { bar: "bg-red-500", text: "text-red-600", chip: "danger" };
        if (pct < 80) return { bar: "bg-amber-400", text: "text-amber-600", chip: "warning" };
        return { bar: activeTab === "cv" ? "bg-blue-500" : "bg-emerald-600", text: activeTab === "cv" ? "text-blue-600" : "text-emerald-700", chip: "success" };
    };

    const isCV = activeTab === "cv";

    return (
        <DashboardCard
            title="Avance Docente"
            icon={<MdOutlineAnalytics className={`${isCV ? "text-blue-500" : "text-emerald-600"} text-sm`} />}
            className="h-full shadow-none border border-slate-100 p-2"
            actions={
                <div className="flex gap-1 bg-slate-100 rounded-full p-0.5">
                    <button
                        onClick={() => setActiveTab("cv")}
                        className={`text-[10px] font-bold px-3 py-1 rounded-full transition-all duration-200 ${isCV ? "bg-blue-500 text-white shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                    >
                        CV
                    </button>
                    <button
                        onClick={() => setActiveTab("entrevista")}
                        className={`text-[10px] font-bold px-3 py-1 rounded-full transition-all duration-200 ${!isCV ? "bg-emerald-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                    >
                        Entr.
                    </button>
                </div>
            }
        >
            {loading ? (
                <div className="p-2 flex flex-col gap-3 h-full">
                    {[...Array(6)].map((_, i) => (
                        <Skeleton key={i} className="h-10 w-full rounded-lg" />
                    ))}
                </div>
            ) : docentesFiltrados.length === 0 ? (
                <div className="flex items-center justify-center h-full text-slate-400 text-[11px]">
                    Sin datos de docentes
                </div>
            ) : (
                <div className="flex flex-col gap-2 overflow-y-auto h-full pr-1 pb-1">
                    {docentesFiltrados.map((doc, i) => {
                        const colors = getBarColor(doc.pct);
                        return (
                            <div
                                key={i}
                                className="flex flex-col gap-1.5 bg-slate-50/60 rounded-xl px-3 py-2.5 hover:bg-slate-100/80 transition-colors"
                            >
                                {/* Nombre + % */}
                                <div className="flex items-start justify-between gap-1">
                                    <div className="flex items-start gap-1.5 min-w-0">
                                        {doc.pct < 50 && (
                                            <MdWarning className="text-red-500 text-[13px] shrink-0 mt-0.5" />
                                        )}
                                        <div className="flex flex-col min-w-0">
                                            <span
                                                className="text-[13px] font-bold text-slate-700 leading-tight truncate"
                                                title={doc.fullName}
                                            >
                                                {doc.shortName}
                                            </span>
                                            {doc.firstNames && (
                                                <span className="text-[11px] text-slate-400 leading-tight truncate">
                                                    {doc.firstNames}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0 ml-1 mt-0.5">
                                        <span className="text-[11px] text-slate-400">
                                            {doc.evaluados}/{doc.total}
                                        </span>
                                        <span className={`text-[13px] font-black ${colors.text}`}>
                                            {doc.pct}%
                                        </span>
                                    </div>
                                </div>
                                {/* Barra de progreso */}
                                <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all duration-500 ${colors.bar}`}
                                        style={{ width: `${doc.pct}%` }}
                                    />
                                </div>
                                {/* Pendientes si hay */}
                                {doc.pendientes > 0 && (
                                    <span className="text-[10px] text-slate-400">
                                        {doc.pendientes} pendiente{doc.pendientes > 1 ? "s" : ""}
                                    </span>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </DashboardCard>
    );
}
