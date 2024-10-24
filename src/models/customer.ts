export interface ICustomer {
  id: number;
  username: string;
  password?: string;
  name: string;
  email: string;
  phone: string;
  gender: string;
  loyalty_points: number;
  avatar: string;
  status: number;
  role: number;
  token: string;
  user_id?: number;
  created_at?: string;
  updated_at?: string;
}
