import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Link, Input } from "@heroui/react";
import { motion } from "framer-motion";
import PropTypes from "prop-types";
import { useState, useMemo } from "react";

/**
 * ProgramTable - Tabla moderna y responsive para programas de posgrado con búsqueda
 * @param {Array} programs - Array de programas con estructura: { nro, facultad, programa, planEstudio, brochure? }
 * @param {boolean} showBrochure - Mostrar columna de brochure (opcional)
 */
export default function ProgramTable({ programs, showBrochure = false }) {
    const [searchQuery, setSearchQuery] = useState("");

    // Filtrar programas basado en la búsqueda
    const filteredPrograms = useMemo(() => {
        if (!searchQuery.trim()) return programs;

        const query = searchQuery.toLowerCase();
        return programs.filter((program) => {
            return (
                program.nro.toLowerCase().includes(query) ||
                program.facultad.toLowerCase().includes(query) ||
                program.programa.toLowerCase().includes(query)
            );
        });
    }, [programs, searchQuery]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full"
        >
            {/* Contenedor Unificado */}
            <div className="overflow-hidden rounded-[2.5rem] border border-gray-200 shadow-xl shadow-gray-100/50 bg-white">

                {/* Header / Buscador integrado (Sin bordes redondeados inferiores para pegar a la tabla) */}
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between p-6 bg-gray-50/50 border-b border-gray-100">
                    <Input
                        isClearable
                        variant="flat"
                        radius="full"
                        placeholder="Buscar programa o facultad..."
                        className="w-full md:max-w-md"
                        classNames={{
                            inputWrapper: "bg-white border border-gray-200 shadow-sm group-data-[focus=true]:border-blue-400 transition-all",
                            input: "text-sm"
                        }}
                        startContent={
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-blue-500">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                            </svg>
                        }
                        value={searchQuery}
                        onValueChange={setSearchQuery}
                        onClear={() => setSearchQuery("")}
                    />

                    <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-full border border-gray-200 shadow-sm">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                            {filteredPrograms.length} resultados
                        </span>
                    </div>
                </div>

                {/* Tabla (Sin bordes adicionales para que parezca parte del mismo bloque) */}
                <Table
                    aria-label="Tabla de programas de posgrado"
                    removeWrapper
                    classNames={{
                        base: "max-h-[550px] overflow-y-auto",
                        th: "bg-gray-50/30 text-gray-500 text-[11px] font-bold py-5 first:pl-8 last:pr-8 border-b border-gray-100",
                        td: "py-5 first:pl-8 last:pr-8 group-hover:bg-blue-50/40 transition-all duration-300",
                        tr: "group border-b border-gray-50 last:border-none",
                    }}
                >
                    <TableHeader>
                        <TableColumn className="w-20">ID</TableColumn>
                        <TableColumn>FACULTAD</TableColumn>
                        <TableColumn className="min-w-[300px]">PROGRAMA ACADÉMICO</TableColumn>
                        <TableColumn className="text-center">PLAN</TableColumn>
                        {showBrochure && <TableColumn className="text-center">BROCHURE</TableColumn>}
                    </TableHeader>
                    <TableBody
                        emptyContent={
                            <div className="py-20 text-center text-gray-400 font-medium">
                                No se encontraron resultados
                            </div>
                        }
                    >
                        {filteredPrograms.map((program, index) => (
                            <TableRow key={index}>
                                <TableCell>
                                    <span className="text-xs font-bold text-gray-600">
                                        {program.nro}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-white border border-gray-200 text-gray-700 shadow-sm uppercase">
                                        {program.facultad}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <span className="font-bold text-gray-600 text-sm md:text-base leading-tight group-hover:text-blue-700 transition-colors">
                                        {program.programa}
                                    </span>
                                </TableCell>
                                <TableCell className="text-center">
                                    <Link
                                        isExternal
                                        href={program.planEstudio}
                                        className="h-9 px-4 rounded-full bg-blue-600 text-white text-xs font-bold hover:bg-blue-600 transition-all active:scale-95"
                                    >
                                        Ver Plan
                                    </Link>
                                </TableCell>
                                {showBrochure && (
                                    <TableCell className="text-center">
                                        {program.brochure ? (
                                            <Link
                                                isExternal
                                                href={program.brochure}
                                                className="h-9 w-9 inline-flex items-center justify-center rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all border border-blue-100"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                            </Link>
                                        ) : <span className="text-gray-200">—</span>}
                                    </TableCell>
                                )}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </motion.div>
    );
}

ProgramTable.propTypes = {
    programs: PropTypes.arrayOf(
        PropTypes.shape({
            nro: PropTypes.string.isRequired,
            facultad: PropTypes.string.isRequired,
            programa: PropTypes.string.isRequired,
            planEstudio: PropTypes.string.isRequired,
            brochure: PropTypes.string,
        })
    ).isRequired,
    showBrochure: PropTypes.bool,
};
