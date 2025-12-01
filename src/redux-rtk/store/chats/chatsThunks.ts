import { createAsyncThunk } from '@reduxjs/toolkit';
import { isAxiosError } from 'axios';

import type {
  ChatmateInfo,
  ChatMessage,
  ChatSummary,
  CreateChatResponse,
} from '@/redux-rtk/store/chats/types';
import { api } from '@/shared/axios.config';

const getChatError = (err: unknown, fallback = 'Failed to create chat') =>
  isAxiosError(err) ? (err.response?.data?.message ?? fallback) : fallback;

export const createChat = createAsyncThunk<CreateChatResponse, { serviceId: string }>(
  'chats/createChat',
  async ({ serviceId }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/chat/${serviceId}`, null, {});
      return response.data as CreateChatResponse;
    } catch (err: unknown) {
      return rejectWithValue(getChatError(err));
    }
  },
);

export const fetchChats = createAsyncThunk<ChatSummary[], void, { rejectValue: string }>(
  'chats/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get<ChatSummary[]>('/chat');
      return data;
    } catch (err: unknown) {
      return rejectWithValue(getChatError(err, 'Не удалось получить чаты'));
    }
  },
);

export const fetchMessages = createAsyncThunk<
  { chatId: string; messages: ChatMessage[] },
  { chatId: string; page?: number; size?: number },
  { rejectValue: string }
>('chats/fetchMessages', async ({ chatId, page = 0, size = 20 }, { rejectWithValue }) => {
  try {
    const { data } = await api.get<ChatMessage[]>(`/chat/${chatId}/messages`, {
      params: { page, size },
    });
    return { chatId, messages: data };
  } catch (err: unknown) {
    return rejectWithValue(getChatError(err, 'Не удалось загрузить сообщения'));
  }
});

export const fetchChatmate = createAsyncThunk<
  { chatId: string; info: ChatmateInfo },
  { chatId: string },
  { rejectValue: string }
>('chats/fetchChatmate', async ({ chatId }, { rejectWithValue }) => {
  try {
    const { data } = await api.get<ChatmateInfo>(`/chat/${chatId}/chatmate`);
    return { chatId, info: data };
  } catch (err: unknown) {
    return rejectWithValue(getChatError(err, 'Не удалось получить информацию о собеседнике'));
  }
});
