import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Menu,
    MenuItem,
    Box,
    useTheme,
    Breadcrumbs,
    Chip,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";

export const Navbar = ({ userAuth, isSidebarOpen, handleDrawerToggle, isMobile }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();
    const [anchorEl, setAnchorEl] = useState(null);

    const handleMenu = (e) => setAnchorEl(e.currentTarget);
    const handleClose = () => setAnchorEl(null);
    const handleLogout = () => {
        handleClose();
        navigate("/admin/logout");
    };

    const resolveTitle = (path) => {
        const rules = [
            { match: "/admin/administrator-list", title: "Administradores" },
            { match: "/admin/administrator-create", title: "Crear Administrador" },
            { match: "/admin/administrator-update", title: "Actualizar Administrador" },
            { match: "/admin/user-list", title: "Usuarios" },
            { match: "/admin/user-create", title: "Crear Usuario" },
            { match: "/admin/user-update", title: "Actualizar Usuario" },
            { match: "/admin/pqrs-list", title: "PQRS" },
            { match: "/admin/pqrs-create", title: "Crear PQRS" },
            { match: "/admin/pqrs-update", title: "Actualizar PQRS" },
            { match: "/admin/pqrs-observation", title: "Observaciones PQRS" },
            { match: "/admin/affiliates-list", title: "Afiliados" },
            { match: "/admin/affiliates-create", title: "Crear Afiliado" },
            { match: "/admin/affiliates-update", title: "Actualizar Afiliado" },
            { match: "/admin/affiliates-bulk", title: "Carga Masiva" },
            { match: "/admin/affiliate-history", title: "Historial de Afiliado" },
            { match: "/admin/special-population-list", title: "Población Especial" },
            { match: "/admin/special-population-create", title: "Crear Población Especial" },
            { match: "/admin/special-population-update", title: "Actualizar Población Especial" },
            { match: "/admin/affiliates-report", title: "Reportes" },
        ];

        const matched = rules.find((rule) => path.startsWith(rule.match));
        return matched?.title || "Panel";
    };

    const currentTitle = resolveTitle(location.pathname);

    return (
        <AppBar
            position="fixed"
            color="transparent"
            elevation={0}
            sx={{
                zIndex: theme.zIndex.drawer + 1,
                width: isMobile ? "100%" : `calc(100% - ${isSidebarOpen ? 240 : 64}px)`,
                left: isMobile ? 0 : `${isSidebarOpen ? 240 : 64}px`,
                transition: "left 0.3s ease, width 0.3s ease",
                background: "linear-gradient(90deg, #0f375a 0%, #134a74 50%, #1f6a9f 100%)",
                color: "#fff",
                borderBottom: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 0,
            }}
        >
            <Toolbar sx={{ justifyContent: "space-between", px: { xs: 1.5, sm: 3 } }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    {isMobile && (
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="start"
                            onClick={handleDrawerToggle}
                            sx={{ mr: 1 }}
                        >
                            <MenuIcon />
                        </IconButton>
                    )}
                    <Box>
                        <Typography variant="h6" noWrap sx={{ fontWeight: 800, letterSpacing: 1 }}>
                            SIGES
                        </Typography>
                        <Breadcrumbs
                            aria-label="breadcrumb"
                            sx={{ color: "rgba(255,255,255,0.8)" }}
                        >
                            <Typography variant="caption">Inicio</Typography>
                            <Typography variant="caption">{currentTitle}</Typography>
                        </Breadcrumbs>
                    </Box>
                    {userAuth?.organization && (
                        <Chip
                            size="small"
                            label={`Org ${userAuth.organization}`}
                            sx={{
                                backgroundColor: "rgba(255,255,255,0.18)",
                                color: "#fff",
                                fontWeight: 600,
                            }}
                        />
                    )}
                </Box>

                <Box>
                    <IconButton onClick={handleMenu} color="inherit">
                        <AccountCircle />
                        <Typography
                            variant="body1"
                            sx={{
                                ml: 1,
                                display: { xs: "none", sm: "block" },
                                fontSize: { sm: "0.9rem", md: "1rem" },
                            }}
                        >
                            Hola, {userAuth.userName || userAuth.email}
                        </Typography>
                    </IconButton>

                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                        transformOrigin={{ vertical: "top", horizontal: "right" }}
                    >
                        <MenuItem onClick={handleLogout}>
                            <LogoutIcon fontSize="small" sx={{ mr: 1 }} /> Logout
                        </MenuItem>
                    </Menu>
                </Box>
            </Toolbar>
        </AppBar>
    );
};
