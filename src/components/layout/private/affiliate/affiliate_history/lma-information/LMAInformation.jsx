import {Card, Col, Row} from "react-bootstrap";
import {FiUser} from "react-icons/fi";

export const LMAInformation = ({data}) => {
    return (
        <>
            <Card className="shadow-sm rounded-4 overflow-hidden">
                {/* Encabezado */}
                <Card.Header className="text-center fw-semibold"
                             style={{
                                 backgroundColor: "#031b32",
                                 color: "white"
                             }}
                >
                    Información de pagos realizados
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
                            {data.map((pays) => (
                                <Row key={pays.id} className="mb-2">
                                    <Col md={4} className="py-2 border-bottom">
                                        <strong>Mes:</strong> {pays.month}
                                    </Col>
                                    <Col md={4} className="py-2 border-bottom">
                                        <strong>Año:</strong> {pays.year}
                                    </Col>
                                    <Col md={4} className="py-2 border-bottom">
                                        <strong>Valor pagado:</strong> ${pays.paid?.toLocaleString()}
                                    </Col>
                                </Row>
                            ))}
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        </>
    )
}