export interface IAppointment {
  branchId: number;
  createdAt?: string;
  customerId: number;
  time: string;
  employeeId: null;
  id: number;
  note: string;
  reminderSent: number;
  serviceId: number;
  status: number;
  updatedAt?: string;
  userId: number;
  serviceName?: string;
  customerName?: string;
  employeeName?: string;
}
// export interface IAppointment {
//   branchId: number;   DONE
//   created_at: string;
//   customerId: number;   DONE
//   employeeId: null;  DONE
//   id: number;    DONE
//   note: string;   DONE
//   reminderSent: number;  DONE
//   service_id: number;   DONE
//   status: number;    DONE
//   time: string;   DONE
//   updated_at: string;
//   user_id: number;   DONE
// }
