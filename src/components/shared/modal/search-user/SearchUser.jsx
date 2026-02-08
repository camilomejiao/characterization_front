import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";

import { ResponseStatusEnum } from "../../../../helpers/GlobalEnum";
import AlertComponent from "../../../../helpers/alert/AlertComponent";
import { userServices } from "../../../../services/UserServices";

export const SearchUser = ({ showModal, onUserFound }) => {
    const navigate = useNavigate();

    const [documentNumber, setDocumentNumber] = useState("");
    const [errors, setErrors] = useState({});

    const validate = () => {
        const validationErrors = {};

        if (!documentNumber || isNaN(documentNumber) || Number(documentNumber) < 0) {
            validationErrors.documentNumber = "Debe ingresar un número válido";
        }
        setErrors(validationErrors);
        return Object.keys(validationErrors).length === 0;
    };

    const handleSearchUser = async () => {
        if (!validate()) return;

        try {
            const { data, status } = await userServices.getIdentifiedUser(Number(documentNumber));

            if (status === ResponseStatusEnum.OK) {
                onUserFound(data);
                return;
            }

            if (status === ResponseStatusEnum.NOT_FOUND) {
                AlertComponent.warning(
                    "El usuario que buscas no existe en el sistema, por favor regístralo para poder continuar!"
                );
                navigate("/admin/user-create");
            }
        } catch {
            AlertComponent.error("Error al buscar el usuario");
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        e.stopPropagation();
        handleSearchUser();
    };

    useEffect(() => {
        setDocumentNumber("");
        setErrors({});
    }, []);

    return (
        <Dialog open={showModal} onClose={() => {}} fullWidth maxWidth="xs">
            <DialogTitle>Buscar Usuario</DialogTitle>
            <DialogContent>
                <form onSubmit={handleSubmit} noValidate>
                    <TextField
                        autoFocus
                        fullWidth
                        margin="dense"
                        type="number"
                        label="Número de Documento"
                        value={documentNumber}
                        onChange={(e) => setDocumentNumber(e.target.value)}
                        error={!!errors.documentNumber}
                        helperText={errors.documentNumber}
                        inputProps={{ min: 0 }}
                    />
                    <DialogActions sx={{ px: 0, pt: 2 }}>
                        <Button
                            variant="outlined"
                            onClick={() => navigate("/admin/user-list")}
                            sx={{ borderColor: "#6b6b6b", color: "#6b6b6b" }}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            sx={{
                                backgroundColor: "#031b32",
                                color: "#fff",
                                "&:hover": { backgroundColor: "#183456" },
                            }}
                        >
                            Buscar
                        </Button>
                    </DialogActions>
                </form>
            </DialogContent>
        </Dialog>
    );
};
