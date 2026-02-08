import { Box, Button, Card, CardContent, CardHeader, Grid, Typography } from "@mui/material";
import { FiExternalLink, FiFileText } from "react-icons/fi";

export const PqrsInformation = ({ data }) => {
    const docUrl = data?.fileUrl ?? data?.files ?? null;

    return (
        <Card sx={{ borderRadius: 4, overflow: "hidden", mt: 3, boxShadow: "0 8px 20px rgba(0,0,0,0.08)" }}>
            <CardHeader
                title="Información de PQRS"
                sx={{
                    textAlign: "center",
                    backgroundColor: "#0f375a",
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
                            <FiFileText size={52} color="#041432" />
                        </Box>
                    </Grid>

                    <Grid item xs={12} md={9}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <Typography variant="subtitle2">Tipo PQRS</Typography>
                                <Typography fontWeight={600}>{data?.pqrsType?.name}</Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="subtitle2">Status</Typography>
                                <Typography fontWeight={600}>{data?.applicationStatus?.name}</Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="subtitle2">Departamento</Typography>
                                <Typography fontWeight={600}>{data?.department?.name}</Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="subtitle2">Municipio</Typography>
                                <Typography fontWeight={600}>{data?.municipality?.name}</Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="subtitle2">Razón</Typography>
                                <Typography fontWeight={600}>{data?.reason?.name}</Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="subtitle2">EPS</Typography>
                                <Typography fontWeight={600}>{data?.eps?.name}</Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="subtitle2">Entidad</Typography>
                                <Typography fontWeight={600}>{data?.entity}</Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="subtitle2">Responsable</Typography>
                                <Typography fontWeight={600}>{data?.userSystem?.name}</Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="subtitle2">Fecha del Evento</Typography>
                                <Typography fontWeight={600}>{data?.dateOfEvents}</Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                {docUrl ? (
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        href={docUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        startIcon={<FiExternalLink />}
                                    >
                                        Ver documento
                                    </Button>
                                ) : (
                                    <Typography variant="body2" color="text.secondary">
                                        Sin documento adjunto
                                    </Typography>
                                )}
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="subtitle2">Descripción</Typography>
                                <Typography fontWeight={600}>{data?.descriptionOfEvents}</Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
};
