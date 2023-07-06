import httpClient from '@/common/http-commen.js';

class MissionService {
    async save(mission) {
        return await httpClient
            .post('/missions', mission)
            .then((response) => {
                return response.data;
            })
            .catch((error) => {
                //
                console.log(error);
            });
    }
    async delete(missionId) {
        return await httpClient.delete(`/missions/${missionId}`).then((response) => {
            return response.data;
        });
    }
    async update(file, missionId) {
        const formData = new FormData();
        formData.append(file.name, file.data);

        return await httpClient.post(`/mission/${missionId}`, formData).then((response) => {
            return response.data;
        });
    }
    async update_stat(missionId) {
        const formData = new FormData();
        formData.append('status_id', 5);
        formData.append('_method', 'put');

        return await httpClient.post(`/missions/${missionId}`, formData).then((response) => {
            return response.data;
        });
    }
    async getAll() {
        return await httpClient.get(`/missions`).then((response) => {
            return response.data;
        });
    }

    async deleteDocument(docId) {
        return await httpClient.delete(`/documents/${docId}`).then((response) => {
            return response.data;
        });
    }
}

export default new MissionService();
