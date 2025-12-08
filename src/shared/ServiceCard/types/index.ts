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
  /**
   * Флаг для собственных услуг (нужен, чтобы скрывать действия в модалке).
   */
  isOwn?: boolean;
}
