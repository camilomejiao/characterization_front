import {Global} from "../Global";
import {authTokenService} from "./AuthTokenService";

class UserServices {
    constructor() {
        this.baseUrl = Global.url + 'users/';
    }

    /**
     * Genera la URL completa para los endpoints de entrega.
     * @param {string} endpoint - Endpoint relativo.
     * @returns {string} - URL completa.
     */
    buildUrl(endpoint) {
        return this.baseUrl + endpoint;
    }

    async getList() {
        const url = this.baseUrl;
        return authTokenService.fetchWithAuth(url, { method: "GET" });
    }

    async getById(id) {
        const url = this.buildUrl(`${id}`);
        return authTokenService.fetchWithAuth(url, { method: "GET" });
    }

    async create(data) {
        const url = this.buildUrl(`create`)
        return authTokenService.fetchWithAuth(url, {
            method: "POST",
            body: JSON.stringify(data),
        });
    }

    async update(id, data) {
        const url = this.buildUrl(`${id}`)
        return authTokenService.fetchWithAuth(url, {
            method: "PUT",
            body: JSON.stringify(data),
        });
    }

    async delete(id) {
        const url = this.buildUrl(`${id}`);
        return authTokenService.fetchWithAuth(url, { method: "DELETE" });
    }

    async getIdentifiedUser(identificationType, identificationNumber) {
        const url = this.buildUrl(`identification/${identificationType}/${identificationNumber}`);
        return authTokenService.fetchWithAuth(url, { method: "GET" });
    }
}

export const userServices = new UserServices();