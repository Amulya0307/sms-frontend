import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const API = axios.create({
    baseURL: API_BASE_URL,
});

API.interceptors.request.use((config) => {
    const userString = localStorage.getItem('user');
    if (userString) {
        const user = JSON.parse(userString);
        if (user && user.token) {
            config.headers.Authorization = `Bearer ${user.token}`;
        }
    }
    return config;
}, (error) => Promise.reject(error));

API.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const userString = localStorage.getItem('user');
            
            if (userString) {
                const user = JSON.parse(userString);
                if (user && user.refreshToken) {
                    try {
                        const rs = await axios.post(`${API_BASE_URL}/auth/refreshtoken`, {
                            refreshToken: user.refreshToken,
                        });

                        const { accessToken } = rs.data.data;
                        
                        user.token = accessToken;
                        localStorage.setItem('user', JSON.stringify(user));

                        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                        return API(originalRequest);
                    } catch (_error) {
                        localStorage.removeItem('user');
                        window.location.href = '/'; 
                        return Promise.reject(_error);
                    }
                }
            }
        }

        return Promise.reject(error);
    }
);

export default API;