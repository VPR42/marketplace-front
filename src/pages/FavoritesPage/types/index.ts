export interface FavoritesListProps {
  loadingState?: 'idle' | 'loading' | 'succeeded' | 'failed';
  onToggle?: (id: string, makeFavorite: boolean) => Promise<void>;
  togglingFavoriteId?: string | null;
  hasActiveFilters?: boolean;
  locallyRemovedIds?: string[];
}
