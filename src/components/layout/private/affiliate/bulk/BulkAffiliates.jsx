import React, { useState } from "react";
import {useNavigate} from "react-router-dom";
import * as Yup from "yup";
import { useFormik } from "formik";
import AlertComponent from "../../../../../helpers/alert/AlertComponent";
import { Box, Button, FormControl, Typography } from "@mui/material";
import { CloudUpload } from "@mui/icons-material";
import Papa from "papaparse";

//Services
import { affiliateServices } from "../../../../../helpers/services/AffiliateServices";


const validationSchema = Yup.object({
    attachment: Yup.mixed().nullable().test("fileFormat", "Solo se permiten archivos CSV", (value) => {
        return !value || value.type === "text/csv" || value.name.endsWith(".csv");
    }),
});

const initialValues = {
    attachment: null,
}
export const BulkAffiliates = () => {

    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const processCSV = (file) => {
        return new Promise((resolve, reject) => {
            Papa.parse(file, {
                header: true,
                skipEmptyLines: true,
                delimiter: ",", // puede cambiar a ";" si es necesario
                complete: (result) => resolve(result.data),
                error: (error) => reject(error),
            });
        });
    };

    const sendInBatches = async (data, batchSize = 250) => {
        console.log(data);
        for (let i = 0; i < data.length; i += batchSize) {
            const batch = data.slice(i, i + batchSize);
            await affiliateServices.bulk(batch);
        }
    };

    //
    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: async (values) => {
            try {
                setLoading(true);
                const file = values.attachment;
                const parsedData = await processCSV(file);
                await sendInBatches(parsedData);
                AlertComponent.success("Carga masiva realizada correctamente");
                navigate("/admin/affiliates-list");
                
            } catch (error) {
                AlertComponent.error("Error al procesar la solicitud");
            } finally {
                setLoading(false);
            }
        }    
    });

    return (
        <>
            <div className="container py-3">
                <div className="d-flex justify-content-end mb-2">
                    <Button variant="contained" color="primary" onClick={() => navigate("/admin/affiliates-list")}>
                        Volver al listado
                    </Button>
                </div>

                {/* Form */}
                <form onSubmit={formik.handleSubmit} className="mt-4">
                    <FormControl fullWidth className="mb-4">
                        <Typography variant="h6">Subir Archivo CSV</Typography>
                        <Box onClick={() => document.getElementById("fileInput").click()} sx={{ border: "2px dashed #ccc", p: 3, textAlign: "center", cursor: "pointer" }}>
                            <CloudUpload sx={{ fontSize: 40, color: "#777" }} />
                            <Typography variant="body2">Arrastra o haz clic para subir archivo CSV</Typography>
                        </Box>
                        <input
                            id="fileInput"
                            type="file"
                            accept=".csv"
                            style={{ display: "none" }}
                            onChange={(e) => {
                                const file = e.target.files[0];
                                if (file?.name.endsWith(".csv")) formik.setFieldValue("attachment", file);
                                else formik.setFieldError("attachment", "Solo se permiten archivos CSV.");
                            }}
                        />
                        {formik.values.attachment && (
                            <Typography mt={2} variant="body2">Archivo: {formik.values.attachment.name}</Typography>
                        )}
                        {formik.errors.attachment && (
                            <Typography color="error" variant="body2">{formik.errors.attachment}</Typography>
                        )}
                    </FormControl>

                <div className="text-end">
                    <div className="text-end">
                        <Button type="submit" variant="contained" color="primary" disabled={loading}>
                            {loading ? "Cargando..." : "Enviar"}
                        </Button>
                    </div>
                </div>
            </form>

            </div>
        </>
    )
}