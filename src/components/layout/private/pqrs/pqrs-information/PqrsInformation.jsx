import { Card, Row, Col } from "react-bootstrap";
import {FiExternalLink, FiFileText} from "react-icons/fi";

export const PqrsInformation = ({ data }) => {

    const docUrl = data?.fileUrl ?? data?.files ?? null;

    const handleOpen = () => {
        if (!docUrl) return;
        window.open(docUrl, "_blank", "noopener,noreferrer");
    };

    return (
        <Card className="shadow-sm rounded-4 overflow-hidden mt-3">
            {/* Encabezado */}
            <Card.Header className="bg-primary text-white text-center fw-semibold">
                Información de PQRS
            </Card.Header>

            <Card.Body className="px-4 py-5">
                <Row>
                    {/* Ícono a la izquierda */}
                    <Col md={2} className="text-center mb-4 mb-md-0">
                        <div
                            style={{
                                width: 100,
                                height: 100,
                                borderRadius: "50%",
                                backgroundColor: "#f0f0f0",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                                margin: "0 auto",
                            }}
                        >
                            <FiFileText size={50} color="#041432" />
                        </div>
                    </Col>

                    {/* Datos en columnas */}
                    <Col md={10}>
                        <Row className="mb-2">
                            <Col md={6} className="py-2 border-bottom">
                                <strong>Tipo PQRS:</strong> {data?.pqrsType?.name}
                            </Col>
                            <Col md={6} className="py-2 border-bottom">
                                <strong>Status:</strong> {data?.applicationStatus?.name}
                            </Col>
                        </Row>

                        <Row className="mb-2">
                            <Col md={6} className="py-2 border-bottom">
                                <strong>Departamento:</strong> {data?.department?.name}
                            </Col>
                            <Col md={6} className="py-2 border-bottom">
                                <strong>Municipio:</strong> {data?.municipality?.name}
                            </Col>
                        </Row>

                        <Row className="mb-2">
                            <Col md={6} className="py-2 border-bottom">
                                <strong>Razón:</strong> {data?.reason?.name}
                            </Col>
                            <Col md={6} className="py-2 border-bottom">
                                <strong>EPS:</strong> {data?.eps?.name}
                            </Col>
                        </Row>

                        <Row className="mb-2">
                            <Col md={6} className="py-2 border-bottom">
                                <strong>Entidad:</strong> {data?.entity}
                            </Col>
                            <Col md={6} className="py-2 border-bottom">
                                <strong>Responsable:</strong> {data?.userSystem?.name}
                            </Col>
                        </Row>

                        <Row className="mb-2">
                            <Col md={6} className="py-2 border-bottom">
                                <strong>Fecha del Evento:</strong> {data?.dateOfEvents}
                            </Col>

                            <Col md={6} className="py-2">
                                {docUrl ? (
                                    <a href={docUrl} target="_blank" rel="noopener noreferrer"
                                       className="btn btn-outline-primary btn-sm">
                                        <FiExternalLink className="me-1" />
                                        Ver documento
                                    </a>
                                ) : (
                                    <span className="text-muted">Sin documento adjunto</span>
                                )}
                            </Col>


                        </Row>

                        <Row>
                            <Col className="py-2">
                                <strong>Descripción:</strong> {data?.descriptionOfEvents}
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    );
};
