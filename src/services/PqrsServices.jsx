import { Global } from "../helpers/Global";
import { authTokenService } from "./AuthTokenService";

class PqrsServices {
    constructor() {
        this.baseUrl = Global.url + "pqrs/";
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

    async create(formData) {
        const url = this.buildUrl(`create`);
        return authTokenService.fetchWithAuth(url, {
            method: "POST",
            body: formData,
        });
    }

    async update(id, formData) {
        const url = this.buildUrl(`${id}`);
        return authTokenService.fetchWithAuth(url, {
            method: "PUT",
            body: formData,
        });
    }

    async getById(id) {
        const url = this.buildUrl(`${id}`);
        return authTokenService.fetchWithAuth(url, { method: "GET" });
    }

    async notificationCreate(id, data) {
        const url = this.buildUrl(`notification/${id}`);
        return authTokenService.fetchWithAuth(url, {
            method: "POST",
            body: JSON.stringify(data),
        });
    }

    async delete(id) {
        const url = this.buildUrl(`${id}/`);
        return authTokenService.fetchWithAuth(url, { method: "DELETE" });
    }

    async reportPqrsExcel(start, end) {
        const url = this.buildUrl(`report-information-pqrs/${start}/${end}`);
        return authTokenService.fetchWithAuth(url, { method: "GET" });
    }
}

export const pqrsServices = new PqrsServices();
