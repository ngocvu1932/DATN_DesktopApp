import axios, {CustomAxiosResponse} from '../axiosConfig';

export const createServiceSkill = async (body: any): Promise<CustomAxiosResponse<any> | undefined> => {
  try {
    const res = await axios.post(`/api/v1/service-skill`, body);
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const findAllServiceSkill = async (
  page: number,
  limit: number
): Promise<CustomAxiosResponse<any> | undefined> => {
  try {
    const res = await axios.get(`/api/v1/service-skills?page=${page}&limit=${limit}`);
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const updateStatusServiceSkill = async (
  id: number,
  body: any
): Promise<CustomAxiosResponse<any> | undefined> => {
  try {
    const res = await axios.put(`/api/v1/services/update-status/${id}`, body);
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const deleteSericeSkill = async (id: number): Promise<CustomAxiosResponse<any> | undefined> => {
  try {
    const res = await axios.delete(`/api/v1/service-skills/${id}`);
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const findOneServiceSkillById = async (id: number): Promise<CustomAxiosResponse<any> | undefined> => {
  try {
    const res = await axios.get(`/api/v1/service-skills/findById/${id}`);
    return res;
  } catch (error) {
    console.log(error);
  }
};
