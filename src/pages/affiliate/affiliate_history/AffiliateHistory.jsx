import React, { useEffect, useRef, useState } from "react";
import {
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    CircularProgress,
    Grid,
    TextField,
    Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { useFormik } from "formik";

//
import { UserInformation } from "../../../components/shared/user-information/UserInformation";
import AlertComponent from "../../../helpers/alert/AlertComponent";

//
import { affiliateServices } from "../../../services/AffiliateServices";

//
import { ResponseStatusEnum } from "../../../helpers/GlobalEnum";
import { AffiliateInformation } from "./affiliate-information/AffiliateInformation";
import { AffiliateChangesInformation } from "./affiliate-changes-information/AffiliateChangesInformation";
import { LMAInformation } from "./lma-information/LMAInformation";
import printJS from "print-js";
import { AffiliateReport } from "../affiliate-report/AffiliateReport";

//
const initialValues = {
    identification_number: "",
};

//
const validationSchema = Yup.object({
    identification_number: Yup.string()
        .required("El número de identificación es obligatorio")
        .matches(/^\d+$/, "El número de identificación debe ser numérico")
        .min(5, "Debe tener al menos 5 dígitos")
        .max(20, "No debe superar 20 dígitos"),
});

export const AffiliateHistory = () => {
    const navigate = useNavigate();
    const AffiliateReportRef = useRef();

    const [userData, setUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isReadyToPrintReport, setIsReadyToPrintReport] = useState(false);

    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: async (values) => {
            try {
                setIsLoading(true);
                setUserData(null);

                const identification = values.identification_number.trim();

                // ⬇️ Ajusta este servicio al que tengas en tu backend
                const response =
                    await affiliateServices.getUserInformationByIdentificationNumber(
                        identification,
                    );

                if (response.status === ResponseStatusEnum.OK) {
                    if (!response.data) {
                        AlertComponent.warning(
                            "No se encontró información para el número de identificación ingresado.",
                        );
                        return;
                    }

                    setUserData(response.data);
                    AlertComponent.success("Beneficiario encontrado correctamente");
                } else if (response.status === ResponseStatusEnum.NOT_FOUND) {
                    AlertComponent.warning(
                        "No se encontró ningún beneficiario con ese número de identificación",
                    );
                } else {
                    // Manejo genérico de error con estructura tipo JSON:API (si la usas)
                    const title = response?.data?.errors?.[0]?.title || "Error en la búsqueda";
                    const detail =
                        response?.data?.errors?.[0]?.detail ||
                        response?.data?.errors?.[0]?.source?.pointer?.[0]?.errors ||
                        "";
                    AlertComponent.warning(title, detail);
                }
            } catch (error) {
                console.error("Error al buscar beneficiario:", error);
                AlertComponent.error("Hubo un error al procesar la solicitud");
            } finally {
                setIsLoading(false);
            }
        },
    });

    //
    const generateReport = async () => {
        try {
            const identification = formik.values.identification_number?.trim();

            if (!identification) {
                AlertComponent.warning(
                    "Debes ingresar un número de identificación antes de generar el reporte.",
                );
                return;
            }

            await formik.validateForm();
            if (formik.errors.identification_number) {
                formik.setFieldTouched("identification_number", true, false);
                AlertComponent.warning(
                    "Corrige el número de identificación antes de generar el reporte.",
                );
                return;
            }

            setIsLoading(true);

            const response =
                await affiliateServices.getUserInformationByIdentificationNumber(identification);

            if (response.status !== ResponseStatusEnum.OK) {
                AlertComponent.warning(
                    "No se encontró ningún beneficiario con ese número de identificación.",
                );
                return;
            }

            setUserData(response.data);

            setIsReadyToPrintReport(true);
        } catch (error) {
            console.error("Error al obtener datos del usuario:", error);
            AlertComponent.warning(
                "Usuario no encontrado para cargar los datos del usuario para el reporte.",
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handlePDFPrint = () => {
        const printContent = `
            <html>
                <head>
                  <style>           
                    body {
                      font-family: Arial, sans-serif;
                      margin: 20px;
                      font-size: 10px;
                    }
                    .page-break {
                        page-break-after: always;
                    }
                  </style>
                </head>
                <body>
                  <!-- Inyectamos el HTML del componente -->
                  ${AffiliateReportRef.current.innerHTML} 
                </body>
            </html>`;

        printJS({
            printable: printContent,
            type: "raw-html",
            documentTitle: "Reporte AFILIADO",
        });
    };

    useEffect(() => {
        if (isReadyToPrintReport) {
            handlePDFPrint();
            setIsReadyToPrintReport(false);
        }
    }, [isReadyToPrintReport]);

    return (
        <>
            <Box py={2}>
                <Box display="flex" justifyContent="flex-end" mb={2}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => navigate("/admin/affiliates-list")}
                    >
                        Volver al listado
                    </Button>
                </Box>

                {/* Card de búsqueda */}
                <Box
                    sx={{
                        maxWidth: 900,
                        margin: "0 auto",
                    }}
                >
                    <Card
                        elevation={4}
                        sx={{
                            borderRadius: 2,
                            background:
                                "linear-gradient(135deg, #f8fafc 0%, #ffffff 40%, #f3f7f5 100%)",
                        }}
                    >
                        <CardHeader
                            title="Consulta de beneficiario"
                            subheader="Ingresa el número de identificación para ver la información asociada al beneficiario."
                            sx={{
                                borderBottom: "1px solid #e0e0e0",
                                "& .MuiCardHeader-title": {
                                    fontWeight: 600,
                                    fontSize: "1.15rem",
                                },
                                "& .MuiCardHeader-subheader": {
                                    fontSize: "0.9rem",
                                    color: "#6b7280",
                                },
                            }}
                        />

                        <CardContent>
                            <Box component="form" onSubmit={formik.handleSubmit}>
                                <Grid container spacing={2} alignItems="flex-end">
                                    <Grid item xs={12} md={7}>
                                        <TextField
                                            fullWidth
                                            label="Número de identificación"
                                            type="text"
                                            inputMode="numeric"
                                            {...formik.getFieldProps("identification_number")}
                                            error={
                                                formik.touched.identification_number &&
                                                Boolean(formik.errors.identification_number)
                                            }
                                            helperText={
                                                formik.touched.identification_number &&
                                                formik.errors.identification_number
                                            }
                                        />
                                    </Grid>

                                    <Grid item xs={12} md={5}>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} sm={6} md={12}>
                                                <Button
                                                    type="submit"
                                                    fullWidth
                                                    variant="contained"
                                                    disableElevation
                                                    disabled={isLoading}
                                                    sx={{
                                                        backgroundColor: "#2d8165",
                                                        color: "#fff",
                                                        height: "56px",
                                                        fontWeight: 600,
                                                        "&:hover": { backgroundColor: "#3f8872" },
                                                    }}
                                                >
                                                    {isLoading
                                                        ? "Buscando..."
                                                        : "Buscar beneficiario"}
                                                </Button>
                                            </Grid>
                                            <Grid item xs={12} sm={6} md={12}>
                                                <Button
                                                    fullWidth
                                                    variant="contained"
                                                    disableElevation
                                                    disabled={isLoading}
                                                    onClick={() => generateReport()}
                                                    sx={{
                                                        backgroundColor: "#812d2d",
                                                        color: "#fff",
                                                        height: "56px",
                                                        fontWeight: 600,
                                                        "&:hover": { backgroundColor: "#b63232" },
                                                    }}
                                                >
                                                    Generar reporte
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Box>

                            {isLoading && (
                                <Box
                                    mt={3}
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
                                    gap={1}
                                >
                                    <CircularProgress size={22} />
                                    <Typography variant="body2">
                                        Cargando información del usuario...
                                    </Typography>
                                </Box>
                            )}
                        </CardContent>
                    </Card>
                </Box>

                {/* Resultado debajo de la card */}
                {userData && (
                    <Box mt={4}>
                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: "#374151" }}>
                            Información basica del usuario
                        </Typography>
                        <UserInformation data={userData?.user} />
                    </Box>
                )}

                {userData && (
                    <Box mt={4}>
                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: "#374151" }}>
                            Información de la afiliación
                        </Typography>
                        <AffiliateInformation data={userData?.affiliate} />
                    </Box>
                )}

                {userData && (
                    <Box mt={4}>
                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: "#374151" }}>
                            Información de LMA
                        </Typography>
                        <LMAInformation data={userData?.lma} />
                    </Box>
                )}

                {userData && (
                    <Box mt={4}>
                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: "#374151" }}>
                            Información de cambios del usuario
                        </Typography>
                        <AffiliateChangesInformation data={userData?.history} />
                    </Box>
                )}
            </Box>

            {/* Aquí renderizas el componente pero lo ocultas */}
            <div style={{ display: "none" }}>
                {isReadyToPrintReport && (
                    <div ref={AffiliateReportRef}>
                        <AffiliateReport data={userData} />
                    </div>
                )}
            </div>
        </>
    );
};
