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

const RenderManyFilesUpload = ({
    inputId,
    onFileUpload,
    uploadType,
    allowedFileTypes,
    tamicono,
    tamletra,
}) => {
    const [fileNames, setFileNames] = useState([]);
    const [fileUploaded, setFileUploaded] = useState(false);
    const [isDragOver, setIsDragOver] = useState(false);

    const handleFileChange = (files) => {
        if (!files.length)
            return toast.error("No se ha seleccionado ningún archivo.");

        // Limitar a máximo 20 archivos
        if (files.length > 20) {
            toast.error("Solo se permite subir hasta 20 archivos.");
            return;
        }

        const validFiles = [];
        const names = [];

        for (const file of files) {
            if (!allowedFileTypes.includes(file.type)) {
                toast.error(`Archivo no permitido: ${file.name}`);
                continue;
            }
            if (file.size > 10 * 1024 * 1024) {
                toast.error(
                    `El archivo ${file.name} excede el tamaño permitido (10MB).`
                );
                continue;
            }

            validFiles.push(file);
            names.push(file.name);
        }

        if (validFiles.length === 0) return;

        setFileNames(names);
        setFileUploaded(true);
        toast.success("Archivos cargados correctamente.");

        onFileUpload(inputId, validFiles);
    };

    const handleFileInputChange = (event) => {
        const files = Array.from(event.target.files);
        handleFileChange(files);
    };

    const handleDrop = (event) => {
        event.preventDefault();
        setIsDragOver(false);

        const files = Array.from(event.dataTransfer.files);
        handleFileChange(files);
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
        if (fileNames.some((name) => name.endsWith(".pdf")))
            return (
                <AiFillFilePdf
                    size={tamicono}
                    color="rgb(238, 87, 76)"
                    style={{ marginBottom: "5px" }}
                />
            );
        if (
            fileNames.some(
                (name) => name.endsWith(".xls") || name.endsWith(".xlsx")
            )
        )
            return (
                <AiFillFileExcel
                    size={tamicono}
                    color="rgb(67, 129, 51)"
                    style={{ marginBottom: "5px" }}
                />
            );
        if (
            fileNames.some(
                (name) =>
                    name.endsWith(".png") ||
                    name.endsWith(".jpg") ||
                    name.endsWith(".jpeg")
            )
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
                {fileUploaded ? fileNames.join(", ") : `${uploadType}`}
            </p>

            <input
                id={inputId}
                type="file"
                accept={allowedFileTypes.join(", ")}
                multiple
                style={{ display: "none" }}
                onChange={handleFileInputChange}
            />
        </div>
    );
};

RenderManyFilesUpload.propTypes = {
    inputId: propTypes.string.isRequired,
    onFileUpload: propTypes.func.isRequired,
    uploadType: propTypes.string.isRequired,
    allowedFileTypes: propTypes.arrayOf(propTypes.string).isRequired,
    tamicono: propTypes.number.isRequired,
    tamletra: propTypes.number.isRequired,
};

export default RenderManyFilesUpload;
