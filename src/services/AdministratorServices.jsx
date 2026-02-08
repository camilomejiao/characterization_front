import { Global } from "../helpers/Global";
import {authTokenService} from "./AuthTokenService";


class AdministratorServices {
    constructor() {
        this.baseUrl = Global.url + 'admins/';
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
        const url = this.buildUrl(`list`);
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
        const url = this.buildUrl(`update/${id}/`)
        return authTokenService.fetchWithAuth(url, {
            method: "PUT",
            body: JSON.stringify(data),
        });
    }

    async delete(id) {
        const url = this.buildUrl(`delete/${id}`);
        return authTokenService.fetchWithAuth(url, { method: "DELETE" });
    }

    async toggleStatus (id, status) {
        const url = this.buildUrl(`toggle-status/${id}/`)
        return authTokenService.fetchWithAuth(url, {
            method: "PUT",
            body: JSON.stringify(status),
        });
    }

    async getRoles() {
        const url = Global.url+'roles';
        return authTokenService.fetchWithAuth(url, { method: "GET" });
    }
}

export const administratorServices = new AdministratorServices();
