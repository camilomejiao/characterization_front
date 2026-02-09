import { Box, Card, CardContent, CardHeader, Divider, Typography } from "@mui/material";
import { FiUser } from "react-icons/fi";

export const UserInformation = ({ data }) => {
    const twoCol = {
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "1fr 1fr", lg: "1fr 1fr 1fr" },
        gap: 2,
    };
    const items = [
        { label: "Nombre", value: `${data?.firstName ?? ""} ${data?.firstLastName ?? ""}`.trim() },
        { label: "Tipo de Documento", value: data?.identificationType?.name },
        { label: "Documento", value: data?.identificationNumber },
        { label: "Discapacidad", value: data?.disabilityType?.name || "Ninguna" },
        { label: "Sexo", value: data?.sex?.name },
        { label: "Barrio", value: data?.neighborhood },
        { label: "Área", value: data?.area?.name },
        { label: "Email", value: data?.email ?? "NO REGISTRA" },
        { label: "Dirección", value: data?.address },
        { label: "Teléfono", value: data?.phoneNumber },
    ];

    return (
        <Card
            sx={{ borderRadius: 2, overflow: "hidden", boxShadow: "0 8px 20px rgba(0,0,0,0.08)" }}
        >
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
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        mb: 3,
                        justifyContent: { xs: "center", md: "flex-start" },
                    }}
                >
                    <Box
                        sx={{
                            width: 90,
                            height: 90,
                            borderRadius: "50%",
                            backgroundColor: "#f0f3f7",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: "0 6px 16px rgba(0,0,0,0.12)",
                        }}
                    >
                        <FiUser size={44} color="#041432" />
                    </Box>
                    <Box>
                        <Typography variant="h6" fontWeight={700}>
                            {`${data?.firstName ?? ""} ${data?.firstLastName ?? ""}`.trim() || "—"}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {data?.identificationType?.name || "Documento"}:{" "}
                            {data?.identificationNumber || "—"}
                        </Typography>
                    </Box>
                </Box>

                <Box sx={twoCol}>
                    {items.map((item) => (
                        <Box
                            key={item.label}
                            sx={{
                                p: 1.25,
                                borderRadius: 2,
                                backgroundColor: "rgba(15,55,90,0.04)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                gap: 2,
                            }}
                        >
                            <Typography
                                variant="caption"
                                sx={{ letterSpacing: 0.6, color: "text.secondary" }}
                            >
                                {item.label}
                            </Typography>
                            <Typography variant="body2" fontWeight={600}>
                                {item.value || "—"}
                            </Typography>
                        </Box>
                    ))}
                </Box>
            </CardContent>
        </Card>
    );
};
