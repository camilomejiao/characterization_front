import React, {useEffect, useMemo, useState} from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { useFormik } from "formik";
import AlertComponent from "../../../../../helpers/alert/AlertComponent";
import {
    Box,
    Button,
    FormControl,
    Typography,
    MenuItem,
    Stack,
    Chip, TextField,
} from "@mui/material";
import { CloudUpload } from "@mui/icons-material";
import Papa from "papaparse";

// Services
import { affiliateServices } from "../../../../../helpers/services/AffiliateServices";
import { commonServices } from "../../../../../helpers/services/CommonServices";
import {RegimenEnum, ResponseStatusEnum} from "../../../../../helpers/GlobalEnum";
import useAuth from "../../../../../hooks/useAuth";

// TODO: trae estos datos de tu contexto de auth
const getCurrentUser = () => ({
    id: 4,            // system_user ID
    organizationId: 2 // organization ID
});

// Prefijo permitido: MS202510 | MSCM202510 | MC202510 | MCCM202510
const FILE_NAME_RE = /^(MS(CM)?|MC(CM)?)\d{6}$/;

const validationSchema = Yup.object({
    regime: Yup.string().required("El Regimen es obligatorio"),
    attachment: Yup.mixed()
        .nullable()
        .test("fileFormat", "Solo se permiten archivos CSV (.csv)", (value) => !value || value.name.toLowerCase().endsWith(".csv"))
        .test("fileName", "Nombre inválido: MS/MC + AAAAMM (ej: MS202510)", (value) => {
            if (!value) return true;
            const base = value.name.replace(/\.[^/.]+$/, "");
            return FILE_NAME_RE.test(base);
        })
        .required("Archivo requerido"),
});

const initialValues = {
    regime: "",
    attachment: null,
};

//Columnas requeridas por régimen
const REQUIRED_S = [
    "TIPO_DOCUMENTO","IDENTIFICACION","FECHA_NACIMIENTO"
];

const REQUIRED_C = [
    "TIPO_DOCUMENTO","IDENTIFICACION","FECHA_NACIMIENTO"
];

//Columnas opcionales
const OPTIONAL_COMMON = [
    "PRIMER_NOMBRE","SEGUNDO_NOMBRE","PRIMER_APELLIDO",
    "SEGUNDO_APELLIDO","SEXO","PAIS","EPS","TIPO_POBLACION","NIVEL_SISBEN",
    "CODIGO_DPTO","CODIGO_MUN","ESTADO","FECHA AFILIACION","LMA",
    "GRUPO", "SUBGRUPO","NUMERO_FICHA_SISBEN","ZONA","BARRIO","DIRECCION",
    "EMAIL","TELEFONO"
];

//Helpers
const normalizeHeader = (s) =>
    (s || "")
        .toString()
        .trim()
        .toUpperCase()
        .replace(/\s+/g, " ")
        .replace(/\t+/g, " ");

const isEmptyValue = (v) =>
    v === undefined || v === null || String(v).trim() === "";

const hasAnyRequiredValue = (row, requiredCols) =>
    requiredCols.some((col) => !isEmptyValue(row[col]));

// dd/mm/yyyy o dd-mm-yyyy  ->  yyyy-mm-dd
const toISO = (ddmmyyyy) => {
    if (!ddmmyyyy) return undefined;
    const raw = ddmmyyyy.toString().trim();
    const parts = raw.includes("/") ? raw.split("/") : raw.split("-");
    if (parts.length !== 3) return undefined;
    const [d, m, y] = parts;
    if (!y || !m || !d) return undefined;

    // validaciones básicas de rango
    const dd = Number(d);
    const mm = Number(m);
    const yyyy = Number(y.length === 2 ? `20${y}` : y);
    if (!Number.isInteger(dd) || dd < 1 || dd > 31) return undefined;
    if (!Number.isInteger(mm) || mm < 1 || mm > 12) return undefined;
    if (!Number.isInteger(yyyy) || yyyy < 1900) return undefined;

    return `${String(yyyy).padStart(4, "0")}-${String(mm).padStart(2, "0")}-${String(dd).padStart(2, "0")}`;
};

const toNum = (s) => {
    if (s === undefined || s === null) return undefined;
    const txt = String(s).trim();
    if (txt === "") return undefined;
    if (!/^\d+$/.test(txt)) return undefined; // solo dígitos
    const n = Number(txt);
    return Number.isFinite(n) ? n : undefined;
};

// proyecta solo columnas permitidas (ignora basura a la derecha)
const projectKnownColumns = (row, allowedSet) => {
    const out = {};
    for (const k in row) {
        if (allowedSet.has(k)) out[k] = row[k];
    }
    return out;
};

