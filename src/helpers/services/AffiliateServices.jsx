import { Global } from "../Global";
import { authTokenService } from "./AuthTokenService";


class AffiliateServices {

    constructor() {
        this.baseUrl = Global.url + 'affiliates/';
    }

    /**
     * Genera la URL completa para los endpoints de entrega.
     * @param {string} endpoint - Endpoint relativo.
     * @returns {string} - URL completa.
     */
    buildUrl(endpoint) {
        return this.baseUrl + endpoint;
    }

    async create(data) {
        const url = this.buildUrl(`create`)
        return authTokenService.fetchWithAuth(url, {
            method: "POST",
            body: JSON.stringify(data),
        });
    }

    async getList() {
        const url = this.buildUrl(`list`)
        return authTokenService.fetchWithAuth(url, { method: "GET" });
    }

    async getById(id) {
        const url = this.buildUrl(`${id}`);
        return authTokenService.fetchWithAuth(url, { method: "GET" });
    }

    async update(id, data) {
        const url = this.buildUrl(`update/${id}`)
        return authTokenService.fetchWithAuth(url, {
            method: "PUT",
            body: JSON.stringify(data),
        });
    }

    async bulk(data) {
        const url = this.buildUrl(`bulk`)
        return authTokenService.fetchWithAuth(url, {
            method: "POST",
            body: JSON.stringify(data),
        });
    }
}

export const affiliateServices = new AffiliateServices();