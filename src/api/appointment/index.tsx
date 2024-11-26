import {b} from 'vite/dist/node/types.d-aGj9QkWt';
import axios, {CustomAxiosResponse} from '../axiosConfig';

interface IStatusUpdate {
  status: number;
}

interface IAppointmentUpdate {
  status: number;
  reminderSent: number | boolean;
  serviceId: number;
  note: string;
  branchId: number;
  employeeId: number;
  time: string;
}

export const allAppointment = async (page?: number, limit?: number): Promise<CustomAxiosResponse<any> | undefined> => {
  try {
    const res = await axios.get(`/api/v1/appointments${page && limit ? `?page=${page}&limit=${limit}` : ''}`);
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const createAppointment = async (data: any): Promise<CustomAxiosResponse<any> | undefined> => {
  try {
    const res = await axios.post(`/api/v1/appointments/`, data);
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const deleteAppointment = async (id: number): Promise<CustomAxiosResponse<any> | undefined> => {
  try {
    const res = await axios.delete(`/api/v1/appointments/${id}`);
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const findOneAppointmentById = async (id: number): Promise<CustomAxiosResponse<any> | undefined> => {
  try {
    const res = await axios.delete(`/api/v1/services/findById/${id}`);
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const updateStatusAppointment = async (
  id: number,
  data: IStatusUpdate
): Promise<CustomAxiosResponse<any> | undefined> => {
  try {
    const res = await axios.patch(`/api/v1/appointments/${id}`, data);
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const updateAppointment = async (
  id: number,
  data: IAppointmentUpdate
): Promise<CustomAxiosResponse<any> | undefined> => {
  try {
    const res = await axios.patch(`/api/v1/appointments/${id}`, data);
    return res;
  } catch (error) {
    console.log(error);
  }
};
