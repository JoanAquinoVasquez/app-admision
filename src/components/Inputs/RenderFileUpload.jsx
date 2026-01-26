import { useState } from "react";
import propTypes from "prop-types";
import { toast } from "react-hot-toast";
import {
    AiOutlineUpload,
    AiFillFilePdf,
    AiFillFileExcel,
    AiOutlineFile,
    AiOutlinePicture,
} from "react-icons/ai";

const RenderFileUpload = ({
    inputId,
    onFileUpload,
    uploadType,
    allowedFileTypes,
    tamicono,
    tamletra,
}) => {
    const [fileName, setFileName] = useState("No se ha subido ningún archivo.");
    const [fileUploaded, setFileUploaded] = useState(false);
    const [isDragOver, setIsDragOver] = useState(false);

    const handleFileChange = (file) => {
        if (!file) return toast.error("No se ha seleccionado ningún archivo.");
        if (!allowedFileTypes.includes(file.type)) {
            return toast.error(
                `El archivo debe ser uno de los siguientes tipos: ${allowedFileTypes.join(
                    ", "
                )}`
            );
        }
        if (file.size > 10 * 1024 * 1024)
            return toast.error("El archivo debe ser menor de 10MB.");

        setFileName(file.name);
        setFileUploaded(true);
        toast.success("El archivo se cargo correctamente.");

        onFileUpload(inputId, file); // Esto pasa el archivo completo al manejador externo
    };

    const handleFileInputChange = (event) => {
        const file = event.target.files[0];
        handleFileChange(file);
    };

    const handleDrop = (event) => {
        event.preventDefault();
        setIsDragOver(false);

        const file = event.dataTransfer.files[0];
        handleFileChange(file);
    };

    const handleDragOver = (event) => {
        event.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = () => {
        setIsDragOver(false);
    };

    const getIcon = () => {
        if (!fileUploaded)
            return (
                <AiOutlineUpload
                    size={tamicono}
                    style={{ marginBottom: "5px" }}
                />
            );
        if (fileName.endsWith(".pdf"))
            return (
                <AiFillFilePdf
                    size={tamicono}
                    color="rgb(238, 87, 76)"
                    style={{ marginBottom: "5px" }}
                />
            );
        if (fileName.endsWith(".xls") || fileName.endsWith(".xlsx"))
            return (
                <AiFillFileExcel
                    size={tamicono}
                    color="rgb(67, 129, 51)"
                    style={{ marginBottom: "5px" }}
                />
            );
        if (
            fileName.endsWith(".png") ||
            fileName.endsWith(".jpg") ||
            fileName.endsWith(".jpeg")
        )
            return (
                <AiOutlinePicture
                    size={tamicono}
                    color="rgb(67, 129, 51)"
                    style={{ marginBottom: "5px" }}
                />
            );
        return (
            <AiOutlineFile
                size={tamicono}
                color="gray"
                style={{ marginBottom: "5px" }}
            />
        );
    };

    return (
        <div
            className={`flex-1 min-w-200 ${isDragOver ? "drag-over" : ""}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => document.getElementById(inputId).click()}
            style={{
                border: isDragOver
                    ? "2px dashed #0070f3"
                    : fileUploaded
                    ? "2px dashed #0070f3"
                    : "2px dashed #ccc",
                borderRadius: "8px",
                padding: "7px",
                alignItems: "center",
                justifyContent: "center",
                display: "flex",
                backgroundColor: isDragOver ? "#f0f8ff" : "#fff",
                cursor: "pointer",
            }}
        >
            {getIcon()}
            <p
                style={{
                    marginLeft: "10px",
                    fontSize: tamletra,
                    color: "gray",
                    fontWeight: "500",
                }}
            >
                {fileUploaded ? fileName : `${uploadType}`}
            </p>

            <input
                id={inputId}
                type="file"
                accept={allowedFileTypes.join(", ")}
                style={{ display: "none" }}
                onChange={handleFileInputChange}
            />
        </div>
    );
};

RenderFileUpload.propTypes = {
    inputId: propTypes.string.isRequired,
    onFileUpload: propTypes.func.isRequired,
    uploadType: propTypes.string.isRequired, // Ejemplo: "DNI", "Contrato", "CV"
    allowedFileTypes: propTypes.arrayOf(propTypes.string).isRequired, // Ejemplo: ["application/pdf", "application/vnd.ms-excel"]
};

export default RenderFileUpload;
