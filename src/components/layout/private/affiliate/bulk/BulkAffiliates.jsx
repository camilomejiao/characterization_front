import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { useFormik } from "formik";
import AlertComponent from "../../../../../helpers/alert/AlertComponent";
import { Box, Button, FormControl, Typography } from "@mui/material";
import { CloudUpload } from "@mui/icons-material";
import Papa from "papaparse";

//Services
import { affiliateServices } from "../../../../../helpers/services/AffiliateServices";

const validationSchema = Yup.object({
    attachment: Yup.mixed()
        .nullable()
        .test("fileFormat", "Solo se permiten archivos Excel (.csv)", (value) => {
            return !value || value.name.endsWith(".csv");
        }),
});

const initialValues = {
    attachment: null,
};

export const BulkAffiliates = () => {
    const navigate = useNavigate();
    const [parseErrors, setParseErrors] = useState([]);
    const [loading, setLoading] = useState(false);

    const FIELD_RULES = [
        { name: "Tipo Documento", key: "identification_type", required: true, type: "string" },
        { name: "Documento", key: "identification_number", required: true, type: "string" },
        { name: "Primer Nombre", key: "first_name", required: true, type: "string" },
        { name: "Segundo Nombre", key: "middle_name", required: false, type: "string" },
        { name: "Primer Apellido", key: "first_last_name", required: true, type: "string" },
        { name: "Segundo Apellido", key: "middle_last_name", required: false, type: "string" },
        { name: "Eps", key: "eps", required: true, type: "string" },
        { name: "Fecha de Nacimiento", key: "birthdate", required: true, type: "date" },
        { name: "Genero", key: "gender", required: true, type: "string" },
        { name: "Grupo Poblacional", key: "population_type", required: true, type: "number" },
        { name: "nivel", key: "level", required: true, type: "number" },
        { name: "Cod Depto", key: "department_code", required: true, type: "number" },
        { name: "Cod Muni", key: "municipality_code", required: true, type: "number" },
        { name: "Estado", key: "state_code", required: true, type: "string" },
        { name: "Fecha Afiliacion", key: "date_of_affiliated", required: true, type: "date" },
        { name: "Sisben", key: "sisben", required: true, type: "string" },
        { name: "Dpt Encuesta", key: "dpt_survival", required: true, type: "string" },
        { name: "Mun Encuensta", key: "mun_survival", required: true, type: "string" },
        { name: "Numero Ficha", key: "sisben_number", required: true, type: "string" },
        { name: "Area", key: "area", required: true, type: "string" },
        { name: "Barrio o Vereda", key: "neighborhood", required: true, type: "string" },
        { name: "Direccion", key: "address", required: true, type: "string" },
        { name: "Email", key: "email", required: true, type: "string" },
        { name: "Telefono", key: "phone_number", required: true, type: "string" },
        { name: "Nacionalidad", key: "country", required: true, type: "string" }
    ];

    //
    const processCSV = (file) => {
        return new Promise((resolve, reject) => {
            Papa.parse(file, {
                header: true,
                skipEmptyLines: true,
                complete: (result) => {
                    const rows = result.data;
                    const errors = [];

                    if (isEmpty(rows)) {
                        return rejectWithErrors(["El archivo está vacío o mal formado."]);
                    }

                    const headers = Object.keys(rows[0]);
                    validateHeaders(headers, errors);
                    validateRequiredFields(rows, errors);

                    if (errors.length > 0) {
                        return rejectWithErrors(errors);
                    }

                    const mapped = transformRows(rows);
                    resolve(mapped);
                },
                error: () => {
                    rejectWithErrors(["Error al leer el archivo CSV."]);
                },
            });

            function rejectWithErrors(errorList) {
                setParseErrors(errorList);
                reject(new Error("Errores en el archivo"));
            }

            function isEmpty(data) {
                return !data || data.length === 0;
            }

            function validateHeaders(headers, errorList) {
                const requiredNames = FIELD_RULES.filter(f => f.required).map(f => f.name);
                const missing = requiredNames.filter(name => !headers.includes(name));
                if (missing.length > 0) {
                    errorList.push(`Faltan columnas requeridas: ${missing.join(", ")}`);
                }
            }

            function validateRequiredFields(data, errorList) {
                data.forEach((row, index) => {
                    FIELD_RULES.forEach(({ name, required }) => {
                        const value = row[name];
                        if (required && (!value || value.toString().trim() === "")) {
                            errorList.push(`Fila ${index + 2}: Campo obligatorio "${name}" está vacío`);
                        }
                    });
                });
            }

            function transformRows(data) {
                return data.map((row) => {
                    const result = {};
                    FIELD_RULES.forEach(({ name, key, type }) => {
                        let value = row[name]?.toString().trim() ?? "";

                        if (type === "number") {
                            const num = Number(value);
                            value = isNaN(num) ? null : num;
                        }

                        if (type === "date") {
                            value = formatDateToISO(value);
                        }

                        result[key] = value;
                    });
                    return result;
                });
            }

            function formatDateToISO(dateString) {
                const [day, month, year] = dateString.split("/");
                if (day && month && year) {
                    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
                }
                return null;
            }
        });
    };

    const sendInBatches = async (data, batchSize = 250) => {
        for (let i = 0; i < data.length; i += batchSize) {
            const batch = data.slice(i, i + batchSize);
            await affiliateServices.bulk({ dataBulkDto: batch });
        }
    };

    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: async (values) => {
            try {
                setLoading(true);
                const file = values.attachment;
                const parsedData = await processCSV(file);
                console.log('parsedData: ', parsedData);
                await sendInBatches(parsedData);
                AlertComponent.success(`Carga masiva realizada correctamente (${parsedData.length} registros procesados)`);
                navigate("/admin/affiliates-list");
            } catch (error) {
                AlertComponent.error("Error al procesar la solicitud");
            } finally {
                setLoading(false);
            }
        }
    });

    return (
        <div className="container py-3">
            <div className="d-flex justify-content-end mb-2">
                <Button variant="contained" color="primary" onClick={() => navigate("/admin/affiliates-list")}>
                    Volver al listado
                </Button>
            </div>

            <form onSubmit={formik.handleSubmit} className="mt-4">
                <FormControl fullWidth className="mb-4">
                    <Typography variant="h6">Subir Archivo CSV</Typography>
                    <Box
                        onClick={() => document.getElementById("fileInput").click()}
                        sx={{ border: "2px dashed #ccc", p: 3, textAlign: "center", cursor: "pointer" }}
                    >
                        <CloudUpload sx={{ fontSize: 40, color: "#777" }} />
                        <Typography variant="body2">Arrastra o haz clic para subir archivo CSV (.csv)</Typography>
                    </Box>
                    <input
                        id="fileInput"
                        type="file"
                        accept=".csv"
                        style={{ display: "none" }}
                        onChange={(e) => {
                            const file = e.target.files[0];
                            if (file?.name.endsWith(".csv")) formik.setFieldValue("attachment", file);
                            else formik.setFieldError("attachment", "Solo se permiten archivos .csv");
                        }}
                    />

                    {formik.values.attachment && (
                        <Typography mt={2} variant="body2">Archivo: {formik.values.attachment.name}</Typography>
                    )}
                    {formik.errors.attachment && (
                        <Typography color="error" variant="body2">{formik.errors.attachment}</Typography>
                    )}
                </FormControl>

                {parseErrors.length > 0 && (
                    <Box mt={2}>
                        <Typography color="error" variant="body2">
                            Se encontraron los siguientes errores:
                        </Typography>
                        <ul>
                            {parseErrors.map((err, idx) => (
                                <li key={idx} style={{ color: "red", fontSize: "0.9rem" }}>{err}</li>
                            ))}
                        </ul>
                    </Box>
                )}

                <div className="text-end">
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={loading || parseErrors.length > 0 || !formik.values.attachment}
                    >
                        {loading ? "Cargando..." : "Enviar"}
                    </Button>
                </div>
            </form>
        </div>
    );
};
