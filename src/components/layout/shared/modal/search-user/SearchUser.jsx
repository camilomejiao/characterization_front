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
    const [selectedDocumentType, setSelectedDocumentType] = useState(2); // valor por defecto
    const [documentNumber, setDocumentNumber] = useState("");
    const [errors, setErrors] = useState({});

    const getIdentificationType = async () => {
        try {
            const { data, status } = await commonServices.getIdentificationType();
            if (status === ResponseStatusEnum.OK) {
                setDocumentTypes(data);
            }
        } catch {
            AlertComponent.warning("No se pudieron cargar los tipos de documento.");
        }
    };

    const validate = () => {
        const validationErrors = {};
        if (!selectedDocumentType) {
            validationErrors.documentType = "Debe seleccionar un tipo de documento";
        }
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
                Number(selectedDocumentType),
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
        e.preventDefault(); // evita refresh/navegación
        e.stopPropagation();
        handleSearchUser();
    };

    useEffect(() => {
        getIdentificationType();
        setSelectedDocumentType(2); // si quieres forzar TI por defecto
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
                        <Form.Label>Tipo de Documento</Form.Label>
                        <Form.Select
                            value={selectedDocumentType}
                            onChange={(e) => setSelectedDocumentType(Number(e.target.value))}
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

                <Modal.Footer>
                    {/* type="button" para que NO dispare submit */}
                    <Button variant="secondary" type="button" onClick={() => navigate("/admin/pqrs-list")}>
                        Cancelar
                    </Button>

                    {/* type="submit" para que Enter llame a handleSubmit */}
                    <Button variant="primary" type="submit">
                        Buscar
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};
