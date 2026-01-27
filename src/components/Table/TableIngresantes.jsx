import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import useGrado from "../../data/dataGrados";
import Spinner from "../../components/Spinner/Spinner"; // Spinner
import { toast, Toaster } from "react-hot-toast";
import MultiSelect from "../../components/Select/SelectMultiple";
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Input,
    Button,
    DropdownTrigger,
    Dropdown,
    DropdownMenu,
    DropdownItem,
    Chip,
    Pagination,
} from "@nextui-org/react";
import useDataIngresantes from "../../data/Resultados/dataIngresantes";
import Select from "../../components/Select/Select";
import useProgramasHabilitados from "../../data/Inscripcion/dataProgramasHabilitados";
import axios from "../../axios";

export const columns = [
    { name: "ID", uid: "id", sortable: true },
    { name: "Nombres Completos", uid: "nombre_completo", sortable: true },
    { name: "Grado y Programa", uid: "grado", sortable: true },
    { name: "Doc. Identidad", uid: "num_iden", sortable: true },
    { name: "Contacto", uid: "contacto", sortable: true },
    { name: "Mérito Prog.", uid: "merito_programa", sortable: true },
    { name: "Mérito Gen.", uid: "merito_general", sortable: true },
    { name: "Puntaje", uid: "nota_final", sortable: true },
    { name: "Matrícula", uid: "matricula_pagada", sortable: true },
    { name: "Pensión", uid: "pension_pagada", sortable: true },
    // { name: "Estado", uid: "estado", sortable: true },
    // { name: "Acciones", uid: "actions" },
];

export const statusOptions = [
    { name: "Pagó", uid: "1" },
    { name: "No pagó", uid: "0" },
];

export function capitalize(s) {
    return s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : "";
}

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
};

const INITIAL_VISIBLE_COLUMNS = [
    "id",
    "nombre_completo",
    "grado",
    "num_iden",
    "merito_programa",
    "merito_general",
    "nota_final",
    "matricula_pagada",
    "pension_pagada",
];

