export interface ICustomer {
  id: number;
  username: string;
  password?: string;
  name: string;
  email: string;
  phone: string;
  gender: string;
  loyaltyPoints: number;
  avatar: string;
  status: number;
  role: number;
  token: string;
  userId?: number;
  createdAt?: string;
  updatedAt?: string;
}
