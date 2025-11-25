export type OrderStatus = 'new' | 'in_progress' | 'done' | 'canceled';

export interface OrderItem {
  id: number;
  clientId: number;
  master: string;
  title: string;
  created: string;
  status: OrderStatus;
  description: string;
  categoryId: number;
  categoryLabel: string;
  budget: number;
  location: string;
  image?: string;
}
