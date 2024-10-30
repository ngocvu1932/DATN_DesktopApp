export interface IAppointmentRequest {
  time: string;
  customerId: number;
  employeeId: number;
  branchId: number;
  serviceId: number;
  note: string;
  reminderSent: number; // boolean
  status: number;
}
