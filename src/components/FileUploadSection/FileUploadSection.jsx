import React from "react";
import { Box, Typography } from "@mui/material";
import RenderFileUpload from "../../components/Inputs/RenderFileUpload";

const FileUploadSection = ({ handleFileUpload }) => {
    const fileInputs = [
        {
            uploadType: "Subir Voucher (PDF)",
            allowedFileTypes: ["application/pdf"],
            inputId: "rutaVoucher",
            required: true,
            description:
                "Suba el comprobante de pago de inscripción en formato PDF.",
        },
        {
            uploadType: "Subir Copia DNI (PDF)",
            allowedFileTypes: ["application/pdf"],
            inputId: "rutaDocIden",
            description:
                "Suba una copia legible de su DNI (ambas caras) en formato PDF.",
        },
        {
            uploadType: "Subir Curriculum Vitae (PDF)",
            allowedFileTypes: ["application/pdf"],
            inputId: "rutaCV",
            description:
                "Suba su Curriculum Vitae en formato PDF. Tamaño máximo: 10MB.",
        },
        {
            uploadType: "Subir Foto Carnet (IMG)",
            allowedFileTypes: ["image/jpeg", "image/png", "image/jpg"],
            inputId: "rutaFoto",
            description:
                "Suba una foto tipo carnet en formato JPG o PNG. Debe ser a color, con fondo blanco, sin lentes. No escaneado.",
        },
    ];

    return (
        <Box
            sx={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: 1,
                mb: 1,
            }}
        >
            <h3 className="font-bold" style={{ gridColumn: "span 2" }}>
                Subir Archivos
            </h3>

            {fileInputs.map(
                ({
                    uploadType,
                    allowedFileTypes,
                    inputId,
                    description,
                    required,
                }) => (
                    <div key={inputId}>
                        <RenderFileUpload
                            uploadType={uploadType}
                            allowedFileTypes={allowedFileTypes}
                            inputId={inputId}
                            tamicono={24}
                            tamletra={14}
                            required={required || false}
                            onFileUpload={handleFileUpload}
                        />
                        <Typography
                            variant="body2"
                            color="textSecondary"
                            sx={{ fontSize: "0.7rem" }}
                        >
                            {description}
                        </Typography>
                    </div>
                )
            )}
        </Box>
    );
};

export default FileUploadSection;
