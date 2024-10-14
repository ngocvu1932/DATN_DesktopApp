import axios, {CustomAxiosResponse} from '../axiosConfig';

export const allCustomer = async (page: number, limit: number): Promise<CustomAxiosResponse<any> | undefined> => {
  try {
    const res = await axios.get(`/api/v1/customers?page=${page}&limit=${limit}`);
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const createCustomer = async (data: any): Promise<CustomAxiosResponse<any> | undefined> => {
  try {
    const res = await axios.post(`/api/v1/customers`, data);
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const updateCustomer = async (id: number, data: any): Promise<CustomAxiosResponse<any> | undefined> => {
  try {
    const res = await axios.put(`/api/v1/services/update-status/${id}`, data);
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const deleteCustomer = async (id: number): Promise<CustomAxiosResponse<any> | undefined> => {
  try {
    const res = await axios.delete(`/api/v1/services/${id}`);
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const findOneCustomer = async (id: number): Promise<CustomAxiosResponse<any> | undefined> => {
  try {
    const res = await axios.get(`/api/v1/services/findById/${id}`);
    return res;
  } catch (error) {
    console.log(error);
  }
};
