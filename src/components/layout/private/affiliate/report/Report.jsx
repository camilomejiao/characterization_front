import React, { useMemo, useState } from "react";
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
    Divider,
} from "@mui/material";

import AlertComponent from "../../../../../helpers/alert/AlertComponent";
import { affiliateServices } from "../../../../../helpers/services/AffiliateServices";
import { ResponseStatusEnum } from "../../../../../helpers/GlobalEnum";

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
} from "recharts";

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

const years = Array.from({ length: 2 }, (_, i) => 2026 - i);

// =================== ESTILOS HOMOGÉNEOS ===================
const baseCardSx = {
    borderRadius: 2,
    border: "1px solid #e5e7eb",
    boxShadow: "0 4px 10px rgba(15,23,42,0.06)",
    height: "100%",
};

const headerRowSx = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    mb: 1,
};

const titleSx = { fontWeight: 800, fontSize: "0.95rem", color: "#0f172a" };
const subTitleSx = { fontWeight: 800, fontSize: "0.9rem", color: "#0f172a" };
const chartCardSx = { ...baseCardSx, minHeight: 380 };

const innerBoxSx = {
    borderRadius: 2,
    border: "1px solid #e5e7eb",
    p: 2,
    height: "100%",
};

const baseCardSx2 = {
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
    ...baseCardSx2,
    minHeight: 130,
};

const formatMoney = (n) =>
    new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP" }).format(n ?? 0);

const sortDescEntries = (obj) =>
    Object.entries(obj ?? {}).sort((a, b) => (b[1] ?? 0) - (a[1] ?? 0));

const topNKeys = (obj, n = 12) =>
    sortDescEntries(obj)
        .slice(0, n)
        .map(([k]) => k);

const SimpleTable = ({ rows }) => (
    <Table size="small">
        <TableBody>
            {rows.map(([label, value]) => (
                <TableRow key={label}>
                    <TableCell sx={{ fontWeight: 800, borderBottomColor: "#e5e7eb" }}>
                        {label}
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: 800, borderBottomColor: "#e5e7eb" }}>
                        {value}
                    </TableCell>
                </TableRow>
            ))}
        </TableBody>
    </Table>
);

