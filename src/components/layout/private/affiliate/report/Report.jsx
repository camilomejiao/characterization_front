import React, { useState } from "react";
import {
    Box,
    Card,
    CardContent,
    CardHeader,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
    Grid,
    Typography,
} from "@mui/material";
import { Spinner } from "react-bootstrap";
import AlertComponent from "../../../../../helpers/alert/AlertComponent";

// Icons
import PeopleIcon from "@mui/icons-material/People";
import PieChartIcon from "@mui/icons-material/PieChart";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import TimelineIcon from "@mui/icons-material/Timeline";
import Diversity3Icon from "@mui/icons-material/Diversity3";
import WcIcon from "@mui/icons-material/Wc";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";

const months = [
    { id: "01", name: "Enero" },
    { id: "02", name: "Febrero" },
    { id: "03", name: "Marzo" },
    { id: "04", name: "Abril" },
    { id: "05", name: "Mayo" },
    { id: "06", name: "Junio" },
    { id: "07", name: "Julio" },
    { id: "08", name: "Agosto" },
    { id: "09", name: "Septiembre" },
    { id: "10", name: "Octubre" },
    { id: "11", name: "Noviembre" },
    { id: "12", name: "Diciembre" },
];

const years = Array.from({ length: 6 }, (_, i) => 2025 - i);

const metricCardSx = {
    borderRadius: 2,
    boxShadow: "0 4px 10px rgba(15,23,42,0.08)",
    border: "1px solid #e5e7eb",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    p: 2.5,
    transition: "transform 0.15s ease, box-shadow 0.15s ease",
    "&:hover": {
        transform: "translateY(-2px)",
        boxShadow: "0 8px 18px rgba(15,23,42,0.12)",
    },
};

