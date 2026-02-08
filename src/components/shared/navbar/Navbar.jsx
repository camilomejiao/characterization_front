import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Menu,
    MenuItem,
    Box,
    useTheme,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";

export const Navbar = ({ userAuth, isSidebarOpen, handleDrawerToggle, isMobile }) => {
    const navigate = useNavigate();
    const theme = useTheme();
    const [anchorEl, setAnchorEl] = useState(null);

    const handleMenu = (e) => setAnchorEl(e.currentTarget);
    const handleClose = () => setAnchorEl(null);
    const handleLogout = () => {
        handleClose();
        navigate("/admin/logout");
    };

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
            }}
        >
            <Toolbar sx={{ justifyContent: "space-between", px: { xs: 1.5, sm: 3 } }}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
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
                    <Typography variant="h6" noWrap sx={{ fontWeight: 800, letterSpacing: 1 }}>
                        SIGES
                    </Typography>
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
