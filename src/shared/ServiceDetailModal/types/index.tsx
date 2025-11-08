export interface ServiceDetailModalProps {
  open: boolean;
  onClose: () => void;
  service: {
    id: number;
    title: string;
    description: string;
    price: string;
    orders: number;
    gradient: string;
    workerName: string;
    workerRating: string;
    workerAvatar: string;
    category?: string;
    tags?: string[];
    experience?: string;
    location?: string;
  };
  onOrder?: () => void;
  onMessage?: () => void;
  onFavorite?: () => void;
  isFavorite?: boolean;
}
