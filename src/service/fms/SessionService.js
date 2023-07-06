import httpClient from '@/common/http-commen.js';

class SessionService {
    async save(session) {
        return await httpClient
            .post('/sessions', session)
            .then((response) => {
                return response.data;
            })
            .catch((error) => {});
    }
    async delete(sessionId) {
        return await httpClient.delete(`/sessions/${sessionId}`).then((response) => {
            return response.data;
        });
    }
    async update(session, sessionId) {
        return await httpClient.post(`/sessions/${sessionId}`, session).then((response) => {
            return response.data;
        });
    }
    async getAll() {
        return await httpClient.get(`/sessions`).then((response) => {
            return response.data;
        });
    }
    async getById(sessionId) {
        return await httpClient.get(`/sessions/${sessionId}`).then((response) => {
            return response.data;
        });
    }
    async convoquerPartcipants(sessionId) {
        return await httpClient.get(`session/convoquer/${sessionId}`).then((response) => {
            return response.data;
        });
    }
    async certifGeneration(sessionId) {
        return await httpClient.get(`session/certif/${sessionId}`).then((response) => {
            return response.data;
        });
    }
    async emargementGeneration(sessionId) {
        return await httpClient.get(`emargement/session/${sessionId}`).then((response) => {
            return response.data;
        });
    }
}

export default new SessionService();
