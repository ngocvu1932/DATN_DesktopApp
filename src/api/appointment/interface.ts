export interface IAppointmentRequest {
  time: string; //
  status: number; //
  customer_id: number; //
  employee_id: number; //
  service_id: number; //
  note: string;
  reminder_sent: number;
  branch_id: number; //
}
