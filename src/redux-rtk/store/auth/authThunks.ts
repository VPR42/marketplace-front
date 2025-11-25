import { createAsyncThunk } from '@reduxjs/toolkit';
import { isAxiosError } from 'axios';

import { api } from '@/shared/axios.config';

import type { RootState } from '../..';
import type {
  AuthResponse,
  LoginRequest,
  LoginResponse,
  RefreshResponse,
  RegisterRequest,
  RegisterResponse,
  WhoAmIResponse,
} from './types';

const TOKEN_STORAGE_KEY = 'access_token';

const setAuthToken = (token: string | null) => {
  if (typeof localStorage === 'undefined') {
    return;
  }

  if (token) {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    delete api.defaults.headers.common.Authorization;
  }
};

const getStoredToken = () => {
  if (typeof localStorage === 'undefined') {
    return null;
  }
  return localStorage.getItem(TOKEN_STORAGE_KEY);
};

const getErrorMessage = (error: unknown) => {
  if (isAxiosError(error)) {
    const message = (error.response?.data as { message?: string })?.message;
    return message ?? error.message ?? 'Request failed';
  }
  return 'Unknown error';
};

const existingToken = getStoredToken();
if (existingToken) {
  setAuthToken(existingToken);
}

export const registerUser = createAsyncThunk<
  AuthResponse,
  RegisterRequest,
  { rejectValue: string }
>('auth/register', async (payload, { rejectWithValue }) => {
  try {
    const { data } = await api.post<RegisterResponse>('/auth/registration', payload);
    setAuthToken(data.token);
    return data;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const loginUser = createAsyncThunk<AuthResponse, LoginRequest, { rejectValue: string }>(
  'auth/login',
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await api.post<LoginResponse>('/auth/login', payload);
      setAuthToken(data.token);
      return data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const refreshSession = createAsyncThunk<
  AuthResponse,
  void,
  { state: RootState; rejectValue: string }
>('auth/refresh', async (_payload, { rejectWithValue }) => {
  try {
    const { data } = await api.get<RefreshResponse>('/auth/refresh');
    setAuthToken(data.token);
    return data;
  } catch (error) {
    setAuthToken(null);
    return rejectWithValue(getErrorMessage(error));
  }
});

export const logoutUser = createAsyncThunk<void, void, { rejectValue: string }>(
  'auth/logout',
  async (_payload, { rejectWithValue }) => {
    try {
      await api.post('/auth/logout');
      setAuthToken(null);
      return;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const fetchWhoAmI = createAsyncThunk<WhoAmIResponse, void, { rejectValue: string }>(
  'auth/whoami',
  async (_payload, { rejectWithValue }) => {
    try {
      const { data } = await api.get<WhoAmIResponse>('/auth/whoami');
      return data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export { getStoredToken, setAuthToken, TOKEN_STORAGE_KEY };
