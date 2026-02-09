import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import {
    Button,
    IconButton,
    InputAdornment,
    Paper,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import { Add, Search } from "@mui/icons-material";
import { DataGrid } from "@mui/x-data-grid";
import { FaPencilAlt } from "react-icons/fa";

import { PageHeader } from "../../../components/shared/page-header/PageHeader";
//
import AlertComponent from "../../../helpers/alert/AlertComponent";
//
import { affiliateServices } from "../../../services/AffiliateServices";
//
import { ResponseStatusEnum } from "../../../helpers/GlobalEnum";

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

            const { data, status } = await affiliateServices.getList();
            if (status === ResponseStatusEnum.OK) {
                setAffiliateList(await normalizeRows(data));
            }

            if (status !== ResponseStatusEnum.OK) {
                AlertComponent.warning("Error al obtener lista de afiliados");
            }
        } catch (error) {
            console.log(`Error en Admin List ${error}`);
        } finally {
            setLoadingData(false);
            setIsLoading(false);
            setInformationLoadingText("Cargando informacion...");
        }
    };

    const normalizeRows = async (data) => {
        //console.log(data);
        return data.map((row) => {
            return {
                id: row?.id,
                regime: row?.regime?.name,
                name: row?.user?.firstName + " " + row?.user?.middleName,
                lastName: row?.user?.firstLastName + " " + row?.user?.middleLastName,
                identificationNumber: row?.user?.identificationNumber,
                eps: row?.eps?.name,
                populationType: row?.populationType?.name,
                affiliateType: row?.affiliateType?.name,
                methodology: row?.methodology?.name,
                level: row?.level?.name,
            };
        });
    };

    const filteredRows = affiliateList.filter((row) =>
        Object.values(row).some((value) =>
            String(value).toLowerCase().includes(searchText.toLowerCase()),
        ),
    );

    const AffiliateColumns = [
        { field: "id", headerName: "N°", width: 50 },
        {
            field: "regime",
            headerName: "Regimen",
            width: 200,
            headerAlign: "left",
            align: "left",
            cellClassName: "MuiDataGrid-cell-left",
        },
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
                    <IconButton color="warning" onClick={() => handleEdit(params.row.id)}>
                        <FaPencilAlt />
                    </IconButton>
                </Stack>
            ),
        },
    ];

    const handleEdit = (id) => {
        navigate(`/admin/affiliates-update/${id}`);
    };

    useEffect(() => {
        getAffiliateList();
    }, []);

    return (
        <>
            <PageHeader
                title="Afiliados"
                subtitle="Gestiona régimen, EPS y clasificación poblacional."
                stats={[{ label: "Total", value: affiliateList.length }]}
                actions={
                    <Button
                        variant="contained"
                        color="secondary"
                        startIcon={<Add />}
                        onClick={() => navigate("/admin/affiliates-create")}
                    >
                        Crear Nuevo
                    </Button>
                }
            >
                <TextField
                    label="Buscar afiliado"
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
        </>
    );
};
