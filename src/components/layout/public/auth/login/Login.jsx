import React, { useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { Formik } from 'formik';
import * as yup from 'yup';
import { FaEye, FaEyeSlash } from "react-icons/fa";

//css
import './Login.css';

//img
import imageLogin from '../../../../../assets/image/login/img-login.png';
import imageLoginForm from '../../../../../assets/image/login/image.png';
import userInput from '../../../../../assets/image/login/user.png';
import lockInput from '../../../../../assets/image/login/lock.png';

//
import useAuth from "../../../../../hooks/useAuth";

//Services
import { authService } from "../../../../../helpers/services/AuthServices";
import AlertComponent from "../../../../../helpers/alert/AlertComponent";

const initialValues = {
    email: "",
    password: "",
};

const loginSchema = yup.object().shape({
    email: yup.string().required("Email es requerido"),
    password: yup.string().required("Contraseña es requerida"),
});

export const Login = () => {

    const {setAuth} = useAuth();

    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    const handleLogin = async (values, { resetForm }) => {
        const informationToSend = {
            'email' : values.valueOf().email,
            'password': values.valueOf().password
        }

        // Lógica para manejar el login
        const respServicesLogin = await authService.login(informationToSend).then((data) => {
            return data;
        });

        //console.log(respServicesLogin);
        if(!respServicesLogin.accessToken && !respServicesLogin.user) {
            AlertComponent.error('Oops...', 'Usuario o Contraseña incorrecta');
        } else {
            AlertComponent.success('Bien hecho!', 'Te has logueado corectamente!');
            setAuth(respServicesLogin);
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        }

        // Reiniciar el formulario después del envío
        resetForm();
    };

    return (
        <>
            <Container fluid className="login-container d-flex justify-content-center align-items-center">
                <Row className="login-row">
                    <Col md={8} className="login-image-container d-none d-md-block">
                        <img src={imageLogin} alt="Imagen Login" className="login-image" />
                    </Col>
                    <Col md={4} className="login-form-container d-flex flex-column justify-content-center align-items-center">
                        <div className="text-center mb-4">
                            <img src={imageLoginForm} alt="login icon" className="img-fluid" style={{ maxWidth: '100px', height: 'auto' }} />
                        </div>
                        <div className="">
                            <Formik
                                initialValues={initialValues}
                                validationSchema={loginSchema}
                                onSubmit={handleLogin}
                            >
                                {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
                                    <Form onSubmit={handleSubmit}>
                                        <Form.Group controlId="email" className="mb-3">
                                            <div className="input-icon-wrapper">
                                                <img src={userInput} alt="icono usuario" className="input-icon-img" />
                                                <Form.Control
                                                    type="email"
                                                    name="email"
                                                    placeholder="EMAIL"
                                                    value={values.email}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    isInvalid={!!errors.email && touched.email}
                                                />
                                            </div>
                                            <Form.Control.Feedback type="invalid">
                                                {errors.email}
                                            </Form.Control.Feedback>
                                        </Form.Group>

                                        <Form.Group controlId="password" className="mb-3 position-relative">
                                            <div className="input-icon-wrapper">
                                                {/* Icono del candado */}
                                                <img src={lockInput} alt="icono candado" className="input-icon-img" />

                                                {/* Campo de entrada de contraseña */}
                                                <Form.Control
                                                    type={showPassword ? "text" : "password"}
                                                    name="password"
                                                    placeholder="CONTRASEÑA"
                                                    value={values.password}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    isInvalid={!!errors.password && touched.password}
                                                />

                                                {/* Icono del ojito para alternar visibilidad */}
                                                <div className="password-toggle-icon" onClick={togglePasswordVisibility}>
                                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                                </div>
                                            </div>

                                            {/* Mensaje de error */}
                                            <Form.Control.Feedback type="invalid">
                                                {errors.password}
                                            </Form.Control.Feedback>
                                        </Form.Group>

                                        <Button type="submit" className="login-button w-100 mb-3">
                                            LOGIN
                                        </Button>
                                        {/*<div className="d-flex justify-content-end">
                                            <a href="/forgot-password" className="forgot-password-link">
                                                ¿Olvidó su contraseña?
                                            </a>
                                        </div>*/}
                                    </Form>
                                )}
                            </Formik>
                        </div>
                    </Col>
                </Row>
            </Container>
        </>
    );
};
