import httpClient from '@/common/http-commen.js';

class FactureService {
    async save(facture) {
        return await httpClient
            .post('/factures', facture)
            .then((response) => {
                return response.data;
            })
            .catch((error) => {});
    }
    async delete(factureId) {
        return await httpClient.delete(`/factures/${factureId}`).then((response) => {
            return response.data;
        });
    }
    async update(factureId, facture) {
        return await httpClient.post(`/factures/${factureId}`, facture).then((response) => {
            return response.data;
        });
    }
    async getAll() {
        return await httpClient.get(`/factures`).then((response) => {
            return response.data;
        });
    }
    async getById(factureId) {
        return await httpClient.get(`/factures/${factureId}`).then((response) => {
            return response.data;
        });
    }
}

export default new FactureService();
