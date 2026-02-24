import { useCallback } from "react";
import { Chip, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from "@heroui/react";
import { VerticalDotsIcon } from "../TableIcons";
import { statusColorMap } from "../TableConstants";

export const useInscritosRenderCell = ({
    handleExportCarnet,
    setValidarId,
    setIsValidarOpen,
    handleEditar,
    renderActions,
    renderStatus,
}) => {
    return useCallback((user, columnKey) => {
        const cellValue = user[columnKey];

        switch (columnKey) {
            case "id":
                return (
                    <div className="flex flex-col">
                        <p className="text-sm text-default-400">
                            {user.postulante_id}
                        </p>
                    </div>
                );

            case "nombre_completo":
                return (
                    <div className="flex flex-col">
                        <p className="capitalize text-sm text-default-500">
                            {cellValue}
                        </p>
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

            case "fecha_inscripcion":
                return (
                    <div className="flex flex-col">
                        <p className="font-medium capitalize text-sm text-default-500">
                            {cellValue.hora}
                        </p>
                        <p className="text-sm text-default-400">
                            {cellValue.fecha}
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
            case "ruta_dni":
                return (
                    <div className="flex flex-col">
                        {cellValue ? (
                            <a
                                href={cellValue}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 underline"
                            >
                                Abrir
                            </a>
                        ) : (
                            <span className="text-gray-400">No disponible</span>
                        )}
                    </div>
                );

            case "ruta_cv":
                return (
                    <div className="flex flex-col">
                        {cellValue ? (
                            <a
                                href={cellValue}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 underline"
                            >
                                Abrir
                            </a>
                        ) : (
                            <span className="text-gray-400">No disponible</span>
                        )}
                    </div>
                );
            case "ruta_foto":
                return (
                    <div className="flex flex-col">
                        {cellValue ? (
                            <a
                                href={`/${cellValue}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 underline"
                            >
                                Abrir
                            </a>
                        ) : (
                            <span className="text-gray-400">No disponible</span>
                        )}
                    </div>
                );
            case "voucher":
                return (
                    <div className="flex flex-col">
                        <p className="font-medium capitalize text-sm text-default-500">
                            {cellValue}
                        </p>
                    </div>
                );
            case "ruta_voucher":
                return (
                    <div className="flex flex-col">
                        {cellValue ? (
                            <a
                                href={cellValue}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 underline"
                            >
                                Abrir
                            </a>
                        ) : (
                            <span className="text-gray-400">No disponible</span>
                        )}
                    </div>
                );

            case "estado":
                if (renderStatus) {
                    return renderStatus(user);
                }
                return (
                    <Chip
                        className="capitalize"
                        color={statusColorMap[user.estado]}
                        size="sm"
                        variant="flat"
                    >
                        {user.programa_estado == 0
                            ? "Prog. No abierto"
                            : cellValue == 0
                                ? "Pendiente"
                                : cellValue == 1
                                    ? "Validado"
                                    : "Observado"}
                    </Chip>
                );

            case "actions":
                if (renderActions) {
                    return renderActions(user);
                }
                return (
                    <div className="relative flex justify-end items-center gap-2">
                        <Dropdown>
                            <DropdownTrigger>
                                <Button
                                    aria-label="Actions"
                                    isIconOnly
                                    size="sm"
                                    variant="light"
                                    data-testid="actions-button"
                                >
                                    <VerticalDotsIcon className="text-default-300" />
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu>
                                <DropdownItem
                                    textValue="Exportar Carnet"
                                    key="carnet"
                                    onPress={() => {
                                        setValidarId(user.id);
                                        handleExportCarnet(user.postulante_id);
                                    }}
                                >
                                    Exportar Carnet
                                </DropdownItem>
                                {user.estado == 0 && (
                                    <DropdownItem
                                        textValue="Validar"
                                        key="validar"
                                        onPress={() => {
                                            setValidarId(user.id);
                                            setIsValidarOpen(true);
                                        }}
                                    >
                                        Validar
                                    </DropdownItem>
                                )}
                                <DropdownItem
                                    textValue="Editar"
                                    key="edit"
                                    onPress={() => {
                                        handleEditar(user.id);
                                    }}
                                >
                                    Editar
                                </DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                );
            default:
                return cellValue;
        }
    }, [handleExportCarnet, setValidarId, setIsValidarOpen, handleEditar, renderActions, renderStatus]);
};
