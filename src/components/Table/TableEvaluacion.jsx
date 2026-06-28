import { useState, useMemo, useCallback, useEffect } from "react";
import {
    Table, TableHeader, TableColumn, TableBody, TableRow, TableCell,
    Input, Button, DropdownTrigger, Dropdown, DropdownMenu, DropdownItem,
    Skeleton, Progress
} from "@heroui/react";
import DashboardCard from "../../components/Cards/DashboardCard";
import { SearchIcon, ChevronDownIcon } from "../../components/Table/components/Icons";
import TablePagination from "./components/TablePagination";
import { admissionConfig } from "../../config/admission";
import { MdOutlineAssignmentInd, MdFactCheck } from "react-icons/md";

const columns = [
    { name: "Grado y Programa", uid: "grado_programa", sortable: true },
    { name: "Facultad", uid: "facultad", sortable: true },
    { name: "CV", uid: "evaluados_cv", sortable: true },
    { name: "Entrevistas", uid: "evaluados_entrevista", sortable: true },
];

const INITIAL_VISIBLE_COLUMNS = ["grado_programa", "facultad", "evaluados_cv", "evaluados_entrevista"];

// Colores por índice para badges de facultad
const FACULTY_COLORS = [
    "bg-blue-100 text-blue-700",
    "bg-purple-100 text-purple-700",
    "bg-green-100 text-green-700",
    "bg-amber-100 text-amber-700",
    "bg-rose-100 text-rose-700",
    "bg-cyan-100 text-cyan-700",
    "bg-indigo-100 text-indigo-700",
    "bg-teal-100 text-teal-700",
    "bg-orange-100 text-orange-700",
    "bg-pink-100 text-pink-700",
];
const facultyColorMap = {};
let facultyColorIndex = 0;
const getFacultyColor = (facultad) => {
    if (!facultyColorMap[facultad]) {
        facultyColorMap[facultad] = FACULTY_COLORS[facultyColorIndex % FACULTY_COLORS.length];
        facultyColorIndex++;
    }
    return facultyColorMap[facultad];
};

