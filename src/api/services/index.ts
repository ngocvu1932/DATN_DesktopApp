import axios, {CustomAxiosResponse} from '../axiosConfig';
import {IServiceRequest} from './enum';

export const allServices = async (page?: number, limit?: number): Promise<CustomAxiosResponse<any> | undefined> => {
  try {
    const res = await axios.get(`/api/v1/services${page && limit ? `?page=${page}&limit=${limit}` : ''}`);
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const allServicesNoLimit = async (): Promise<CustomAxiosResponse<any> | undefined> => {
  try {
    const res = await axios.get(`/api/v1/services`);
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

export const findAllSerivceWithSkill = async (): Promise<CustomAxiosResponse<any> | undefined> => {
  try {
    const res = await axios.get('/api/v1/services/findAllSerivceWithSkill');
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const updateStatusService = async (id: number, data: any): Promise<CustomAxiosResponse<any> | undefined> => {
  try {
    const res = await axios.put(`/api/v1/services/update-status/${id}`, data);
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const deleteService = async (id: number): Promise<CustomAxiosResponse<any> | undefined> => {
  try {
    const res = await axios.delete(`/api/v1/services/${id}`);
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const findOneServiceById = async (id: number): Promise<CustomAxiosResponse<any> | undefined> => {
  try {
    const res = await axios.get(`/api/v1/services/findById/${id}`);
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const updateService = async (id: number, data: any): Promise<CustomAxiosResponse<any> | undefined> => {
  try {
    const res = await axios.patch(`/api/v1/services/${id}`, data);
    return res;
  } catch (error) {
    console.log(error);
  }
};
