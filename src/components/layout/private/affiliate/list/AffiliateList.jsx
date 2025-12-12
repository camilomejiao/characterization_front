import {useNavigate} from "react-router-dom";
import {useEffect, useRef, useState} from "react";
import {Box, Button, IconButton, Stack, TextField} from "@mui/material";
import {DataGrid} from "@mui/x-data-grid";
import {FaPencilAlt, FaRegFile} from "react-icons/fa";

//
import AlertComponent from "../../../../../helpers/alert/AlertComponent";
//
import { affiliateServices } from "../../../../../helpers/services/AffiliateServices";
//
import { ResponseStatusEnum } from "../../../../../helpers/GlobalEnum";

export const AffiliateList = () => {

    const navigate = useNavigate();

    const [affiliateList, setAffiliateList] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [loadingData, setLoadingData] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [informationLoadingText, setInformationLoadingText] = useState("");

    const getAffiliateList = async () => {
        setLoadingData(true);
        try {
            setIsLoading(true);
            setInformationLoadingText("Cargando informacion...");

            const {data, status} = await affiliateServices.getList();
            if(status === ResponseStatusEnum.OK) {
                setAffiliateList(await normalizeRows(data));
            }

            if(status !== ResponseStatusEnum.OK) {
                AlertComponent.warning('Error al obtener lista de afiliados');
            }
        } catch (error) {
            console.log(`Error en Admin List ${error}`);
        } finally {
            setLoadingData(false);
            setIsLoading(false);
            setInformationLoadingText("Cargando informacion...");
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
                eps: row?.eps?.name,
                populationType: row?.populationType?.name,
                affiliateType: row?.affiliateType?.name,
                methodology: row?.methodology?.name,
                level: row?.level?.name
            };
        });
    }

    const filteredRows = affiliateList.filter((row) =>
        Object.values(row).some((value) =>
            String(value).toLowerCase().includes(searchText.toLowerCase())
        )
    );

    const AffiliateColumns = [
        { field: "id", headerName: "N°", width: 50 },
        {
            field: "name",
            headerName: "Nombre",
            width: 200,
            headerAlign: "left",
            align: "left",
            cellClassName: "MuiDataGrid-cell-left",
        },
        {
            field: "lastName",
            headerName: "Apellido",
            width: 200,
            headerAlign: "left",
        },
        {
            field: "identificationNumber",
            headerName: "Cédula",
            width: 150,
            headerAlign: "left",
        },
        {
            field: "eps",
            headerName: "EPS",
            width: 150,
            headerAlign: "left",
        },
        {
            field: "populationType",
            headerName: "Tipo de Poblacion",
            width: 150,
            headerAlign: "left",
        },
        {
            field: "affiliateType",
            headerName: "Tipo de Afiliacion",
            width: 150,
            headerAlign: "left",
        },
        {
            field: "methodology",
            headerName: "Metodologia",
            width: 150,
            headerAlign: "left",
        },
        {
            field: "level",
            headerName: "Nivel",
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
                        color="secondary"
                        onClick={() => showAffiliateDetail(params.row.id)}
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

    const handleEdit = (id) => {
        navigate(`/admin/affiliates-update/${id}`);
    }

    const showAffiliateDetail = (id) => {
        navigate(`/admin/pqrs-observation/${id}`);
    }

    useEffect(() => {
        getAffiliateList();
    }, []);

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
                        sx={{
                            backgroundColor: "#031b32",
                            color: "#fff",
                            "&:hover": { backgroundColor: "#21569a" },
                        }}
                        onClick={() => navigate("/admin/affiliates-create")}
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
                    columns={AffiliateColumns}
                    loading={loadingData}
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
        </>
    )

}