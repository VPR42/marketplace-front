import { createAsyncThunk } from '@reduxjs/toolkit';
import { isAxiosError } from 'axios';

import { api } from '@/shared/axios.config';

import type { FavoriteJob } from './types';

const getFavoriteError = (error: unknown, fallback: string) => {
  if (isAxiosError(error)) {
    return (error.response?.data as { message?: string; errorCode?: string })?.message ?? fallback;
  }
  return fallback;
};

export const fetchFavorites = createAsyncThunk<FavoriteJob[], void, { rejectValue: string }>(
  'favorites/fetchFavorites',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/feed/jobs', { params: { fromFavourites: true } });
      return data?.content ?? [];
    } catch (error: unknown) {
      if (
        isAxiosError(error) &&
        error.response?.status === 404 &&
        (error.response.data as { errorCode?: string })?.errorCode === 'JOBS_NOT_FOUND'
      ) {
        return [];
      }
      return rejectWithValue(getFavoriteError(error, 'Failed to load favorites'));
    }
  },
);

export const addToFavorites = createAsyncThunk<string, string, { rejectValue: string }>(
  'favorites/addToFavorites',
  async (jobId, { rejectWithValue }) => {
    try {
      await api.post('/feed/favourites', { jobId });
      return jobId;
    } catch (error: unknown) {
      return rejectWithValue(getFavoriteError(error, 'Failed to add favorite'));
    }
  },
);

export const removeFromFavorites = createAsyncThunk<string, string, { rejectValue: string }>(
  'favorites/removeFromFavorites',
  async (jobId, { rejectWithValue }) => {
    try {
      await api.delete(`/feed/favourites/${jobId}`);
      return jobId;
    } catch (error: unknown) {
      return rejectWithValue(getFavoriteError(error, 'Failed to remove favorite'));
    }
  },
);
