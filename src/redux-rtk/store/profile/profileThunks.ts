import { createAsyncThunk } from '@reduxjs/toolkit';
import { isAxiosError } from 'axios';

import { api } from '@/shared/axios.config';

import type {
  MasterInfo,
  Profile,
  UpdateMasterInfoPayload,
  UpdateSkillsPayload,
  UpdateUserPayload,
} from './types';

const getProfileError = (error: unknown, fallback: string) => {
  if (isAxiosError(error)) {
    return (error.response?.data as { message?: string })?.message ?? fallback;
  }
  return fallback;
};

export const fetchOwnProfile = createAsyncThunk<Profile, void, { rejectValue: string }>(
  'profile/fetchOwn',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get<Profile>('/profile');
      return data;
    } catch (error: unknown) {
      return rejectWithValue(getProfileError(error, 'Не удалось получить профиль'));
    }
  },
);

export const fetchProfileById = createAsyncThunk<Profile, string, { rejectValue: string }>(
  'profile/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.get<Profile>(`/profile/${id}`);
      return data;
    } catch (error: unknown) {
      return rejectWithValue(getProfileError(error, 'Не удалось получить профиль пользователя'));
    }
  },
);

export const updateProfileUser = createAsyncThunk<
  Profile,
  UpdateUserPayload,
  { rejectValue: string }
>('profile/updateUser', async (payload, { rejectWithValue }) => {
  try {
    const { data } = await api.patch<Profile>('/profile/user', payload);
    return data;
  } catch (error: unknown) {
    return rejectWithValue(getProfileError(error, 'Не удалось обновить данные пользователя'));
  }
});

export const updateProfileMasterInfo = createAsyncThunk<
  Profile,
  UpdateMasterInfoPayload,
  { rejectValue: string }
>('profile/updateMasterInfo', async (payload, { rejectWithValue }) => {
  try {
    const { data } = await api.patch<Profile>('/profile/master-info', payload);
    return data;
  } catch (error: unknown) {
    return rejectWithValue(getProfileError(error, 'Не удалось обновить мастер-инфо'));
  }
});

export const updateProfileSkills = createAsyncThunk<
  Profile,
  UpdateSkillsPayload,
  { rejectValue: string }
>('profile/updateSkills', async (payload, { rejectWithValue }) => {
  try {
    const { data } = await api.patch<Profile>('/profile/skills', payload);
    return data;
  } catch (error: unknown) {
    return rejectWithValue(getProfileError(error, 'Не удалось обновить навыки'));
  }
});

export interface CreateMasterInfoRequest {
  masterInfo: MasterInfo;
  skills: number[];
}

export const createProfileMasterInfo = createAsyncThunk<
  Profile,
  CreateMasterInfoRequest,
  { rejectValue: string }
>('profile/createMasterInfo', async (payload, { rejectWithValue }) => {
  try {
    const { data } = await api.post<Profile>('/profile/master-info', payload);
    return data;
  } catch (error: unknown) {
    return rejectWithValue(getProfileError(error, 'Не удалось создать мастер-инфо'));
  }
});
