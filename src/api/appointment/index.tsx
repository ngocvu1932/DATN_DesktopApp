import axios, {CustomAxiosResponse} from '../axiosConfig';

interface IStatusUpdate {
  status: number;
}

export const appointment = async (page: number, limit: number): Promise<CustomAxiosResponse<any> | undefined> => {
  try {
    const res = await axios.get(`/api/v1/appointments?page=${page}&limit=${limit}`);
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const updateStatusAppointment = async (
  appointmentId: number,
  data: IStatusUpdate
): Promise<CustomAxiosResponse<any> | undefined> => {
  try {
    const res = await axios.put(`/api/v1/appointments/update-status/${appointmentId}`, {data});
    return res;
  } catch (error) {
    console.log(error);
  }
};
