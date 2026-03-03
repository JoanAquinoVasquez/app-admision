import React, { useRef, useState } from "react";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
} from "@heroui/react";
import Typography from "@mui/material/Typography";
import RenderFileUpload from "../../Inputs/RenderFileUpload";
import { toast } from "react-hot-toast";
import axios from "../../../axios";

const UploadNotesModal = ({ isOpen, onClose, onSuccess }) => {
    const formDataRef = useRef(new FormData());
    const [loading, setLoading] = useState(false);

    const handleFileUpload = (inputId, file) => {
        formDataRef.current.set(inputId, file);
    };

    const handleObservar = async () => {
        // Verificar si el FormData tiene un archivo
        if (!formDataRef.current.has("notas_examen")) {
            toast.error("Debe seleccionar un archivo.");
            return;
        }

        setLoading(true);
        const promise = axios.post(
            "/extraer-notas-examen",
            formDataRef.current,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        toast.promise(promise, {
            loading: "Procesando notas de examen...",
            success: (response) => {
                onSuccess();
                onClose();
                return response.data.message || "Notas procesadas con éxito.";
            },
            error: (err) =>
                err.response?.data?.message ||
                "Hubo un problema al subir el archivo."
        });

        try {
            await promise;
        } catch (error) {
            // Error managed by toast.promise
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} shouldBlockScroll={false}>
            <ModalContent>
                <ModalHeader>Subir Notas Examen Admisión</ModalHeader>
                <ModalBody>
                    <RenderFileUpload
                        uploadType="Subir Notas (Excel)"
                        allowedFileTypes={[
                            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                            "application/vnd.ms-excel",
                        ]}
                        inputId="notas_examen"
                        tamicono={24}
                        tamletra={14}
                        onFileUpload={handleFileUpload}
                    />

                    <Typography
                        variant="body2"
                        color="textSecondary"
                        sx={{ fontSize: "0.7rem" }}
                    >
                        * Suba las notas en formato Excel (.xls, .xlsx).
                        Tamaño máximo: 10MB.
                    </Typography>
                </ModalBody>
                <ModalFooter>
                    <Button
                        color="default"
                        variant="flat"
                        onPress={onClose}
                        isDisabled={loading}
                    >
                        Cancelar
                    </Button>
                    <Button
                        color="success"
                        onPress={handleObservar}
                        isLoading={loading}
                    >
                        Registrar Notas
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default UploadNotesModal;
