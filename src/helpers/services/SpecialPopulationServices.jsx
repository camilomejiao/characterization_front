import { Global } from "../Global";
import {authTokenService} from "./AuthTokenService";

class SpecialPopulationServices {

    constructor() {
        this.baseUrl = Global.url + 'special-population/';
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
        const url = this.buildUrl(`list`)
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
        const url = this.buildUrl(`update/${id}`)
        return authTokenService.fetchWithAuth(url, {
            method: "PUT",
            body: JSON.stringify(data),
        });
    }

}

export const specialPopulationServices = new SpecialPopulationServices();