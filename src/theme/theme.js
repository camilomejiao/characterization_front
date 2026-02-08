import { createTheme } from "@mui/material/styles";

export const appTheme = createTheme({
    palette: {
        mode: "light",
        primary: {
            main: "#0f375a",
        },
        secondary: {
            main: "#2fa87e",
        },
        info: {
            main: "#2d6fc4",
        },
        warning: {
            main: "#d97706",
        },
        error: {
            main: "#c2410c",
        },
        background: {
            default: "#f5f7fb",
            paper: "#ffffff",
        },
    },
    typography: {
        fontFamily: '"Nunito", "Segoe UI", "Roboto", "Helvetica", "Arial", sans-serif',
        h1: { fontWeight: 800 },
        h2: { fontWeight: 800 },
        h3: { fontWeight: 700 },
        h4: { fontWeight: 700 },
        h5: { fontWeight: 700 },
        h6: { fontWeight: 700 },
        button: { fontWeight: 700, textTransform: "none" },
    },
    shape: {
        borderRadius: 12,
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    background:
                        "linear-gradient(180deg, rgba(246,249,252,1) 0%, rgba(238,243,248,1) 50%, rgba(233,240,247,1) 100%)",
                    color: "#0b1f36",
                },
                "*": {
                    boxSizing: "border-box",
                },
                a: {
                    color: "inherit",
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    borderRadius: 16,
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 16,
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    paddingLeft: 18,
                    paddingRight: 18,
                },
            },
        },
        MuiTextField: {
            defaultProps: {
                variant: "outlined",
                size: "medium",
            },
        },
    },
});
