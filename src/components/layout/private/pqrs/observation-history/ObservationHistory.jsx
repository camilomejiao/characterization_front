import { Card, Row, Col } from "react-bootstrap";

export const ObservationHistory = ({ observations }) => {
    if (!observations?.length) return null;

    return (
        <Card className="shadow-sm rounded-4 overflow-hidden mt-4">
            <Card.Header className="bg-primary text-white text-center fw-semibold">
                Historial de Observaciones
            </Card.Header>
            <Card.Body>
                {observations?.map((obs, idx) => (
                    <Row key={idx} className="mb-3 pb-2 border-bottom">
                        <Col md={4}><strong>Fecha:</strong> {new Date(obs?.created_at).toLocaleDateString()}</Col>
                        <Col md={4}><strong>Estado:</strong> {obs?.status?.name}</Col>
                        <Col md={4}><strong>Observación:</strong> {obs?.notification}</Col>
                    </Row>
                ))}
            </Card.Body>
        </Card>
    );
};