export default function TableEvaluacionComponent({ resumenEvaluacion, loading }) {
    const [filterValue, setFilterValue] = useState("");
    const [visibleColumns, setVisibleColumns] = useState(new Set(INITIAL_VISIBLE_COLUMNS));
    // Rows por página responsivo: 8 en monitor (xl ≥ 1280px), 5 en laptop
    const [rowsPerPage, setRowsPerPage] = useState(() =>
        typeof window !== "undefined" && window.innerWidth >= 1280 ? 7 : 5
    );

    useEffect(() => {
        const mq = window.matchMedia("(min-width: 1280px)");
        const handler = (e) => setRowsPerPage(e.matches ? 8 : 5);
        mq.addEventListener("change", handler);
        return () => mq.removeEventListener("change", handler);
    }, []);

    const [sortDescriptor, setSortDescriptor] = useState({
        column: "avance_pct",
        direction: "descending",
    });
    const [page, setPage] = useState(1);

    const users = useMemo(() => {
        if (!resumenEvaluacion || !Array.isArray(resumenEvaluacion)) return [];

        const formatShortName = (apellidos, nombres) => {
            if (!apellidos) return 'No asignado';
            const cleanAp = apellidos.trim();
            if (cleanAp === '' || cleanAp.toLowerCase() === 'no asignado') {
                return 'No asignado';
            }

            const firstAp = cleanAp.split(/[\s,]+/)[0];

            if (!nombres || nombres.trim() === '' || nombres.toLowerCase() === 'no asignado') {
                return firstAp.charAt(0).toUpperCase() + firstAp.slice(1).toLowerCase();
            }

            const firstNom = nombres.trim().split(/[\s,]+/)[0];

            const toTitleCase = (str) => {
                if (!str) return '';
                return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
            };

            return `${toTitleCase(firstNom)} ${toTitleCase(firstAp)}`;
        };

        return resumenEvaluacion.map((item, index) => {
            const aptos = Number(item.aptos || 0);
            const cobertura_cv = Number(item.cobertura_cv || 0);
            const cobertura_entrevista = Number(item.cobertura_entrevista || 0);
            const avance_pct = (cobertura_cv + cobertura_entrevista) / 2;

            return {
                id: `${item.id || 'item'}-${index}`,
                grado_programa: String(item.grado_programa || ""),
                facultad: String(item.facultad || "Sin Área"),
                inscritos: Number(item.inscritos || 0),
                aptos: aptos,
                evaluados_cv: Number(item.evaluados_cv || 0),
                evaluados_entrevista: Number(item.evaluados_entrevista || 0),
                cobertura_cv: cobertura_cv,
                cobertura_entrevista: cobertura_entrevista,
                avance_pct: avance_pct,
                docente_cv: formatShortName(item.docente_cv_apellidos, item.docente_cv_nombres),
                docente_entrevista: formatShortName(item.docente_entrevista_apellidos, item.docente_entrevista_nombres),
            };
        });
    }, [resumenEvaluacion]);

    const filteredItems = useMemo(() => {
        let filtered = [...users];
        if (filterValue) {
            const q = filterValue.toLowerCase();
            filtered = filtered.filter((user) =>
                user.grado_programa.toLowerCase().includes(q) ||
                user.facultad.toLowerCase().includes(q) ||
                user.docente_cv.toLowerCase().includes(q) ||
                user.docente_entrevista.toLowerCase().includes(q)
            );
        }
        return filtered;
    }, [users, filterValue]);

    const sortedItems = useMemo(() => {
        return [...filteredItems].sort((a, b) => {
            let first = a[sortDescriptor.column];
            let second = b[sortDescriptor.column];

            if (sortDescriptor.column === "evaluados_cv") {
                first = a.cobertura_cv;
                second = b.cobertura_cv;
            } else if (sortDescriptor.column === "evaluados_entrevista") {
                first = a.cobertura_entrevista;
                second = b.cobertura_entrevista;
            }

            if (first !== second) {
                const cmp = first < second ? -1 : first > second ? 1 : 0;
                return sortDescriptor.direction === "descending" ? -cmp : cmp;
            }

            // Tie breaker: sort by most enrolled/inscritos descending
            const insA = a.inscritos;
            const insB = b.inscritos;
            if (insA !== insB) {
                return sortDescriptor.direction === "descending" ? insB - insA : insA - insB;
            }

            // Secondary tie breaker
            return a.grado_programa.localeCompare(b.grado_programa);
        });
    }, [filteredItems, sortDescriptor]);

    const items = useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        return sortedItems.slice(start, start + rowsPerPage);
    }, [page, sortedItems, rowsPerPage]);

    const renderCell = useCallback((user, columnKey) => {
        const cellValue = user[columnKey];
        switch (columnKey) {
            case "grado_programa":
                return (
                    <div className="flex flex-col py-1">
                        <p className="text-[11px] sm:text-[13px] text-slate-700 leading-tight font-medium">{cellValue}</p>
                    </div>
                );
            case "evaluados_cv":
            case "evaluados_entrevista": {
                const isCV = columnKey === "evaluados_cv";
                const progressValue = isCV ? user.cobertura_cv : user.cobertura_entrevista;
                const docente = isCV ? user.docente_cv : user.docente_entrevista;
                const icon = isCV ? <MdOutlineAssignmentInd className="text-blue-500 shrink-0" /> : <MdFactCheck className="text-emerald-600 shrink-0" />;

                return (
                    <div className="flex flex-col gap-1 sm:gap-2 pr-1 sm:pr-4 w-full">
                        <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-0.5 sm:gap-2">
                            <div className="flex items-center gap-1 sm:gap-2 min-w-0">
                                {icon}
                                <span className={`text-[11px] sm:text-[12px] font-bold ${isCV ? 'text-blue-700' : 'text-emerald-700'} truncate max-w-[100px] sm:max-w-[140px]`}>
                                    {docente}
                                </span>
                            </div>
                            <span className="text-[10px] sm:text-[12px] font-black text-slate-600 shrink-0">
                                {cellValue}/{isCV ? user.aptos : user.inscritos} ({progressValue}%)
                            </span>
                        </div>
                        <Progress
                            aria-label={`Prog ${user.id}-${columnKey}`}
                            value={progressValue}
                            size="sm"
                            radius="md"
                            color={isCV ? "primary" : "success"}
                            classNames={{ track: "bg-slate-100", base: "h-1.5 sm:h-2" }}
                        />
                    </div>
                );
            }
            default:
                return <span className="text-[10px]">{cellValue}</span>;
        }
    }, []);

    return (
        <DashboardCard
            className="h-full flex flex-col overflow-hidden shadow-none border border-slate-100"
            noHeader={true} // Eliminamos el header del Card para ganar espacio
        >
            <div className="p-2 flex flex-col h-full">
                {/* Header compacto con buscador */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 px-1">
                    <div className="flex items-baseline gap-2">
                        <h2 className="text-[12px] sm:text-[13px] font-black text-slate-800 uppercase tracking-tighter">Resumen Evaluación</h2>
                        <span className="text-[10px] text-slate-400 font-medium">{admissionConfig.cronograma.periodo}</span>
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                        <Input
                            isClearable
                            className="w-full sm:w-[200px]"
                            placeholder="Buscar programa..."
                            size="sm"
                            startContent={<SearchIcon className="text-slate-400" />}
                            value={filterValue}
                            onValueChange={(v) => { setFilterValue(v); setPage(1); }}
                            classNames={{ inputWrapper: "h-8 min-h-8 bg-slate-50 border-none shadow-none" }}
                        />
                        <Button size="sm" variant="flat" isIconOnly radius="full" className="h-8 w-8 min-w-8 shrink-0">
                            <ChevronDownIcon />
                        </Button>
                    </div>
                </div>

                <Table
                    aria-label="Tabla de Evaluación"
                    layout="fixed"
                    isHeaderSticky
                    classNames={{
                        base: "flex-1 min-h-0 flex flex-col overflow-hidden",
                        wrapper: "flex-1 overflow-auto w-full p-0.5 m-0 shadow-none border-none",
                        table: "min-w-[550px] sm:min-w-0 w-full",
                        th: "bg-slate-50/50 text-slate-500 font-bold uppercase text-[9px] py-1 border-b border-slate-100 h-8",
                        td: "py-2 border-b border-slate-50/50"
                    }}
                    sortDescriptor={sortDescriptor}
                    onSortChange={setSortDescriptor}
                >
                    <TableHeader columns={columns}>
                        {(column) => (
                            <TableColumn
                                key={column.uid}
                                allowsSorting={column.sortable}
                                className={column.uid === "facultad" ? "hidden sm:table-cell" : ""}
                                width={
                                    column.uid === "grado_programa" ? "35%" :
                                        column.uid === "facultad" ? "10%" : "27.5%"
                                }
                            >
                                {column.name}
                            </TableColumn>
                        )}
                    </TableHeader>
                    <TableBody
                        emptyContent={
                            loading ? (
                                <div className="flex flex-col gap-2 w-full p-2">
                                    <Skeleton className="h-10 w-full rounded-lg" />
                                    <Skeleton className="h-10 w-full rounded-lg" />
                                    <Skeleton className="h-10 w-full rounded-lg" />
                                    <Skeleton className="h-10 w-full rounded-lg" />
                                    <Skeleton className="h-10 w-full rounded-lg" />
                                </div>
                            ) : "No hay datos"
                        }
                        items={loading ? [] : items}
                    >
                        {(item) => (
                            <TableRow key={item.id}>
                                {(columnKey) => (
                                    <TableCell className={columnKey === "facultad" ? "hidden sm:table-cell" : ""}>
                                        {renderCell(item, columnKey)}
                                    </TableCell>
                                )}
                            </TableRow>
                        )}
                    </TableBody>
                </Table>

                {/* Paginador como footer fijo — siempre visible al fondo */}
                <div className="shrink-0 border-t border-slate-100">
                    <TablePagination
                        page={page}
                        pages={Math.ceil(filteredItems.length / rowsPerPage)}
                        setPage={setPage}
                        filteredItemsLength={filteredItems.length}
                    />
                </div>
            </div>
        </DashboardCard>
    );
}
