import axios, {CustomAxiosResponse} from '../axiosConfig';

export const createBranch = async (body: any): Promise<CustomAxiosResponse<any> | undefined> => {
  try {
    const res = await axios.post(`/api/v1/branch/`, body);
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const getAllBranch = async (page: number, limit: number): Promise<CustomAxiosResponse<any> | undefined> => {
  try {
    const res = await axios.get(`/api/v1/branch/?page=${page}&limit=${limit}`);
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const getAllBranchNoLimit = async (): Promise<CustomAxiosResponse<any> | undefined> => {
  try {
    const res = await axios.get(`/api/v1/branch`);
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const updateStatusBranch = async (id: number, body: any): Promise<CustomAxiosResponse<any> | undefined> => {
  try {
    const res = await axios.put(`/api/v1/branch/update-status/${id}`, body);
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const updateBranch = async (id: number, body: any): Promise<CustomAxiosResponse<any> | undefined> => {
  try {
    const res = await axios.put(`/api/v1/branch/${id}`, body);
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const deleteBranch = async (id: number): Promise<CustomAxiosResponse<any> | undefined> => {
  try {
    const res = await axios.delete(`/api/v1/branch/${id}`);
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const findOneBranchById = async (id: number): Promise<CustomAxiosResponse<any> | undefined> => {
  try {
    const res = await axios.get(`/api/v1/services/findById/${id}`);
    return res;
  } catch (error) {
    console.log(error);
  }
};
