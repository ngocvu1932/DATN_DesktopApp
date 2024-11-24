import axios, {CustomAxiosResponse} from '../axiosConfig';

export const allEmployee = async (page: number, limit: number): Promise<CustomAxiosResponse<any> | undefined> => {
  try {
    const res = await axios.get(`/api/v1/employee?page=${page}&limit=${limit}`);
    return res;
  } catch (error) {
    console.log(error);
  }
};
