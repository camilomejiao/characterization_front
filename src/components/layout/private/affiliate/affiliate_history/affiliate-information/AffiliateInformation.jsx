import {Card, Col, Row} from "react-bootstrap";
import {FiUser} from "react-icons/fi";

export const AffiliateInformation = ({data}) => {
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
                                <strong>Regimen:</strong> {data?.regime?.name}
                            </Col>
                            <Col md={6} className="py-2 border-bottom">
                                <strong>Estado de afiliación:</strong> {data?.affiliatedState?.description}
                            </Col>
                        </Row>

                        <Row className="mb-2">
                            <Col md={6} className="py-2 border-bottom">
                                <strong>Tipo de población:</strong> {data?.populationType?.name}
                            </Col>
                            <Col md={6} className="py-2 border-bottom">
                                <strong>EPS:</strong> {data?.eps?.name}
                            </Col>
                        </Row>

                        <Row className="mb-2">
                            <Col md={6} className="py-2 border-bottom">
                                <strong>IPS Primaria:</strong> {data?.ipsPrimary?.name || "No registra"}
                            </Col>
                            <Col md={6} className="py-2 border-bottom">
                                <strong>IPS Odontologica:</strong> {data?.ipsDental?.name || "No registra"}
                            </Col>
                        </Row>

                        <Row className="mb-2">
                            <Col md={6} className="py-2 border-bottom">
                                <strong>Tipo de afiliado:</strong> {data?.affiliateType?.name || "No registra"}
                            </Col>
                            <Col md={6} className="py-2 border-bottom">
                                <strong>Metodologia:</strong> {data?.methodology?.name}
                            </Col>
                        </Row>

                        <Row className="mb-2">
                            <Col md={6} className="py-2 border-bottom">
                                <strong>Grupo y Subgrupo:</strong> {data?.groupSubgroup?.subgroup}
                            </Col>
                            <Col md={6} className="py-2 border-bottom">
                                <strong>Nivel:</strong> {data?.level?.name ?? 'NO REGISTRA'}
                            </Col>
                        </Row>

                        <Row className="mb-2">
                            <Col md={6} className="py-2 border-bottom">
                                <strong>Clase de afiliación:</strong> {data?.membershipClass?.name}
                            </Col>
                            <Col md={6} className="py-2 border-bottom">
                                <strong>Estado de afiliacion:</strong> {data?.affiliateType?.name}
                            </Col>
                        </Row>

                        <Row className="mb-2">
                            <Col md={6} className="py-2 border-bottom">
                                <strong>Numero del formulario:</strong> {data?.formNumber}
                            </Col>
                            <Col md={6} className="py-2 border-bottom">
                                <strong>Etnia:</strong> {data?.ethnicity?.name}
                            </Col>
                        </Row>

                        <Row className="mb-2">
                            <Col md={6} className="py-2 border-bottom">
                                <strong>Fecha de afiliacion:</strong> {data?.dateOfAffiliated}
                            </Col>
                            <Col md={6} className="py-2 border-bottom">
                                <strong>Numero de la ficha del sisben:</strong> {data?.sisbenNumber}
                            </Col>
                        </Row>

                        <Row className="mb-2">
                            <Col md={6} className="py-2 border-bottom">
                                <strong>Observaciones:</strong> {data?.observations}
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    );
}