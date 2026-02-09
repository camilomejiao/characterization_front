import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Box,
    Button,
    CircularProgress,
    IconButton,
    InputAdornment,
    Paper,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import { Add, Search } from "@mui/icons-material";
import { FaPencilAlt, FaRegFile } from "react-icons/fa";
import { DataGrid } from "@mui/x-data-grid";
import printJS from "print-js";

//Util
import AlertComponent from "../../../helpers/alert/AlertComponent";
//Enum
import { ResponseStatusEnum } from "../../../helpers/GlobalEnum";
//Services
import { specialPopulationServices } from "../../../services/SpecialPopulationServices";
//Components
import { SpecialPopulationReport } from "../special-population-report/SpecialPopulationReport";
import { PageHeader } from "../../../components/shared/page-header/PageHeader";

export const SpecialPopulationList = () => {
    const navigate = useNavigate();
    const SpecialPopulationReportRef = useRef();

    const [specialPopulationList, setSpecialPopulationList] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [loadingData, setLoadingData] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [userData, setUserData] = useState(null);
    const [isReadyToPrintReport, setIsReadyToPrintReport] = useState(false);

    const getSpecialPopulationList = async () => {
        setLoadingData(true);
        try {
            setIsLoading(true);
            const { data, status } = await specialPopulationServices.getList();
            if (status === ResponseStatusEnum.OK) {
                setSpecialPopulationList(await normalizeRows(data));
            }

            if (status !== ResponseStatusEnum.OK) {
                AlertComponent.warning("Error al obtener lista de afiliados");
            }
        } catch (error) {
            console.log(`Error en Admin List ${error}`);
        } finally {
            setLoadingData(false);
            setIsLoading(false);
        }
    };

    const normalizeRows = async (data) => {
        return data.map((row) => {
            return {
                id: row?.id,
                name: row?.user?.firstName + " " + row?.user?.middleName,
                lastName: row?.user?.firstLastName + " " + row?.user?.middleLastName,
                identificationNumber: row?.user?.identificationNumber,
                eps: row?.eps?.name ?? "No registra",
                populationType: row?.populationType?.name,
                hasEpsAffiliate: row?.hasEpsAffiliate === false ? "NO" : "SI",
                ethnicity: row?.ethnicity?.name,
                observations: row?.observations,
            };
        });
    };

    const filteredRows = specialPopulationList.filter((row) =>
        Object.values(row).some((value) =>
            String(value).toLowerCase().includes(searchText.toLowerCase()),
        ),
    );

    const AffiliateColumns = [
        { field: "id", headerName: "N°", width: 50 },
        {
            field: "name",
            headerName: "Nombre",
            width: 150,
            headerAlign: "left",
            align: "left",
            cellClassName: "MuiDataGrid-cell-left",
        },
        {
            field: "lastName",
            headerName: "Apellido",
            width: 150,
            headerAlign: "left",
        },
        {
            field: "identificationNumber",
            headerName: "Cédula",
            width: 110,
            headerAlign: "left",
        },
        {
            field: "eps",
            headerName: "EPS",
            width: 120,
            headerAlign: "left",
        },
        {
            field: "hasEpsAffiliate",
            headerName: "Afiliado?",
            width: 80,
            headerAlign: "left",
        },
        {
            field: "ethnicity",
            headerName: "Etnia",
            width: 100,
            headerAlign: "left",
        },
        {
            field: "observations",
            headerName: "Observaciones",
            width: 200,
            headerAlign: "left",
        },
        {
            field: "actions",
            headerName: "Acciones",
            width: 150,
            headerAlign: "left",
            renderCell: (params) => (
                <Stack direction="row" spacing={1}>
                    <IconButton color="secondary" onClick={() => generateReport(params.row.id)}>
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
        navigate(`/admin/special-population-update/${id}`);
    };

    const generateReport = async (id) => {
        setIsLoading(true);
        try {
            const { data, status } = await specialPopulationServices.getById(id);
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
                      font-size: 14px;
                    }
                    .page-break {
                        page-break-after: always;
                    }
                  </style>
                </head>
                <body>
                  <!-- Inyectamos el HTML del componente -->
                  ${SpecialPopulationReportRef.current.innerHTML} 
                </body>
            </html>`;

        printJS({
            printable: printContent,
            type: "raw-html",
            documentTitle: "Reporte Pobacion Especial",
        });
    };

    useEffect(() => {
        if (isReadyToPrintReport) {
            handlePDFPrint();
            setIsReadyToPrintReport(false);
        }
    }, [isReadyToPrintReport]);

    useEffect(() => {
        getSpecialPopulationList();
    }, []);

    return (
        <>
            <PageHeader
                title="Población Especial"
                subtitle="Listado censal y reportes con trazabilidad completa."
                stats={[{ label: "Total", value: specialPopulationList.length }]}
                actions={
                    <Button
                        variant="contained"
                        color="secondary"
                        startIcon={<Add />}
                        onClick={() => navigate("/admin/special-population-create")}
                    >
                        Crear Nuevo
                    </Button>
                }
            >
                <TextField
                    label="Buscar registro"
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
                    <Box display="flex" alignItems="center" justifyContent="center" gap={1} py={2}>
                        <CircularProgress size={22} />
                        <Typography variant="body2">Cargando...</Typography>
                    </Box>
                )}

                <DataGrid
                    rows={filteredRows}
                    columns={AffiliateColumns}
                    loading={loadingData}
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

            {/* AquÃ­ renderizas el componente pero lo ocultas */}
            <div style={{ display: "none" }}>
                {isReadyToPrintReport && (
                    <div ref={SpecialPopulationReportRef}>
                        <SpecialPopulationReport data={userData} />
                    </div>
                )}
            </div>
        </>
    );
};
