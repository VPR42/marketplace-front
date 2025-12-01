import { createAsyncThunk } from '@reduxjs/toolkit';
import { isAxiosError } from 'axios';

import { api } from '@/shared/axios.config';

import type { RootState } from '../..';
import type {
  MasterInfo,
  Profile,
  UpdateMasterInfoPayload,
  UpdateSkillsPayload,
  UpdateUserPayload,
  UploadAvatarResponse,
} from './types';

const getProfileError = (error: unknown, fallback: string) => {
  if (isAxiosError(error)) {
    return (error.response?.data as { message?: string })?.message ?? fallback;
  }
  return fallback;
};

//const sanitizePhone = (phone?: string) => (phone ? phone.replace(/\D/g, '').slice(0, 11) : phone);

const sanitizePhoneForSend = (phone?: string) => {
  if (!phone) {
    return phone;
  }
  const clean = phone.replace(/\D/g, '');
  return clean.length > 1 ? clean.slice(1, 11) : clean;
};

const normalizePhoneForDisplay = (phone?: string) => {
  if (!phone) {
    return phone;
  }
  const clean = phone.replace(/\D/g, '');
  if (clean.length === 10) {
    return `7${clean}`;
  }
  if (clean.length === 11 && clean.startsWith('7')) {
    return clean;
  }
  return clean;
};

const withDefaultAvatar = (profile: Profile): Profile => {
  if (profile.avatarPath) {
    return profile;
  }
  const fullName =
    `${profile.name} ${profile.surname} ${profile.patronymic ?? ''}`.trim() || 'user';
  const fallback = `https://avatar.iran.liara.run/username?username=${encodeURIComponent(fullName)}`;
  return { ...profile, avatarPath: fallback };
};

export const fetchOwnProfile = createAsyncThunk<Profile, void, { rejectValue: string }>(
  'profile/fetchOwn',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get<Profile>('/profile');
      const normPhone = normalizePhoneForDisplay(data.masterInfo?.phoneNumber);
      const result = {
        ...data,
        masterInfo: {
          ...data.masterInfo,
          phoneNumber: normPhone ?? data.masterInfo.phoneNumber,
        },
      };
      return withDefaultAvatar(result);
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
      const normPhone = normalizePhoneForDisplay(data.masterInfo?.phoneNumber);
      const result = {
        ...data,
        masterInfo: {
          ...data.masterInfo,
          phoneNumber: normPhone ?? data.masterInfo.phoneNumber,
        },
      };
      return withDefaultAvatar(result);
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
    return withDefaultAvatar(data);
  } catch (error: unknown) {
    return rejectWithValue(getProfileError(error, 'Не удалось обновить данные пользователя'));
  }
});

export const uploadProfileAvatar = createAsyncThunk<
  UploadAvatarResponse,
  File,
  { rejectValue: string }
>('profile/uploadAvatar', async (file, { rejectWithValue }) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    const { data } = await api.put<UploadAvatarResponse>('/profile/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  } catch (error: unknown) {
    return rejectWithValue(getProfileError(error, 'Не удалось загрузить аватар'));
  }
});

export const removeProfileAvatar = createAsyncThunk<
  Profile,
  void,
  { rejectValue: string; state: RootState }
>('profile/removeAvatar', async (_, { rejectWithValue, getState }) => {
  try {
    const state = getState();
    const user = state.profile.data;
    const fullName = user ? `${user.name} ${user.surname}`.trim() || 'user' : 'user';
    const liaraUrl = `https://avatar.iran.liara.run/username?username=${encodeURIComponent(fullName)}`;

    let avatarBlob: Blob;
    try {
      const response = await fetch(liaraUrl);
      avatarBlob = await response.blob();
    } catch {
      avatarBlob = new Blob([], { type: 'application/octet-stream' });
    }

    const formData = new FormData();
    formData.append('file', avatarBlob, 'avatar.png');
    const { data } = await api.put<Profile>('/profile/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  } catch (error: unknown) {
    return rejectWithValue(getProfileError(error, 'Не удалось удалить аватар'));
  }
});

export const updateProfileMasterInfo = createAsyncThunk<
  Profile,
  UpdateMasterInfoPayload,
  { rejectValue: string }
>('profile/updateMasterInfo', async (payload, { rejectWithValue }) => {
  try {
    const validPhone = sanitizePhoneForSend(payload.phoneNumber);
    const { data } = await api.patch<Profile>('/profile/master-info', {
      ...payload,
      phoneNumber: validPhone,
    });
    const normPhone = normalizePhoneForDisplay(data.masterInfo?.phoneNumber);
    const result = {
      ...data,
      masterInfo: {
        ...data.masterInfo,
        phoneNumber: normPhone ?? data.masterInfo.phoneNumber,
      },
    };
    return withDefaultAvatar(result);
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
    return withDefaultAvatar(data);
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
    const validPhone = sanitizePhoneForSend(payload.masterInfo.phoneNumber);
    const { data } = await api.post<Profile>('/profile/master-info', {
      masterInfo: { ...payload.masterInfo, phoneNumber: validPhone },
      skills: payload.skills,
    });
    const normPhone = normalizePhoneForDisplay(data.masterInfo?.phoneNumber);
    const result = {
      ...data,
      masterInfo: {
        ...data.masterInfo,
        phoneNumber: normPhone ?? data.masterInfo.phoneNumber,
      },
    };
    return withDefaultAvatar(result);
  } catch (error: unknown) {
    return rejectWithValue(getProfileError(error, 'Не удалось создать мастер-инфо'));
  }
});