export const Report = () => {
    const [month, setMonth] = useState("");
    const [year, setYear] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [informationLoadingText, setInformationLoadingText] = useState("");
    const [data, setData] = useState(null);

    const handleSearch = async () => {
        if (!month || !year) return AlertComponent.warning("Seleccione mes y año");

        try {
            setIsLoading(true);
            setInformationLoadingText("Cargando informacion...");

            const { data: apiData, status } = await affiliateServices.reportGraphics(month, year);

            if (status === ResponseStatusEnum.OK) setData(apiData);
            else {
                AlertComponent.warning("No se encontraron datos para el periodo seleccionado");
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

    const epsSubs = data?.byEpsByRegime?.SUBSIDIADO ?? {};
    const epsCont = data?.byEpsByRegime?.CONTRIBUTIVO ?? {};

    const genderSubs = data?.byGenderByRegime?.SUBSIDIADO ?? {};
    const genderCont = data?.byGenderByRegime?.CONTRIBUTIVO ?? {};

    const ageSubs = data?.byAgeGroupByRegime?.SUBSIDIADO ?? {};
    const ageCont = data?.byAgeGroupByRegime?.CONTRIBUTIVO ?? {};

    const popSubs = data?.byPopulationTypeByRegime?.SUBSIDIADO ?? {};
    const popCont = data?.byPopulationTypeByRegime?.CONTRIBUTIVO ?? {};

    const epsSubsRows = useMemo(() => sortDescEntries(epsSubs), [data]);
    const epsContRows = useMemo(() => sortDescEntries(epsCont), [data]);

    const genderSubsRows = useMemo(() => Object.entries(genderSubs), [data]);
    const genderContRows = useMemo(() => Object.entries(genderCont), [data]);

    const ageSubsRows = useMemo(() => Object.entries(ageSubs), [data]);
    const ageContRows = useMemo(() => Object.entries(ageCont), [data]);

    const popSubsRows = useMemo(() => sortDescEntries(popSubs), [data]);
    const popContRows = useMemo(() => sortDescEntries(popCont), [data]);

    const ageChartData = useMemo(() => {
        if (!data) return [];
        const keys = Object.keys(ageSubs);
        return keys.map((label) => ({
            label,
            SUBSIDIADO: ageSubs[label] ?? 0,
            CONTRIBUTIVO: ageCont[label] ?? 0,
        }));
    }, [data]);

    const populationBarData = useMemo(() => {
        if (!data) return [];
        const keys = Array.from(new Set([...topNKeys(popSubs, 12), ...topNKeys(popCont, 12)]));
        return keys.map((name) => ({
            name,
            SUBSIDIADO: popSubs[name] ?? 0,
            CONTRIBUTIVO: popCont[name] ?? 0,
        }));
    }, [data]);

    return (
        // ✅ Fondo full width
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

                    {/* ========= FILA 1: Total afiliados + Gasto LMA + Régimenes ========= */}
                    <CardContent sx={{ pt: 1, pb: 2 }}>
                        <Box
                            sx={{
                                display: "grid",
                                gap: 2,
                                gridTemplateColumns: {
                                    xs: "1fr",
                                    sm: "repeat(3, minmax(0, 1fr))",
                                },
                            }}
                        >
                            {/* Total */}
                            <Card sx={{...kpiCardSx, backgroundColor: "#ecf1fd"}}>
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

                            {/* Detalle LMA */}
                            <Card sx={{...kpiCardSx, backgroundColor: "#ecfdf3" }}>
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

                            {/* Detalle por Régimen */}
                            <Card sx={{...kpiCardSx, backgroundColor: "#fadbdb"}}>
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
                        </Box>
                    </CardContent>

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
                            {/* ===== SEXO ===== */}
                            <Card sx={{...kpiCardSx}}>
                                <CardContent sx={{ p: 2.5 }}>
                                        <Box sx={headerRowSx}>
                                            <Typography sx={titleSx}>Sexo / Género</Typography>
                                            <WcIcon sx={{ color: "#0891b2" }} />
                                        </Box>
                                        <Divider sx={{ mb: 2 }} />

                                        <Grid container spacing={2}>
                                            <Grid item xs={12} md={6}>
                                                <Box sx={innerBoxSx}>
                                                    <Typography sx={subTitleSx} gutterBottom>
                                                        Subsidiado
                                                    </Typography>
                                                    <SimpleTable rows={genderSubsRows} />
                                                </Box>
                                            </Grid>

                                            <Grid item xs={12} md={6}>
                                                <Box sx={innerBoxSx}>
                                                    <Typography sx={subTitleSx} gutterBottom>
                                                        Contributivo
                                                    </Typography>
                                                    <SimpleTable rows={genderContRows} />
                                                </Box>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                            </Card>

                            {/* ===== EPS ===== */}
                            <Card sx={{...kpiCardSx}}>
                                <CardContent sx={{ p: 2.5 }}>
                                    <Box sx={headerRowSx}>
                                        <Typography sx={titleSx}>Detalle por EPS</Typography>
                                        <LocalHospitalIcon sx={{ color: "#2563eb" }} />
                                    </Box>
                                    <Divider sx={{ mb: 2 }} />

                                    <Grid container spacing={2}>
                                        <Grid item xs={12} md={6}>
                                            <Box sx={innerBoxSx}>
                                                <Typography sx={subTitleSx} gutterBottom>
                                                    Subsidiado
                                                </Typography>
                                                <SimpleTable rows={epsSubsRows} />
                                            </Box>
                                        </Grid>

                                        <Grid item xs={12} md={6}>
                                            <Box sx={innerBoxSx}>
                                                <Typography sx={subTitleSx} gutterBottom>
                                                    Contributivo
                                                </Typography>
                                                <SimpleTable rows={epsContRows} />
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Box>
                    </CardContent>

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
                            {/* ===== EDADES ===== */}
                            <Card sx={{...kpiCardSx}}>
                                <CardContent sx={{ p: 2.5 }}>
                                    <Box sx={headerRowSx}>
                                        <Typography sx={titleSx}>Distribución por Edades (Res. 3280)</Typography>
                                        <TimelineIcon sx={{ color: "#8b5cf6" }} />
                                    </Box>
                                    <Divider sx={{ mb: 2 }} />

                                    <Grid container spacing={2}>
                                        <Grid item xs={12} md={6}>
                                            <Box sx={innerBoxSx}>
                                                <Typography sx={subTitleSx} gutterBottom>
                                                    Subsidiado
                                                </Typography>
                                                <SimpleTable rows={ageSubsRows} />
                                            </Box>
                                        </Grid>

                                        <Grid item xs={12} md={6}>
                                            <Box sx={innerBoxSx}>
                                                <Typography sx={subTitleSx} gutterBottom>
                                                    Contributivo
                                                </Typography>
                                                <SimpleTable rows={ageContRows} />
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>

                            {/* ===== EDADES ===== */}
                            <Card sx={chartCardSx}>
                                <CardContent sx={{ p: 2.5 }}>
                                    <Box sx={headerRowSx}>
                                        <Typography sx={titleSx}>Gráfica – Edades (Subsidiado vs Contributivo)</Typography>
                                        <TimelineIcon sx={{ color: "#8b5cf6" }} />
                                    </Box>
                                    <Divider sx={{ mb: 2 }} />

                                    <Box sx={{ height: 300 }}>
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={ageChartData}>
                                                <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                                                <YAxis />
                                                <Tooltip />
                                                <Legend />
                                                <Bar dataKey="SUBSIDIADO" fill="#22c55e" radius={[6, 6, 0, 0]} />
                                                <Bar dataKey="CONTRIBUTIVO" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Box>
                    </CardContent>

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
                            {/* ===== TIPO POBLACIÓN ===== */}
                            <Card sx={{...kpiCardSx }}>
                                <CardContent sx={{ p: 2.5 }}>
                                    <Box sx={headerRowSx}>
                                        <Typography sx={titleSx}>Tipo de Población</Typography>
                                        <Diversity3Icon sx={{ color: "#dc2626" }} />
                                    </Box>
                                    <Divider sx={{ mb: 2 }} />

                                    <Grid container spacing={2}>
                                        <Grid item xs={12} md={6}>
                                            <Box sx={innerBoxSx}>
                                                <Typography sx={subTitleSx} gutterBottom>
                                                    Subsidiado
                                                </Typography>
                                                <Box sx={{ maxHeight: 250, overflow: "auto" }}>
                                                    <SimpleTable rows={popSubsRows} />
                                                </Box>
                                            </Box>
                                        </Grid>

                                        <Grid item xs={12} md={6}>
                                            <Box sx={innerBoxSx}>
                                                <Typography sx={subTitleSx} gutterBottom>
                                                    Contributivo
                                                </Typography>
                                                <Box sx={{ maxHeight: 250, overflow: "auto" }}>
                                                    <SimpleTable rows={popContRows} />
                                                </Box>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>

                            <Card sx={chartCardSx}>
                                <CardContent sx={{ p: 2.5 }}>
                                    <Box sx={headerRowSx}>
                                        <Typography sx={titleSx}>
                                            Gráfica – Tipo de Población (Top 12) (Subsidiado vs Contributivo)
                                        </Typography>
                                        <Diversity3Icon sx={{ color: "#dc2626" }} />
                                    </Box>
                                    <Divider sx={{ mb: 2 }} />

                                    <Box sx={{ height: 300 }}>
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={populationBarData}>
                                                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                                                <YAxis />
                                                <Tooltip />
                                                <Legend />
                                                <Bar dataKey="SUBSIDIADO" fill="#22c55e" radius={[6, 6, 0, 0]} />
                                                <Bar dataKey="CONTRIBUTIVO" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Box>
                    </CardContent>

                </Card>
            )}
        </Box>
    );
};
