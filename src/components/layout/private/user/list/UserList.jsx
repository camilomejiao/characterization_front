import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AlertComponent from "../../../../../helpers/alert/AlertComponent";
import { FaPencilAlt, FaTrash } from "react-icons/fa";
import { DataGrid } from "@mui/x-data-grid";
import { IconButton, Button, Stack, TextField, Box } from "@mui/material";

//Enum
import { ResponseStatusEnum } from "../../../../../helpers/GlobalEnum";

//Services
import { userServices } from "../../../../../helpers/services/UserServices";


export const UserList = () => {

    const navigate = useNavigate();

    const [userList, setUserList] = useState([]);
    const [searchText, setSearchText] = useState("");

    const getUserList = async () => {
        try {
            const {data, status} = await userServices.getList();
            if(status === ResponseStatusEnum.OK) {
                setUserList(await normalizeRows(data));
            }

            if(status !== ResponseStatusEnum.OK) {
                AlertComponent.warning('Error al obtener lista de usuarios');
            }
        } catch (error) {
            console.log(`Error en Admin List ${error}`);
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
            field: "identificationType",
            headerName: "Tipo de Documento",
            width: 100,
            headerAlign: "left",
        },
        {
            field: "identificationNumber",
            headerName: "Número de Documento",
            width: 150,
            headerAlign: "left",
        },
        {
            field: "email",
            headerName: "Email",
            width: 300,
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
                        onClick={() => navigate("/admin/user-create")}
                    >
                        Crear Nuevo
                    </Button>
                </Stack>

                <DataGrid
                    rows={filteredRows}
                    columns={UserColumns}
                    pageSize={10}
                    sx={{
                        "& .MuiDataGrid-columnHeaders": {
                            backgroundColor: "#031b32",
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
                            backgroundColor: "#031b32 !important",
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
    );
}