import httpClient from '@/common/http-commen.js';

class ClientService {
    async save(client) {
        return await httpClient
            .post('/clients', client)
            .then((response) => {
                return response.data;
            })
            .catch((error) => {
                return error;
            });
    }
    async delete(clientId) {
        return await httpClient.delete(`/clients/${clientId}`).then((response) => {
            return response.data;
        });
    }
    async update(clientId, client) {
        return await httpClient.post(`/clients/${clientId}`, client).then((response) => {
            return response.data;
        });
    }
    async getAll() {
        return await httpClient.get(`/clients`).then((response) => {
            return response.data;
        });
    }
    async getById(clientId) {
        return await httpClient.get(`/clients/${clientId}`).then((response) => {
            return response.data;
        });
    }
}

export default new ClientService();
