import { createAsyncThunk } from '@reduxjs/toolkit';
import { isAxiosError } from 'axios';

import type { CreateChatResponse } from '@/redux-rtk/store/chats/types';
import { api } from '@/shared/axios.config';

const getChatError = (err: unknown, fallback = 'Failed to create chat') =>
  isAxiosError(err) ? (err.response?.data?.message ?? fallback) : fallback;

export const createChat = createAsyncThunk<CreateChatResponse, { orderId: string }>(
  'chats/createChat',
  async ({ orderId }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/chat/create/${orderId}`, null, {});
      return response.data as CreateChatResponse;
    } catch (err: unknown) {
      return rejectWithValue(getChatError(err));
    }
  },
);
