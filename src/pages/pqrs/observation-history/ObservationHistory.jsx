import { Card, CardContent, CardHeader, Grid, Typography } from "@mui/material";

export const ObservationHistory = ({ observations }) => {
    if (!observations?.length) return null;

    return (
        <Card sx={{ borderRadius: 4, overflow: "hidden", mt: 4, boxShadow: "0 8px 20px rgba(0,0,0,0.08)" }}>
            <CardHeader
                title="Historial de Observaciones"
                sx={{
                    textAlign: "center",
                    backgroundColor: "#0f375a",
                    color: "#fff",
                    "& .MuiCardHeader-title": { fontWeight: 700 },
                }}
            />
            <CardContent>
                {observations.map((obs, idx) => (
                    <Grid container spacing={2} key={idx} sx={{ pb: 2, mb: 2, borderBottom: "1px solid #e5e7eb" }}>
                        <Grid item xs={12} md={4}>
                            <Typography variant="subtitle2">Fecha</Typography>
                            <Typography fontWeight={600}>
                                {new Date(obs?.created_at).toLocaleDateString()}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Typography variant="subtitle2">Estado</Typography>
                            <Typography fontWeight={600}>{obs?.status?.name}</Typography>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Typography variant="subtitle2">Observación</Typography>
                            <Typography fontWeight={600}>{obs?.notification}</Typography>
                        </Grid>
                    </Grid>
                ))}
            </CardContent>
        </Card>
    );
};
