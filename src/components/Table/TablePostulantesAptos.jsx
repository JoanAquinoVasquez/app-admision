import React from "react";
import { useState, useCallback, useMemo, useEffect } from "react";
import useGrado from "../../data/dataGrados";
import Spinner from "../../components/Spinner/Spinner"; // Spinner

import MultiSelect from "../../components/Select/SelectMultiple";
import UploadNotesModal from "./modals/UploadNotesModal";
import GradeModal from "./modals/GradeModal";
import usePostulanteExports from "../../hooks/usePostulanteExports";
import {

    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,

    Button,
    DropdownTrigger,
    Dropdown,
    DropdownMenu,
    DropdownItem,
    Pagination,
} from "@nextui-org/react";
import useInscripcioNota from "../../data/Inscripcion/dataInscripcionNota";
import Select from "../../components/Select/Select";

import useProgramas from "../../data/dataProgramas";

export const columns = [
    { name: "ID", uid: "id", sortable: true },
    { name: "Nombres Completos", uid: "nombre_completo", sortable: true },
    { name: "Grado y Programa", uid: "grado", sortable: true },
    { name: "Doc. Identidad", uid: "doc_iden", sortable: true },
    { name: "Nota CV", uid: "nota_expediente", sortable: true },
    { name: "Nota Entrevista", uid: "nota_entrevista", sortable: true },
    { name: "Nota Examen", uid: "nota_examen", sortable: true },
    // { name: "Estado", uid: "estado", sortable: true },
    { name: "Acciones", uid: "actions" },
];

export const statusOptions = [
    { name: "Validado", uid: "1" },
    { name: "Pendiente", uid: "0" },
    { name: "Observado", uid: "2" },
];

export function capitalize(s) {
    return s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : "";
}

export const PlusIcon = ({ size = 24, width, height, ...props }) => {
    return (
        <svg
            aria-hidden="true"
            fill="none"
            focusable="false"
            height={size || height}
            role="presentation"
            viewBox="0 0 24 24"
            width={size || width}
            {...props}
        >
            <g
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
            >
                <path d="M6 12h12" />
                <path d="M12 18V6" />
            </g>
        </svg>
    );
};

export const VerticalDotsIcon = ({ size = 24, width, height, ...props }) => {
    return (
        <svg
            aria-hidden="true"
            fill="none"
            focusable="false"
            height={size || height}
            role="presentation"
            viewBox="0 0 24 24"
            width={size || width}
            {...props}
        >
            <path
                d="M12 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 12c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"
                fill="currentColor"
            />
        </svg>
    );
};

export const SearchIcon = (props) => {
    return (
        <svg
            aria-hidden="true"
            fill="none"
            focusable="false"
            height="1em"
            role="presentation"
            viewBox="0 0 24 24"
            width="1em"
            {...props}
        >
            <path
                d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
            />
            <path
                d="M22 22L20 20"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
            />
        </svg>
    );
};

export const ChevronDownIcon = ({ strokeWidth = 1.5, ...otherProps }) => {
    return (
        <svg
            aria-hidden="true"
            fill="none"
            focusable="false"
            height="1em"
            role="presentation"
            viewBox="0 0 24 24"
            width="1em"
            {...otherProps}
        >
            <path
                d="m19.92 8.95-6.52 6.52c-.77.77-2.03.77-2.8 0L4.08 8.95"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeMiterlimit={10}
                strokeWidth={strokeWidth}
            />
        </svg>
    );
};

const statusColorMap = {
    1: "success",
    0: "danger",
    2: "warning",
};

const INITIAL_VISIBLE_COLUMNS = [
    "id",
    "nombre_completo",
    "grado",
    "doc_iden",
    "nota_expediente",
    "nota_entrevista",
    "nota_examen",
    // "estado",
    "actions",
];

