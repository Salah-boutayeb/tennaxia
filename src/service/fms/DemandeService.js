import httpClient from '@/common/http-commen.js';

class DemandeService {
    async save(demande) {
        return await httpClient
            .post('/demandes', demande)
            .then((response) => {
                return response.data;
            })
            .catch((error) => {});
    }
    async delete(demandeId) {
        return await httpClient.delete(`/demandes/${demandeId}`).then((response) => {
            return response.data;
        });
    }
    async update(demande) {
        return await httpClient.put('/demandes', demande).then((response) => {
            return response.data;
        });
    }
    async getAllDemandes() {
        return await httpClient.get(`/demandes`).then((response) => {
            return response.data;
        });
    }
    async getDemande(demandeId) {
        return await httpClient.get(`/demandes/${demandeId}`).then((response) => {
            return response.data;
        });
    }
}

export default new DemandeService();
