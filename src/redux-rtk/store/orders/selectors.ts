import type { RootState } from '@/redux-rtk';

export const selectOrdersState = (state: RootState) => state.orders;

export const selectOrders = (state: RootState) => state.orders.data?.items ?? [];

export const selectOrdersPagination = (state: RootState) => {
  const serverPage = state.orders.data?.pageNumber;
  return {
    totalCount: state.orders.data?.totalCount ?? 0,
    pageNumber: serverPage !== undefined && serverPage !== null ? serverPage + 1 : 1,
    pageSize: state.orders.data?.pageSize ?? 9,
  };
};

export const selectOrdersLoading = (state: RootState) => state.orders.loading;

export const selectOrdersError = (state: RootState) => state.orders.error;
