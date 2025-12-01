import type { UserExtended } from '@/redux-rtk/store/profile/types';

export interface ServiceDetailModalProps {
  mode?: string;
  open: boolean;
  onClose: () => void;
  service: {
    id: string;
    title: string;
    description: string;
    price: number;
    orders: number;
    gradient: string;
    coverUrl?: string;
    workerName: string;
    workerRating: string;
    workerAvatar: string;
    category?: string;
    tags?: string[];
    experience?: string;
    location?: string;
    user?: UserExtended;
  };
  onOrder?: () => void;
  onMessage?: () => void;
  onFavorite?: () => void;
  isFavorite?: boolean;
  isTogglingFavorite?: boolean;
}
