export interface IAppointment {
  id: number;
  code: string;
  branchId: number;
  customerId: number;
  employeeId: number;
  status: number;
  note: string;
  isRemoved: boolean;
  createdAt: string;
  updatedAt: string;
  serviceId: number;
  serviceName: string;
  branchName: string;
  customerName: string;
  employeeName: string;
  time: string;
  reminderSent: boolean;
}
