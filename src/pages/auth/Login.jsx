import React, { useState } from "react";
import {
    Box,
    Button,
    Divider,
    Grid,
    IconButton,
    InputAdornment,
    Paper,
    TextField,
    Typography,
} from "@mui/material";
import { Email, Lock, Visibility, VisibilityOff } from "@mui/icons-material";
import { Formik } from "formik";
import * as yup from "yup";

import useAuth from "../../hooks/useAuth";
import AlertComponent from "../../helpers/alert/AlertComponent";
import { authService } from "../../services/AuthServices";

import imageLogin from "../../assets/image/login/img-login.png";
import imageLoginForm from "../../assets/image/login/image.png";

const initialValues = {
    email: "",
    password: "",
};

const loginSchema = yup.object().shape({
    email: yup.string().required("Email es requerido"),
    password: yup.string().required("Contraseña es requerida"),
});

export const Login = () => {
    const { setAuth } = useAuth();
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    const handleLogin = async (values, { resetForm }) => {
        const informationToSend = {
            email: values.valueOf().email,
            password: values.valueOf().password,
        };

        const respServicesLogin = await authService.login(informationToSend).then((data) => data);

        if (!respServicesLogin.accessToken && !respServicesLogin.user) {
            AlertComponent.error("Oops...", "Usuario o Contraseña incorrecta");
        } else {
            AlertComponent.success("Bien hecho!", "Te has logueado correctamente!");
            setAuth(respServicesLogin);
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        }

        resetForm();
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                background:
                    "radial-gradient(1200px 600px at 10% 10%, rgba(64,165,129,0.35), transparent 60%), linear-gradient(135deg, #0b1f36 0%, #0f375a 55%, #163f6a 100%)",
                display: "flex",
                alignItems: "stretch",
            }}
        >
            <Grid container sx={{ minHeight: "100vh" }}>
                <Grid
                    item
                    xs={12}
                    md={6}
                    sx={{
                        display: { xs: "none", md: "flex" },
                        position: "relative",
                        alignItems: "center",
                        justifyContent: "center",
                        p: 6,
                    }}
                >
                    <Box
                        sx={{
                            position: "absolute",
                            inset: 0,
                            backgroundImage: `url(${imageLogin})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            opacity: 0.22,
                        }}
                    />
                    <Box sx={{ position: "relative", maxWidth: 420, color: "#e7f2ff" }}>
                        <Typography variant="overline" sx={{ letterSpacing: 2 }}>
                            Sistema de Gestión en Salud
                        </Typography>
                        <Typography variant="h3" sx={{ fontWeight: 800, mt: 1, lineHeight: 1.1 }}>
                            SIGES
                        </Typography>
                        <Typography variant="body1" sx={{ mt: 2, opacity: 0.9 }}>
                            Acceso unificado para afiliaciones, PQRS y reportes con trazabilidad completa y una
                            experiencia moderna y eficiente.
                        </Typography>
                        <Box
                            sx={{
                                mt: 4,
                                p: 2,
                                borderRadius: 3,
                                background: "rgba(7, 22, 39, 0.55)",
                                border: "1px solid rgba(255,255,255,0.15)",
                            }}
                        >
                            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                                Tip rápido
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                Usa tu correo institucional para iniciar sesión y acceder a todos los módulos.
                            </Typography>
                        </Box>
                    </Box>
                </Grid>

                <Grid
                    item
                    xs={12}
                    md={6}
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        p: { xs: 2, sm: 4, md: 6 },
                    }}
                >
                    <Paper
                        elevation={0}
                        sx={{
                            width: "100%",
                            maxWidth: 420,
                            p: { xs: 3, sm: 4 },
                            borderRadius: 4,
                            background: "rgba(255,255,255,0.88)",
                            backdropFilter: "blur(12px)",
                            border: "1px solid rgba(255,255,255,0.6)",
                            boxShadow: "0 20px 50px rgba(0,0,0,0.25)",
                        }}
                    >
                        <Box display="flex" alignItems="center" gap={2} mb={3}>
                            <Box
                                component="img"
                                src={imageLoginForm}
                                alt="SIGES"
                                sx={{ width: 56, height: 56 }}
                            />
                            <Box>
                                <Typography variant="h5" sx={{ fontWeight: 800, color: "#0b1f36" }}>
                                    Bienvenido
                                </Typography>
                                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                                    Ingresa para continuar
                                </Typography>
                            </Box>
                        </Box>

                        <Divider sx={{ mb: 3 }} />

                        <Formik initialValues={initialValues} validationSchema={loginSchema} onSubmit={handleLogin}>
                            {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
                                <Box component="form" onSubmit={handleSubmit}>
                                    <TextField
                                        fullWidth
                                        type="email"
                                        name="email"
                                        label="Email"
                                        value={values.email}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={!!errors.email && touched.email}
                                        helperText={touched.email && errors.email}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <Email sx={{ color: "#0f375a" }} />
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{ mb: 2 }}
                                    />

                                    <TextField
                                        fullWidth
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        label="Contraseña"
                                        value={values.password}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={!!errors.password && touched.password}
                                        helperText={touched.password && errors.password}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <Lock sx={{ color: "#0f375a" }} />
                                                </InputAdornment>
                                            ),
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton onClick={togglePasswordVisibility} edge="end">
                                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{ mb: 3 }}
                                    />

                                    <Button
                                        type="submit"
                                        fullWidth
                                        size="large"
                                        variant="contained"
                                        sx={{
                                            py: 1.4,
                                            fontWeight: 700,
                                            background:
                                                "linear-gradient(135deg, #0f375a 0%, #1f6a9f 50%, #2fa87e 100%)",
                                            boxShadow: "0 12px 24px rgba(15,55,90,0.35)",
                                            "&:hover": {
                                                background:
                                                    "linear-gradient(135deg, #0d2f4e 0%, #1b5a86 50%, #2a936f 100%)",
                                            },
                                        }}
                                    >
                                        Ingresar
                                    </Button>
                                </Box>
                            )}
                        </Formik>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};
