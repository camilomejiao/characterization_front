import { useNavigate, useLocation } from "react-router-dom";
import { useState, useMemo } from "react";
import {
    Drawer, List, ListItemButton, ListItemIcon, ListItemText, Collapse,
    IconButton, Divider, Box, useTheme, useMediaQuery
} from "@mui/material";
import {
    ExpandLess, ExpandMore, Menu as MenuIcon, MoreVert,
    Home as HomeIcon, People as PeopleIcon, GridOn, PersonAdd,
    Assignment, Add, Sync
} from "@mui/icons-material";

const NAV_WIDTH_EXPANDED = 240;
const NAV_WIDTH_COLLAPSED = 64;
const DARK_BG = "#031b32";// fondo principal
const DARK_BG_HOVER = "rgba(255,255,255,0.06)";
const DARK_BG_ACTIVE = "rgba(255,255,255,0.12)";
const TEXT_COLOR = "#fff";
const DIVIDER_COLOR = "rgba(255,255,255,0.12)";

export const Sidebar = ({
    isOpen,
    setIsOpen,
    mobileOpen,
    handleDrawerToggle,
    paperSx,
    headerBg
}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const navigate = useNavigate();
    const location = useLocation();

    const [expandedSections, setExpandedSections] = useState({});

    const toggleSection = (section) => {
        setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
    };

    const isActive = useMemo(
        () => (path) => location.pathname.startsWith(path),
        [location.pathname]
    );

    const commonItemSx = {
        color: "inherit",
        "& .MuiListItemIcon-root": { color: "inherit", minWidth: 36 },
        "& .MuiListItemText-primary": { fontWeight: 600 },  // similar a la captura
        "&:hover": { backgroundColor: DARK_BG_HOVER }
    };

    const drawerContent = (
        <>
            {/* Header con imagen/degradado */}
            <Box
                sx={{
                    height: 140,
                    width: "100%",
                    position: "relative",
                    background: headerBg
                        ? undefined
                        : "linear-gradient(180deg, #2f6fdb 0%, #0c3f7a 100%)",
                    backgroundImage: headerBg ? `url(${headerBg})` : undefined,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    borderBottom: `1px solid ${DIVIDER_COLOR}`
                }}
            >
                <Box display="flex" justifyContent="flex-end" p={1}>
                    <IconButton onClick={() => setIsOpen(!isOpen)} sx={{ color: TEXT_COLOR }}>
                        {isOpen ? <MenuIcon /> : <MoreVert />}
                    </IconButton>
                </Box>
            </Box>

            <Divider sx={{ borderColor: DIVIDER_COLOR }} />

            <List sx={{ py: 1 }}>
                {/* Inicio */}
                <ListItemButton
                    onClick={() => navigate("/admin/administrator-list")}
                    selected={isActive("/admin/administrator-list")}
                    sx={{
                        ...commonItemSx,
                        "&.Mui-selected": { backgroundColor: DARK_BG_ACTIVE },
                        "&.Mui-selected:hover": { backgroundColor: DARK_BG_ACTIVE }
                    }}
                >
                    <ListItemIcon><HomeIcon /></ListItemIcon>
                    {isOpen && <ListItemText primary="Inicio" />}
                </ListItemButton>

                {/* Users */}
                <ListItemButton onClick={() => toggleSection("user")} sx={commonItemSx}>
                    <ListItemIcon><PeopleIcon /></ListItemIcon>
                    {isOpen && (
                        <Box display="flex" alignItems="center" width="100%">
                            <ListItemText primary="Inscripciones" />
                            {expandedSections.user ? <ExpandLess /> : <ExpandMore />}
                        </Box>
                    )}
                </ListItemButton>
                <Collapse in={expandedSections.user && isOpen} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        <ListItemButton
                            sx={{ pl: 4, ...commonItemSx }}
                            onClick={() => navigate("/admin/user-list")}
                            selected={isActive("/admin/user-list")}
                        >
                            <ListItemIcon><GridOn /></ListItemIcon>
                            <ListItemText primary="Lista de usuarios" />
                        </ListItemButton>
                        <ListItemButton
                            sx={{ pl: 4, ...commonItemSx }}
                            onClick={() => navigate("/admin/user-create")}
                            selected={isActive("/admin/user-create")}
                        >
                            <ListItemIcon><PersonAdd /></ListItemIcon>
                            <ListItemText primary="Crear usuario" />
                        </ListItemButton>
                    </List>
                </Collapse>

                {/* PQRS */}
                <ListItemButton onClick={() => toggleSection("pqrs")} sx={commonItemSx}>
                    <ListItemIcon><Assignment /></ListItemIcon>
                    {isOpen && (
                        <Box display="flex" alignItems="center" width="100%">
                            <ListItemText primary="Pqrs" />
                            {expandedSections.pqrs ? <ExpandLess /> : <ExpandMore />}
                        </Box>
                    )}
                </ListItemButton>
                <Collapse in={expandedSections.pqrs && isOpen} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        <ListItemButton
                            sx={{ pl: 4, ...commonItemSx }}
                            onClick={() => navigate("/admin/pqrs-list")}
                            selected={isActive("/admin/pqrs-list")}
                        >
                            <ListItemIcon><GridOn /></ListItemIcon>
                            <ListItemText primary="Lista de PQRS" />
                        </ListItemButton>
                        <ListItemButton
                            sx={{ pl: 4, ...commonItemSx }}
                            onClick={() => navigate("/admin/pqrs-create")}
                            selected={isActive("/admin/pqrs-create")}
                        >
                            <ListItemIcon><Add /></ListItemIcon>
                            <ListItemText primary="Crear PQRS" />
                        </ListItemButton>
                    </List>
                </Collapse>

                {/* Afiliados */}
                <ListItemButton onClick={() => toggleSection("affiliates")} sx={commonItemSx}>
                    <ListItemIcon><Assignment /></ListItemIcon>
                    {isOpen && (
                        <Box display="flex" alignItems="center" width="100%">
                            <ListItemText primary="Afiliados" />
                            {expandedSections.affiliates ? <ExpandLess /> : <ExpandMore />}
                        </Box>
                    )}
                </ListItemButton>
                <Collapse in={expandedSections.affiliates && isOpen} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        <ListItemButton
                            sx={{ pl: 4, ...commonItemSx }}
                            onClick={() => navigate("/admin/affiliates-list")}
                            selected={isActive("/admin/affiliates-list")}
                        >
                            <ListItemIcon><GridOn /></ListItemIcon>
                            <ListItemText primary="Reporte" />
                        </ListItemButton>
                        <ListItemButton
                            sx={{ pl: 4, ...commonItemSx }}
                            onClick={() => navigate("/admin/affiliates-list")}
                            selected={isActive("/admin/affiliates-list")}
                        >
                            <ListItemIcon><GridOn /></ListItemIcon>
                            <ListItemText primary="Lista de afiliados" />
                        </ListItemButton>
                        <ListItemButton
                            sx={{ pl: 4, ...commonItemSx }}
                            onClick={() => navigate("/admin/affiliates-create")}
                            selected={isActive("/admin/affiliates-create")}
                        >
                            <ListItemIcon><Add /></ListItemIcon>
                            <ListItemText primary="Registrar afiliado" />
                        </ListItemButton>
                        <ListItemButton
                            sx={{ pl: 4, ...commonItemSx }}
                            onClick={() => navigate("/admin/affiliates-bulk")}
                            selected={isActive("/admin/affiliates-bulk")}
                        >
                            <ListItemIcon><Sync /></ListItemIcon>
                            <ListItemText primary="Proceso masivo" />
                        </ListItemButton>
                        <ListItemButton
                            sx={{ pl: 4, ...commonItemSx }}
                            onClick={() => navigate("/admin/affiliates-list")}
                            selected={isActive("/admin/affiliates-list")}
                        >
                            <ListItemIcon><GridOn /></ListItemIcon>
                            <ListItemText primary="Historial de afiliado" />
                        </ListItemButton>
                    </List>
                </Collapse>

                {/* Listados Censales */}
                <ListItemButton onClick={() => toggleSection("censales")} sx={commonItemSx}>
                    <ListItemIcon><Assignment /></ListItemIcon>
                    {isOpen && (
                        <Box display="flex" alignItems="center" width="100%">
                            <ListItemText primary="Registros Censales" />
                            {expandedSections.censales ? <ExpandLess /> : <ExpandMore />}
                        </Box>
                    )}
                </ListItemButton>
                <Collapse in={expandedSections.censales && isOpen} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        <ListItemButton
                            sx={{ pl: 4, ...commonItemSx }}
                            onClick={() => navigate("/admin/affiliates-list")}
                            selected={isActive("/admin/affiliates-list")}
                        >
                            <ListItemIcon><GridOn /></ListItemIcon>
                            <ListItemText primary="Listado" />
                        </ListItemButton>
                    </List>
                </Collapse>
            </List>
        </>
    );

    return (
        <Drawer
            variant={isMobile ? "temporary" : "permanent"}
            open={isMobile ? mobileOpen : isOpen}
            onClose={handleDrawerToggle}
            ModalProps={{ keepMounted: true }}
            sx={{
                "& .MuiDrawer-paper": {
                    width: isOpen ? NAV_WIDTH_EXPANDED : NAV_WIDTH_COLLAPSED,
                    boxSizing: "border-box",
                    overflowX: "hidden",
                    bgcolor: DARK_BG,
                    color: TEXT_COLOR,
                    borderRight: "none",
                    ...paperSx
                }
            }}
        >
            {drawerContent}
        </Drawer>
    );
};
