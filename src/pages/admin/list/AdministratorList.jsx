import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import { Button, IconButton, InputAdornment, Paper, Stack, TextField, Typography } from "@mui/material";
import { Search, Add } from "@mui/icons-material";
import { FaPencilAlt, FaTrash } from "react-icons/fa";

import { PageHeader } from "../../../components/shared/page-header/PageHeader";
//
import AlertComponent from "../../../helpers/alert/AlertComponent";

//
import { administratorServices } from "../../../services/AdministratorServices";
import { ResponseStatusEnum, RolesEnum } from "../../../helpers/GlobalEnum";

export const AdministratorList = () => {

    const navigate = useNavigate();

    const [adminList, setAdminList] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [loading, setLoading] = useState(false);
    const [informationLoadingText, setInformationLoadingText] = useState("");

    // Function to fetch the list of administrators
    const getAdminList = async () => {
        try {
            setLoading(true);
            setInformationLoadingText("Cargando informacion...");
            const { data, status } = await administratorServices.getList();
            if (status === ResponseStatusEnum.OK) {
                setAdminList(data);
            } else {
                AlertComponent.warning('Error al obtener lista de usuarios');
            }
        } catch (error) {
            console.error(`Error en Admin List ${error}`);
        } finally {
            setLoading(false);
            setInformationLoadingText("");
        }
    };

    // Filter the rows based on search text
    const filteredRows = useMemo(() => {
        return adminList.filter((row) =>
            Object.values(row).some((value) =>
                String(value).toLowerCase().includes(searchText.toLowerCase())
            )
        );
    }, [adminList, searchText]);

    // Disable the buttons for users with the "ADMIN" role
    const isButtonDisabled = (id) => id === RolesEnum.ADMIN;

    // Toggle the active status of an administrator
    const handleToggleStatus = async (id, currentStatus) => {
        try {
            const newStatus = !currentStatus;
            const { status } = await administratorServices.toggleStatus(id, { status: newStatus });
            if (status === ResponseStatusEnum.OK) {
                getAdminList();
                AlertComponent.success('Actualizado correctamente');
            } else {
                AlertComponent.warning('Error al actualizar estado del usuario');
            }
        } catch (error) {
            console.error(`Error en actualizar estado ${error}`);
        }
    };

    // Navigate to the update page for the administrator
    const handleEdit = (id) => {
        navigate(`/admin/administrator-update/${id}`);
    };

    // Delete an administrator
    const handleDelete = async (id) => {
        try {
            const { status } = await administratorServices.delete(id);
            if (status === ResponseStatusEnum.OK) {
                getAdminList();
                AlertComponent.success('Eliminado correctamente');
            } else {
                AlertComponent.warning('Error al eliminar el usuario');
            }
        } catch (error) {
            console.error(`Error en borrar usuario ${error}`);
        }
    };

    // Column definitions for the DataGrid
    const AdministratorColumns = [
        { field: "id", headerName: "N°", width: 50 },
        { field: "name", headerName: "Nombre", width: 200 },
        { field: "email", headerName: "Email", width: 200 },
        { field: "organizationName", headerName: "Nombre de la organización", width: 300 },
        {
            field: "active",
            headerName: "Estado",
            width: 200,
            renderCell: (params) => (
                <Button
                    variant="outlined"
                    color={params.value ? "success" : "error"}
                    onClick={() => handleToggleStatus(params.row.id, params.value)}
                    disabled={isButtonDisabled(params.row.id)}
                    fullWidth
                >
                    {params.value ? "Activo" : "Inactivo"}
                </Button>
            ),
        },
        {
            field: "actions",
            headerName: "Acciones",
            width: 150,
            renderCell: (params) => (
                <Stack direction="row" spacing={1}>
                    <IconButton
                        color="warning"
                        onClick={() => handleEdit(params.row.id)}
                        disabled={isButtonDisabled(params.row.id)}
                    >
                        <FaPencilAlt />
                    </IconButton>
                    <IconButton
                        color="error"
                        onClick={() => handleDelete(params.row.id)}
                        disabled={isButtonDisabled(params.row.id)}
                    >
                        <FaTrash />
                    </IconButton>
                </Stack>
            ),
        },
    ];

    // Fetch the administrator list on component mount
    useEffect(() => {
        getAdminList();
    }, []);

    const totalAdmins = adminList.length;
    const activeAdmins = adminList.filter((row) => row?.active).length;
    const inactiveAdmins = totalAdmins - activeAdmins;

    return (
        <>
            <PageHeader
                title="Administradores"
                subtitle="Controla accesos, estados y permisos de administración."
                stats={[
                    { label: "Total", value: totalAdmins },
                    { label: "Activos", value: activeAdmins, color: "#b7f0d1" },
                    { label: "Inactivos", value: inactiveAdmins, color: "#ffd1d1" },
                ]}
                actions={
                    <Button
                        variant="contained"
                        color="secondary"
                        startIcon={<Add />}
                        onClick={() => navigate("/admin/administrator-create")}
                    >
                        Crear Nuevo
                    </Button>
                }
            >
                <TextField
                    label="Buscar administrador"
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
                    columns={AdministratorColumns}
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
};
