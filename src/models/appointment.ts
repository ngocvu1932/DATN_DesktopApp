export interface IAppointment {
  branch_id: number;
  created_at?: string;
  customer_id: number;
  date: string;
  employee_id: null;
  id: number;
  note: string;
  reminder_sent: number;
  service_id: number;
  status: number;
  time: string;
  updated_at?: string;
  user_id: number;
}
// export interface IAppointment {
//   branch_id: number;   DONE
//   created_at: string;
//   customer_id: number;   DONE
//   employee_id: null;  DONE
//   id: number;    DONE
//   note: string;   DONE
//   reminder_sent: number;  DONE
//   service_id: number;   DONE
//   status: number;    DONE
//   time: string;   DONE
//   updated_at: string;
//   user_id: number;   DONE
// }
