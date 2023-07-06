import httpClient from '@/common/http-commen.js';

const headers = {
    'Content-Type': 'application/json'
};

class ParticipantsService {
    async save(participant) {
        const formData = new FormData();
        formData.append('session_id', participant.sessionId);
        formData.append('nom', participant.nom);
        formData.append('prenom', participant.prenom);
        formData.append('email', participant.email);
        return await httpClient
            .post('/participant', formData)
            .then((response) => {
                return response.data;
            })
            .catch((error) => {
                //
                console.log(error);
            });
    }
    async saveParticipants(participants, sessionId) {
        const formData = new FormData();
        formData.append('participants', JSON.stringify(participants));
        formData.append('session_id', sessionId);
        return await httpClient
            .post('/participants', formData)
            .then((response) => {
                return response.data;
            })
            .catch((error) => {});
    }
    async delete(participantId) {
        return await httpClient.delete(`/participants/${participantId}`).then((response) => {
            return response.data;
        });
    }
    async update(participantId, participant) {
        const formData = new FormData();
        formData.append('nom', participant.nom);
        formData.append('prenom', participant.prenom);
        formData.append('email', participant.email);
        formData.append('_method', 'PUT');
        return await httpClient.post(`/participants/${participantId}`, formData).then((response) => {
            return response.data;
        });
    }
    async getAll() {
        return await httpClient.get(`/participants`).then((response) => {
            return response.data;
        });
    }
    async getById(participantId) {
        return await httpClient.get(`/participants/${participantId}`).then((response) => {
            return response.data;
        });
    }
}

export default new ParticipantsService();
