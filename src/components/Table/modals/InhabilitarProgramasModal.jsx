import { useEffect, useMemo, useState } from 'react';
import {
    Button,
    Checkbox,
    Chip,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
} from '@heroui/react';
import Select from '../../../components/Select/Select';
import { SearchIcon } from '../components/Icons';

const PROGRAMAS_PER_PAGE = 7;

export default function InhabilitarProgramasModal({
    isOpen,
    onOpenChange,
    grados = [],
    programasHabilitados = [],
    filteredProgramasHabilitados = [],
    selectedProgramas = [],
    onTogglePrograma,
    onSubmit,
}) {
    const [gradoFilter, setGradoFilter] = useState('all');
    const [searchValue, setSearchValue] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    const filteredProgramas = useMemo(() => {
        const programas = gradoFilter === 'all'
            ? filteredProgramasHabilitados
            : programasHabilitados.filter((programa) => programa.grado_id == gradoFilter);

        if (!searchValue) return programas;

        const query = searchValue.toLowerCase();
        return programas.filter((programa) => programa.nombre.toLowerCase().includes(query));
    }, [filteredProgramasHabilitados, programasHabilitados, gradoFilter, searchValue]);

    const totalPages = Math.max(1, Math.ceil(filteredProgramas.length / PROGRAMAS_PER_PAGE));
    const currentProgramas = filteredProgramas.slice(
        (currentPage - 1) * PROGRAMAS_PER_PAGE,
        currentPage * PROGRAMAS_PER_PAGE
    );

    useEffect(() => {
        setCurrentPage(1);
    }, [searchValue]);

    return (
        <Modal
            size="2xl"
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            isDismissable={false}
            shouldBlockScroll={false}
            scrollBehavior="inside"
            backdrop="opaque"
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">
                            Inhabilitar Programas
                            <p className="text-sm text-default-500 font-normal">
                                Seleccione los programas que desea inhabilitar.{' '}
                                <span className="font-semibold text-primary">Esta acción es irreversible.</span>
                            </p>
                        </ModalHeader>
                        <ModalBody className="p-0">
                            <div className="sticky top-0 z-20 bg-white px-6 py-4 border-b border-default-100">
                                <Select
                                    label="Grado Académico"
                                    variant="flat"
                                    className="w-full h-12 text-sm"
                                    defaultItems={grados.map((item) => ({
                                        key: item.id.toString(),
                                        textValue: item.nombre,
                                        ...item,
                                    }))}
                                    selectedKey={gradoFilter !== 'all' ? gradoFilter : null}
                                    onSelectionChange={(value) => setGradoFilter(value ?? 'all')}
                                />

                                <div className="flex flex-col gap-3 mt-4">
                                    <div className="flex items-center justify-between">
                                        <p className="font-semibold text-default-700">Programas Disponibles</p>
                                        {selectedProgramas.length > 0 && (
                                            <Chip size="sm" color="primary" variant="flat">
                                                {selectedProgramas.length} seleccionado{selectedProgramas.length !== 1 ? 's' : ''}
                                            </Chip>
                                        )}
                                    </div>
                                    {gradoFilter !== 'all' && (
                                        <Input
                                            isClearable
                                            className="w-full"
                                            placeholder="Buscar programa..."
                                            startContent={<SearchIcon />}
                                            value={searchValue}
                                            onClear={() => setSearchValue('')}
                                            onValueChange={setSearchValue}
                                            size="sm"
                                        />
                                    )}
                                </div>
                            </div>

                            <div className="px-6 py-4">
                                <div className="pr-1">
                                    {gradoFilter === 'all' ? (
                                        <div className="flex flex-col items-center justify-center py-8 text-center">
                                            <svg className="w-16 h-16 text-default-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                            </svg>
                                            <p className="text-default-400 font-medium">
                                                Seleccione un grado académico para ver los programas disponibles
                                            </p>
                                        </div>
                                    ) : currentProgramas.length > 0 ? (
                                        <>
                                            <div className="space-y-2">
                                                {currentProgramas.map((programa) => (
                                                    <div
                                                        key={programa.id}
                                                        className={`p-3 rounded-lg border-2 transition-all cursor-pointer hover:shadow-md ${selectedProgramas.includes(programa.id)
                                                            ? 'border-primary bg-primary-50 shadow-sm'
                                                            : 'border-default-200 hover:border-default-300'
                                                            }`}
                                                        onClick={() => onTogglePrograma(programa.id)}
                                                    >
                                                        <div className="flex items-start gap-3">
                                                            <Checkbox
                                                                id={`programa-${programa.id}`}
                                                                name={`programa-${programa.id}`}
                                                                isSelected={selectedProgramas.includes(programa.id)}
                                                                onChange={() => onTogglePrograma(programa.id)}
                                                                color="primary"
                                                            />
                                                            <div className="flex-1">
                                                                <p className="font-medium text-default-700">{programa.nombre}</p>
                                                                <p className="text-xs text-default-500 mt-1">
                                                                    {programa.inscripciones_count} {programa.inscripciones_count === 1 ? 'inscrito' : 'inscritos'}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            {totalPages > 1 && (
                                                <div className="flex items-center justify-center mt-4 space-x-2">
                                                    <Button size="sm" isDisabled={currentPage === 1} onPress={() => setCurrentPage((page) => page - 1)}>
                                                        Anterior
                                                    </Button>
                                                    <span className="text-xs font-medium">Página {currentPage} de {totalPages}</span>
                                                    <Button size="sm" isDisabled={currentPage >= totalPages} onPress={() => setCurrentPage((page) => page + 1)}>
                                                        Siguiente
                                                    </Button>
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center py-8 text-center">
                                            <svg className="w-16 h-16 text-default-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a2 2 0 01.707.293l5.414 5.414a2 2 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                            <p className="text-default-400 font-medium">No hay programas disponibles para este grado</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </ModalBody>
                        <ModalFooter className="gap-2">
                            <Button color="default" variant="light" onPress={onClose}>Cancelar</Button>
                            <Button
                                color="primary"
                                name="inhabilitar"
                                isDisabled={!selectedProgramas.length}
                                onPress={() => onSubmit(selectedProgramas)}
                            >
                                Inhabilitar {selectedProgramas.length > 0 && `(${selectedProgramas.length})`}
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}
