import { createAsyncThunk } from '@reduxjs/toolkit';
import { isAxiosError } from 'axios';

import type {
  CreateOrderResponse,
  OrdersQueryParams,
  OrdersResponse,
} from '@/redux-rtk/store/orders/types';
import { api } from '@/shared/axios.config';

const getOrdersError = (error: unknown, fallback: string) => {
  if (isAxiosError(error)) {
    return (error.response?.data as { message?: string; errorCode?: string })?.message ?? fallback;
  }
  return fallback;
};

export const fetchOrders = createAsyncThunk<OrdersResponse, OrdersQueryParams | undefined>(
  'orders/fetchOrders',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get('/orders', {
        params,
      });

      return response.data as OrdersResponse;
    } catch (err: unknown) {
      return rejectWithValue(getOrdersError(err, 'Failed to fetch orders'));
    }
  },
);

export const createOrder = createAsyncThunk<CreateOrderResponse, { jobId: string }>(
  'orders/createOrder',
  async (body, { rejectWithValue }) => {
    try {
      const response = await api.post('/orders', body);
      return response.data;
    } catch (err: unknown) {
      return rejectWithValue(getOrdersError(err, 'Failed to create order'));
    }
  },
);

export const updateOrderStatus = createAsyncThunk<
  CreateOrderResponse,
  { orderId: number; status: number }
>('orders/updateOrderStatus', async ({ orderId, status }, { rejectWithValue }) => {
  try {
    const response = await api.put(`/orders/${orderId}/status`, { status });
    return response.data as CreateOrderResponse;
  } catch (err: unknown) {
    return rejectWithValue(getOrdersError(err, 'Не удалось обновить статус заказа'));
  }
});
