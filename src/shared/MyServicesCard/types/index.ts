export interface MyServiceCardProps {
  mode: 'my' | 'favorite';

  id: string;
  title: string;
  description?: string;
  category?: string;
  price?: number;
  location?: string;
  image?: string;
  tags?: string[];
  createdAt?: string;
  status?: string;
  workerName?: string;
  timeAgo?: string;

  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onRemove?: (id: string) => void;
  onProfile?: (id: string) => void;
  onMessage?: (id: string) => void;
}
