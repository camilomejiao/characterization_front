import { useNavigate } from "react-router-dom";
import React, { useEffect, useRef, useState } from "react";
import {
    Button,
    IconButton,
    Stack,
    TextField,
    Box,
    Card,
    CardHeader,
    CardContent,
    Grid,
    InputAdornment,
    Paper,
    Typography,
} from "@mui/material";
import { Add, Search } from "@mui/icons-material";
import { DataGrid } from "@mui/x-data-grid";
import { FaFilePdf, FaPencilAlt, FaRegFile } from "react-icons/fa";

import AlertComponent from "../../../helpers/alert/AlertComponent";
import printJS from "print-js";

//Componets
import { Format1 } from "../pqrs-report/format1/Format1";

//Enum
import { ResponseStatusEnum } from "../../../helpers/GlobalEnum";

//Services
import { pqrsServices } from "../../../services/PqrsServices";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { PageHeader } from "../../../components/shared/page-header/PageHeader";

export const PQRSList = () => {
    const navigate = useNavigate();
    const PqrsReportRef = useRef();

    const [pqrsList, setPqrsList] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [userData, setUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isReadyToPrintReport, setIsReadyToPrintReport] = useState(false);
    const [informationLoadingText, setInformationLoadingText] = useState("");

    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const getPqrsList = async () => {
        try {
            setIsLoading(true);
            setInformationLoadingText("Cargando informacion...");

            const { data, status } = await pqrsServices.getList();
            if (status === ResponseStatusEnum.OK) {
                setPqrsList(await normalizeRows(data));
            }

            if (status !== ResponseStatusEnum.OK) {
                AlertComponent.warning("Error al obtener lista de usuarios");
            }
        } catch (error) {
            console.log(`Error en Admin List ${error}`);
        } finally {
            setIsLoading(false);
            setInformationLoadingText("");
        }
    };

    const normalizeRows = async (data) => {
        return data.map((row) => {
            return {
                id: row?.id,
                name: row?.user?.firstName + " " + row?.user?.middleName,
                lastName: row?.user?.firstLastName + " " + row?.user?.middleLastName,
                identificationNumber: row?.user?.identificationNumber,
                pqrsType: row?.pqrsType?.name,
                applicationStatus: row?.applicationStatus?.name,
                reason: row?.reason?.name,
            };
        });
    };

    const filteredRows = pqrsList.filter((row) =>
        Object.values(row).some((value) =>
            String(value).toLowerCase().includes(searchText.toLowerCase())
        )
    );

    const PqrsColumns = [
        { field: "id", headerName: "N°", width: 50 },
        {
            field: "name",
            headerName: "Nombre",
            width: 300,
            headerAlign: "left",
            align: "left",
            cellClassName: "MuiDataGrid-cell-left",
        },
        {
            field: "lastName",
            headerName: "Apellido",
            width: 300,
            headerAlign: "left",
        },
        {
            field: "identificationNumber",
            headerName: "Cédula",
            width: 150,
            headerAlign: "left",
        },
        {
            field: "pqrsType",
            headerName: "Tipo",
            width: 150,
            headerAlign: "left",
        },
        {
            field: "applicationStatus",
            headerName: "Estado",
            width: 150,
            headerAlign: "left",
        },
        {
            field: "reason",
            headerName: "Razón",
            width: 150,
            headerAlign: "left",
        },
        {
            field: "actions",
            headerName: "Acciones",
            width: 200,
            headerAlign: "left",
            renderCell: (params) => (
                <Stack direction="row" spacing={1}>
                    <IconButton color="info" onClick={() => generateReport(params.row.id)}>
                        <FaFilePdf />
                    </IconButton>
                    <IconButton color="secondary" onClick={() => showDetail(params.row.id)}>
                        <FaRegFile />
                    </IconButton>
                    <IconButton color="warning" onClick={() => handleEdit(params.row.id)}>
                        <FaPencilAlt />
                    </IconButton>
                </Stack>
            ),
        },
    ];

    const handleEdit = (id) => {
        navigate(`/admin/pqrs-update/${id}`);
    };

    const showDetail = (id) => {
        navigate(`/admin/pqrs-observation/${id}`);
    };

    const generateReport = async (id) => {
        try {
            setIsLoading(true);
            const { data, status } = await pqrsServices.getById(id);
            if (status === ResponseStatusEnum.OK) {
                setUserData(data);
                setIsReadyToPrintReport(true);
            }
        } catch (error) {
            console.error("Error al obtener datos del usuario:", error);
            AlertComponent.warning("No se pudieron cargar los datos del usuario.");
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
                  ${PqrsReportRef.current.innerHTML} 
                </body>
            </html>`;

        printJS({
            printable: printContent,
            type: "raw-html",
            documentTitle: "Reporte PQRS",
        });
    };

    const handleSearch = async () => {
        if (!startDate || !endDate) {
            return AlertComponent.warning("Seleccione fecha inicial y fecha final");
        }

        if (startDate.isAfter(endDate, "day")) {
            return AlertComponent.warning("La fecha inicial no puede ser mayor que la fecha final");
        }

        try {
            setIsLoading(true);
            setInformationLoadingText("Cargando informacion...");

            let start = startDate.format("YYYY-MM-DD");
            let end = endDate.format("YYYY-MM-DD");

            const { data, blob, status } = await pqrsServices.reportPqrsExcel(start, end);
            if (status === ResponseStatusEnum.OK) {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `reporte_pqrs_${start}_a_${end}.xlsx`;
                a.click();
                window.URL.revokeObjectURL(url);
            }
        } catch (error) {
            console.error(error);
            AlertComponent.error("Ocurrió un error al descargar el reporte");
        } finally {
            setIsLoading(false);
            setInformationLoadingText("");
        }
    };

    useEffect(() => {
        if (isReadyToPrintReport) {
            handlePDFPrint();
            setIsReadyToPrintReport(false);
        }
    }, [isReadyToPrintReport]);

    useEffect(() => {
        getPqrsList();
    }, []);

    return (
        <>
            <Box>
                <Card elevation={4} sx={{ borderRadius: 2, mb: 3, maxWidth: "100%" }}>
                    <CardHeader
                        title="Reporteador de Información"
                        subheader="Seleccione el periodo para obtener las estadísticas"
                        sx={{
                            "& .MuiCardHeader-title": { fontWeight: 600, fontSize: "1.2rem" },
                            "& .MuiCardHeader-subheader": {
                                fontSize: "0.9rem",
                                color: "#6b7280",
                            },
                        }}
                    />
                    <CardContent>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <Grid container spacing={2} alignItems="center">
                                <Grid item xs={12} md={4}>
                                    <DatePicker
                                        label="Fecha inicial"
                                        value={startDate}
                                        onChange={(newValue) => setStartDate(newValue)}
                                        maxDate={endDate || undefined}
                                        slotProps={{
                                            textField: { fullWidth: true },
                                        }}
                                    />
                                </Grid>

                                <Grid item xs={12} md={4}>
                                    <DatePicker
                                        label="Fecha final"
                                        value={endDate}
                                        onChange={(newValue) => setEndDate(newValue)}
                                        minDate={startDate || undefined}
                                        slotProps={{
                                            textField: { fullWidth: true },
                                        }}
                                    />
                                </Grid>

                                <Grid item xs={12} md={4}>
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        disabled={isLoading}
                                        onClick={handleSearch}
                                        sx={{
                                            backgroundColor: "#2d8165",
                                            color: "#fff",
                                            height: "56px",
                                            fontWeight: 600,
                                            "&:hover": { backgroundColor: "#256b54" },
                                        }}
                                    >
                                        {isLoading ? "Cargando..." : "Descargar"}
                                    </Button>
                                </Grid>
                            </Grid>
                        </LocalizationProvider>
                    </CardContent>
                </Card>

                <PageHeader
                    title="PQRS"
                    subtitle="Seguimiento, gestión y reportes con trazabilidad completa."
                    stats={[{ label: "Total", value: pqrsList.length }]}
                    actions={
                        <Button
                            variant="contained"
                            color="secondary"
                            startIcon={<Add />}
                            onClick={() => navigate("/admin/pqrs-create")}
                        >
                            Crear Nuevo
                        </Button>
                    }
                >
                    <TextField
                        label="Buscar PQRS"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        fullWidth
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search sx={{ color: "rgba(255,255,255,0.9)" }} />
                                </InputAdornment>
                            ),
                        }}
                        sx={{
                            maxWidth: 420,
                            "& .MuiInputBase-root": {
                                backgroundColor: "rgba(255,255,255,0.15)",
                                color: "#fff",
                            },
                            "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.8)" },
                            "& .MuiOutlinedInput-notchedOutline": {
                                borderColor: "rgba(255,255,255,0.4)",
                            },
                        }}
                    />
                </PageHeader>

                <Paper elevation={0} sx={{ p: 2, borderRadius: 4 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                        <Typography variant="subtitle1" fontWeight={700}>
                            Listado
                        </Typography>
                    </Stack>

                    {isLoading && (
                        <div className="overlay">
                            <div className="loader">{informationLoadingText}</div>
                        </div>
                    )}

                    <DataGrid
                        rows={filteredRows}
                        columns={PqrsColumns}
                        pageSize={100}
                        autoHeight
                        getRowClassName={(params) =>
                            params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd"
                        }
                        sx={{
                            border: "none",
                            "& .MuiDataGrid-columnHeaders": {
                                backgroundColor: "#0f375a",
                                color: "white",
                                fontSize: "14px",
                            },
                            "& .MuiDataGrid-columnHeaderTitle": {
                                fontWeight: 700,
                            },
                            "& .MuiDataGrid-row.even": {
                                backgroundColor: "rgba(15,55,90,0.04)",
                            },
                            "& .MuiDataGrid-row:hover": {
                                backgroundColor: "rgba(47,168,126,0.08)",
                            },
                        }}
                    />
                </Paper>
            </Box>

            <div style={{ display: "none" }}>
                {isReadyToPrintReport && (
                    <div ref={PqrsReportRef}>
                        <Format1 data={userData} />
                    </div>
                )}
            </div>
        </>
    );
};
