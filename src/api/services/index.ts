import axios, {CustomAxiosResponse} from '../axiosConfig';

export const allServices = async (page: number, limit: number): Promise<CustomAxiosResponse<any> | undefined> => {
  try {
    const res = await axios.get(`/api/v1/services?page=${page}&limit=${limit}`);
    return res;
  } catch (error) {
    console.log(error);
  }
};
