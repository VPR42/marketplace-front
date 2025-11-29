import type { RootState } from '@/redux-rtk';

export const selectFavorites = (state: RootState) => state.favorites.items;
export const selectFavoritesStatus = (state: RootState) => state.favorites.status;
