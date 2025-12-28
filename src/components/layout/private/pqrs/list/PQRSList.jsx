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
    FormControl, InputLabel, Select, MenuItem
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { FaFilePdf, FaPencilAlt, FaRegFile } from "react-icons/fa";

import AlertComponent from "../../../../../helpers/alert/AlertComponent";
import printJS from "print-js";

//Componets
import { Format1 } from "../pqrs-report/format1/Format1";

//Enum
import { ResponseStatusEnum} from "../../../../../helpers/GlobalEnum";

//Services
import { pqrsServices} from "../../../../../helpers/services/PqrsServices";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";


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

            const {data, status} = await pqrsServices.getList();
            console.log(data);
            if(status === ResponseStatusEnum.OK) {
                setPqrsList(await normalizeRows(data));
            }

            if(status !== ResponseStatusEnum.OK) {
                AlertComponent.warning('Error al obtener lista de usuarios');
            }
        } catch (error) {
            console.log(`Error en Admin List ${error}`);
        } finally {
            setIsLoading(false);
            setInformationLoadingText("");
        }
    }

    const normalizeRows = async (data) => {
        //console.log(data);
        return data.map((row) => {
            return {
                id: row?.id,
                name: row?.user?.firstName + ' ' + row?.user?.middleName,
                lastName: row?.user?.firstLastName + ' ' + row?.user?.middleLastName,
                identificationNumber: row?.user?.identificationNumber,
                pqrsType: row?.pqrsType?.name,
                applicationStatus: row?.applicationStatus?.name,
                reason: row?.reason?.name,
            };
        });
    }

    // Filtrar los datos según el texto de búsqueda
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
                    <IconButton
                        color="info"
                        onClick={() =>
                            generateReport(params.row.id)
                        }
                    >
                        <FaFilePdf />
                    </IconButton>
                    <IconButton
                        color="secondary"
                        onClick={() => showDetail(params.row.id)}
                    >
                        <FaRegFile/>
                    </IconButton>
                    <IconButton
                        color="warning"
                        onClick={() => handleEdit(params.row.id)}
                    >
                        <FaPencilAlt/>
                    </IconButton>
                </Stack>
            ),
        },
    ];

    //
    const handleEdit = (id) => {
        navigate(`/admin/pqrs-update/${id}`);
    }

    //
    const showDetail = (id) => {
        navigate(`/admin/pqrs-observation/${id}`);
    }

    //
    const generateReport = async (id) => {
        try {
            setIsLoading(true);
            const {data, status} = await pqrsServices.getById(id);
            if(status === ResponseStatusEnum.OK) {
                setUserData(data);
                setIsReadyToPrintReport(true);
            }
        } catch (error) {
            console.error("Error al obtener datos del usuario:", error);
            AlertComponent.warning("No se pudieron cargar los datos del usuario.");
        } finally {
            setIsLoading(false);
        }
    }

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
            type: 'raw-html',
            documentTitle: 'Reporte PQRS',
        });
    }

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

            const payload = {
                startDate: startDate.format("YYYY-MM-DD"),
                endDate: endDate.format("YYYY-MM-DD"),
            };

        } catch (error) {
            console.error(error);
            AlertComponent.error("Ocurrió un error al descargar el reporte");

        } finally {
            setIsLoading(false);
            setInformationLoadingText("");
        }
    }

    useEffect(() => {
        if(isReadyToPrintReport) {
            handlePDFPrint();
            setIsReadyToPrintReport(false);
        }
    }, [isReadyToPrintReport]);

    useEffect(() => {
        getPqrsList();
    }, [])

    return (
        <>
            <Box>

                {/* Card de filtros */}
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
                    {/* Card de filtros */}
                    <CardContent>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <Grid container spacing={2} alignItems="center">
                                {/* FECHA INICIAL */}
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

                                {/* FECHA FINAL */}
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

                                {/* BOTÓN BUSCAR */}
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

                <Stack direction="row" justifyContent="space-between" alignItems="center" mt={5} mb={2}>
                    {/* Input de búsqueda */}
                    <TextField
                        label="Buscar..."
                        variant="outlined"
                        size="small"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        style={{ width: "300px" }}
                    />

                    {/* Botón para redirigir a "Crear" */}
                    <Button
                        variant="contained"
                        onClick={() => navigate("/admin/pqrs-create")}
                        sx={{
                            backgroundColor: "#031b32",
                            color: "#fff",
                            "&:hover": { backgroundColor: "#21569a" },
                        }}
                    >
                        Crear Nuevo
                    </Button>
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
                    sx={{
                        "& .MuiDataGrid-columnHeaders": {
                            backgroundColor: "#102844",
                            color: "white",
                            fontSize: "14px",
                        },
                        "& .MuiDataGrid-columnHeader": {
                            textAlign: "center",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        },
                        "& .MuiDataGrid-container--top [role=row], .MuiDataGrid-container--bottom [role=row]": {
                            backgroundColor: "#102844",
                            color: "white !important",
                        },
                        "& .MuiDataGrid-cell": {
                            fontSize: "14px",
                            textAlign: "left",
                            justifyContent: "left",
                            display: "flex",
                        },
                        "& .MuiDataGrid-row:hover": {
                            backgroundColor: "#E8F5E9",
                        },
                    }}
                />

            </Box>

            {/* Aquí renderizas el componente pero lo ocultas */}
            <div style={{display: 'none'}}>
                {isReadyToPrintReport && (
                    <div ref={PqrsReportRef}>
                        <Format1 data={userData} />
                    </div>
                )}
            </div>

        </>
    )

}