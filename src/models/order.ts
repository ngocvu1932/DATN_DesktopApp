export interface IOrder {
  id: number;
  customerId: number;
  name: string;
  description: string;
  status: number;
  userId: number;
  createdAt: string;
  updatedAt: string;
  isRemoved: boolean;
  orderDetails: IOrderDetail[];
  totalAmount: number;
}

export interface IOrderDetail {
  id: number;
  orderId: number;
  serviceId: number;
  quantity: number;
  price: number;
  createdAt: string;
  serviceName: string;
  totalAmount: number;
}
