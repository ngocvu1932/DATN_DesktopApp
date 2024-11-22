export interface ISkill {
  id: number;
  name: string;
  description: string;
  level: number;
  category: string;
  status: boolean;
  userId: number;
  createdAt: string;
  updatedAt: string;
  isRemoved: boolean;
}
