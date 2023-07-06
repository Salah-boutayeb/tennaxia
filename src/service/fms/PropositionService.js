import httpClient from '@/common/http-commen.js';

class PropositionService {
    async save(proposition) {
        return await httpClient
            .post('/propositions', proposition)
            .then((response) => {
                return response.data;
            })
            .catch((error) => {});
    }
    async delete(propositionId) {
        return await httpClient.delete(`/propositions/${propositionId}`).then((response) => {
            return response.data;
        });
    }
    async update(proposition, propositionId) {
        return await httpClient.post(`/propositions/${propositionId}`, proposition).then((response) => {
            return response.data;
        });
    }
    async getAll() {
        return await httpClient.get(`/propositions`).then((response) => {
            return response.data;
        });
    }
    async getAllPropositionOfDemande(demandeId) {
        return await httpClient.get(`/demande/${demandeId}/propositions`).then((response) => {
            return response.data;
        });
    }
    async getById(propositionId) {
        return await httpClient.get(`/propositions/${propositionId}`).then((response) => {
            return response.data;
        });
    }
    async send(propositionId, missionId) {
        const formData = new FormData();
        formData.append('is_sent', true);
        formData.append('etat', 'shortlistée');
        return await httpClient
            .post(`/envoyer/proposition/${propositionId}/mission/${missionId}`, formData)
            .then((response) => {
                return response.data;
            })
            .catch((error) => {});
    }
    async changePropositionStat(propositionId, missionId, message) {
        const formData = new FormData();
        if (message) {
            formData.append('etat', 'refusée');
            formData.append('message', message);
        } else {
            formData.append('etat', 'acceptée');
        }
        return await httpClient
            .post(`/proposition/etat/${propositionId}/mission/${missionId}`, formData)
            .then((response) => {
                return response.data;
            })
            .catch((error) => {});
    }
}

export default new PropositionService();
