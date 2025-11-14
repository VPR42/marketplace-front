export interface MyService {
  id: number;
  title: string;
  description: string;
  price: number;
  location: string;
  views: number;
  image: string;
  requests: number;
  activeOrders: number;
  createdAt: string;
  category: string;
  status: string;
  onEdit?: () => void;
  onSubmit?: () => void;
}
