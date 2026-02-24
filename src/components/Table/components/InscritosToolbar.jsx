import React from "react";
import {
    Input,
    Button,
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
} from "@heroui/react";
import Select from "../../Select/Select";
import { SearchIcon, ChevronDownIcon, PlusIcon } from "./Icons";
import { capitalize, statusOptions } from "../utils";

export default function InscritosToolbar({
    filterValue,
    onClear,
    onSearchChange,
    statusFilter,
    setStatusFilter,
    visibleColumns,
    setVisibleColumns,
    columns,
    grados,
    gradoFilter,
    setGradoFilter,
    setProgramaFilter,
    filteredProgramas,
    programaFilter,
    handleExportMultiple,
    filteredItemsLength,
    simpleExport = false,
    exportLabel = "Exportar",
    onExport,
    customStatusOptions,
    isExporting = false,
}) {
    // ... (rest of the file until the export button) ...

    return (
        <div className="flex flex-col gap-2 mb-4">
            {/* ... Fila 1 ... */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 w-full">
                {/* ... Input Search ... */}
                <div className="col-span-1 md:col-span-4">
                    <Input
                        isClearable
                        className="w-full h-12 focus:outline-none"
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

                {/* ... Dropdowns Estado/Columnas ... */}
                <div className="col-span-1 md:col-span-1 flex flex-col sm:flex-row gap-2 justify-end w-full">
                    <Dropdown>
                        <DropdownTrigger className="w-full sm:w-auto">
                            <Button
                                aria-label="estado"
                                endContent={<ChevronDownIcon className="text-small" />}
                                variant="flat"
                                className="h-12 w-full sm:w-auto"
                            >
                                Estado
                            </Button>
                        </DropdownTrigger>
                        <DropdownMenu
                            disallowEmptySelection
                            closeOnSelect={false}
                            selectedKeys={statusFilter}
                            selectionMode="multiple"
                            onSelectionChange={setStatusFilter}
                        >
                            {(customStatusOptions || statusOptions).map((status) => (
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
                        <DropdownTrigger className="w-full sm:w-auto">
                            <Button
                                aria-label="columnas"
                                endContent={<ChevronDownIcon className="text-small" />}
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

            {/* 📋 Fila 2: Filtros Avanzados y Exportación */}
            <div className="w-full flex flex-col md:flex-row md:items-end gap-4">
                {/* 🎓 Select Grado Académico */}
                <div className="w-full md:w-1/4">
                    <Select
                        label="Grado Académico"
                        variant="flat"
                        className="w-full h-12 text-sm"
                        defaultItems={grados.map((item) => ({
                            key: item.id,
                            textValue: item.nombre,
                            ...item,
                        }))}
                        selectedKey={gradoFilter !== "all" ? gradoFilter : null}
                        onSelectionChange={(grado_id) => {
                            if (grado_id === null) {
                                setGradoFilter("all");
                                setProgramaFilter("all");
                            } else {
                                setGradoFilter(grado_id);
                                setProgramaFilter("all");
                            }
                        }}
                    />
                </div>

                {/* 🏫 Select Programa */}
                <div className="w-full md:flex-1/4">
                    <Select
                        label="Programa"
                        className="w-full h-12 text-sm"
                        disabled={gradoFilter === "all"}
                        defaultItems={filteredProgramas.map((item) => ({
                            key: item.id,
                            textValue: item.nombre,
                            ...item,
                        }))}
                        selectedKey={programaFilter !== "all" ? programaFilter : null}
                        onSelectionChange={(programa_id) => {
                            if (programa_id === null) {
                                setProgramaFilter("all");
                            } else {
                                setProgramaFilter(programa_id);
                            }
                        }}
                    />
                </div>
                <div className="w-full md:w-auto md:ml-auto">
                    {simpleExport ? (
                        <Button
                            color="primary"
                            onPress={onExport}
                            endContent={!isExporting && <PlusIcon />}
                            className="h-12 w-full md:w-auto"
                            isLoading={isExporting}
                        >
                            {exportLabel}
                        </Button>
                    ) : (
                        <Dropdown>
                            <DropdownTrigger asChild>
                                <Button
                                    aria-label="exportar reportes"
                                    endContent={
                                        <ChevronDownIcon className="text-small" />
                                    }
                                    color="primary"
                                    className="h-12 w-full md:w-auto"
                                    isLoading={isExporting}
                                >
                                    Exportar Reportes
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu>
                                <DropdownItem
                                    textValue="reporte_general_excel"
                                    key={"reporte_general_excel"}
                                    onPress={() => handleExportMultiple("Excel", gradoFilter, programaFilter)}
                                >
                                    Reporte General en Excel
                                </DropdownItem>
                                <DropdownItem
                                    textValue="reporte_diario_excel"
                                    key={"reporte_diario_excel"}
                                    onPress={() => handleExportMultiple("Reporte Diario")}
                                >
                                    Reporte Diario en Excel
                                </DropdownItem>
                                <DropdownItem
                                    textValue="reporte_diario_facultad_excel"
                                    key={"reporte_diario_facultad_excel"}
                                    onPress={() => handleExportMultiple("Facultad Excel")}
                                >
                                    Reporte Diario por Facultad en Excel
                                </DropdownItem>
                                <DropdownItem
                                    textValue="reporte_diario_facultad_pdf"
                                    key={"reporte_diario_facultad_pdf"}
                                    onPress={() => handleExportMultiple("Facultad PDF")}
                                >
                                    Reporte por Facultad en PDF
                                </DropdownItem>
                                <DropdownItem
                                    textValue="top_programas"
                                    key={"top_programas"}
                                    onPress={() => handleExportMultiple("Top Programas")}
                                >
                                    Reporte Top Programas
                                </DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    )}
                </div>
            </div>

        </div>
    );
}
