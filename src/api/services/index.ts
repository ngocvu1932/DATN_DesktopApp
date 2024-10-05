import axios, {CustomAxiosResponse} from '../axiosConfig';
import {IServiceRequest} from './enum';

export const allServices = async (page: number, limit: number): Promise<CustomAxiosResponse<any> | undefined> => {
  try {
    const res = await axios.get(`/api/v1/services?page=${page}&limit=${limit}`);
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const createService = async (data: IServiceRequest): Promise<CustomAxiosResponse<any> | undefined> => {
  try {
    const res = await axios.post('/api/v1/services/', data);
    return res;
  } catch (error) {
    console.log(error);
  }
};
