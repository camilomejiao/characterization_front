import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaPencilAlt, FaTrash } from "react-icons/fa";
import { DataGrid } from "@mui/x-data-grid";
import { Button, IconButton, InputAdornment, Paper, Stack, TextField, Typography } from "@mui/material";
import { Add, Search } from "@mui/icons-material";

import AlertComponent from "../../../helpers/alert/AlertComponent";
import { PageHeader } from "../../../components/shared/page-header/PageHeader";
//Enum
import { ResponseStatusEnum } from "../../../helpers/GlobalEnum";

//Services
import { userServices } from "../../../services/UserServices";


export const UserList = () => {

    const navigate = useNavigate();

    const [userList, setUserList] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [loading, setLoading] = useState(false);
    const [informationLoadingText, setInformationLoadingText] = useState("");

    const getUserList = async () => {
        try {
            setLoading(true);
            setInformationLoadingText("Cargando informacion...");

            const {data, status} = await userServices.getList();
            if(status === ResponseStatusEnum.OK) {
                setUserList(await normalizeRows(data));
            }

            if(status !== ResponseStatusEnum.OK) {
                AlertComponent.warning('Error al obtener lista de usuarios');
            }
        } catch (error) {
            console.log(`Error en Admin List ${error}`);
        } finally {
            setLoading(false);
            setInformationLoadingText("");
        }
    };

    const normalizeRows = async (data) => {
        console.log(data);
        return data.map((row) => {
            return {
                id: row?.id,
                name: row?.firstName + ' ' + row?.middleName,
                lastName: row?.firstLastName + ' ' + row?.middleLastName,
                identificationType: row?.identificationType?.acronym,
                identificationNumber: row?.identificationNumber,
                email: row?.email
            };
        });
    }

    // Filtrar los datos según el texto de búsqueda
    const filteredRows = userList.filter((row) =>
        Object.values(row).some((value) =>
            String(value).toLowerCase().includes(searchText.toLowerCase())
        )
    );

    const UserColumns = [
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
            field: "identificationType",
            headerName: "Tipo de Documento",
            width: 150,
            headerAlign: "left",
        },
        {
            field: "identificationNumber",
            headerName: "Número de Documento",
            width: 200,
            headerAlign: "left",
        },
        {
            field: "email",
            headerName: "Email",
            width: 150,
            headerAlign: "left",
        },
        {
            field: "actions",
            headerName: "Acciones",
            width: 150,
            renderCell: (params) => (
                <Stack direction="row" spacing={1}>
                    <IconButton
                        color="warning"
                        onClick={() => handleEdit(params.row.id) }
                    >
                        <FaPencilAlt/>
                    </IconButton>
                    <IconButton
                        color="error"
                        onClick={() => handleDelete(params.row.id)}
                        //disabled={isButtonDisabled(params.row.id)}
                    >
                        <FaTrash/>
                    </IconButton>
                </Stack>
            ),
        },
    ];

    const handleEdit = (id) => {
        navigate(`/admin/user-update/${id}`);
    }

    const handleDelete = async (id) => {
        try {
            const {status} = await userServices.delete(id);
            if (status === ResponseStatusEnum.OK) {
                getUserList();
                AlertComponent.success('Eliminado correctamente');
            }

            if (status !== ResponseStatusEnum.OK) {
                AlertComponent.warning('Error al eliminar el usuario');
            }
        } catch (error) {
            console.log(`Error en borrar usuario ${error}`);
        }
    }


    useEffect(() => {
        getUserList();
    }, []);

    return (
        <>
            <PageHeader
                title="Usuarios"
                subtitle="Administra registros, documentos y datos básicos del usuario."
                stats={[{ label: "Total", value: userList.length }]}
                actions={
                    <Button
                        variant="contained"
                        color="secondary"
                        startIcon={<Add />}
                        onClick={() => navigate("/admin/user-create")}
                    >
                        Crear Nuevo
                    </Button>
                }
            >
                <TextField
                    label="Buscar usuario"
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

                {loading && (
                    <div className="overlay">
                        <div className="loader">{informationLoadingText}</div>
                    </div>
                )}

                <DataGrid
                    rows={filteredRows}
                    columns={UserColumns}
                    pageSize={10}
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
}
