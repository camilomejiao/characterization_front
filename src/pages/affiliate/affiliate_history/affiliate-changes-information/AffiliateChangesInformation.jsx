import { Box, Card, CardContent, CardHeader, Grid, Typography } from "@mui/material";
import { FiUser } from "react-icons/fi";

export const AffiliateChangesInformation = ({ data }) => {
    if (!data || data.length === 0) {
        return (
            <Card sx={{ borderRadius: 3 }}>
                <CardHeader title="Información de cambios de datos del beneficiario" />
                <CardContent>
                    <Typography variant="body2">No hay cambios registrados.</Typography>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card sx={{ borderRadius: 4, overflow: "hidden", boxShadow: "0 8px 20px rgba(0,0,0,0.08)" }}>
            <CardHeader
                title="Información de cambios de datos del beneficiario"
                sx={{
                    textAlign: "center",
                    backgroundColor: "#031b32",
                    color: "#fff",
                    "& .MuiCardHeader-title": { fontWeight: 700 },
                }}
            />
            <CardContent sx={{ px: 3, py: 4 }}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={3}>
                        <Box
                            sx={{
                                width: 110,
                                height: 110,
                                borderRadius: "50%",
                                backgroundColor: "#f0f3f7",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                boxShadow: "0 6px 16px rgba(0,0,0,0.12)",
                                mx: "auto",
                            }}
                        >
                            <FiUser size={52} color="#041432" />
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={9}>
                        <Grid container spacing={2}>
                            {data.map((descriptions) => (
                                <Grid item xs={12} key={descriptions.id}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} md={9}>
                                            <Typography variant="subtitle2">Cambios</Typography>
                                            <Typography fontWeight={600}>{descriptions?.description}</Typography>
                                        </Grid>
                                        <Grid item xs={12} md={3}>
                                            <Typography variant="subtitle2">Fecha</Typography>
                                            <Typography fontWeight={600}>
                                                {descriptions?.created_at?.split("T")[0]}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            ))}
                        </Grid>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
};
