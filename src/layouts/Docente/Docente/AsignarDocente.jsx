import { useState, useMemo, useEffect } from "react";
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Select,
    SelectItem,
    Input,
    Button,
    Card,
    CardHeader,
    CardBody,
    Chip,
    Tabs,
    Tab,
    Tooltip,
    Divider,
    Spinner,
    Badge,
    Pagination
} from "@heroui/react";
import SelectSearch from "../../../components/Select/Select";
import {
    Search,
    UserPlus,
    BookOpen,
    GraduationCap,
    CheckCircle2,
    AlertCircle,
    Save,
    Filter,
    Users,
    ClipboardCheck
} from "lucide-react";
import { toast } from "react-hot-toast";
import axios from "../../../axios";
import Breadcrumb from "../../../components/Breadcrumb/Breadcrumb";
import useProgramas from "../../../data/dataProgramas";
import useGrados from "../../../data/dataGrados";
import useDocentes from "../../../data/Evaluacion/dataDocentes";
import ModalDocente from "./M_NewDocente";

function AsignarDocente() {
    const { programas, fetchProgramas, loading: loadingP } = useProgramas();
    const { grados } = useGrados();
    const { docentes, fetchDocentes } = useDocentes();

    const [selectedTab, setSelectedTab] = useState("cv");
    const [searchQuery, setSearchQuery] = useState("");
    const [gradoFilter, setGradoFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");
    const [isSaving, setIsSaving] = useState(false);
    const [modalAbierto, setModalAbierto] = useState(false);
    const [pendingChanges, setPendingChanges] = useState({});

    // Paginación
    const [page, setPage] = useState(1);
    const rowsPerPage = 10;

    // Cargar datos iniciales
    useEffect(() => {
        fetchDocentes();
        fetchProgramas();
    }, []);

    // Filtrar docentes por tipo para los Selects
    const docentesCV = useMemo(() => docentes.filter(d => d.tipo === "cv" && d.estado), [docentes]);
    const docentesEntrevista = useMemo(() => docentes.filter(d => d.tipo === "entrevista" && d.estado), [docentes]);

    // ── GESTIÓN DE DATOS (Single Source of Truth) ──────────────────────────
    // Combinamos datos originales con cambios pendientes ANTES de filtrar.
    // Esto garantiza que la tabla siempre vea la última "verdad" (Draft).
    const filteredProgramas = useMemo(() => {
        // 1. Fusionar cambios y FORZAR nuevas referencias para todas las filas.
        // Esto es vital para que la regla de exclusividad se refleje en toda la tabla al instante.
        const programasConCambios = programas.map(p => {
            const changes = pendingChanges[p.id] || {};
            // Siempre retornamos un objeto nuevo {...p} para romper la optimización de la tabla
            // y obligar a todos los selects a re-evaluar su lista de disponibles.
            return { ...p, ...changes };
        });


        // 2. Aplicar filtros
        return programasConCambios.filter(p => {
            const matchesSearch = p.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.codigo?.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesGrado = gradoFilter === "all" || String(p.grado_id) === String(gradoFilter);

            // Regla de Visibilidad: CV ve todos, Entrevista solo programas con estado 1
            const matchesPhaseVisibility = selectedTab === "cv" || (selectedTab === "entrevista" && String(p.estado) === "1") || selectedTab === "global";

            let matchesStatus = true;
            if (statusFilter === "pending") {
                matchesStatus = selectedTab === "cv" ? !p.docente_id : !p.docente_entrevista_id;
            } else if (statusFilter === "completed") {
                matchesStatus = selectedTab === "cv" ? !!p.docente_id : !!p.docente_entrevista_id;
            } else if (statusFilter === "both_pending") {
                matchesStatus = !p.docente_id || !p.docente_entrevista_id;
            }

            return matchesSearch && matchesGrado && matchesStatus && matchesPhaseVisibility;
        }).sort((a, b) => a.nombre.localeCompare(b.nombre));

    }, [programas, pendingChanges, searchQuery, gradoFilter, statusFilter, selectedTab]);

    // Lógica de paginación
    const pages = Math.ceil(filteredProgramas.length / rowsPerPage);
    const items = useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        return filteredProgramas.slice(start, end);
    }, [page, filteredProgramas]);

    // Ids de docentes que ya tienen un programa asignado en ENTREVISTA
    const docentesOcupadosEntrevista = useMemo(() => {
        const occupied = new Set();
        programas.forEach(p => {
            // Regla: Si existe en pendingChanges (incluso si es null), usamos ese. Si no, el original.
            const entId = (pendingChanges[p.id] && "docente_entrevista_id" in pendingChanges[p.id])
                ? pendingChanges[p.id].docente_entrevista_id
                : p.docente_entrevista_id;
            
            if (entId) occupied.add(String(entId));
        });
        return occupied;
    }, [programas, pendingChanges]);


    // Resetear página al filtrar o cambiar pestaña
    useEffect(() => {
        setPage(1);
    }, [searchQuery, gradoFilter, statusFilter, selectedTab]);


    const handleAssignmentChange = (programaId, field, value) => {
        setPendingChanges(prev => ({
            ...prev,
            [programaId]: {
                ...(prev[programaId] || {}),
                [field]: value === "null" ? null : value
            }
        }));
    };

    const hasChanges = Object.keys(pendingChanges).length > 0;

    const handleSaveChanges = async () => {
        if (!hasChanges) return;
        setIsSaving(true);

        try {
            const promises = Object.entries(pendingChanges).map(([id, data]) => {
                return axios.post(`/programas/${id}`, { _method: 'PUT', ...data });
            });

            await toast.promise(Promise.all(promises), {
                loading: "Guardando asignaciones...",
                success: "Asignaciones guardadas correctamente",
                error: "Error al guardar algunos cambios"
            });

            setPendingChanges({});
            fetchProgramas();
        } catch (error) {
            console.error(error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleGuardarNuevoDocente = async (datos) => {
        try {
            const response = await axios.post("/docentes", datos);
            if (response.data.success) {
                toast.success("Docente agregado correctamente");
                setModalAbierto(false);
                fetchDocentes();
            }
        } catch (error) {
            const data = error.response?.data;
            let msg = data?.message || "Error al agregar docente";
            
            // Si hay errores de validación, extraer el primero
            if (data?.errors && Object.keys(data.errors).length > 0) {
                const firstErrorKey = Object.keys(data.errors)[0];
                msg = data.errors[firstErrorKey][0];
            }
            
            toast.error(msg);
        }
    };

    const capitalize = (str) => {
        if (!str) return "";
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    };

    // ── RENDERIZADO DE CELDAS ──────────────────────────────────────────────
    const tableColumns = useMemo(() => {
        const cols = [{ key: "programa", label: "PROGRAMA ACADÉMICO", width: 500 }];
        const evalWidth = 380;

        if (selectedTab === "cv") cols.push({ key: "eval-cv", label: "EVALUADOR CV (EXPEDIENTE)", width: evalWidth });
        else if (selectedTab === "entrevista") cols.push({ key: "eval-ent", label: "EVALUADOR ENTREVISTA", width: evalWidth });
        else if (selectedTab === "global") {
            cols.push({ key: "global-cv", label: "EVALUADOR CV", width: evalWidth });
            cols.push({ key: "global-ent", label: "EVALUADOR ENTREVISTA", width: evalWidth });
        }

        cols.push({ key: "status", label: "ESTADO", align: "center", width: 100 });
        return cols;
    }, [selectedTab]);

    const renderCell = (programa, columnKey) => {
        switch (columnKey) {
            case "programa":
                return (
                    <div className="flex flex-col">
                        <div className="text-slate-700 font-medium leading-tight">
                            {capitalize(programa.grado?.nombre)} en {programa.nombre}
                        </div>
                    </div>
                );
            case "eval-cv":
                return renderEvaluatorSelect(programa, "cv");
            case "eval-ent":
                return renderEvaluatorSelect(programa, "entrevista");
            case "global-cv":
                return renderDocenteBadge(programa.docente_id, "blue");
            case "global-ent":
                return renderDocenteBadge(programa.docente_entrevista_id, "purple");
            case "status":
                const isComplete = selectedTab === "cv" ? !!programa.docente_id :
                    selectedTab === "entrevista" ? !!programa.docente_entrevista_id :
                        (!!programa.docente_id && !!programa.docente_entrevista_id);
                return (
                    <div className="flex justify-center">
                        <div className={`p-1.5 rounded-full ${isComplete ? "bg-success-100 text-success-600" : "bg-warning-100 text-warning-600"}`}>
                            {isComplete ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    const renderDocenteBadge = (docenteId, color) => {
        const d = docentes.find(doc => doc.id == docenteId);
        if (!d) return <span className="text-red-400 text-xs italic flex items-center gap-1"><AlertCircle size={14} /> Sin asignar</span>;

        const bgColor = color === "blue" ? "bg-blue-100 text-blue-600" : "bg-purple-100 text-purple-600";
        return (
            <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full ${bgColor} flex items-center justify-center font-bold text-xs uppercase`}>
                    {d.nombres.charAt(0)}
                </div>
                <div className="flex flex-col text-xs font-semibold">
                    {d.ap_paterno} {d.ap_materno}, {d.nombres}
                </div>

            </div>
        );
    };

    const renderEvaluatorSelect = (programa, type) => {
        const field = type === "cv" ? "docente_id" : "docente_entrevista_id";
        const currentId = programa[field]; 
        let list = type === "cv" ? docentesCV : docentesEntrevista;

        // Regla: En entrevista, un docente solo puede tener UN programa.
        // Filtramos los que ya están ocupados en OTROS programas.
        if (type === "entrevista") {
            list = list.filter(d => {
                const isCurrent = String(d.id) === String(currentId);
                const isOccupiedElsewhere = docentesOcupadosEntrevista.has(String(d.id));
                return isCurrent || !isOccupiedElsewhere;
            });
        }

        const selectItems = list.map(d => ({
            key: String(d.id),
            textValue: `${d.ap_paterno} ${d.ap_materno}, ${d.nombres}`
        }));


        return (
            <SelectSearch
                key={`${programa.id}-${field}`}
                idPrefix={`row-${programa.id}-${field}`}
                label="Seleccionar docente"
                defaultItems={selectItems}
                selectedKey={currentId ? String(currentId) : ""}
                onSelectionChange={(key) => handleAssignmentChange(programa.id, field, key)}
            />
        );
    };

    return (
        <div className="container mx-auto p-4 max-w-8xl animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div>
                    <Breadcrumb paths={[{ name: "Evaluación" }, { name: "Asignar Docentes", href: "/asignar-docentes" }]} />
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <Button color="success" variant="flat" startContent={<UserPlus size={18} />} onPress={() => setModalAbierto(true)} className="font-semibold">
                        Nuevo Docente
                    </Button>
                    {hasChanges && (
                        <Button color="primary" variant="shadow" startContent={<Save size={18} />} onPress={handleSaveChanges} isLoading={isSaving} className="font-bold animate-in zoom-in">
                            Guardar {Object.keys(pendingChanges).length} Cambios
                        </Button>
                    )}
                </div>
            </div>

            <Card className="shadow-xl border-none bg-white/90 backdrop-blur-md overflow-hidden">
                <CardHeader className="bg-slate-50/50 p-0">
                    <Tabs aria-label="Fases de asignación" selectedKey={selectedTab} onSelectionChange={setSelectedTab} color="primary" variant="underlined"
                        classNames={{
                            tabList: "gap-6 w-full relative rounded-none border-b border-divider px-6 h-16",
                            tabContent: "group-data-[selected=true]:text-primary font-semibold text-md text-slate-500"
                        }}>
                        <Tab key="cv" title={<div className="flex items-center space-x-2"><BookOpen size={18} /><span>Fase 1: Evaluación CV</span></div>} />
                        <Tab key="entrevista" title={<div className="flex items-center space-x-2"><Users size={18} /><span>Fase 2: Evaluación Entrevista</span></div>} />
                        <Tab key="global" title={<div className="flex items-center space-x-2"><ClipboardCheck size={18} /><span>Vista General / Auditoría</span></div>} />
                    </Tabs>
                </CardHeader>

                <CardBody className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-6">
                        <div className="md:col-span-4">
                            <Input placeholder="Buscar programa..." startContent={<Search className="text-slate-400" size={18} />} value={searchQuery} onValueChange={setSearchQuery} variant="bordered" />
                        </div>
                        <div className="md:col-span-3">
                            <Select placeholder="Grado" selectedKeys={[gradoFilter]} onSelectionChange={(k) => setGradoFilter(Array.from(k)[0])} variant="bordered">
                                <SelectItem key="all">Todos los grados</SelectItem>
                                {grados.map(g => <SelectItem key={String(g.id)}>{g.nombre}</SelectItem>)}
                            </Select>
                        </div>
                        <div className="md:col-span-3">
                            <Select placeholder="Estado" selectedKeys={[statusFilter]} onSelectionChange={(k) => setStatusFilter(Array.from(k)[0])} variant="bordered">
                                <SelectItem key="all">Todos los estados</SelectItem>
                                <SelectItem key="pending">Pendientes</SelectItem>
                                <SelectItem key="completed">Completados</SelectItem>
                            </Select>
                        </div>
                        <div className="md:col-span-2 flex items-center justify-end">
                            <Chip variant="flat" color="primary" className="font-semibold">{filteredProgramas.length} Programas</Chip>
                        </div>
                    </div>

                    {loadingP ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-4"><Spinner size="lg" /><p className="text-slate-500">Cargando...</p></div>
                    ) : (
                        <Table aria-label="Tabla de asignación" shadow="none" className="border border-slate-100 rounded-xl" removeWrapper
                            bottomContent={pages > 1 && <div className="flex w-full justify-center py-4"><Pagination isCompact showControls color="primary" page={page} total={pages} onChange={setPage} /></div>}>
                            <TableHeader columns={tableColumns}>
                                {(column) => <TableColumn key={column.key} width={column.width} align={column.align || "start"}>{column.label}</TableColumn>}
                            </TableHeader>
                            <TableBody items={items} emptyContent="No hay programas">
                                {(item) => (
                                    <TableRow key={item.id} className="hover:bg-slate-50/50 transition-colors border-b border-slate-50 last:border-0">
                                        {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    )}
                </CardBody>
            </Card>

            <ModalDocente isOpen={modalAbierto} onClose={() => setModalAbierto(false)} onSave={handleGuardarNuevoDocente} />
        </div>
    );
}

export default AsignarDocente;
