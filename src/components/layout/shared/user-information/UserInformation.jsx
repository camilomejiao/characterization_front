import { Card, Row, Col } from "react-bootstrap";
import { FiUser } from "react-icons/fi";

export const UserInformation = ({ data }) => {
    return (
        <Card className="shadow-sm rounded-4 overflow-hidden">
            {/* Encabezado */}
            <Card.Header className="text-center fw-semibold"
                         style={{
                             backgroundColor: "#031b32",
                             color: "white"
                         }}
            >
                Información del Usuario
            </Card.Header>

            <Card.Body className="px-4 py-5">
                <Row>
                    {/* Ícono de usuario a la izquierda */}
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
                            <FiUser size={50} color="#041432" />
                        </div>
                    </Col>

                    {/* Datos en dos columnas */}
                    <Col md={10}>
                        <Row className="mb-2">
                            <Col md={6} className="py-2 border-bottom">
                                <strong>Nombre:</strong> {data?.firstName} {data?.firstLastName}
                            </Col>
                            <Col md={6} className="py-2 border-bottom">
                                <strong>Tipo de Documento:</strong> {data?.identificationType?.name}
                            </Col>
                        </Row>

                        <Row className="mb-2">
                            <Col md={6} className="py-2 border-bottom">
                                <strong>Documento:</strong> {data?.identificationNumber}
                            </Col>
                            <Col md={6} className="py-2 border-bottom">
                                <strong>Discapacidad:</strong> {data?.disabilityType?.name || "Ninguna"}
                            </Col>
                        </Row>

                        <Row className="mb-2">
                            <Col md={6} className="py-2 border-bottom">
                                <strong>Género:</strong> {data?.gender?.name}
                            </Col>
                            <Col md={6} className="py-2 border-bottom">
                                <strong>Barrio:</strong> {data?.neighborhood}
                            </Col>
                        </Row>

                        <Row className="mb-2">
                            <Col md={6} className="py-2 border-bottom">
                                <strong>Área:</strong> {data?.area?.name}
                            </Col>
                            <Col md={6} className="py-2 border-bottom">
                                <strong>Email:</strong> {data?.email}
                            </Col>
                        </Row>

                        <Row>
                            <Col md={6} className="py-2 border-bottom">
                                <strong>Dirección:</strong> {data?.address}
                            </Col>
                            <Col md={6} className="py-2 border-bottom">
                                <strong>Teléfono:</strong> {data?.phoneNumber}
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    );
};
