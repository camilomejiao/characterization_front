import React, {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { useFormik } from "formik";
import AlertComponent from "../../../helpers/alert/AlertComponent";
import {
    Box,
    Button,
    FormControl,
    Typography,
    MenuItem,
    Stack,
    Chip, TextField,
    Grid,
} from "@mui/material";
import { CloudUpload } from "@mui/icons-material";
import Papa from "papaparse";

// Services
import { affiliateServices } from "../../../services/AffiliateServices";
import { commonServices } from "../../../services/CommonServices";
import { RegimenEnum, ResponseStatusEnum } from "../../../helpers/GlobalEnum";
import useAuth from "../../../hooks/useAuth";

// Prefijo permitido: MS202510 | MSCM202510 | MC202510 | MCCM202510
const FILE_NAME_RE = /^(MS(CM)?|MS(LMA)?|MC(CM)?)\d{6}$/;

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
    "TIPO_DOCUMENTO","IDENTIFICACION"
];

const REQUIRED_C = [
    "TIPO_DOCUMENTO","IDENTIFICACION"
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
const normalizeHeader = (value) =>
    (value || "")
        .toString()
        .trim()
        .toUpperCase()
        .replace(/\s+/g, " ")
        .replace(/\t+/g, " ");

const isEmptyValue = (value) =>
    value === undefined || value === null || String(value).trim() === "";

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

//
const toNum = (value) => {
    if (value === undefined || value === null) return undefined;
    const txt = String(value).trim();
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
    const group = (val("GRUPO") || "").trim();
    const subgroup = (val("SUBGRUPO") || "").trim();
    if (!group && !subgroup) return undefined;
    if (!group && subgroup) return undefined;  //si solo llega subgrupo, lo ignoramos (ajusta si quieres)
    const sub = subgroup.length === 1 ? `0${subgroup}` : subgroup;
    return `${group}${sub}`;
};

//Depto + Muni ()
const buildMuni = (val) => {
    const depto = (val("CODIGO_DPTO") || "").trim();
    const muni = (val("CODIGO_MUN") || "").trim();
    return `${depto}${muni}`;
}

//
const buildLevel = (val) => {
    const level = (val("NIVEL_SISBEN") || "").trim();
    return level === "N" ? 4 : Number(level);
}

//
const toDecimal = (value) => {
    if (value === undefined || value === null) return undefined;
    const txt = String(value).trim();
    if (!txt) return undefined;

    const normalized = txt.replace(",", ".");

    if (!/^\d+(\.\d+)?$/.test(normalized)) return undefined;

    const n = Number(normalized);
    return Number.isFinite(n) ? n : undefined;
};

//
const ALLOWED_POPULATION_IDS = [
    1, 2, 4, 5, 6, 8, 9, 10, 11,
    12, 13, 14, 15, 16, 17, 22,
    23, 24, 25, 27, 28, 29, 30,
    31, 32, 33, 34, 35
];

//
const IDENTIFICATION_TYPE = [
    'AS', 'CC', 'CD', 'CE', 'CN',
    'PA', 'PE', 'RC', 'SC', 'TI', 'PT'
];

//
const AREA_TYPE = [
    'U', 'R', 'RD', 'CP', 'CM',
];

//
const STATUS_TYPE = [
    'AF', 'AC', 'RE', 'PL', 'SM'
];

//
const EPS = [
    'CCF018', 'EPS002', 'EPS005', 'EPS008', 'EPS010', 'EPS017',
    'EPS022', 'EPS037', 'EPS041', 'EPS091', 'EPSM03', 'EPSS33',
    'EPSS37', 'EPSS44',
];

export const BulkAffiliates = () => {

    const { auth } = useAuth();

    const navigate = useNavigate();
    const [regimens, setRegimens] = useState([]);
    const [parseErrors, setParseErrors] = useState([]);
    const [loading, setLoading] = useState(false);

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
            }

            if (!/^[A-Za-z]{1,5}$/.test(td)) {
                errors.push(`Fila ${rowNumber}: TIPO_DOCUMENTO con formato inválido (solo letras, 2 caracteres).`);
            }

            if (!IDENTIFICATION_TYPE.includes(td)) {
                errors.push(
                    `Fila ${rowNumber}: TIPO_DOCUMENTO (${td}) no es válido. Códigos permitidos: ${IDENTIFICATION_TYPE.join(", ")}`
                );
            }
        }

        //SEXO
        if (!isEmptyValue(rowKnown["SEXO"])) {
            const td = String(rowKnown["SEXO"]).trim();
            if (/^\d+$/.test(td)) {
                errors.push(`Fila ${rowNumber}: SEXO no debe ser numérico (usa códigos como F, M).`);
            } else if (!/^[A-Za-z]{1,5}$/.test(td)) {
                errors.push(`Fila ${rowNumber}: SEXO con formato inválido (solo una letra, 1 caracteres).`);
            }
        }

        //ESTADO
        if (!isEmptyValue(rowKnown["ESTADO"])) {
            const td = String(rowKnown["ESTADO"]).trim();
            if (/^\d+$/.test(td)) {
                errors.push(`Fila ${rowNumber}: ESTADO no debe ser numérico (usa códigos como AC, AF,RE).`);
            }

            if (!/^[A-Za-z]{1,5}$/.test(td)) {
                errors.push(`Fila ${rowNumber}: ESTADO con formato inválido (solo una letra, 2 caracteres).`);
            }

            if (!STATUS_TYPE.includes(td)) {
                errors.push(
                    `Fila ${rowNumber}: ESTADO (${td}) no es válido. Códigos permitidos: ${STATUS_TYPE.join(", ")}`
                );
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

        // LMA si viene, debe ser numérico (entero o decimal)
        if (!isEmptyValue(rowKnown["LMA"])) {
            let lmaTxt = String(rowKnown["LMA"]).trim();

            lmaTxt = lmaTxt.replace(",", ".");

            if (!/^\d+(\.\d+)?$/.test(lmaTxt)) {
                errors.push(`Fila ${rowNumber}: LMA debe ser numérico (entero o decimal, ej: 70746.9)`);
            }
        }

        // TIPO_POBLACION: numérico y dentro de los IDs permitidos
        if (!isEmptyValue(rowKnown["TIPO_POBLACION"])) {
            const txt = String(rowKnown["TIPO_POBLACION"]).trim();

            if (!/^\d+$/.test(txt)) {
                errors.push(`Fila ${rowNumber}: TIPO_POBLACION debe ser numérico`);
            } else {
                const n = Number(txt);

                if (!ALLOWED_POPULATION_IDS.includes(n)) {
                    errors.push(
                        `Fila ${rowNumber}: TIPO_POBLACION (${n}) no es válido. IDs permitidos: ${ALLOWED_POPULATION_IDS.join(", ")}`
                    );
                }
            }
        }

        //ZONA
        if (!isEmptyValue(rowKnown["ZONA"])) {
            const td = String(rowKnown["ZONA"]).trim();
            if (/^\d+$/.test(td)) {
                errors.push(`Fila ${rowNumber}: ZONA no debe ser numérico. Códigos permitidos: ${AREA_TYPE.join(", ")}`);
            }

            if (!/^[A-Za-z]{1,5}$/.test(td)) {
                errors.push(`Fila ${rowNumber}: ZONA con formato inválido (solo una letra, 1 caracteres).`);
            }

            if (!AREA_TYPE.includes(td)) {
                errors.push(
                    `Fila ${rowNumber}: ZONA (${td}) no es válido. Códigos permitidos: ${AREA_TYPE.join(", ")}`
                );
            }
        }

        //EPS
        if (!isEmptyValue(rowKnown["EPS"])) {
            const epsTxt = String(rowKnown["EPS"]).trim().toUpperCase();

            // 1) formato: alfanumérico 1 a 6
            if (!/^[A-Z0-9]{1,6}$/.test(epsTxt)) {
                errors.push(`Fila ${rowNumber}: EPS con formato inválido (solo letras y números, máximo 6). Ej: EPS002`);
            }

            // 2) catálogo permitido
            if (!EPS.includes(epsTxt)) {
                errors.push(
                    `Fila ${rowNumber}: EPS (${epsTxt}) no es válido. Códigos permitidos: ${EPS.join(", ")}`
                );
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
            municipalityCod: buildMuni(val) || undefined,
            area: val("ZONA") || undefined,
            neighborhood: val("BARRIO O VEREDA") || undefined,
            address: val("DIRECCION") || undefined,
            email: val("EMAIL") || undefined,
            phoneNumber: val("TELEFONO") || undefined,

            // affiliate
            eps: val("EPS") || undefined,
            populationTypeId: toNum(val("TIPO_POBLACION")) || undefined,
            level: buildLevel(val),
            state: val("ESTADO") || undefined,
            dateOfAffiliated: toISO(val("FECHA AFILIACION")) || undefined,
            groupSubgroup: buildGroupSubgroup(val),
            sisbenNumber: val("NUMERO_FICHA_SISBEN") || undefined,

            // LMA
            valorLMA: toDecimal(val("LMA")) ?? undefined,
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
                            return;
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
        let hasErrors = false;
        let totalSent = 0;
        const errorMessages = [];

        for (let i = 0; i < rows.length; i += batchSize) {
            const batch = rows.slice(i, i + batchSize);
            const payload = { ...meta, rows: batch };

            try {
                const { data } = await affiliateServices.bulk(payload);


                if (Array.isArray(data?.errors) && data.errors.length) {
                    hasErrors = true;
                    data.errors.forEach((err) => {
                        errorMessages.push(formatValidationError(err));
                    });
                    break;
                }

                totalSent += batch.length;
            } catch (error) {
                hasErrors = true;

                const apiErrors = error?.response?.data?.errors;
                if (Array.isArray(apiErrors) && apiErrors.length) {
                    apiErrors.forEach((err) => {
                        errorMessages.push(formatValidationError(err));
                    });
                } else {
                    errorMessages.push(
                        error?.message || "Error inesperado al enviar los registros."
                    );
                }

                break;
            }
        }

        return { hasErrors, totalSent, errorMessages };
    };


    //
    const getAllowedPeriods = () => {
        const today = new Date();
        const currentYear = today.getFullYear();
        const currentMonth = today.getMonth() + 1;

        const currentPeriod = String(currentYear) + String(currentMonth).padStart(2, "0");

        let prevYear = currentYear;
        let prevMonth = currentMonth - 1;
        if (prevMonth === 0) {
            prevMonth = 12;
            prevYear = currentYear - 1;
        }
        const prevPeriod = String(prevYear) + String(prevMonth).padStart(2, "0");

        return { currentPeriod, prevPeriod };
    };

    //
    const isPeriodInAllowedWindow = (period) => {
        if (!/^\d{6}$/.test(period)) return false;
        const { prevPeriod } = getAllowedPeriods();
        return period === prevPeriod; // solo mes anterior
    };

    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: async (values) => {
            try {
                setLoading(true);
                if (!values.attachment) return;

                const { base: fileName, period } = getFileBaseAndPeriod(values.attachment);

                const { prevPeriod } = getAllowedPeriods();
                if (!isPeriodInAllowedWindow(period)) {
                    AlertComponent.warning(
                        `El periodo del archivo (${period}) no es válido. Solo se permiten archivos del periodo inmediatamente anterior: ${prevPeriod}.`
                    );
                    setLoading(false);
                    return;
                }

                const expectedPrefix = getRegimeFilePrefix(regimens, values.regime);
                if (!expectedPrefix) {
                    AlertComponent.warning("No se pudo identificar el prefijo del régimen seleccionado.");
                    setLoading(false);
                    return;
                }

                if (!fileName.toUpperCase().startsWith(expectedPrefix)) {
                    AlertComponent.warning(
                        `El régimen no coincide con el nombre del archivo (${expectedPrefix} + AAAAMM).`
                    );
                    setLoading(false);
                    return;
                }

                const parsedRows = await processCSV(
                    values.attachment,
                    expectedPrefix === "MS" ? RegimenEnum.SUB : RegimenEnum.CONT
                );

                if (!parsedRows.length) {
                    AlertComponent.warning("No hay filas válidas para procesar.");
                    setLoading(false);
                    return;
                }

                const meta = {
                    organizationId: Number(auth?.organization),
                    userId: auth?.id,
                    fileName,
                    regime: values.regime,
                    period,
                };

                const { hasErrors, totalSent, errorMessages } = await sendInBatches(
                    parsedRows,
                    meta,
                    250
                );

                if (hasErrors) {
                    setParseErrors(errorMessages);
                    AlertComponent.error(
                        `Se encontraron ${errorMessages.length} error(es) de validación. Revisa el detalle debajo.`
                    );
                    return;
                }

                AlertComponent.success(
                    `Carga masiva realizada correctamente (${totalSent} registros enviados)`
                );
            } catch (error) {
                console.error(error);
                const lines = String(error?.message || "Error al procesar la solicitud").split("\n");
                setParseErrors(lines);
                AlertComponent.error(
                    `Se encontraron ${lines.length} error(es) al procesar la solicitud. Revisa el detalle debajo.`
                );
            } finally {
                setLoading(false);
            }
        },
    });

    // Recibe un item del array `errors` del backend
    const formatValidationError = (err) => {
        if (!err || typeof err !== "object") return String(err);

        const { status, title, detail, source } = err;

        let finalDetail = detail;

        // Intentar leer JSON dentro de "detail"
        try {
            const parsed = JSON.parse(detail);
            if (Array.isArray(parsed)) {
                finalDetail = parsed
                    .map(x => `${x.field}: ${x.errors.join(", ")}`)
                    .join(" | ");
            }
        } catch (e) {}

        let pointer = "";
        if (Array.isArray(source?.pointer)) {
            pointer =
                " (" +
                source.pointer
                    .map(p => `${p.field}: ${p.errors.join(", ")}`)
                    .join(" | ") +
                ")";
        }

        return `[${status}] ${title}${pointer} - ${finalDetail}`;
    };



    useEffect(() => {
        getRemigens();
    }, []);

    return (
        <Box py={2}>
            <Box display="flex" justifyContent="flex-end" mb={2}>
                <Button variant="contained" color="primary" onClick={() => navigate("/admin/affiliates-list")}>
                    Volver al listado
                </Button>
            </Box>

            {loading && (
                <div className="overlay">
                    <div className="loader">Analizando archivo…</div>
                </div>
            )}

            <Box component="form" onSubmit={formik.handleSubmit} mt={3}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            select
                            fullWidth
                            label="Tipo de Regimen"
                            {...formik.getFieldProps("regime")}
                            error={formik.touched.regime && Boolean(formik.errors.regime)}
                            helperText={formik.touched.regime && formik.errors.regime}
                        >
                            {regimens.map((item) => (
                                <MenuItem key={item.id} value={item.id}>
                                    {item.name}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>

                    <Grid item xs={12}>
                        <FormControl fullWidth>
                            <Typography variant="h6">Subir Archivo CSV</Typography>
                            <Box
                                onClick={() => document.getElementById("fileInput")?.click()}
                                sx={{ border: "2px dashed #ccc", p: 3, textAlign: "center", cursor: "pointer" }}
                            >
                                <CloudUpload sx={{ fontSize: 40, color: "#777" }} />
                                <Typography variant="body2">
                                    Arrastra o haz clic para subir archivo CSV (.csv)
                                </Typography>
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
                                <Typography color="error" variant="body2">
                                    {formik.errors.attachment}
                                </Typography>
                            )}
                        </FormControl>
                    </Grid>
                </Grid>


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

                <Box display="flex" justifyContent="flex-end" gap={1} mt={2}>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={
                            loading ||
                            parseErrors.length > 0 ||
                            !formik.values.attachment ||
                            !formik.values.regime
                        }
                    >
                        {loading ? "Cargando..." : "Enviar"}
                    </Button>

                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => window.location.reload()}
                        disabled={loading}
                    >
                        Reinicar formulario
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};
