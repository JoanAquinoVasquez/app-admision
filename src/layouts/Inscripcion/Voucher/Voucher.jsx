import { useMemo, useCallback, useState, useEffect } from "react";
import Breadcrumb from "../../../components/Breadcrumb/Breadcrumb.jsx";
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
    Spinner as NextUISpinner,
} from "@heroui/react";

import { capitalize } from "../../../services/utils.js";
import Spinner from "../../../components/Spinner/Spinner.jsx";
import axios from "../../../axios.js";
import { toast } from "react-hot-toast";
import RenderManyFilesUpload from "../../../components/Inputs/RenderManyFilesUpload.jsx";
import useVouchers from "../../../data/Inscripcion/dataVouchers.jsx";

export const columns = [
    { name: "ID", uid: "id", sortable: true },
    { name: "Nº Doc. Identidad", uid: "num_iden" },
    { name: "Nombre Completo", uid: "nombre_completo", sortable: true },
    { name: "Concepto de Pago", uid: "concepto_pago" },
    { name: "Código de Voucher", uid: "cod_voucher" },
    { name: "Monto", uid: "monto", sortable: true },
    { name: "Cajero", uid: "cajero" },
    { name: "Agencia", uid: "agencia" },
    { name: "Fecha de Pago", uid: "fecha_pago", sortable: true },
    { name: "Estado", uid: "estado", sortable: true },
];

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

export const statusOptions = [
    { name: "Usado", uid: "0" },
    { name: "Activo", uid: "1" },
];

const statusColorMap = { 1: "success", 0: "danger" };
const INITIAL_VISIBLE_COLUMNS = [
    "id",
    "num_iden",
    "nombre_completo",
    "cod_voucher",
    "concepto_pago",
    "monto",
    "fecha_pago",
    "cajero",
    "agencia",
    "estado",
];

