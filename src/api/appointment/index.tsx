import axios, {CustomAxiosResponse} from '../axiosConfig';

interface IStatusUpdate {
  status: number;
}

interface IAppointmentUpdate {
  status: number;
  reminder_sent: number;
  service_id: number;
  note: string;
}

export const allAppointment = async (page: number, limit: number): Promise<CustomAxiosResponse<any> | undefined> => {
  try {
    const res = await axios.get(`/api/v1/appointments?page=${page}&limit=${limit}`);
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
    const res = await axios.delete(`/api/v1/services/${id}`);
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
    const res = await axios.put(`/api/v1/appointments/update-status/${id}`, data);
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
    const res = await axios.put(`/api/v1/appointments/${id}`, data);
    return res;
  } catch (error) {
    console.log(error);
  }
};
