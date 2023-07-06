import axios from 'axios';
import { getToken } from './auth-token';
console.log('token ' + getToken());

export default axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'Content-type': 'multipart/form-data',
        Authorization: `Bearer ${getToken()}`
    }
});