export default function App() {
    const { inscripcioNota, fetchInscripcionNota, loading: dataLoading } = useInscripcioNota();
    const [validarId, setValidarId] = useState(null);
    const [isObservarOpen, setIsObservarOpen] = useState(false);

    const { grados } = useGrado();
    const { filteredProgramas, filterByGrado } = useProgramas();

    const [programasPosibles, setProgramasPosibles] = useState([]);
    const [programasFiltrados, setProgramasFiltrados] = useState([]);
    const [isNotaEntrevista, setIsNotaEntrevista] = useState(false);

    const [selectedNota, setSelectedNota] = useState("");
    const [grado_id, setGrado_id] = useState("");
    const [gradoSelected, setGradoSelected] = useState("");
    const [editMode, setEditMode] = useState(false);
    const toggleEditMode = () => setEditMode(!editMode);
    // loading state removed as it was only for export/internal actions now handled by hook or modals
    // But dataLoading is from useInscripcioNota
    const { loading: exportLoading, handleExport } = usePostulanteExports();
    const [selectedKeysPrograma, setSelectedKeysPrograma] = useState([]);

    // ✅ Aseguramos que `inscripcioNota` tenga datos antes de mapear
    const users = useMemo(() => {
        if (!inscripcioNota || inscripcioNota.length === 0) {
            return []; // Evita errores si aún no hay datos
        }
        return inscripcioNota
            .filter((item) => item.val_fisico == 1) // Filtra solo los elementos con val_fisico === 1
            .map((item) => {
                return {
                    id: item.id,
                    postulante_id: item.postulante_id,
                    nombre_completo: [
                        item.postulante.ap_paterno,
                        item.postulante.ap_materno,
                        item.postulante.nombres,
                    ].join(" "),
                    grado: item.programa.grado.nombre,
                    grado_id: item.programa.grado.id,
                    programa_id: item.programa.id,
                    programa: item.programa.nombre,
                    doc_iden: item.postulante.num_iden,
                    tipo_doc: item.postulante.tipo_doc,
                    voucher: item.codigo,
                    nota_entrevista: item.nota?.entrevista
                        ? item.nota?.entrevista
                        : "-",
                    nota_expediente: item.nota?.cv ? item.nota?.cv : "-",
                    nota_examen: item.nota?.examen ? item.nota?.examen : "-",
                    estado: item.val_fisico,
                };
            });
    }, [inscripcioNota]);

    const [filterValue, setFilterValue] = useState("");
    const [selectedKeys, setSelectedKeys] = useState(new Set([]));
    const [visibleColumns, setVisibleColumns] = useState(
        new Set(INITIAL_VISIBLE_COLUMNS)
    );
    const [statusFilter, setStatusFilter] = useState("all");
    const [gradoFilter, setGradoFilter] = useState("all");
    const [programaFilter, setProgramaFilter] = useState([]);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [sortDescriptor, setSortDescriptor] = useState({
        column: "id",
        direction: "ascending",
    });
    const [page, setPage] = useState(1);



    const headerColumns = useMemo(() => {
        return visibleColumns === "all"
            ? columns
            : columns.filter((column) => visibleColumns.has(column.uid));
    }, [visibleColumns]);

    const filteredItems = useMemo(() => {
        let filteredUsers = [...users];

        if (filterValue) {
            const lowerCaseFilter = filterValue.toLowerCase();
            filteredUsers = filteredUsers.filter((user) =>
                Object.values(user).some((value) =>
                    value?.toString().toLowerCase().includes(lowerCaseFilter)
                )
            );
        }

        if (statusFilter !== "all") {
            filteredUsers = filteredUsers.filter((user) =>
                statusFilter.has(user.estado.toString())
            );
        }

        if (gradoFilter !== "all") {
            filteredUsers = filteredUsers.filter(
                (user) => user.grado_id === gradoFilter
            );
        }

        if (programaFilter.length > 0) {
            filteredUsers = filteredUsers.filter(
                (user) => programaFilter.includes(user.programa_id) // Buscar dentro de un array
            );
        }

        return filteredUsers;
    }, [filterValue, statusFilter, users, gradoFilter, programaFilter]);

    const sortedItems = useMemo(() => {
        return [...filteredItems].sort((a, b) => {
            const first = a[sortDescriptor.column];
            const second = b[sortDescriptor.column];
            const cmp = first < second ? -1 : first > second ? 1 : 0;
            return sortDescriptor.direction === "descending" ? -cmp : cmp;
        });
    }, [sortDescriptor, filteredItems]);
    const pages = Math.ceil(filteredItems.length / rowsPerPage);
    const items = useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        return sortedItems.slice(start, start + rowsPerPage);
    }, [page, sortedItems, rowsPerPage]);

    useEffect(() => {
        setPage(1); // Reiniciar a la primera página cuando se aplica un filtro
    }, [filterValue, statusFilter, sortedItems, gradoFilter]);

    const notaStats = useMemo(() => {
        const conNota = filteredItems.filter((item) => {
            return !isNaN(parseFloat(item.nota_expediente));
        }).length;

        const sinNota = filteredItems.length - conNota;

        return { conNota, sinNota };
    }, [filteredItems]);

    const onExport = (type) => {
        handleExport(type, {
            selectedPrograms: selectedKeysPrograma,
            gradoFilter: gradoFilter,
            programaFilter: programaFilter,
        });
    }

    const renderCell = useCallback((user, columnKey) => {
        const cellValue = user[columnKey];

        switch (columnKey) {
            case "id":
                return (
                    <div className="flex flex-col">
                        <p className="text-sm text-default-400">{cellValue}</p>
                        {/* <p className="text-bold text-tiny capitalize text-default-400">
                            {user.nombre_completo}
                        </p> */}
                    </div>
                );

            case "nombre_completo":
                return (
                    <div className="flex flex-col">
                        <p className="capitalize text-sm text-default-500">
                            {cellValue}
                        </p>
                        {/* <p className="text-bold text-tiny capitalize text-default-400">
                            {user.nombre_completo}
                        </p> */}
                    </div>
                );
            case "grado":
                return (
                    <div className="flex flex-col">
                        <p className="text-sm text-default-400">{cellValue}</p>
                        <p className="font-medium text-sm text-default-500">
                            {user.programa}
                        </p>
                    </div>
                );
            case "doc_iden":
                return (
                    <div className="flex flex-col">
                        <p className="text-sm text-default-400">
                            {user.tipo_doc}
                        </p>
                        <p className="font-medium capitalize text-sm text-default-500">
                            {cellValue}
                        </p>
                    </div>
                );
            case "nota_expediente":
                return (
                    <div className="flex flex-col">
                        <p className="font-medium capitalize text-sm text-default-500">
                            {cellValue}
                        </p>
                    </div>
                );
            case "nota_entrevista":
                return (
                    <div className="flex flex-col">
                        <p className="font-medium capitalize text-sm text-default-500">
                            {cellValue}
                        </p>
                    </div>
                );
            case "nota_examen":
                return (
                    <div className="flex flex-col">
                        <p className="font-medium capitalize text-sm text-default-500">
                            {cellValue}
                        </p>
                    </div>
                );
            case "actions":
                return (
                    <>
                        <div className="relative flex justify-end items-center gap-2">
                            <Dropdown>
                                <DropdownTrigger>
                                    <Button
                                        isIconOnly
                                        size="sm"
                                        variant="light"
                                        aria-label="actions"
                                    >
                                        <VerticalDotsIcon className="text-default-300" />
                                    </Button>
                                </DropdownTrigger>
                                <DropdownMenu>
                                    <DropdownItem
                                        key="nota_entrevista"
                                        textValue="Registrar/Editar Nota Entrevista"
                                        onPress={() => {
                                            setIsNotaEntrevista(true);
                                            setSelectedNota(user.nota_entrevista || "");
                                            setValidarId(user.id);
                                            setGradoSelected(user.grado_id);
                                        }}
                                    >
                                        {user.nota_entrevista !== "-"
                                            ? "Editar nota de entrevista"
                                            : "Registrar nota de entrevista"}
                                    </DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                        </div>
                    </>
                );

            default:
                return cellValue;
        }
    }, []);

    // Filtrar programas cuando cambia el `grado_id` en el modal de edición
    useEffect(() => {
        if (grado_id) {
            const filtrados = programasPosibles.filter(
                (p) => p.grado_id == parseInt(grado_id)
            );
            setProgramasFiltrados(filtrados);
        } else {
            setProgramasFiltrados([]);
        }
    }, [grado_id, programasPosibles]);

    // Filtrar programas en la tabla cuando cambia el grado seleccionado
    useEffect(() => {
        if (gradoFilter !== "all") {
            filterByGrado(gradoFilter);
        }
    }, [gradoFilter, filterByGrado]);

    const onRowsPerPageChange = useCallback((e) => {
        setRowsPerPage(Number(e.target.value));
        setPage(1);
    }, []);

    const onSearchChange = useCallback((value) => {
        setFilterValue(value || "");
        setPage(1);
    }, []);

    const onClear = useCallback(() => {
        setFilterValue("");
        setPage(1);
    }, []);

    const topContent = useMemo(() => {
        return (
            <>
                <UploadNotesModal
                    isOpen={isObservarOpen}
                    onClose={() => setIsObservarOpen(false)}
                    onSuccess={fetchInscripcionNota}
                />
                <GradeModal
                    isOpen={isNotaEntrevista}
                    onClose={() => setIsNotaEntrevista(false)}
                    validarId={validarId}
                    initialNota={selectedNota}
                    gradoSelected={gradoSelected}
                    onSuccess={fetchInscripcionNota}
                />
                {/* Overlay de carga (solo se renderiza si loading es true) */}
                <div className="flex flex-wrap gap-4 w-full">
                    {/* Input de búsqueda */}
                    <div className="w-full sm:w-[60%] md:w-[18%]">
                        <Input
                            isClearable
                            className="w-full h-10 focus:outline-none"
                            classNames={{
                                input: "placeholder:text-gray-800 placeholder:opacity-100 text-gray-900",
                            }}
                            placeholder="Buscar al postulante"
                            startContent={<SearchIcon />}
                            value={filterValue}
                            onClear={onClear}
                            onValueChange={onSearchChange}
                        />
                    </div>

                    {/* Select Grado Académico */}
                    <div className="w-full sm:w-[40%] md:w-[15%]">
                        <Select
                            label="Grado Académico"
                            variant="flat"
                            defaultItems={grados.map((item) => ({
                                key: item.id,
                                textValue: item.nombre,
                                ...item,
                            }))}
                            selectedKey={
                                gradoFilter !== "all" ? gradoFilter : null
                            }
                            onSelectionChange={(grado_id) => {
                                if (grado_id === null) {
                                    setGradoFilter("all");
                                    setProgramaFilter([]); // Vaciar programas
                                    setSelectedKeysPrograma([]); // Vaciar selección de programas
                                } else {
                                    setGradoFilter(parseInt(grado_id));
                                    setProgramaFilter([]); // Reiniciar programas cuando se cambia de grado
                                    setSelectedKeysPrograma([]);
                                }
                            }}
                        />
                    </div>

                    {/* Select Programa */}
                    <div className="w-full sm:w-[60%] md:w-[30%] lg:w-[45%]">
                        <MultiSelect
                            label="Selecciona Programas"
                            defaultItems={
                                gradoFilter !== "all"
                                    ? filteredProgramas.map((item) => ({
                                        key: item.id.toString(),
                                        textValue: item.nombre,
                                        ...item,
                                    }))
                                    : [] // Si no hay grado seleccionado, no mostrar opciones
                            }
                            className="w-full min-h-[50px]"
                            selectedKeys={selectedKeysPrograma}
                            onSelectionChange={(keys) => {
                                setSelectedKeysPrograma(keys);
                                setProgramaFilter(
                                    Array.from(keys).map((key) => parseInt(key))
                                ); // Convertir a números
                            }}
                            isRequired={true}
                            disabled={gradoFilter === "all"}
                            closeOnSelect={false} // Mantener el dropdown abierto al seleccionar
                        />
                    </div>

                    {/* Botón de PDF */}
                    <div className="w-full sm:w-auto md:w-[10%] mb-3 flex items-end gap-2">
                        <Button
                            color="danger"
                            onPress={() => {
                                setIsObservarOpen(true);
                            }}
                        >
                            Importar
                        </Button>
                        <Dropdown>
                            <DropdownTrigger asChild>
                                <Button color="primary" className="h-10">
                                    Exportar
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu>
                                <DropdownItem
                                    textValue="Reporte Notas CV PDF"
                                    onPress={() => onExport("CV")}
                                >
                                    Reporte Notas CV PDF
                                </DropdownItem>
                                <DropdownItem
                                    textValue="Plantilla Notas Entrevista"
                                    onPress={() =>
                                        onExport(
                                            "Plantilla Notas Entrevista"
                                        )
                                    }
                                >
                                    Plantilla Notas Entrevista PDF
                                </DropdownItem>
                                <DropdownItem
                                    textValue="Reporte Aptos Asistencia PDF"
                                    onPress={() =>
                                        onExport(
                                            "Reporte Aptos Asistencia PDF"
                                        )
                                    }
                                >
                                    Plantilla Asistencia PDF
                                </DropdownItem>
                                <DropdownItem
                                    textValue="Reporte Aulas PDF"
                                    onPress={() =>
                                        onExport(
                                            "Reporte Aulas PDF"
                                        )
                                    }
                                >
                                    Plantilla Aulas PDF
                                </DropdownItem>
                                <DropdownItem
                                    textValue="Reporte Aptos Excel"
                                    onPress={() =>
                                        onExport(
                                            "Reporte Aptos Excel"
                                        )
                                    }
                                >
                                    Reporte Final Notas Excel
                                </DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                    {/* 📊 Resumen de resultados */}
                    <div className="flex justify-between items-center w-full">
                        <div className="flex items-center">
                            <span className="text-default-400 text-small">
                                {`${notaStats.conNota} de ${filteredItems.length} postulantes evaluados`}
                            </span>
                        </div>

                        <div className="flex items-center">
                            <label className="flex items-center text-default-400 text-small">
                                Rows per page:
                                <select
                                    value={rowsPerPage}
                                    onChange={(e) => {
                                        setRowsPerPage(Number(e.target.value));
                                        setPage(1);
                                    }}
                                    className="bg-transparent outline-none text-default-400 text-small ml-2"
                                >
                                    <option value="5">5</option>
                                    <option value="10">10</option>
                                    <option value="30">30</option>
                                </select>
                            </label>
                        </div>
                    </div>
                </div>
            </>
        );
    }, [
        filterValue,
        onSearchChange,
        statusFilter,
        visibleColumns,
        onRowsPerPageChange,
        onClear,
        users.length,
    ]);

    const bottomContent = useMemo(
        () => (
            <div className="py-2 px-2 flex justify-between items-center">
                <Pagination
                    isCompact
                    showControls
                    showShadow
                    color="primary"
                    page={page}
                    total={pages}
                    onChange={setPage}
                />
                <div className="hidden sm:flex w-[30%] justify-end gap-2">
                    <Button
                        isDisabled={page === 1}
                        size="sm"
                        variant="flat"
                        onPress={() => setPage((prev) => Math.max(prev - 1, 1))}
                    >
                        Anterior
                    </Button>
                    <Button
                        isDisabled={page === pages}
                        size="sm"
                        variant="flat"
                        onPress={() =>
                            setPage((prev) => Math.min(prev + 1, pages))
                        }
                    >
                        Siguiente
                    </Button>
                </div>
            </div>
        ),
        [selectedKeys, filteredItems.length, page, pages]
    );

    return (
        <Table
            aria-label="Example table"
            layout="auto"
            isHeaderSticky
            bottomContent={bottomContent}
            bottomContentPlacement="outside"
            classNames={{
                wrapper: "max-h-auto overflow-auto w-full p-4", // Ajustar tamaño y eliminar márgenes
            }}
            selectedKeys={selectedKeys}
            sortDescriptor={sortDescriptor}
            topContent={topContent}
            topContentPlacement="outside"
            onSelectionChange={setSelectedKeys}
            onSortChange={setSortDescriptor}
        >
            <TableHeader columns={headerColumns}>
                {(column) => (
                    <TableColumn
                        key={column.uid}
                        align={
                            column.uid === "nombre_completo" ||
                                column.uid === "grado"
                                ? "start"
                                : "center"
                        }
                        allowsSorting={column.sortable}
                        className="p-1 text-sm" // Reducir padding y tamaño de fuente
                        aria-label={column.name}
                        scope="col"
                    >
                        {column.name}
                    </TableColumn>
                )}
            </TableHeader>
            <TableBody
                emptyContent={(dataLoading || exportLoading) ? <Spinner label="Cargando..." /> : "No se encontró información"}
                items={items}
                className="space-y-1" // Reducir espacio entre filas
                isLoading={dataLoading || exportLoading}
                loadingContent={<Spinner label="Cargando..." />}
            >
                {(item) => (
                    <TableRow
                        key={`${item.id}`}
                        className="p-1 text-sm leading-tight"
                    >
                        {(columnKey) => (
                            <TableCell className="p-1 text-sm">
                                {renderCell(item, columnKey)}
                            </TableCell>
                        )}
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
}