export default function CargarVoucher() {
    const { vouchers, fetchVouchers } = useVouchers();
    const [isFetching, setIsFetching] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [filterValue, setFilterValue] = useState("");
    const [selectedKeys, setSelectedKeys] = useState(new Set([]));
    const [visibleColumns, setVisibleColumns] = useState(
        new Set(INITIAL_VISIBLE_COLUMNS)
    );
    const [statusFilter, setStatusFilter] = useState("all");
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [sortDescriptor, setSortDescriptor] = useState({
        column: "id",
        direction: "ascending",
    });
    const [page, setPage] = useState(1);
    const [voucher, setVoucher] = useState([]);
    const headerColumns = useMemo(() => {
        return visibleColumns === "all"
            ? columns
            : columns.filter((column) => visibleColumns.has(column.uid));
    }, [visibleColumns]);

    const filteredItems = useMemo(() => {
        let filtered = [...vouchers];
        if (filterValue)
            filtered = filtered.filter((vouchers) =>
                Object.values(vouchers).some((value) =>
                    value
                        ?.toString()
                        .toLowerCase()
                        .includes(filterValue.toLowerCase())
                )
            );
        if (
            statusFilter !== "all" &&
            statusFilter.size !== statusOptions.length
        )
            filtered = filtered.filter((vouchers) =>
                statusFilter.has(vouchers.estado.toString())
            );

        return filtered;
    }, [filterValue, statusFilter, vouchers]);

    const pages = Math.ceil(filteredItems.length / rowsPerPage);

    const sortedItems = useMemo(() => {
        return [...filteredItems].sort((a, b) => {
            const first = a[sortDescriptor.column];
            const second = b[sortDescriptor.column];
            const cmp = first < second ? -1 : first > second ? 1 : 0;
            return sortDescriptor.direction === "descending" ? -cmp : cmp;
        });
    }, [sortDescriptor, filteredItems]);

    const items = useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        return sortedItems.slice(start, start + rowsPerPage);
    }, [page, sortedItems, rowsPerPage]);

    useEffect(() => {
        const loadData = async () => {
            setIsFetching(true); // Inicia la carga de la tabla
            await fetchVouchers(); // Espera a que termine de obtener los datos
            setIsFetching(false); // Finaliza la carga de la tabla
        };

        loadData();
    }, [fetchVouchers]);

    useEffect(() => {
        setPage(1); // Reiniciar a la primera página cuando se aplica un filtro
    }, [filterValue, statusFilter, sortedItems]);

    const handleSave = async () => {
        if (!voucher || voucher.length === 0) {
            toast.error("No se ha seleccionado ningún archivo para subir.");
            return;
        }

        // Validar todos los archivos
        const allowedTypes = ["text/plain"];
        for (const file of voucher) {
            if (!allowedTypes.includes(file.type)) {
                toast.error(`El archivo ${file.name} no es un archivo .txt`);
                return;
            }
        }

        const formData = new FormData();
        voucher.forEach((file) => {
            formData.append("file[]", file); // Laravel: usa name="file[]" para múltiples archivos
        });

        try {
            setIsSaving(true);
            const response = await axios.post("/vouchers", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            setIsSaving(false);
            fetchVouchers();
            setVoucher([]); // Limpiar el estado después de la carga exitosa
            toast.success(
                response.data.message || "Vouchers cargados exitosamente."
            );
        } catch (error) {
            setIsSaving(false);
            toast.error(
                "Error al subir los archivos: " +
                (error.response?.data?.message || error.message)
            );
        }
    };

    const handleFileUpload = (inputId, files) => {
        switch (inputId) {
            case "voucher":
                setVoucher(files); // ← Guardamos el array de archivos
                break;
            default:
                break;
        }
    };

    const handleExportVouchers = async () => {
        try {
            setIsSaving(true);
            const response = await axios.get("/voucher/exportar", {
                responseType: "blob",
            });
            // Obtener el nombre del archivo desde los encabezados de la respuesta
            const disposition = response.headers["content-disposition"];
            let fileName = `reporte_vouchers_${new Date().toLocaleDateString('es-PE').replace(/\//g, '-')}.xlsx`;

            if (disposition) {
                const match = disposition.match(/filename="?([^"]+)"?/);
                if (match?.[1]) fileName = match[1];
            }

            // Crear un enlace para descargar el archivo
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", fileName); // Nombre del archivo dinámico
            document.body.appendChild(link);
            link.click(); // Simula el click para descargar el archivo
            setIsSaving(false);
            link.remove(); // Eliminar el enlace del DOM
        } catch (error) {
            setIsSaving(false);
            toast.error("Error al exportar vouchers:", error);
        }
    };

    const renderCell = useCallback((vouchers, columnKey) => {
        const cellValue = vouchers[columnKey];
        if (columnKey === "estado") {
            return (
                <Chip
                    className="capitalize text-sm font-medium"
                    color={statusColorMap[vouchers.estado]}
                    size="sm"
                    variant="flat"
                >
                    {cellValue == 1 ? "Activo" : "Usado"}
                </Chip>
            );
        } else if (columnKey === "cod_voucher") {
            return (
                <div className="flex flex-col">
                    <div className="font-medium capitalize text-sm text-default-500">
                        {vouchers.numero || "Sin asignar"}
                    </div>
                </div>
            );
        } else if (columnKey === "concepto_pago") {
            return (
                <div className="flex flex-col">
                    <div className="font-medium capitalize text-sm text-default-500">
                        {vouchers.concepto_pago.nombre || "Sin asignar"}
                    </div>
                    <div className="text-sm text-default-400">
                        {vouchers.concepto_pago.cod_concepto || "Sin asignar"}
                    </div>
                </div>
            );
        } else if (columnKey === "num_iden") {
            return (
                <div className="flex flex-col">
                    <div className="font-medium capitalize text-sm text-default-500">
                        {vouchers.num_iden || "Sin asignar"}
                    </div>
                </div>
            );
        } else if (columnKey === "monto") {
            return (
                <div className="flex flex-col">
                    <div className="font-medium capitalize text-sm text-default-500">
                        S/. {vouchers.monto || "Sin asignar"}
                    </div>
                </div>
            );
        } else if (columnKey === "fecha_pago") {
            // Extraer la parte de la fecha sin convertir a un objeto Date
            const datePart = cellValue ? cellValue.split(" ")[0] : null;
            let formattedDate = "Sin asignar";
            if (datePart) {
                const [year, month, day] = datePart.split("-"); // Suponiendo que la fecha viene en formato YYYY-MM-DD
                formattedDate = `${day}-${month}-${year}`; // Convertir al formato DD-MM-YYYY
            }
            return (
                <div className="flex flex-col">
                    <div className="font-medium capitalize text-sm text-default-500">
                        {formattedDate}
                    </div>
                    <div className="text-sm text-default-400">
                        {vouchers.hora_pago || "Sin asignar"}
                    </div>
                </div>
            );
        }
        return (
            <p className="font-medium capitalize text-sm text-default-500">
                {cellValue}
            </p>
        );
    }, []);

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

    const topContent = useMemo(
        () => (
            <div className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row justify-between gap-3 items-center flex-wrap">
                    <Input
                        isClearable
                        className="w-full xl:max-w-[44%] focus:outline-none "
                        placeholder="Buscar voucher..."
                        startContent={<SearchIcon />}
                        value={filterValue}
                        onClear={onClear}
                        onValueChange={onSearchChange}
                    />
                    <div className="flex gap-3 w-full sm:w-auto ml-auto justify-end">
                        <Button color="primary" onPress={handleExportVouchers}>
                            Exportar Vouchers
                        </Button>
                        <Dropdown>
                            <DropdownTrigger className="w-full sm:w-auto hidden md:flex lg:flex xl:flex">
                                <Button
                                    endContent={
                                        <ChevronDownIcon className="text-small" />
                                    }
                                    variant="flat"
                                    className="w-full sm:w-auto"
                                >
                                    Estado
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu
                                disallowEmptySelection
                                aria-label="Table Columns"
                                closeOnSelect={false}
                                selectedKeys={statusFilter}
                                selectionMode="multiple"
                                onSelectionChange={setStatusFilter}
                            >
                                {statusOptions.map((status) => (
                                    <DropdownItem
                                        key={status.uid}
                                        textValue={status.name}
                                        className="capitalize"
                                    >
                                        {capitalize(status.name)}
                                    </DropdownItem>
                                ))}
                            </DropdownMenu>
                        </Dropdown>
                        <Dropdown>
                            <DropdownTrigger className="w-full hidden md:flex lg:flex xl:flex">
                                <Button
                                    endContent={
                                        <ChevronDownIcon className="text-small" />
                                    }
                                    variant="flat"
                                    className="w-full sm:w-auto"
                                >
                                    Columnas
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu
                                disallowEmptySelection
                                aria-label="Table Columns"
                                closeOnSelect={false}
                                selectedKeys={visibleColumns}
                                selectionMode="multiple"
                                onSelectionChange={setVisibleColumns}
                            >
                                {columns.map((column) => (
                                    <DropdownItem
                                        key={column.uid}
                                        textValue={column.name}
                                        className="capitalize"
                                    >
                                        {capitalize(column.name)}
                                    </DropdownItem>
                                ))}
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                </div>
                {/* Total y filas por página */}
                <div className="flex flex-wrap justify-between items-center">
                    <span className="text-default-400 text-sm">
                        Total {vouchers.length} vouchers
                    </span>
                    <label className="flex items-center text-default-400 text-sm">
                        Filas por página
                        <select
                            className="bg-transparent text-default-400 text-sm ml-2"
                            onChange={onRowsPerPageChange}
                        >
                            {[5, 10, 15].map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                    </label>
                </div>
            </div>
        ),
        [
            filterValue,
            onSearchChange,
            statusFilter,
            visibleColumns,
            vouchers.length,
            onRowsPerPageChange,
            onClear,
        ]
    );

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
                    {/* <Button
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
                    </Button> */}
                </div>
            </div>
        ),
        [selectedKeys, filteredItems.length, page, pages]
    );

    return (
        <div>
            <Breadcrumb
                paths={[
                    {
                        name: "Cargar Vouchers Banco de la Nación",
                        href: "/cargar-vouchers",
                    },
                ]}
            />
            {/* Contenedor principal responsive */}
            <div className="flex flex-col md:flex-row gap-4 justify-around flex-md-col">
                {/* Contenedor del formulario */}
                <div className=" bg-white rounded-lg p-6 shadow-lg mt-5 max-w-lg mx-50 align-center">
                    <p className="text-lg font-semibold text-gray-700 mb-4 text-center">
                        Cargar archivo de pagos Banco de la Nación
                        <br /> (Máx. 20 archivos .txt)
                    </p>
                    <div className="flex flex-col gap-4 w-full">
                        <RenderManyFilesUpload
                            uploadType="Haz clic para subir o arrastra y suelta uno o varios archivos .txt"
                            allowedFileTypes={["text/plain"]}
                            inputId="voucher"
                            tamicono={30}
                            tamletra={15}
                            onFileUpload={handleFileUpload}
                        />
                        <Button
                            isLoading={isSaving}
                            className="bg-blue-600 text-white hover:bg-blue-700"
                            onPress={handleSave}
                        >
                            Subir Vouchers
                        </Button>
                    </div>
                </div>
            </div>

            {/* Contenedor de la tabla */}
            <div className="bg-white rounded-lg p-4 shadow-md mt-5">
                <Table
                    aria-label="Tabla vouchers"
                    layout="auto"
                    isHeaderSticky
                    isLoading={isFetching}
                    loadingContent={<NextUISpinner label="Cargando vouchers..." />}
                    bottomContent={bottomContent}
                    bottomContentPlacement="outside"
                    topContent={topContent}
                    topContentPlacement="outside"
                    classNames={{
                        wrapper: "max-h-auto overflow-auto w-full p-4", // Ajustar tamaño y eliminar márgenes
                    }}
                    selectedKeys={selectedKeys}
                    sortDescriptor={sortDescriptor}
                    onSelectionChange={setSelectedKeys}
                    onSortChange={setSortDescriptor}
                >
                    <TableHeader columns={headerColumns}>
                        {(column) => (
                            <TableColumn
                                key={column.uid}
                                align={
                                    column.uid === "nombre_completo"
                                        ? "start"
                                        : "center"
                                }
                                allowsSorting={column.sortable}
                                aria-label={column.name}
                                scope="col"
                            >
                                {column.name}
                            </TableColumn>
                        )}
                    </TableHeader>
                    <TableBody
                        items={items}
                        className="space-y-1" // Reducir espacio entre filas
                        emptyContent={isFetching ? <NextUISpinner label="Cargando vouchers..." /> : "No se encontró información sobre vouchers."}
                    >
                        {(item) => (
                            <TableRow
                                key={item.id}
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
            </div>
        </div>
    );
}
