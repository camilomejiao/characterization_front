import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Form, FloatingLabel } from "react-bootstrap";

//Enum
import { ResponseStatusEnum } from "../../../../../helpers/GlobalEnum";
//Util
import AlertComponent from "../../../../../helpers/alert/AlertComponent";
//Services
import { userServices } from "../../../../../helpers/services/UserServices";
import {Button} from "@mui/material";

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
            const { data, status } = await userServices.getIdentifiedUser(
                Number(documentNumber)
            );

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

    // Maneja Enter en cualquier control del form
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
        <Modal show={showModal} onHide={() => {}} centered>
            <Modal.Header>
                <Modal.Title>Buscar Usuario</Modal.Title>
            </Modal.Header>

            {/* ← clave: onSubmit */}
            <Form onSubmit={handleSubmit} noValidate>
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <FloatingLabel label="Número de Documento">
                            <Form.Control
                                type="number"
                                inputMode="numeric"
                                placeholder="Ingrese el número de documento"
                                value={documentNumber}
                                onChange={(e) => setDocumentNumber(e.target.value)}
                                isInvalid={!!errors.documentNumber}
                                min={0}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.documentNumber}
                            </Form.Control.Feedback>
                        </FloatingLabel>
                    </Form.Group>
                </Modal.Body>

                <Modal.Footer style={{gap: '10px'}}>
                    <Button
                        variant="contained"
                        sx={{
                            backgroundColor: "#939393",
                            color: "#fff",
                            "&:hover": { backgroundColor: "#2c2c2c" },
                        }}
                        onClick={() => navigate("/admin/pqrs-list")}
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
                </Modal.Footer>
            </Form>
        </Modal>
    );
};
