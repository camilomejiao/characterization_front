import { Box, Chip, Paper, Stack, Typography } from "@mui/material";

export const PageHeader = ({ title, subtitle, stats = [], actions, children }) => {
    return (
        <Paper
            elevation={0}
            sx={{
                p: { xs: 2, sm: 3 },
                mb: 3,
                borderRadius: 0,
                background:
                    "linear-gradient(135deg, rgba(15,55,90,0.95) 0%, rgba(31,106,159,0.95) 55%, rgba(47,168,126,0.9) 100%)",
                color: "#fff",
                boxShadow: "0 18px 45px rgba(15,55,90,0.25)",
                position: "relative",
                overflow: "hidden",
            }}
        >
            <Box
                sx={{
                    position: "absolute",
                    inset: 0,
                    opacity: 0.25,
                    background:
                        "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.2), transparent 40%), radial-gradient(circle at 80% 10%, rgba(255,255,255,0.15), transparent 35%)",
                }}
            />

            <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                alignItems={{ xs: "flex-start", sm: "center" }}
                justifyContent="space-between"
                sx={{ position: "relative", zIndex: 1 }}
            >
                <Box>
                    <Typography variant="overline" sx={{ letterSpacing: 2, opacity: 0.85 }}>
                        Gestión
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 800, lineHeight: 1.1 }}>
                        {title}
                    </Typography>
                    {subtitle && (
                        <Typography variant="body2" sx={{ mt: 1, opacity: 0.9 }}>
                            {subtitle}
                        </Typography>
                    )}
                </Box>
                {actions && <Box>{actions}</Box>}
            </Stack>

            {stats.length > 0 && (
                <Stack direction="row" spacing={1} sx={{ mt: 2, position: "relative", zIndex: 1 }}>
                    {stats.map((stat) => (
                        <Chip
                            key={stat.label}
                            label={`${stat.label}: ${stat.value}`}
                            sx={{
                                color: "#0b1f36",
                                backgroundColor: stat.color || "rgba(255,255,255,0.9)",
                                fontWeight: 700,
                            }}
                        />
                    ))}
                </Stack>
            )}

            {children && (
                <Box sx={{ mt: 2, position: "relative", zIndex: 1 }}>
                    {children}
                </Box>
            )}
        </Paper>
    );
};
