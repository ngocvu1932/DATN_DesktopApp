import axios, {CustomAxiosResponse} from '../axiosConfig';

export const getAllServiceRequest = async (): Promise<CustomAxiosResponse<any> | undefined> => {
  try {
    const res = await axios.get(`/api/v1/service-request`);
    return res;
  } catch (error) {
    console.log(error);
  }
};