export const Report = () => {
    const [month, setMonth] = useState("");
    const [year, setYear] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState(null);

    const handleSearch = async () => {
        if (!month || !year) {
            return AlertComponent.warning("Seleccione mes y año");
        }

        try {
            setIsLoading(true);

            // 🔹 DATA FAKE SOLO PARA VER DISEÑO
            const fakeResponse = {
                status: 200,
                data: {
                    totalAffiliates: 12456,
                    byRegime: {
                        SUBSIDIADO: 8900,
                        CONTRIBUTIVO: 3200,
                        ESPECIAL: 356,
                    },
                    byEps: {
                        "SALUD TOTAL": 4500,
                        "NUEVA EPS": 3200,
                        "SURA": 2100,
                        "SANITAS": 1800,
                        OTRAS: 856,
                    },
                    byAgeGroup: {
                        "Menores de 1 año": 120,
                        "1 - 4 años": 540,
                        "5 - 14 años": 2100,
                        "15 - 44 años": 6500,
                        "45 - 59 años": 2300,
                        "60 y más": 896,
                    },
                    byPopulationType: {
                        "Población con SISBEN": 9000,
                        "Víctimas conflicto armado": 1200,
                        "Comunidades indígenas": 430,
                        "Habitante de calle": 120,
                        "Adulto mayor en protección": 300,
                        Otros: 1406,
                    },
                    byGender: {
                        HOMBRES: 6100,
                        MUJERES: 6150,
                        "NO BINARIO": 80,
                        TRANSEXUAL: 126,
                    },
                    lmaAmount: 387654321,
                },
            };

            // const period = `${year}${month}`;
            // const response = await reportServices.getReport(period);
            const response = fakeResponse;

            if (response.status === 200) {
                setData(response.data);
            } else {
                AlertComponent.warning(
                    "No se encontraron datos para el periodo seleccionado"
                );
                setData(null);
            }
        } catch (error) {
            console.error(error);
            AlertComponent.error("Ocurrió un error al cargar los reportes");
            setData(null);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box className="container py-4">
            {/* Card de filtros */}
            <Card elevation={4} sx={{ borderRadius: 2, mb: 3 }}>
                <CardHeader
                    title="Reporteador de Información"
                    subheader="Seleccione el periodo para obtener las estadísticas"
                    sx={{
                        "& .MuiCardHeader-title": { fontWeight: 600, fontSize: "1.2rem" },
                        "& .MuiCardHeader-subheader": { fontSize: "0.9rem", color: "#6b7280" },
                    }}
                />
                <CardContent>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} md={4}>
                            <FormControl fullWidth>
                                <InputLabel>Mes</InputLabel>
                                <Select
                                    value={month}
                                    label="Mes"
                                    onChange={(e) => setMonth(e.target.value)}
                                >
                                    {months.map((m) => (
                                        <MenuItem key={m.id} value={m.id}>
                                            {m.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <FormControl fullWidth>
                                <InputLabel>Año</InputLabel>
                                <Select
                                    value={year}
                                    label="Año"
                                    onChange={(e) => setYear(e.target.value)}
                                >
                                    {years.map((y) => (
                                        <MenuItem key={y} value={y}>
                                            {y}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <Button
                                fullWidth
                                variant="contained"
                                disabled={isLoading}
                                onClick={handleSearch}
                                sx={{
                                    backgroundColor: "#2d8165",
                                    color: "#fff",
                                    height: "56px",
                                    fontWeight: 600,
                                    "&:hover": { backgroundColor: "#256b54" },
                                }}
                            >
                                {isLoading ? "Cargando..." : "Buscar"}
                            </Button>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {isLoading && (
                <Box className="mt-4 text-center">
                    <Spinner animation="border" variant="success" />
                </Box>
            )}

            {/* Resultados */}
            {data && (
                <Card elevation={4} sx={{ borderRadius: 2, mb: 3 }}>
                    <Box mt={2}>
                        <CardContent>
                            {/* TOTAL AFILIADOS */}
                            <Grid item>
                                <Card sx={{ ...metricCardSx }}>
                                    <Box display="flex" justifyContent="space-between" mb={1}>
                                        <Typography variant="subtitle2" color="text.secondary">
                                            Total de Afiliados
                                        </Typography>
                                        <PeopleIcon sx={{ color: "#16a34a" }} />
                                    </Box>
                                    <Typography
                                        variant="h3"
                                        sx={{ fontWeight: 700, color: "#111827" }}
                                    >
                                        {data.totalAffiliates}
                                    </Typography>
                                </Card>
                            </Grid>

                        </CardContent>

                        <CardContent>
                            <Grid container spacing={3}>

                                {/* REGIMEN */}
                                <Grid item xs={12} md={4} sx={{ display: "flex" }}>
                                    <Card sx={{ ...metricCardSx, flex: 1, minHeight: 220 }}>
                                        <Box display="flex" justifyContent="space-between" mb={1}>
                                            <Typography variant="subtitle2" color="text.secondary">
                                                Afiliados por Régimen
                                            </Typography>
                                            <PieChartIcon sx={{ color: "#f97316" }} />
                                        </Box>

                                        <Box sx={{ mt: 1 }}>
                                            {Object.keys(data.byRegime).map((key) => (
                                                <Typography key={key} variant="body2">
                                                    <strong>{key}:</strong> {data.byRegime[key]}
                                                </Typography>
                                            ))}
                                        </Box>
                                    </Card>
                                </Grid>

                                {/* EPS */}
                                <Grid item xs={12} md={4} sx={{ display: "flex" }}>
                                    <Card sx={{ ...metricCardSx, flex: 1, minHeight: 220 }}>
                                        <Box display="flex" justifyContent="space-between" mb={1}>
                                            <Typography variant="subtitle2" color="text.secondary">
                                                Afiliados por EPS
                                            </Typography>
                                            <LocalHospitalIcon sx={{ color: "#2563eb" }} />
                                        </Box>

                                        <Box sx={{ mt: 1 }}>
                                            {Object.keys(data.byEps).map((eps) => (
                                                <Typography key={eps} variant="body2">
                                                    <strong>{eps}:</strong> {data.byEps[eps]}
                                                </Typography>
                                            ))}
                                        </Box>
                                    </Card>
                                </Grid>

                                {/* EDADES */}
                                <Grid item xs={12} md={4} sx={{ display: "flex" }}>
                                    <Card sx={{ ...metricCardSx, flex: 1, minHeight: 220 }}>
                                        <Box display="flex" justifyContent="space-between" mb={1}>
                                            <Typography variant="subtitle2" color="text.secondary">
                                                Distribución por Edades (Res. 3280)
                                            </Typography>
                                            <TimelineIcon sx={{ color: "#8b5cf6" }} />
                                        </Box>

                                        <Box sx={{ mt: 1 }}>
                                            {Object.keys(data.byAgeGroup).map((group) => (
                                                <Typography key={group} variant="body2">
                                                    <strong>{group}:</strong> {data.byAgeGroup[group]}
                                                </Typography>
                                            ))}
                                        </Box>
                                    </Card>
                                </Grid>

                            </Grid>
                        </CardContent>


                        <CardContent>
                            <Grid container spacing={3}>
                                {/* TIPO POBLACIÓN */}
                                <Grid item xs={12} md={4}>
                                    <Card sx={{ ...metricCardSx }}>
                                        <Box display="flex" justifyContent="space-between" mb={1}>
                                            <Typography variant="subtitle2" color="text.secondary">
                                                Tipo de Población
                                            </Typography>
                                            <Diversity3Icon sx={{ color: "#dc2626" }} />
                                        </Box>
                                        <Box>
                                            {Object.keys(data.byPopulationType).map((tp) => (
                                                <Typography key={tp} variant="body2">
                                                    <strong>{tp}:</strong> {data.byPopulationType[tp]}
                                                </Typography>
                                            ))}
                                        </Box>
                                    </Card>
                                </Grid>

                                {/* SEXO / GÉNERO */}
                                <Grid item xs={12} md={4}>
                                    <Card sx={{ ...metricCardSx }}>
                                        <Box display="flex" justifyContent="space-between" mb={1}>
                                            <Typography variant="subtitle2" color="text.secondary">
                                                Sexo / Género
                                            </Typography>
                                            <WcIcon sx={{ color: "#0891b2" }} />
                                        </Box>
                                        <Box>
                                            {Object.keys(data.byGender).map((g) => (
                                                <Typography key={g} variant="body2">
                                                    <strong>{g}:</strong> {data.byGender[g]}
                                                </Typography>
                                            ))}
                                        </Box>
                                    </Card>
                                </Grid>

                                {/* GASTO LMA */}
                                <Grid item xs={12} md={4}>
                                    <Card sx={{ ...metricCardSx, backgroundColor: "#ecfdf3" }}>
                                        <Box display="flex" justifyContent="space-between" mb={1}>
                                            <Typography variant="subtitle2" color="text.secondary">
                                                Gasto en LMA
                                            </Typography>
                                            <AttachMoneyIcon sx={{ color: "#15803d" }} />
                                        </Box>
                                        <Typography
                                            variant="h4"
                                            sx={{ fontWeight: 700, color: "#15803d", mt: 1 }}
                                        >
                                            ${data.lmaAmount?.toLocaleString()}
                                        </Typography>
                                    </Card>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Box>
                </Card>
            )}
        </Box>
    );
};
