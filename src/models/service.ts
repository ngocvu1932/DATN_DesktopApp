export interface IService {
  id: number;
  name: string;
  description: string;
  price: string;
  status: boolean;
  categoryId: number;
  branchId: number;
  totalSessions: number;
  userId: number;
  createdAt: string;
  updatedAt: string;
  isRemoved: boolean;
  category?: {
    id: number;
    name: string;
  };
  branch?: {
    id: number;
    name: string;
  };
}
