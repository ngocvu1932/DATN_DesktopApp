import axios, {CancelToken} from 'axios';
import axiosInstance, {CustomAxiosResponse} from '../axiosConfig';

interface ILoginRequest {
  username: string;
  password: string;
}

export const login = async (
  data: ILoginRequest,
  cancelToken?: CancelToken
): Promise<CustomAxiosResponse<any> | undefined> => {
  try {
    const res = await axiosInstance.post('/api/v1/auth/login', data, {cancelToken});
    return res;
  } catch (error) {
    if (axios.isCancel(error)) {
      console.log('Request canceled', error.message);
    } else {
      console.log(error);
    }
  }
};

export const getInfo = async (cancelToken?: CancelToken): Promise<CustomAxiosResponse<any> | undefined> => {
  try {
    const res = await axiosInstance.get('/api/v1/users/get-profile', {cancelToken});
    return res;
  } catch (error) {
    if (axios.isCancel(error)) {
      console.log('Request canceled', error.message);
    } else {
      console.log(error);
    }
  }
};

export const logout = async (refreshToken: string): Promise<CustomAxiosResponse<any> | undefined> => {
  try {
    const res = await axiosInstance.post('/api/v1/auth/logout', {refreshToken: refreshToken});
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const updateUser = async (id: number, data: any): Promise<CustomAxiosResponse<any> | undefined> => {
  try {
    const res = await axiosInstance.post(`/api/v1/users/${id}`, data);
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const changePasswordUser = async (id: number, data: any): Promise<CustomAxiosResponse<any> | undefined> => {
  try {
    const res = await axiosInstance.post(`/api/v1/users/${id}`, data);
    return res;
  } catch (error) {
    console.log(error);
  }
};
