export interface ServiceCardProps {
  title: string;
  description: string;
  price: string;
  orders: number;
  gradient: string;
  coverUrl?: string;
  workerName: string;
  workerAvatar: string;
  favorite?: boolean;
  onClick?: () => void;
}
