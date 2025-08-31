import { useNavigate } from "react-router-dom";
import {useEffect, useRef, useState} from "react";
import { Button, IconButton, Stack, TextField, Box } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { FaFilePdf, FaPencilAlt, FaRegFile, FaTrash } from "react-icons/fa";
import AlertComponent from "../../../../../helpers/alert/AlertComponent";
import { Spinner } from "react-bootstrap";
import printJS from "print-js";

//Componets
import { Format1 } from "../pqrs-report/format1/Format1";

//Enum
import { ResponseStatusEnum} from "../../../../../helpers/GlobalEnum";

//Services
import { pqrsServices} from "../../../../../helpers/services/PqrsServices";

export const PQRSList = () => {

    const navigate = useNavigate();
    const PqrsReportRef = useRef();

    const [pqrsList, setPqrsList] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [userData, setUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isReadyToPrintReposrt, setIsReadyToPrintReposrt] = useState(false);

    const getPqrsList = async () => {
        try {
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
        setIsLoading(true);
        try {
            const {data, status} = await pqrsServices.getById(id);
            if(status === ResponseStatusEnum.OK) {
                setUserData(data);
                setIsReadyToPrintReposrt(true);
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

    useEffect(() => {
        if(isReadyToPrintReposrt) {
            handlePDFPrint();
            setIsReadyToPrintReposrt(false);
        }
    }, [isReadyToPrintReposrt]);

    useEffect(() => {
        getPqrsList();
    }, [])

    return (
        <>
            <Box>
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
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
                        color="primary"
                        onClick={() => navigate("/admin/pqrs-create")}
                    >
                        Crear Nuevo
                    </Button>
                </Stack>

                {isLoading && (
                    <div className="text-center spinner-container">
                        <Spinner animation="border" variant="success" />
                        <span>Cargando...</span>
                    </div>
                )}

                <DataGrid
                    rows={filteredRows}
                    columns={PqrsColumns}
                    pageSize={100}
                    sx={{
                        "& .MuiDataGrid-columnHeaders": {
                            backgroundColor: "#40A581",
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
                            backgroundColor: "#40A581 !important",
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
                {isReadyToPrintReposrt && (
                    <div ref={PqrsReportRef}>
                        <Format1 data={userData} />
                    </div>
                )}
            </div>

        </>
    )

}