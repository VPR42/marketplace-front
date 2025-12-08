export interface MyServiceCardProps {
  mode: 'my' | 'favorite';

  id: string;
  title: string;
  description?: string;
  category?: string;
  price?: number;
  location?: string;
  cover?: string;
  workerAvatar?: string;
  tags?: string[];
  gradient?: string;
  createdAt?: string;
  workerName?: string;
  timeAgo?: string;
  isFavorite?: boolean;
  isToggling?: boolean;

  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onToggle?: (id: string, makeFavorite: boolean) => Promise<void> | void;
  onProfile?: (id: string) => void;
  onMessage?: (id: string) => void;
  onClick?: () => void;
}
