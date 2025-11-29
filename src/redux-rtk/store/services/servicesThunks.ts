import { createAsyncThunk } from '@reduxjs/toolkit';
import { isAxiosError } from 'axios';

import { api } from '@/shared/axios.config';

import type {
  PageResponse,
  Service,
  ServiceCreateRequest,
  ServiceQueryParams,
  ServiceUpdateRequest,
} from './types';

const getServiceError = (error: unknown, fallback: string) => {
  if (isAxiosError(error)) {
    return (error.response?.data as { message?: string })?.message ?? fallback;
  }
  return fallback;
};

export const createService = createAsyncThunk<
  Service,
  ServiceCreateRequest,
  { rejectValue: string }
>('services/create', async (payload, { rejectWithValue }) => {
  try {
    const { data } = await api.post<Service>('/feed/jobs', payload);
    return data;
  } catch (error: unknown) {
    return rejectWithValue(getServiceError(error, 'Не удалось создать услугу'));
  }
});

export const updateService = createAsyncThunk<
  Service,
  { id: string; body: ServiceUpdateRequest },
  { rejectValue: string }
>('services/update', async ({ id, body }, { rejectWithValue }) => {
  try {
    const { data } = await api.put<Service>(`/feed/jobs/${id}`, body);
    return data;
  } catch (error: unknown) {
    return rejectWithValue(getServiceError(error, 'Не удалось обновить услугу'));
  }
});

export const deleteService = createAsyncThunk<void, string, { rejectValue: string }>(
  'services/delete',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/feed/jobs/${id}`);
      return;
    } catch (error: unknown) {
      return rejectWithValue(getServiceError(error, 'Не удалось удалить услугу'));
    }
  },
);

export const fetchServiceById = createAsyncThunk<Service, string, { rejectValue: string }>(
  'services/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.get<Service>(`/feed/jobs/${id}`);
      return data;
    } catch (error: unknown) {
      return rejectWithValue(getServiceError(error, 'Не удалось получить услугу'));
    }
  },
);

export const fetchServices = createAsyncThunk<
  PageResponse<Service>,
  ServiceQueryParams | void,
  { rejectValue: string }
>('services/fetchList', async (params, { rejectWithValue }) => {
  try {
    const { data } = await api.get<PageResponse<Service>>('/feed/jobs', { params });
    return data;
  } catch (error: unknown) {
    return rejectWithValue(getServiceError(error, 'Не удалось загрузить услуги'));
  }
});
