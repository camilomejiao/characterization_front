import { Box, Button, Container, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import image from "../../../assets/image/404/404.png";

export const PageNotFound = () => {
    return (
        <Container
            maxWidth="sm"
            sx={{
                textAlign: "center",
                py: 8,
            }}
        >
            <Box>
                <img
                    src={image}
                    alt="Not Found"
                    style={{ width: "100%", maxWidth: "400px" }}
                />
            </Box>

            <Typography variant="h4" mt={4}>
                Página no encontrada
            </Typography>

            <Button
                component={Link}
                to="/admin"
                variant="contained"
                color="primary"
                sx={{ mt: 4 }}
            >
                Volver al inicio
            </Button>
        </Container>
    );
};
