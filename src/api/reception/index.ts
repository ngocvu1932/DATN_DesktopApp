import axios, {CustomAxiosResponse} from '../axiosConfig';

interface IApproveStatus {
  status: number;
}

export const approveAppointment = async (
  id: number,
  body: IApproveStatus
): Promise<CustomAxiosResponse<any> | undefined> => {
  try {
    const res = await axios.patch(`/api/v1/receptionist-employee/appointment/${id}`, body);
    return res;
  } catch (error) {
    console.log(error);
  }
};
