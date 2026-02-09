import { useNavigate, useLocation } from "react-router-dom";
import { useState, useMemo } from "react";
import {
    Drawer,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Collapse,
    IconButton,
    Divider,
    Box,
    useTheme,
    useMediaQuery,
    Typography,
    Avatar,
    Chip,
} from "@mui/material";
import {
    ExpandLess,
    ExpandMore,
    Menu as MenuIcon,
    MoreVert,
    Home as HomeIcon,
    People as PeopleIcon,
    PersonAdd,
    Assignment,
    Add,
    Sync,
    ListAlt,
    ReceiptLong,
    Analytics,
} from "@mui/icons-material";

//Enum
import { RolesEnum } from "../../../helpers/GlobalEnum";

const NAV_WIDTH_EXPANDED = 240;
const NAV_WIDTH_COLLAPSED = 64;
const DARK_BG = "#0b1f36";
const DARK_BG_HOVER = "rgba(255,255,255,0.08)";
const DARK_BG_ACTIVE = "rgba(255,255,255,0.16)";
const TEXT_COLOR = "#fff";
const DIVIDER_COLOR = "rgba(255,255,255,0.12)";

/**
 * Menú base con TODAS las secciones posibles.
 * Cada sección tiene:
 *  - key: identificador único
 *  - type: "item" (simple) o "collapse" (con hijos)
 *  - label, icon
 *  - path (para item simple) o children (para collapse)
 */
const baseMenu = [
    {
        key: "home",
        type: "item",
        label: "Inicio",
        icon: HomeIcon,
        path: "/admin/administrator-list",
    },
    {
        key: "user",
        type: "collapse",
        label: "Inscripciones",
        icon: PeopleIcon,
        children: [
            {
                label: "Lista de usuarios",
                path: "/admin/user-list",
                icon: ListAlt,
            },
            {
                label: "Crear usuario",
                path: "/admin/user-create",
                icon: PersonAdd,
            },
        ],
    },
    {
        key: "pqrs",
        type: "collapse",
        label: "Pqrs",
        icon: Assignment,
        children: [
            {
                label: "Lista de PQRS",
                path: "/admin/pqrs-list",
                icon: ListAlt,
            },
            {
                label: "Crear PQRS",
                path: "/admin/pqrs-create",
                icon: Add,
            },
        ],
    },
    {
        key: "affiliates",
        type: "collapse",
        label: "Afiliados",
        icon: Assignment,
        children: [
            {
                label: "Lista de afiliados",
                path: "/admin/affiliates-list",
                icon: ListAlt,
            },
            {
                label: "Registrar afiliado",
                path: "/admin/affiliates-create",
                icon: Add,
            },
        ],
    },
    {
        key: "membership_module",
        type: "collapse",
        label: "Afiliados",
        icon: Assignment,
        children: [
            {
                label: "Lista de afiliados",
                path: "/admin/affiliates-list",
                icon: ListAlt,
            },
            {
                label: "Registrar afiliado",
                path: "/admin/affiliates-create",
                icon: Add,
            },
            {
                label: "Proceso masivo",
                path: "/admin/affiliates-bulk",
                icon: Sync,
            },
        ],
    },
    {
        key: "censales",
        type: "collapse",
        label: "Registros Censales",
        icon: Assignment,
        children: [
            {
                label: "Listado",
                path: "/admin/special-population-list",
                icon: ListAlt,
            },
            {
                label: "Registrar población Especial",
                path: "/admin/special-population-create",
                icon: Add,
            },
        ],
    },
    {
        key: "reportes",
        type: "collapse",
        label: "Reportes",
        icon: Assignment,
        children: [
            {
                label: "Reporte",
                path: "/admin/affiliates-report",
                icon: Analytics,
            },
            {
                label: "Historial de afiliado",
                path: "/admin/affiliate-history",
                icon: ReceiptLong,
            },
        ],
    },
];

/**
 * Config por rol: qué secciones del baseMenu ve cada rol.
 * Solo ponemos los keys de baseMenu.
 */
const roleMenuMap = {
    [RolesEnum.SUPER_ADMIN]: ["home", "user", "pqrs", "membership_module", "censales", "reportes"],
    [RolesEnum.ADMIN]: ["home", "user", "affiliates", "censales", "reportes"],
    [RolesEnum.PQRS]: ["user", "pqrs"],
    [RolesEnum.AFFILIATES]: ["user", "pqrs", "affiliates"],
    [RolesEnum.CENSALES]: ["user", "affiliates", "censales"],
    [RolesEnum.AUDITOR]: ["user", "pqrs", "censales", "membership_module", "reportes"],
};

