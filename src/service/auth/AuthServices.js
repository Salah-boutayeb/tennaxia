import httpClient from '@/common/http-commen.js';

import { destroyToken, saveToken } from '../../common/auth-token';

class AuthService {
    async login(user) {
        console.log(user);
        return await httpClient.post('/login', user).then((response) => {
            if (response.data.token) {
                saveToken(response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
            }

            return response.data;
        });
    }

    logout() {
        destroyToken();
        localStorage.removeItem('user');
    }

    register(user) {
        return httpClient.post('/register', {
            nom: user.nom,
            prenom: user.prenom,
            email: user.email,
            password: user.password
        });
    }
}
export default new AuthService();
