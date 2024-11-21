export interface IServiceRequest {
  id: number;
  code: string;
  appointmentId: number;
  currentStatus: number;
  checkInTime: string;
  completedTime: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
  isRemoved: boolean;
  branchId: number;
  statusHistory?: [
    {
      id: number;
      status: number;
      note: string;
      userId: number;
      createdAt: string;
      updatedAt: string;
      isRemoved: boolean;
      serviceRequestId: number;
      serviceRequestImages?: any;
    }
  ];
}
