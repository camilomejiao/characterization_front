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
    useMediaQuery
} from "@mui/material";
import {
    ExpandLess,
    ExpandMore,
    Menu as MenuIcon,
    Home as HomeIcon,
    People as PeopleIcon,
    GridOn,
    PersonAdd,
    Assignment,
    Add,
    MoreVert, Sync
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export const Sidebar = ({ isOpen, setIsOpen, mobileOpen, handleDrawerToggle }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const navigate = useNavigate();

    const [expandedSections, setExpandedSections] = useState({});

    const toggleSection = (section) => {
        setExpandedSections((prev) => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const drawerContent = (
        <>
            <Box display="flex" justifyContent="flex-end" p={1}>
                <IconButton onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <MenuIcon /> : <MoreVert />}
                </IconButton>
            </Box>

            <Divider />

            <List>
                <ListItemButton onClick={() => navigate("/admin/administrator-list")}>
                    <ListItemIcon><HomeIcon /></ListItemIcon>
                    {isOpen && <ListItemText primary="Admin" />}
                </ListItemButton>

                {/* Users Section */}
                <ListItemButton onClick={() => toggleSection("user")}>
                    <ListItemIcon><PeopleIcon /></ListItemIcon>
                    {isOpen && <ListItemText primary="Users" />}
                    {isOpen && (expandedSections.user ? <ExpandLess /> : <ExpandMore />)}
                </ListItemButton>
                <Collapse in={expandedSections.user && isOpen} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        <ListItemButton sx={{ pl: 4 }} onClick={() => navigate("/admin/user-list")}>
                            <ListItemIcon><GridOn /></ListItemIcon>
                            <ListItemText primary="Lista de usuarios" />
                        </ListItemButton>
                        <ListItemButton sx={{ pl: 4 }} onClick={() => navigate("/admin/user-create")}>
                            <ListItemIcon><PersonAdd /></ListItemIcon>
                            <ListItemText primary="Crear usuario" />
                        </ListItemButton>
                    </List>
                </Collapse>

                {/* PQRS */}
                <ListItemButton onClick={() => toggleSection("pqrs")}>
                    <ListItemIcon><Assignment /></ListItemIcon>
                    {isOpen && <ListItemText primary="Pqrs" />}
                    {isOpen && (expandedSections.pqrs ? <ExpandLess /> : <ExpandMore />)}
                </ListItemButton>
                <Collapse in={expandedSections.pqrs && isOpen} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        <ListItemButton sx={{ pl: 4 }} onClick={() => navigate("/admin/pqrs-list")}>
                            <ListItemIcon><GridOn /></ListItemIcon>
                            <ListItemText primary="Lista de PQRS" />
                        </ListItemButton>
                        <ListItemButton sx={{ pl: 4 }} onClick={() => navigate("/admin/pqrs-create")}>
                            <ListItemIcon><Add /></ListItemIcon>
                            <ListItemText primary="Crear PQRS" />
                        </ListItemButton>
                    </List>
                </Collapse>

                {/* Affiliate */}
                <ListItemButton onClick={() => toggleSection("affiliates")}>
                    <ListItemIcon><Assignment /></ListItemIcon>
                    {isOpen && <ListItemText primary="Afiliados" />}
                    {isOpen && (expandedSections.affiliates ? <ExpandLess /> : <ExpandMore />)}
                </ListItemButton>
                <Collapse in={expandedSections.affiliates && isOpen} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        <ListItemButton sx={{ pl: 4 }} onClick={() => navigate("/admin/affiliates-list")}>
                            <ListItemIcon><GridOn /></ListItemIcon>
                            <ListItemText primary="Lista de afiliados" />
                        </ListItemButton>
                        <ListItemButton sx={{ pl: 4 }} onClick={() => navigate("/admin/affiliates-create")}>
                            <ListItemIcon><Add /></ListItemIcon>
                            <ListItemText primary="Registrar afiliado" />
                        </ListItemButton>
                        <ListItemButton sx={{ pl: 4 }} onClick={() => navigate("/admin/affiliates-bulk")}>
                            <ListItemIcon><Sync /></ListItemIcon>
                            <ListItemText primary="Proceso masivo" />
                        </ListItemButton>
                    </List>
                </Collapse>

                {/* Censales */}
                <ListItemButton onClick={() => toggleSection("censales")}>
                    <ListItemIcon><Assignment /></ListItemIcon>
                    {isOpen && <ListItemText primary="Reportes Cesales" />}
                    {isOpen && (expandedSections.censales ? <ExpandLess /> : <ExpandMore />)}
                </ListItemButton>
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
                width: isMobile ? '100%' : (isOpen ? 0 : 0),
                '& .MuiDrawer-paper': {
                    width: isOpen ? 240 : 64,
                    boxSizing: 'border-box',
                    overflowX: "hidden",
                }
            }}
        >
            {drawerContent}
        </Drawer>
    );
};