export default function App() {
    const { ingresantes, refetch } = useDataIngresantes();

    const { grados } = useGrado();
    const { filteredProgramasHabilitados, filterByGrado } =
        useProgramasHabilitados();

    const [loading, setLoading] = useState(false);
    const [selectedKeysPrograma, setSelectedKeysPrograma] = useState([]);

    // ✅ Aseguramos que `ingresantes` tenga datos antes de mapear
    const users = useMemo(() => {
        if (!ingresantes || ingresantes.length === 0) {
            return []; // Evita errores si aún no hay datos
        }
        return ingresantes.map((item) => {
            return {
                id: item.inscripcion_id,
                programa_id: item.programa_id,
                programa: item.programa,
                nombre_completo: [item.apellidos, item.nombres].join(" "),
                grado: item.grado,
                grado_id: item.grado_id,
                nota_final: item.nota_final,
                merito_programa: item.merito_programa,
                merito_general: item.merito_general,
                tipo_doc: item.tipo_doc,
                num_iden: item.num_iden,
                celular: item.celular,
                email: item.email,
                matricula_pagada: item.matricula_pagada,
                pension_pagada: item.pension_pagada,
            };
        });
    }, [ingresantes]);

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
        column: "nota_final",
        direction: "descending",
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
    const pages = Math.max(1, Math.ceil(filteredItems.length / rowsPerPage));
    const items = useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        return sortedItems.slice(start, start + rowsPerPage);
    }, [page, sortedItems, rowsPerPage]);

    useEffect(() => {
        setPage(1); // Reiniciar a la primera página cuando se aplica un filtro
    }, [filterValue, statusFilter, sortedItems, gradoFilter]);

    const handleExportMultiple = async (type) => {
        setLoading(true);

        const endpointMap = {
            "Ingresantes por Programa PDF": "reporte-ingresantes-programa",
            "Reporte Ingresantes PDF": "reporte-final-notas",
            "Reporte Resultados Excel": "reporte-notas-final-excel",
            "Reporte Programas Aperturados": "programas-aperturados-pdf",
            "Reporte Programas No Aperturados": "programas-no-aperturados-pdf",
        };

        const fileExtensionMap = {
            "Ingresantes por Programa PDF": "pdf",
            "Reporte Ingresantes PDF": "pdf",
            "Reporte Resultados Excel": "xlsx",
            "Reporte Programas Aperturados": "pdf",
            "Reporte Programas No Aperturados": "pdf",
        };

        const url = endpointMap[type];
        const fileExt = fileExtensionMap[type];

        if (!url) {
            toast.error("Tipo de reporte no válido");
            setLoading(false);
            return;
        }

        try {
            const response = await axios.get(url, {
                responseType: "blob",
            });

            // Obtener el nombre de archivo desde los headers si existe
            const disposition = response.headers["content-disposition"];
            let fileName = type.replace(/\s+/g, "_").toLowerCase();

            if (disposition && disposition.includes("filename=")) {
                const match = disposition.match(/filename="?([^"]+)"?/);
                if (match && match[1]) {
                    fileName = match[1];
                }
            } else {
                fileName += `.${fileExt}`;
            }

            const urlBlob = window.URL.createObjectURL(
                new Blob([response.data])
            );
            const link = document.createElement("a");
            link.href = urlBlob;
            link.setAttribute("download", fileName);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(urlBlob);
        } catch (error) {
            toast.error("Error al exportar el reporte");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const renderCell = useCallback((user, columnKey) => {
        const cellValue = user[columnKey];

        switch (columnKey) {
            case "id":
                return (
                    <div className="flex flex-col">
                        {/* <p className="text-sm text-default-400">{cellValue}</p> */}
                        <p className="text-bold text-tiny capitalize text-default-400">
                            {cellValue}
                        </p>
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
            case "num_iden":
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
            case "merito_programa":
                return (
                    <div className="flex flex-col">
                        <p className="font-medium capitalize text-sm text-default-500">
                            {cellValue}
                        </p>
                    </div>
                );
            case "merito_general":
                return (
                    <div className="flex flex-col">
                        <p className="font-medium capitalize text-sm text-default-500">
                            {cellValue}
                        </p>
                    </div>
                );
            case "nota_final":
                return (
                    <div className="flex flex-col">
                        <p className="font-medium capitalize text-sm text-default-500">
                            {cellValue}
                        </p>
                    </div>
                );
            case "contacto":
                return (
                    <div className="flex flex-col">
                        <p className="text-sm text-default-400">{user.email}</p>
                        <p className="font-medium capitalize text-sm text-default-500">
                            {user.celular}
                        </p>
                    </div>
                );
            case "matricula_pagada":
                return (
                    <Chip
                        className="capitalize text-sm font-medium"
                        color={statusColorMap[cellValue === 0 ? 0 : 1]}
                        size="sm"
                        variant="flat"
                    >
                        {cellValue === 0 ? "No pagó" : "Pagó"}
                    </Chip>
                );
            case "pension_pagada":
                return (
                    <Chip
                        className="capitalize text-sm font-medium"
                        color={statusColorMap[cellValue === 0 ? 0 : 1]}
                        size="sm"
                        variant="flat"
                    >
                        {cellValue === 0 ? "No pagó" : `Pagó (${cellValue})`}
                    </Chip>
                );
            default:
                return cellValue;
        }
    }, []);

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

    const formDataRef = useRef(new FormData());
    const handleFileUpload = (inputId, file) => {
        formDataRef.current.set(inputId, file);
    };

    const topContent = useMemo(() => {
        return (
            <>
                <Toaster position="top-right" />
                {/* Overlay de carga (solo se renderiza si loading es true) */}
                {loading && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                        {" "}
                        {/* z-index más alto que el modal */}
                        <Spinner label={"Cargando..."} />
                    </div>
                )}
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
                                key: item.id.toString(),
                                textValue: item.nombre,
                                ...item,
                            }))}
                            onSelectionChange={(grado_id) => {
                                if (!grado_id) {
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
                                    ? filteredProgramasHabilitados.map(
                                        (item) => ({
                                            key: item.id.toString(),
                                            textValue: item.nombre,
                                            ...item,
                                        })
                                    )
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
                        <Dropdown>
                            <DropdownTrigger asChild>
                                <Button
                                    color="primary"
                                    className="h-10"
                                    aria-label="exportando"
                                >
                                    Exportar
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu>
                                <DropdownItem
                                    textValue="Ingresantes por Programa PDF"
                                    onPress={() =>
                                        handleExportMultiple(
                                            "Ingresantes por Programa PDF"
                                        )
                                    }
                                >
                                    N° Ingresantes por Programa PDF
                                </DropdownItem>

                                <DropdownItem
                                    textValue="Reporte Ingresantes PDF"
                                    onPress={() =>
                                        handleExportMultiple(
                                            "Reporte Ingresantes PDF"
                                        )
                                    }
                                >
                                    Reporte Ingresantes PDF
                                </DropdownItem>
                                <DropdownItem
                                    textValue="Reporte Resultados Excel"
                                    onPress={() =>
                                        handleExportMultiple(
                                            "Reporte Resultados Excel"
                                        )
                                    }
                                >
                                    Reporte Resultados Excel
                                </DropdownItem>
                                <DropdownItem
                                    textValue="Reporte Programas Aperturados"
                                    onPress={() =>
                                        handleExportMultiple(
                                            "Reporte Programas Aperturados"
                                        )
                                    }
                                >
                                    Reporte Programas Aperturados
                                </DropdownItem>
                                <DropdownItem
                                    textValue="Reporte Programas No Aperturados"
                                    onPress={() =>
                                        handleExportMultiple(
                                            "Reporte Programas No Aperturados"
                                        )
                                    }
                                >
                                    Reporte Programas No Aperturados
                                </DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                        <Dropdown>
                            <DropdownTrigger className="w-full sm:w-auto">
                                <Button
                                    aria-label="lista_columna"
                                    endContent={
                                        <ChevronDownIcon className="text-small" />
                                    }
                                    variant="flat"
                                    className="h-12 w-full sm:w-auto"
                                >
                                    Columnas
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu
                                disallowEmptySelection
                                closeOnSelect={false}
                                selectedKeys={visibleColumns}
                                selectionMode="multiple"
                                onSelectionChange={setVisibleColumns}
                            >
                                {columns.map((column) => (
                                    <DropdownItem
                                        textValue={column.name}
                                        key={column.uid}
                                        className="capitalize"
                                    >
                                        {capitalize(column.name)}
                                    </DropdownItem>
                                ))}
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                    {/* 📊 Resumen de resultados */}
                    <div className="flex justify-between items-center w-full">
                        <div className="flex items-center">
                            <span className="text-default-400 text-small">
                                {`${filteredItems.length} ingresantes encontrados`}
                            </span>
                        </div>

                        <div className="flex items-center">
                            <label className="flex items-center text-default-400 text-small">
                                Filas por página:
                                <select
                                    className="bg-transparent outline-none text-default-400 text-small ml-2"
                                    value={rowsPerPage}
                                    onChange={(e) => {
                                        setRowsPerPage(Number(e.target.value));
                                        setPage(1);
                                    }}
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
        [
            filterValue,
            onSearchChange,
            statusFilter,
            visibleColumns,
            onRowsPerPageChange,
            onClear,
            users.length,
        ],
    ]);
    const bottomContent = useMemo(
        () => (
            <div className="py-2 px-2 flex flex-col sm:flex-row justify-center items-center gap-2">
                <Pagination
                    isCompact
                    showControls
                    showShadow
                    color="primary"
                    page={page}
                    total={pages}
                    onChange={setPage}
                />
            </div>
        ),
        [page, pages]
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
                emptyContent={"No se encontró información"}
                items={items}
                className="space-y-1" // Reducir espacio entre filas
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
