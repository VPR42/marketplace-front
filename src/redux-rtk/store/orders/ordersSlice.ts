import { createSlice } from '@reduxjs/toolkit';

import { createOrder, fetchOrders, updateOrderStatus } from '@/redux-rtk/store/orders/ordersThunks';
import type { OrdersState } from '@/redux-rtk/store/orders/types';

const initialState: OrdersState = {
  data: null,
  loading: false,
  error: null,
};

export const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(updateOrderStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.loading = false;
        if (state.data?.items) {
          const index = state.data.items.findIndex(
            (o) => String(o.orderId) === String(action.payload.id),
          );
          if (index !== -1) {
            state.data.items[index] = {
              ...state.data.items[index],
              status: action.payload.status,
            };
          }
        }
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default ordersSlice.reducer;
