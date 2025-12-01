export type OrderStatus = 'created' | 'working' | 'completed' | 'cancelled' | 'rejected';

export interface OrderItem {
  id: string;
  clientId?: number;
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

export type ActionType = 'start' | 'complete' | 'cancel';

export interface OrderActionModalProps {
  open: boolean;
  type: ActionType;
  role?: 'customer' | 'worker';
  onClose: () => void;
  onConfirm: (payload?: { reason?: string }) => void;
}

export interface MyOrderCardProps extends OrderItem {
  onClick?: () => void;
  role?: 'customer' | 'worker';
  onAction?: (action: 'start' | 'complete' | 'cancel' | 'message' | 'profile') => void;
}

export interface ApiOrderItem {
  orderId: number;
  status: string;
  orderedAt: string;
  categoryId: number;
  jobName: string;
  jobDescription: string;
  jobPrice: number;
  jobCoverUrl: string;
  categoryName: string;
  masterFullName: string;
  masterCityId: number;
}