// MS/MC desde lista de regímenes (por nombre)
const getRegimeFilePrefix = (regimens, selectedId) => {
    const item = regimens.find((r) => r.id === selectedId);
    if (!item) return null;
    const name = (item.name || "").toUpperCase();
    if (name.startsWith("SUB")) return "MS";
    if (name.startsWith("CON")) return "MC";
    return null;
};

//GRUPO + SUBGRUPO (si subgrupo = 1 dígito, le agrega 0 delante)
const buildGroupSubgroup = (val) => {
    const g = (val("GRUPO") || "").trim();
    const sRaw = (val("SUBGRUPO") || "").trim();
    if (!g && !sRaw) return undefined;
    if (!g && sRaw) return undefined;  //si solo llega subgrupo, lo ignoramos (ajusta si quieres)
    const s = sRaw.length === 1 ? `0${sRaw}` : sRaw;
    return `${g}${s}`;
};


export const BulkAffiliates = () => {

    const { auth } = useAuth() //Reforzar el auth

    const navigate = useNavigate();
    const [regimens, setRegimens] = useState([]);
    const [parseErrors, setParseErrors] = useState([]);
    const [loading, setLoading] = useState(false);

    //
    const user = useMemo(getCurrentUser, []);

    //
    const getRemigens = async () => {
        try {
            setLoading(true);
            const {data, status} =  await commonServices.getRegimen();
            if(status === ResponseStatusEnum.OK) {
                setRegimens(data);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    // Devuelve lista de errores para una fila (con número de línea ya calculado)
    const validateRow = (rowKnown, required, rowNumber) => {
        const errors = [];

        // 1) obligatorios presentes
        required.forEach((col) => {
            if (isEmptyValue(rowKnown[col])) {
                errors.push(`Fila ${rowNumber}: Campo obligatorio "${col}" vacío`);
            }
        });

        // TIPO_DOCUMENTO: debe ser string alfabético (no números)
        if (!isEmptyValue(rowKnown["TIPO_DOCUMENTO"])) {
            const td = String(rowKnown["TIPO_DOCUMENTO"]).trim();
            if (/^\d+$/.test(td)) {
                errors.push(`Fila ${rowNumber}: TIPO_DOCUMENTO no debe ser numérico (usa códigos como CC, TI, CE, PA).`);
            } else if (!/^[A-Za-z]{1,5}$/.test(td)) {
                errors.push(`Fila ${rowNumber}: TIPO_DOCUMENTO con formato inválido (solo letras, 2 caracteres).`);
            }
        }

        //Sexo
        if (!isEmptyValue(rowKnown["SEXO"])) {
            const td = String(rowKnown["SEXO"]).trim();
            if (/^\d+$/.test(td)) {
                errors.push(`Fila ${rowNumber}: SEXO no debe ser numérico (usa códigos como F, M).`);
            } else if (!/^[A-Za-z]{1,5}$/.test(td)) {
                errors.push(`Fila ${rowNumber}: SEXO con formato inválido (solo una letra, 1 caracteres).`);
            }
        }

        if (!isEmptyValue(rowKnown["ESTADO"])) {
            const td = String(rowKnown["ESTADO"]).trim();
            if (/^\d+$/.test(td)) {
                errors.push(`Fila ${rowNumber}: ESTADO no debe ser numérico (usa códigos como AC, AF,RE).`);
            } else if (!/^[A-Za-z]{1,5}$/.test(td)) {
                errors.push(`Fila ${rowNumber}: ESTADO con formato inválido (solo una letra, 2 caracteres).`);
            }
        }

        // IDENTIFICACION: solo numeros
        if (!isEmptyValue(rowKnown["IDENTIFICACION"])) {
            const idTxt = String(rowKnown["IDENTIFICACION"]).trim();
            if (!/^\d+$/.test(idTxt)) {
                errors.push(`Fila ${rowNumber}: IDENTIFICACION debe contener solo dígitos`);
            } else if (idTxt.length < 5 || idTxt.length > 20) {
                errors.push(`Fila ${rowNumber}: IDENTIFICACION con longitud inválida (5-20)`);
            }
        }

        // FECHA_NACIMIENTO válida (toISO ≠ undefined)
        if (!isEmptyValue(rowKnown["FECHA_NACIMIENTO"])) {
            const iso = toISO(rowKnown["FECHA_NACIMIENTO"]);
            if (!iso) errors.push(`Fila ${rowNumber}: FECHA_NACIMIENTO con formato inválido (esperado dd/mm/yyyy)`);
        }

        // LMA si viene, debe ser numérico
        if (!isEmptyValue(rowKnown["LMA"])) {
            const lmaTxt = String(rowKnown["LMA"]).trim();
            if (!/^\d+$/.test(lmaTxt)) {
                errors.push(`Fila ${rowNumber}: LMA debe ser numérico`);
            }
        }

        return errors;
    };

    // Mapea una fila CSV → DTO del backend (usa las nuevas columnas)
    const mapRowToDto = (row) => {
        const val = (k) => (row[k] != null ? String(row[k]).trim() : "");

        return {
            // comunes
            identificationType: val("TIPO_DOCUMENTO"),
            identificationNumber: toNum(val("IDENTIFICACION")),
            birthdate: toISO(val("FECHA_NACIMIENTO")),
            firstName: val("PRIMER_NOMBRE") || undefined,
            middleName: val("SEGUNDO_NOMBRE") || undefined,
            firstLastName: val("PRIMER_APELLIDO") || undefined,
            middleLastName: val("SEGUNDO_APELLIDO") || undefined,
            sex: val("SEXO") || undefined,
            countryCod: val("PAIS") || undefined,
            departmentCod: toNum(val("CODIGO_DPTO")) || undefined,
            municipalityCod: toNum(val("CODIGO_MUN")) || undefined,
            area: val("ZONA") || undefined,
            neighborhood: val("BARRIO O VEREDA") || undefined,
            address: val("DIRECCION") || undefined,
            email: val("EMAIL") || undefined,
            phoneNumber: val("TELEFONO") || undefined,

            // affiliate
            eps: val("EPS") || undefined,
            populationTypeId: toNum(val("TIPO_POBLACION")) || undefined,
            level: val("NIVEL_SISBEN") || undefined,
            state: val("ESTADO") || undefined,
            dateOfAffiliated: toISO(val("FECHA AFILIACION")) || undefined,
            groupSubgroup: buildGroupSubgroup(val),
            sisbenNumber: val("NUMERO_FICHA_SISBEN") || undefined,

            // LMA
            valorLMA: toNum(val("LMA")) || undefined,
        };
    };

    const processCSV = (file, regime) => {
        const REQUIRED = regime === RegimenEnum.SUB ? REQUIRED_S : REQUIRED_C;
        const ALLOWED = new Set([...REQUIRED, ...OPTIONAL_COMMON]);

        return new Promise((resolve, reject) => {
            const buffer = [];
            const errors = [];

            let headersChecked = false;
            let headers = [];
            let rowNumber = 1; // header

            Papa.parse(file, {
                header: true,
                worker: false,
                fastMode: true,
                skipEmptyLines: "greedy",
                delimiter: ";",
                transformHeader: normalizeHeader,
                step: (results, parser) => {
                    try {
                        rowNumber += 1;
                        const rowRaw = results.data;

                        if (!headersChecked) {
                            headers = (results.meta.fields || []).map(normalizeHeader).filter(Boolean);
                            const missing = REQUIRED.filter((k) => !headers.includes(k));
                            if (missing.length) {
                                errors.push(`Faltan columnas requeridas: ${missing.join(", ")}`);
                                parser.abort();
                                return;
                            }
                            headersChecked = true;
                        }

                        const rowKnown = projectKnownColumns(rowRaw, ALLOWED);

                        // si no trae NINGÚN requerido con valor, omitimos
                        if (!hasAnyRequiredValue(rowKnown, REQUIRED)) return;

                        // valida fila
                        const rowErrs = validateRow(rowKnown, REQUIRED, rowNumber);
                        if (rowErrs.length) {
                            errors.push(...rowErrs);
                            return; // no agregamos esta fila
                        }

                        buffer.push(mapRowToDto(rowKnown));
                    } catch {
                        errors.push(`Fila ${rowNumber}: error al procesar la fila`);
                        parser.abort();
                    }
                },
                complete: () => {
                    if (errors.length) {
                        // 👉 ahora sí guardamos en el estado para mostrar en pantalla y bloquear el submit
                        setParseErrors(errors);
                        return reject(new Error(errors.join("\n")));
                    }
                    setParseErrors([]); // limpio errores
                    resolve(buffer);
                },
                error: () => {
                    const msg = "Error al leer el CSV.";
                    setParseErrors([msg]);
                    reject(new Error(msg));
                },
            });
        });
    };

    // Nombre base (sin extensión) y periodo AAAAMM
    const getFileBaseAndPeriod = (file) => {
        const base = file.name.replace(/\.[^/.]+$/, "");
        const period = base.slice(-6);
        return { base, period };
    };

    // Envío en lotes al backend
    const sendInBatches = async (rows, meta, batchSize = 250) => {
        for (let i = 0; i < rows.length; i += batchSize) {
            const batch = rows.slice(i, i + batchSize);
            const payload = { ...meta, rows: batch };
            await affiliateServices.bulk(payload);
            // si tu backend devuelve summary por batch, acumúlalo aquí
        }
    };

    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: async (values) => {
            console.log(values);
            try {
                setLoading(true);
                if (!values.attachment) return;

                //Nombre de archivo y período (AAAAMM)
                const { base: fileName, period } = getFileBaseAndPeriod(values.attachment);
                const expectedPrefix = getRegimeFilePrefix(regimens, values.regime); // e.g. "MS" o "MC"
                if (!expectedPrefix) {
                    AlertComponent.warning("No se pudo identificar el prefijo del régimen seleccionado.");
                    setLoading(false);
                    return;
                }
                if (!fileName.toUpperCase().startsWith(expectedPrefix)) {
                    AlertComponent.warning(`El régimen no coincide con el nombre del archivo (${expectedPrefix} + AAAAMM).`);
                    setLoading(false);
                    return;
                }

                const parsedRows = await processCSV(values.attachment, expectedPrefix === "MS" ? RegimenEnum.SUB : RegimenEnum.CONT);
                if (!parsedRows.length) {
                    AlertComponent.warning("No hay filas válidas para procesar.");
                    setLoading(false);
                    return;
                }

                //payload para el backend
                const meta = {
                    organizationId: user.organizationId,
                    userId: user.id,
                    fileName,
                    regime: values.regime,
                    period,
                };

                await sendInBatches(parsedRows, meta, 500);

                AlertComponent.success(`Carga masiva realizada correctamente (${parsedRows.length} registros enviados)`);
                navigate("/admin/affiliates-list");
            } catch (error) {
                console.error(error);
                const lines = String(error?.message || "Error al procesar la solicitud").split("\n");
                setParseErrors(lines);
                AlertComponent.error(`Se encontraron ${lines.length} error(es) en el archivo. Revisa el detalle debajo.`);
            } finally {
                setLoading(false);
            }
        },
    });

    useEffect(() => {
        getRemigens();
    }, []);

    return (
        <div className="container py-3">
            <div className="d-flex justify-content-end mb-2">
                <Button variant="contained" color="primary" onClick={() => navigate("/admin/affiliates-list")}>
                    Volver al listado
                </Button>
            </div>

            {loading && (
                <div className="overlay">
                    <div className="loader">Analizando archivo…</div>
                </div>
            )}

            <form onSubmit={formik.handleSubmit} className="user-form mt-4">
                <div className="row g-3">
                    <div className="col-md-12 mb-4">
                        <TextField select
                                   fullWidth
                                   label="Tipo de Regimen" {...formik.getFieldProps("regime")}
                                   error={formik.touched.regime && Boolean(formik.errors.regime)}
                                   helperText={formik.touched.regime && formik.errors.regime}>
                            {regimens.map((item) => (
                                <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
                            ))}
                        </TextField>
                    </div>

                    <div className="col-md-12 mb-4">
                        <FormControl fullWidth>
                            <Typography variant="h6">Subir Archivo CSV</Typography>
                            <Box
                                onClick={() => document.getElementById("fileInput")?.click()}
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
                                    const file = e.target.files?.[0];
                                    if (!file) return;
                                    if (file.name.toLowerCase().endsWith(".csv")) {
                                        formik.setFieldValue("attachment", file);
                                        formik.setFieldTouched("attachment", true, true);
                                    } else {
                                        formik.setFieldError("attachment", "Solo se permiten archivos .csv");
                                    }
                                }}
                            />

                            {formik.values.attachment && (
                                <Stack mt={2} direction="row" spacing={1} alignItems="center">
                                    <Typography variant="body2">Archivo:</Typography>
                                    <Chip size="small" label={formik.values.attachment.name} />
                                </Stack>
                            )}
                            {formik.touched.attachment && formik.errors.attachment && (
                                <Typography color="error" variant="body2">{formik.errors.attachment}</Typography>
                            )}
                        </FormControl>
                    </div>
                </div>


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

                <div className="text-end" style={{ marginTop: 16 }}>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={loading || parseErrors.length > 0 || !formik.values.attachment || !formik.values.regime}
                    >
                        {loading ? "Cargando..." : "Enviar"}
                    </Button>
                </div>
            </form>
        </div>
    );
};
