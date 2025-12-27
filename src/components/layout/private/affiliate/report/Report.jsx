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
    Table,
    TableBody,
    TableRow,
    TableCell,
} from "@mui/material";
import AlertComponent from "../../../../../helpers/alert/AlertComponent";

// Icons
import PeopleIcon from "@mui/icons-material/People";
import PieChartIcon from "@mui/icons-material/PieChart";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import TimelineIcon from "@mui/icons-material/Timeline";
import Diversity3Icon from "@mui/icons-material/Diversity3";
import WcIcon from "@mui/icons-material/Wc";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";

// Recharts
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    Cell,
} from "recharts";
import { affiliateServices } from "../../../../../helpers/services/AffiliateServices";
import { ResponseStatusEnum } from "../../../../../helpers/GlobalEnum";

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

const years = Array.from({ length: 1 }, (_, i) => 2025 - i);

// ==== ESTILOS BASE (sin width fijo) ====
const baseCardSx = {
    borderRadius: 2,
    boxShadow: "0 4px 10px rgba(15,23,42,0.08)",
    border: "1px solid #e5e7eb",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    gap: 1.2,
    p: 2.5,
    transition: "transform 0.15s ease, box-shadow 0.15s ease",
    "&:hover": {
        transform: "translateY(-2px)",
        boxShadow: "0 8px 18px rgba(15,23,42,0.12)",
    },
};

// tarjetas chiquitas de totales
const kpiCardSx = {
    ...baseCardSx,
    minHeight: 130,
};

// tablas normales (Régimen, EPS, Sexo/Género)
const tableCardSx = {
    ...baseCardSx,
    minHeight: 210,
};

// tablas largas (Edades, Tipo de población)
const tallTableCardSx = {
    ...baseCardSx,
    minHeight: 260,
};

// gráficas grandes
const chartCardSx = {
    ...baseCardSx,
    minHeight: 340,
};

const barColors = ["#22c55e", "#3b82f6", "#f97316", "#a855f7", "#ef4444", "#0ea5e9"];

