export interface IAppointmentRequest {
  time: string; //
  status: number; //
  customerId: number; //
  employeeId: number; //
  serviceId: number; //
  note: string;
  reminderSent: number;
  branchId: number; //
}
