import { Global } from "../Global";
import { authTokenService } from "./AuthTokenService";

class CommonServices {

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

    async getIdentificationType() {
        const url = this.buildUrl(`identification-type`);
        return authTokenService.fetchWithAuth(url, { method: "GET" });
    }

    async getDisabilityType() {
        const url = this.buildUrl(`disability-type`);
        return authTokenService.fetchWithAuth(url, { method: "GET" });
    }

    async sexGender() {
        const url = this.buildUrl(`sex`);
        return authTokenService.fetchWithAuth(url, { method: "GET" });
    }

    async getGender() {
        const url = this.buildUrl(`gender`);
        return authTokenService.fetchWithAuth(url, { method: "GET" });
    }

    async getArea() {
        const url = this.buildUrl(`area`);
        return authTokenService.fetchWithAuth(url, { method: "GET" });
    }

    async getPQRSType() {
        const url = this.buildUrl(`pqrs-type`);
        return authTokenService.fetchWithAuth(url, { method: "GET" });
    }

    async getStatusPqrs() {
        const url = this.buildUrl(`application-status`);
        return authTokenService.fetchWithAuth(url, { method: "GET" });
    }

    async getReasons() {
        const url = this.buildUrl(`reason-pqrs`);
        return authTokenService.fetchWithAuth(url, { method: "GET" });
    }

    async getEps() {
        const url = this.buildUrl(`eps`);
        return authTokenService.fetchWithAuth(url, { method: "GET" });
    }

    async getIpsPrimary() {
        const url = this.buildUrl(`ips-primary`);
        return authTokenService.fetchWithAuth(url, { method: "GET" });
    }

    async getIpsDental() {
        const url = this.buildUrl(`ips-dental`);
        return authTokenService.fetchWithAuth(url, { method: "GET" });
    }

    //
    async getPopulationType() {
        const url = this.buildUrl(`population-type`);
        return authTokenService.fetchWithAuth(url, { method: "GET" });
    }

    async getAffiliateType() {
        const url = this.buildUrl(`affiliate-type`);
        return authTokenService.fetchWithAuth(url, { method: "GET" });
    }

    async getAffiliatedState() {
        const url = this.buildUrl(`affiliated-state`);
        return authTokenService.fetchWithAuth(url, { method: "GET" });
    }

    async getCommunity() {
        const url = this.buildUrl(`community`);
        return authTokenService.fetchWithAuth(url, { method: "GET" });
    }

    async getEthnicity() {
        const url = this.buildUrl(`ethnicity`);
        return authTokenService.fetchWithAuth(url, { method: "GET" });
    }

    async getGroupAndSubgroup() {
        const url = this.buildUrl(`group-subgroup`);
        return authTokenService.fetchWithAuth(url, { method: "GET" });
    }

    async getlevel() {
        const url = this.buildUrl(`level`);
        return authTokenService.fetchWithAuth(url, { method: "GET" });
    }

    async getMembershipClass() {
        const url = this.buildUrl(`membership-class`);
        return authTokenService.fetchWithAuth(url, { method: "GET" });
    }

    async getMethodology() {
        const url = this.buildUrl(`methodology`);
        return authTokenService.fetchWithAuth(url, { method: "GET" });
    }

    async getCountries() {
        const url = this.buildUrl(`countries`);
        return authTokenService.fetchWithAuth(url, { method: "GET" });
    }

    async getRegimen() {
        const url = this.buildUrl(`regime`);
        return authTokenService.fetchWithAuth(url, { method: "GET" });
    }
}

export const commonServices = new CommonServices();