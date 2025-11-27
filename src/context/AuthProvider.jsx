import React from "react";
import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [auth, setAuth] = useState({});
    const [loading, setLoading] = useState(true);

    const logout = () => {
        localStorage.clear();
        setAuth({});
    };

    const authUser = async() => {
        //Sacar datos del usuario identificado
        const token = localStorage.getItem('token');
        const user = await decodeToken(token);
        const userId = user?.id;

        //comprobamos si tenemos informacion
        if (!token || !userId) {
            logout(); // Si no hay token o userId, cerrar sesión automáticamente
            setLoading(false);
        } else {
            try {
                setAuth({
                    id: userId,
                    department_id: user?.department?.id,
                    municipality_id: user?.municipality?.id,
                    rol_id: user?.role,
                    email: user?.email,
                    userName: user?.name,
                });
            } catch (error) {
                console.error("Error parsing user data:", error);
                logout(); //Si el parseo falla, cerramos sesión
            } finally {
                setLoading(false); //Aseguramos que el estado de carga termine
            }
        }
    };

    /**
     * Decodifica el token JWT.
     * @param {string} token - Token JWT.
     * @returns {object} - Datos decodificados del token.
     */
    const decodeToken = async(token) => {
        try {
            return jwtDecode(token);
        } catch (error) {
            console.error("Error al decodificar el token:", error);
            return null;
        }
    };

    useEffect(() => {
        authUser();
    }, []);

    return(
        <AuthContext.Provider value={{auth, setAuth, loading, logout}}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;