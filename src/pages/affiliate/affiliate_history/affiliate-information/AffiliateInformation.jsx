import { Box, Card, CardContent, CardHeader, Grid, Typography } from "@mui/material";
import { FiUser } from "react-icons/fi";

export const AffiliateInformation = ({ data }) => {
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
                                <Typography variant="subtitle2">Régimen</Typography>
                                <Typography fontWeight={600}>{data?.regime?.name}</Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="subtitle2">Estado de afiliación</Typography>
                                <Typography fontWeight={600}>{data?.affiliatedState?.description}</Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="subtitle2">Tipo de población</Typography>
                                <Typography fontWeight={600}>{data?.populationType?.name}</Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="subtitle2">EPS</Typography>
                                <Typography fontWeight={600}>{data?.eps?.name}</Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="subtitle2">IPS Primaria</Typography>
                                <Typography fontWeight={600}>{data?.ipsPrimary?.name || "No registra"}</Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="subtitle2">IPS Odontológica</Typography>
                                <Typography fontWeight={600}>{data?.ipsDental?.name || "No registra"}</Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="subtitle2">Tipo de afiliado</Typography>
                                <Typography fontWeight={600}>{data?.affiliateType?.name || "No registra"}</Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="subtitle2">Metodología</Typography>
                                <Typography fontWeight={600}>{data?.methodology?.name}</Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="subtitle2">Grupo y Subgrupo</Typography>
                                <Typography fontWeight={600}>{data?.groupSubgroup?.subgroup}</Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="subtitle2">Nivel</Typography>
                                <Typography fontWeight={600}>{data?.level?.name ?? "NO REGISTRA"}</Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="subtitle2">Clase de afiliación</Typography>
                                <Typography fontWeight={600}>{data?.membershipClass?.name}</Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="subtitle2">Estado de afiliación</Typography>
                                <Typography fontWeight={600}>{data?.affiliateType?.name}</Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="subtitle2">Número del formulario</Typography>
                                <Typography fontWeight={600}>{data?.formNumber}</Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="subtitle2">Etnia</Typography>
                                <Typography fontWeight={600}>{data?.ethnicity?.name}</Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="subtitle2">Fecha de afiliación</Typography>
                                <Typography fontWeight={600}>{data?.dateOfAffiliated}</Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="subtitle2">Número de ficha Sisben</Typography>
                                <Typography fontWeight={600}>{data?.sisbenNumber}</Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="subtitle2">Observaciones</Typography>
                                <Typography fontWeight={600}>{data?.observations}</Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
};
