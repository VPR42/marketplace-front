export interface FavoriteItemProps {
  id: number;
  title: string;
  description?: string;
  category?: string;
  budget?: string;
  location?: string;
  remoteId?: number;
  image?: string | null;
  tags?: string[];
  workerName?: string;
  timeAgo?: string;
}
