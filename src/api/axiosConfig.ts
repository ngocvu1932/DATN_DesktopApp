import axios, {AxiosResponse} from 'axios';
const API_URL = import.meta.env.VITE_API_URL;

interface IPagination {
  totalPage: number;
  limit: number;
  page: number;
}

export interface CustomAxiosResponse<T = any> extends AxiosResponse<T> {
  statusCode?: number;
  pagination?: IPagination;
}

const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 600000, // 10 phút
  headers: {
    'Content-Type': 'application/json',
    // Authorization: `Bearer ${accessToken ?? ''}`,
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const accessTokenLocalStorage = localStorage.getItem('accessToken');
    config.headers.Authorization = `Bearer ${accessTokenLocalStorage ?? ''}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    // xử lý response trước khi trả về
    // console.log('response', response);

    if (response.status === 200) {
      return response.data;
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const refreshResponse = await axios.post(`${API_URL}/api/v1/auth/refresh-token`, {
          refreshToken: refreshToken,
        });
        const newAccessToken = refreshResponse.data.data.accessToken;

        console.log('newAccessToken: ', newAccessToken);

        localStorage.setItem('accessToken', newAccessToken);
        // Cập nhật header Authorization với accessToken mới
        axiosInstance.defaults.headers['Authorization'] = `Bearer ${newAccessToken}`;
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (err) {
        console.error('Làm mới token thất bại:', err);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
