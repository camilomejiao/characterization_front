import { Box, Card, CardContent, CardHeader, Grid, Typography } from "@mui/material";
import { FiUser } from "react-icons/fi";

export const UserInformation = ({ data }) => {
    return (
        <Card sx={{ borderRadius: 4, overflow: "hidden", boxShadow: "0 8px 20px rgba(0,0,0,0.08)" }}>
            <CardHeader
                title="Información del Usuario"
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
                            <Grid item xs={12} md={6}>
                                <Typography variant="subtitle2">Nombre</Typography>
                                <Typography variant="body1" fontWeight={600}>
                                    {data?.firstName} {data?.firstLastName}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="subtitle2">Tipo de Documento</Typography>
                                <Typography variant="body1" fontWeight={600}>
                                    {data?.identificationType?.name}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="subtitle2">Documento</Typography>
                                <Typography variant="body1" fontWeight={600}>
                                    {data?.identificationNumber}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="subtitle2">Discapacidad</Typography>
                                <Typography variant="body1" fontWeight={600}>
                                    {data?.disabilityType?.name || "Ninguna"}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="subtitle2">Sexo</Typography>
                                <Typography variant="body1" fontWeight={600}>
                                    {data?.sex?.name}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="subtitle2">Barrio</Typography>
                                <Typography variant="body1" fontWeight={600}>
                                    {data?.neighborhood}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="subtitle2">Área</Typography>
                                <Typography variant="body1" fontWeight={600}>
                                    {data?.area?.name}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="subtitle2">Email</Typography>
                                <Typography variant="body1" fontWeight={600}>
                                    {data?.email ?? "NO REGISTRA"}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="subtitle2">Dirección</Typography>
                                <Typography variant="body1" fontWeight={600}>
                                    {data?.address}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="subtitle2">Teléfono</Typography>
                                <Typography variant="body1" fontWeight={600}>
                                    {data?.phoneNumber}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
};
