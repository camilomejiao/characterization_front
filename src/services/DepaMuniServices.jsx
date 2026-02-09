import { Global } from "../helpers/Global";
import { authTokenService } from "./AuthTokenService";

class DepaMuniServices {
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

    async getDepartments() {
        const url = this.buildUrl(`departments`);
        return authTokenService.fetchWithAuth(url, { method: "GET" });
    }

    async getMunicipalities(departmentId) {
        const url = this.buildUrl(`municipalities/${departmentId}`);
        return authTokenService.fetchWithAuth(url, { method: "GET" });
    }
}

export const depaMuniServices = new DepaMuniServices();
