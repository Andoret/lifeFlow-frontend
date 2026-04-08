import axios from 'axios';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});


// REQUEST INTERCEPTOR (ADD TOKEN)
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');

  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});


// RESPONSE INTERCEPTOR (REFRESH)
apiClient.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem('refresh_token');

      if (!refreshToken) {
        throw new Error('Sesión expirada');
      }

      try {
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/authentication/refresh-token`,
          {
            refresh_token: refreshToken,
          }
        );

        const newAccessToken = res.data.access_token;

        localStorage.setItem('access_token', newAccessToken);

        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return apiClient(originalRequest);

      } catch (err) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        throw new Error('Sesión expirada');
      }
    }

    return Promise.reject(error);
  }
);