export const Report = () => {
    const [month, setMonth] = useState("");
    const [year, setYear] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [informationLoadingText, setInformationLoadingText] = useState("");
    const [data, setData] = useState(null);

    const handleSearch = async () => {
        if (!month || !year) {
            return AlertComponent.warning("Seleccione mes y año");
        }

        try {
            setIsLoading(true);
            setInformationLoadingText("Cargando informacion...");

            const { data, status } = await affiliateServices.reportGraphics(month, year);

            if (status === ResponseStatusEnum.OK) {
                setData(data);
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
            setInformationLoadingText("");
        }
    };

    // ---- Datos para las gráficas (solo si existe data) ----
    const ageChartData =
        data &&
        Object.entries(data.byAgeGroup).map(([label, value]) => ({
            label,
            value,
        }));

    // lo usamos ahora como data para barras de población
    const populationBarData =
        data &&
        Object.entries(data.byPopulationType).map(([name, value]) => ({
            name,
            value,
        }));

    // Para la card de Tipo de población en 2 columnas
    const populationEntries = data ? Object.entries(data.byPopulationType) : [];
    const midIndex = Math.ceil(populationEntries.length / 2);
    const populationLeft = populationEntries.slice(0, midIndex);
    const populationRight = populationEntries.slice(midIndex);

    return (
        <Box
            sx={{
                width: "100%",
                px: { xs: 2, md: 4 },
                py: 4,
                bgcolor: "#f3f4f6",
            }}
        >
            {/* Card de filtros */}
            <Card elevation={4} sx={{ borderRadius: 2, mb: 3, maxWidth: "100%" }}>
                <CardHeader
                    title="Reporteador de Información"
                    subheader="Seleccione el periodo para obtener las estadísticas"
                    sx={{
                        "& .MuiCardHeader-title": { fontWeight: 600, fontSize: "1.2rem" },
                        "& .MuiCardHeader-subheader": {
                            fontSize: "0.9rem",
                            color: "#6b7280",
                        },
                    }}
                />
                <CardContent>
                    <Grid container spacing={2} alignItems="center">
                        {/* MES */}
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

                        {/* AÑO */}
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

                        {/* BOTÓN BUSCAR */}
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
                <div className="overlay">
                    <div className="loader">{informationLoadingText}</div>
                </div>
            )}

            {/* RESULTADOS */}
            {data && (
                <Card
                    elevation={4}
                    sx={{
                        borderRadius: 2,
                        mb: 3,
                        p: 2,
                        bgcolor: "#ffffff",
                        width: "100%",
                    }}
                >
                    {/* ========= FILA 1: Total afiliados + Gasto LMA ========= */}
                    <CardContent sx={{ pt: 1, pb: 2 }}>
                        <Box
                            sx={{
                                display: "grid",
                                gap: 2,
                                gridTemplateColumns: {
                                    xs: "1fr",
                                    sm: "repeat(2, minmax(0, 1fr))",
                                },
                            }}
                        >
                            <Card sx={kpiCardSx}>
                                <Box display="flex" justifyContent="space-between" alignItems="center">
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Total de Afiliados
                                    </Typography>
                                    <PeopleIcon sx={{ color: "#16a34a" }} />
                                </Box>
                                <Typography
                                    variant="h3"
                                    sx={{ fontWeight: 700, color: "#111827", lineHeight: 1.1 }}
                                >
                                    {data.totalAffiliates}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Afiliados activos en el periodo.
                                </Typography>
                            </Card>

                            <Card sx={{ ...kpiCardSx, backgroundColor: "#ecfdf3" }}>
                                <Box display="flex" justifyContent="space-between" alignItems="center">
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Gasto en LMA
                                    </Typography>
                                    <AttachMoneyIcon sx={{ color: "#15803d" }} />
                                </Box>
                                <Typography
                                    variant="h4"
                                    sx={{ fontWeight: 700, color: "#15803d", lineHeight: 1.1 }}
                                >
                                    ${data.lmaAmount?.toLocaleString()}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Monto total liquidado en el periodo.
                                </Typography>
                            </Card>
                        </Box>
                    </CardContent>

                    {/* ========= FILA 2: Régimen, EPS, Sexo/Género ========= */}
                    <CardContent sx={{ pt: 0, pb: 2 }}>
                        <Box
                            sx={{
                                display: "grid",
                                gap: 2,
                                gridTemplateColumns: {
                                    xs: "1fr",
                                    sm: "repeat(2, minmax(0, 1fr))",
                                    md: "repeat(3, minmax(0, 1fr))",
                                },
                            }}
                        >
                            {/* Detalle por Régimen */}
                            <Card sx={tableCardSx}>
                                <Box display="flex" justifyContent="space-between" alignItems="center">
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Detalle por Régimen
                                    </Typography>
                                    <PieChartIcon sx={{ color: "#f97316" }} />
                                </Box>
                                <Table size="small">
                                    <TableBody>
                                        {Object.entries(data.byRegime).map(([key, value]) => (
                                            <TableRow key={key}>
                                                <TableCell sx={{ fontWeight: 600 }}>{key}</TableCell>
                                                <TableCell align="right">{value}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </Card>

                            {/* Detalle por EPS */}
                            <Card sx={tableCardSx}>
                                <Box display="flex" justifyContent="space-between" alignItems="center">
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Detalle por EPS
                                    </Typography>
                                    <LocalHospitalIcon sx={{ color: "#2563eb" }} />
                                </Box>
                                <Table size="small">
                                    <TableBody>
                                        {Object.entries(data.byEps).map(([eps, value]) => (
                                            <TableRow key={eps}>
                                                <TableCell sx={{ fontWeight: 600 }}>{eps}</TableCell>
                                                <TableCell align="right">{value}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </Card>

                            {/* Sexo / Género */}
                            <Card sx={tableCardSx}>
                                <Box display="flex" justifyContent="space-between" alignItems="center">
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Sexo / Género
                                    </Typography>
                                    <WcIcon sx={{ color: "#0891b2" }} />
                                </Box>
                                <Table size="small">
                                    <TableBody>
                                        {Object.entries(data.byGender).map(([g, value]) => (
                                            <TableRow key={g}>
                                                <TableCell sx={{ fontWeight: 600 }}>{g}</TableCell>
                                                <TableCell align="right">{value}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </Card>
                        </Box>
                    </CardContent>

                    {/* ========= FILA 3: Edades (izquierda) y Tipo de población (derecha, 2 columnas) ========= */}
                    <CardContent sx={{ pt: 0, pb: 2 }}>
                        <Box
                            sx={{
                                display: "grid",
                                gap: 2,
                                gridTemplateColumns: {
                                    xs: "1fr",
                                    md: "repeat(2, minmax(0, 1fr))",
                                },
                            }}
                        >
                            {/* Distribución por edades */}
                            <Card sx={tallTableCardSx}>
                                <Box display="flex" justifyContent="space-between" alignItems="center">
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Distribución por Edades (Res. 3280)
                                    </Typography>
                                    <TimelineIcon sx={{ color: "#8b5cf6" }} />
                                </Box>
                                <Table size="small">
                                    <TableBody>
                                        {Object.entries(data.byAgeGroup).map(([group, value]) => (
                                            <TableRow key={group}>
                                                <TableCell sx={{ fontWeight: 600 }}>{group}</TableCell>
                                                <TableCell align="right">{value}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </Card>

                            {/* Tipo de población – card de 2 columnas */}
                            <Card sx={tallTableCardSx}>
                                <Box display="flex" justifyContent="space-between" alignItems="center">
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Tipo de Población
                                    </Typography>
                                    <Diversity3Icon sx={{ color: "#dc2626" }} />
                                </Box>

                                <Grid container spacing={1}>
                                    <Grid item xs={12} md={6}>
                                        <Table size="small">
                                            <TableBody>
                                                {populationLeft.map(([tp, value]) => (
                                                    <TableRow key={tp}>
                                                        <TableCell sx={{ fontWeight: 600 }}>{tp}</TableCell>
                                                        <TableCell align="right">{value}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Table size="small">
                                            <TableBody>
                                                {populationRight.map(([tp, value]) => (
                                                    <TableRow key={tp}>
                                                        <TableCell sx={{ fontWeight: 600 }}>{tp}</TableCell>
                                                        <TableCell align="right">{value}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </Grid>
                                </Grid>
                            </Card>
                        </Box>
                    </CardContent>

                    {/* ========= FILA 4: Gráfica Edades + Gráfica Tipo de Población ========= */}
                    <CardContent sx={{ pt: 0 }}>
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: { xs: "column", md: "row" },
                                gap: 2,
                            }}
                        >
                            {/* Gráfica Edades – más vistosa */}
                            <Card sx={{ ...chartCardSx, flex: 1 }}>
                                <Typography
                                    variant="subtitle2"
                                    color="text.secondary"
                                    sx={{ mb: 1 }}
                                >
                                    Gráfica – Distribución por Edades
                                </Typography>
                                <Box sx={{ flex: 1, height: 300 }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={ageChartData}>
                                            <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                                            <YAxis />
                                            <Tooltip />
                                            <Legend />
                                            <Bar
                                                dataKey="value"
                                                name="Afiliados"
                                                radius={[6, 6, 0, 0]}
                                            >
                                                {ageChartData.map((entry, index) => (
                                                    <Cell
                                                        key={entry.label}
                                                        fill={barColors[index % barColors.length]}
                                                    />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </Box>
                            </Card>

                            {/* Gráfica Tipo de Población – barras de colores */}
                            <Card sx={{ ...chartCardSx, flex: 1 }}>
                                <Typography
                                    variant="subtitle2"
                                    color="text.secondary"
                                    sx={{ mb: 1 }}
                                >
                                    Gráfica – Tipo de Población
                                </Typography>
                                <Box sx={{ flex: 1, height: 300 }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={populationBarData}>
                                            <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                                            <YAxis />
                                            <Tooltip />
                                            <Legend />
                                            <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                                                {populationBarData.map((entry, index) => (
                                                    <Cell
                                                        key={entry.name}
                                                        fill={barColors[index % barColors.length]}
                                                    />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </Box>
                            </Card>
                        </Box>
                    </CardContent>
                </Card>
            )}
        </Box>
    );
};
