import { useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { Box, CssBaseline, Toolbar, useMediaQuery, useTheme } from "@mui/material";
import useAuth from "../../../hooks/useAuth";
import { Navbar } from "../shared/navbar/Navbar";
import { Sidebar } from "../shared/sidebar/Sidebar";


const LoadingIndicator = () => <div>Cargando...</div>;

export const PrivateLayout = () => {
    const { auth, loading, logout } = useAuth();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    if (loading) return <LoadingIndicator />;
    if (!auth?.id) {
        logout();
        return <Navigate to="/login" replace />;
    }

    return (
        <Box sx={{ display: "flex" }}>
            <CssBaseline />

            <Navbar
                userAuth={auth}
                isSidebarOpen={isSidebarOpen}
                handleDrawerToggle={handleDrawerToggle}
                isMobile={isMobile}
            />

            <Sidebar
                isOpen={isSidebarOpen}
                setIsOpen={setIsSidebarOpen}
                mobileOpen={mobileOpen}
                handleDrawerToggle={handleDrawerToggle}
                paperSx={{ bgcolor: "#102844", color: "#fff" }}
                headerBg={"/assets/tu-header-azul.png"}
                userAuth={auth}
            />

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    mt: "64px",
                    ml: isMobile ? 0 : isSidebarOpen ? "240px" : "64px",
                    transition: "margin 0.3s ease",
                    overflow: "hidden",
                    height: "100vh",
                }}
            >
                <Toolbar />
                <Box sx={{ p: 3, height: "calc(100vh - 64px)", overflow: "auto" }}>
                    <Outlet context={{ userAuth: auth }} />
                </Box>
            </Box>
        </Box>
    );
};
