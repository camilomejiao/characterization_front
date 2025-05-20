import { useEffect, useState } from "react";
import { Modal, Button, Form, FloatingLabel } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import { ResponseStatusEnum } from "../../../../../helpers/GlobalEnum";
import AlertComponent from "../../../../../helpers/alert/AlertComponent";
import { commonServices } from "../../../../../helpers/services/CommonServices";
import { userServices } from "../../../../../helpers/services/UserServices";

export const SearchUser = ({ showModal, onUserFound }) => {
    const navigate = useNavigate();

    const [documentTypes, setDocumentTypes] = useState([]);
    const [selectedDocumentType, setSelectedDocumentType] = useState("");
    const [documentNumber, setDocumentNumber] = useState("");
    const [errors, setErrors] = useState({});

    const getIdentificationType = async () => {
        try {
            const { data, status } = await commonServices.getIdentificationType();
            if (status === ResponseStatusEnum.OK) {
                setDocumentTypes(data);
            }
        } catch (error) {
            AlertComponent.warning("No se pudieron cargar los tipos de documento.");
        }
    };

    const handleSearchUser = async () => {
        const validationErrors = {};
        if (!selectedDocumentType) {
            validationErrors.documentType = "Debe seleccionar un tipo de documento";
        }
        if (!documentNumber || isNaN(documentNumber) || documentNumber < 0) {
            validationErrors.documentNumber = "Debe ingresar un número válido";
        }

        setErrors(validationErrors);

        if (Object.keys(validationErrors).length === 0) {
            try {
                const { data, status } = await userServices.getIdentifiedUser(
                    selectedDocumentType,
                    documentNumber
                );
                if (status === ResponseStatusEnum.OK) {
                    onUserFound(data);
                    return;
                }

                if (status === ResponseStatusEnum.NOT_FOUND) {
                    AlertComponent.warning(
                        "El usuario que buscas no existe en el sistema, por favor registralo para poder continuar!"
                    );
                    navigate("/admin/user-create");
                }
            } catch (error) {
                AlertComponent.error("Error al buscar el usuario");
            }
        }
    };

    useEffect(() => {
        getIdentificationType();
        setSelectedDocumentType(2);
        setDocumentNumber("");
        setErrors({});
    }, []);

    return (
        <Modal show={showModal} onHide={() => {}} centered>
            <Modal.Header>
                <Modal.Title>Buscar Usuario</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Tipo de Documento</Form.Label>
                        <Form.Select
                            value={selectedDocumentType}
                            onChange={(e) => setSelectedDocumentType(e.target.value)}
                            isInvalid={!!errors.documentType}
                        >
                            <option value="">Seleccione...</option>
                            {documentTypes.map((row) => (
                                <option key={row.id} value={row.id}>
                                    {row.name}
                                </option>
                            ))}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                            {errors.documentType}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <FloatingLabel label="Número de Documento">
                            <Form.Control
                                type="number"
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
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => navigate("/admin/pqrs-list")}>Cancelar</Button>
                <Button variant="primary" onClick={handleSearchUser}>Buscar</Button>
            </Modal.Footer>
        </Modal>
    );
};
