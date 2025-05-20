import { Global } from "../Global.jsx";

class AuthService {
    constructor() {
        this.baseUrl = Global.url;
    }

    /**
     * Genera la URL completa para los endpoints de entrega.
     * @param {string} endpoint - Endpoint relativo.
     * @returns {string} - URL completa.
     */
    buildUrl(endpoint) {
        return this.baseUrl + endpoint;
    }

    /**
     * Realiza la solicitud de inicio de sesión y guarda los tokens en el almacenamiento local.
     * @param {object} data - Datos de inicio de sesión (usuario y contraseña).
     * @returns {Promise<object>} - Respuesta del servidor.
     */
    async login(data) {
        const url = this.buildUrl(`auth/login`);
        const headers = {
            "Content-Type": "application/json"
        };

        try {
            const response = await fetch(url, {
                method: "POST",
                body: JSON.stringify(data),
                headers,
                mode: "cors",
            });

            const resp = await response.json();

            // Validar si los tokens están presentes
            if (resp.accessToken && resp.user) {
                this.saveToLocalStorage(resp);
            } else {
                return resp;
            }

            return resp;
        } catch (error) {
            console.error("Error en el login:", error);
            throw error;
        }
    }

    /**
     * Guarda los tokens y datos del usuario en el almacenamiento local.
     * @param {object} tokens - Tokens de acceso y actualización.
     * @param {object} decodeToken - Datos decodificados del token.
     */
    saveToLocalStorage(tokens, decodeToken) {
        localStorage.setItem("token", tokens?.accessToken || "");
        localStorage.setItem("rol_id", tokens?.user?.role?.id || "");
        localStorage.setItem("department_id", tokens?.user?.department?.id || "");
        localStorage.setItem("department_name", tokens?.user?.department?.name || "");
        localStorage.setItem("municipality_id", tokens?.user?.municipality?.id || "");
        localStorage.setItem("municipality_name", tokens?.user?.municipality?.name || "");
    }
}

export const authService = new AuthService();