export const Sidebar = ({
    isOpen,
    setIsOpen,
    mobileOpen,
    handleDrawerToggle,
    paperSx,
    headerBg,
    userAuth,
}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const navigate = useNavigate();
    const location = useLocation();

    const [expandedSections, setExpandedSections] = useState({});

    const toggleSection = (sectionKey) => {
        setExpandedSections((prev) => ({
            ...prev,
            [sectionKey]: !prev[sectionKey],
        }));
    };

    const isActive = useMemo(
        () => (path) => location.pathname.startsWith(path),
        [location.pathname],
    );

    const commonItemSx = {
        color: "inherit",
        "& .MuiListItemIcon-root": { color: "inherit", minWidth: 36 },
        "& .MuiListItemText-primary": { fontWeight: 600 },
        "&:hover": { backgroundColor: DARK_BG_HOVER },
    };

    const role = userAuth?.rol_id?.id;
    const allowedKeys = roleMenuMap[role];

    const menuSections = useMemo(
        () => baseMenu.filter((sec) => allowedKeys.includes(sec.key)),
        [allowedKeys],
    );

    const renderItem = (item) => {
        const Icon = item.icon;
        const selected = isActive(item.path);

        return (
            <ListItemButton
                key={item.path}
                sx={{
                    ...commonItemSx,
                    pl: 4,
                    "&.Mui-selected": { backgroundColor: DARK_BG_ACTIVE },
                    "&.Mui-selected:hover": { backgroundColor: DARK_BG_ACTIVE },
                }}
                onClick={() => navigate(item.path)}
                selected={selected}
            >
                <ListItemIcon>
                    <Icon />
                </ListItemIcon>
                {isOpen && <ListItemText primary={item.label} />}
            </ListItemButton>
        );
    };

    const renderSection = (section) => {
        const Icon = section.icon;

        if (section.type === "item") {
            const selected = isActive(section.path);

            return (
                <ListItemButton
                    key={section.key}
                    onClick={() => navigate(section.path)}
                    selected={selected}
                    sx={{
                        ...commonItemSx,
                        "&.Mui-selected": { backgroundColor: DARK_BG_ACTIVE },
                        "&.Mui-selected:hover": { backgroundColor: DARK_BG_ACTIVE },
                    }}
                >
                    <ListItemIcon>
                        <Icon />
                    </ListItemIcon>
                    {isOpen && <ListItemText primary={section.label} />}
                </ListItemButton>
            );
        }

        // type === "collapse"
        const sectionExpanded = expandedSections[section.key];

        return (
            <div key={section.key}>
                <ListItemButton onClick={() => toggleSection(section.key)} sx={commonItemSx}>
                    <ListItemIcon>
                        <Icon />
                    </ListItemIcon>
                    {isOpen && (
                        <Box display="flex" alignItems="center" width="100%">
                            <ListItemText primary={section.label} />
                            {sectionExpanded ? <ExpandLess /> : <ExpandMore />}
                        </Box>
                    )}
                </ListItemButton>

                <Collapse in={sectionExpanded && isOpen} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        {section.children?.map((child) => renderItem(child))}
                    </List>
                </Collapse>
            </div>
        );
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
                        : "linear-gradient(180deg, #1f6a9f 0%, #0b1f36 100%)",
                    backgroundImage: headerBg ? `url(${headerBg})` : undefined,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    borderBottom: `1px solid ${DIVIDER_COLOR}`,
                }}
            >
                <Box display="flex" justifyContent="flex-end" p={1}>
                    <IconButton onClick={() => setIsOpen(!isOpen)} sx={{ color: TEXT_COLOR }}>
                        {isOpen ? <MenuIcon /> : <MoreVert />}
                    </IconButton>
                </Box>
            </Box>

            <Divider sx={{ borderColor: DIVIDER_COLOR }} />

            <Box sx={{ px: 2, py: 2, display: "flex", alignItems: "center", gap: 1.5 }}>
                <Avatar sx={{ bgcolor: "#2fa87e", width: 42, height: 42 }}>
                    {(userAuth?.userName || userAuth?.email || "U")[0]?.toUpperCase()}
                </Avatar>
                {isOpen && (
                    <Box>
                        <Typography variant="subtitle2" sx={{ color: TEXT_COLOR, fontWeight: 700 }}>
                            {userAuth?.userName || userAuth?.email || "Usuario"}
                        </Typography>
                        <Chip
                            size="small"
                            label={`Rol ${userAuth?.rol_id?.id || userAuth?.rol_id || "—"}`}
                            sx={{
                                mt: 0.5,
                                backgroundColor: "rgba(255,255,255,0.15)",
                                color: TEXT_COLOR,
                            }}
                        />
                    </Box>
                )}
            </Box>

            <List sx={{ py: 1 }}>{menuSections.map((section) => renderSection(section))}</List>
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
                    borderRadius: 0,
                    ...paperSx,
                },
            }}
        >
            {drawerContent}
        </Drawer>
    );
};
