import {
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    Divider,
    Grid,
    Typography,
} from "@mui/material";
import { FiExternalLink, FiFileText } from "react-icons/fi";

export const PqrsInformation = ({ data }) => {
    const docUrl = data?.fileUrl ?? data?.files ?? null;

    const items = [
        { label: "Tipo PQRS", value: data?.pqrsType?.name },
        { label: "Status", value: data?.applicationStatus?.name },
        { label: "Departamento", value: data?.department?.name },
        { label: "Municipio", value: data?.municipality?.name },
        { label: "Razón", value: data?.reason?.name },
        { label: "EPS", value: data?.eps?.name },
        { label: "Entidad", value: data?.entity },
        { label: "Responsable", value: data?.userSystem?.name },
        { label: "Fecha del Evento", value: data?.dateOfEvents },
    ];

    return (
        <Card
            sx={{
                borderRadius: 2,
                overflow: "hidden",
                mt: 3,
                boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
            }}
        >
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
                            {items.map((item) => (
                                <Grid item xs={12} md={6} key={item.label}>
                                    <Box
                                        sx={{
                                            p: 1.5,
                                            borderRadius: 2,
                                            backgroundColor: "rgba(15,55,90,0.04)",
                                        }}
                                    >
                                        <Typography variant="caption" sx={{ letterSpacing: 0.6 }}>
                                            {item.label}
                                        </Typography>
                                        <Divider sx={{ my: 0.6 }} />
                                        <Typography fontWeight={600}>
                                            {item.value || "—"}
                                        </Typography>
                                    </Box>
                                </Grid>
                            ))}
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
                            <Grid item xs={12} md={6}>
                                <Box
                                    sx={{
                                        p: 1.5,
                                        borderRadius: 2,
                                        backgroundColor: "rgba(15,55,90,0.04)",
                                    }}
                                >
                                    <Typography variant="caption" sx={{ letterSpacing: 0.6 }}>
                                        Descripción
                                    </Typography>
                                    <Divider sx={{ my: 0.6 }} />
                                    <Typography fontWeight={600}>
                                        {data?.descriptionOfEvents || "—"}
                                    </Typography>
                                </Box>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
};
