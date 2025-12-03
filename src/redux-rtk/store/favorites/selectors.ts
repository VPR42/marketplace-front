import type { RootState } from '@/redux-rtk';

export const selectAllFavorites = (state: RootState) => state.favorites.items;
export const selectFilteredFavorites = (state: RootState) => state.favorites.filtered;
export const selectFavoritesStatus = (state: RootState) => state.favorites.status;
export const selectFilterParams = (state: RootState) => state.favorites.filterParams;
export const selectFavoritesPagination = (state: RootState) => {
  const { pageNumber, pageSize, totalElements } = state.favorites;

  return {
    totalCount: totalElements,
    pageNumber: pageNumber + 1,
    pageSize,
  };
};
