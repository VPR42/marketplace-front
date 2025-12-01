import { createAsyncThunk } from '@reduxjs/toolkit';
import { isAxiosError } from 'axios';

import { api } from '@/shared/axios.config';

import type { FavoriteJob, FetchFavoritesParams } from './types';

const getFavoriteError = (error: unknown, fallback: string) => {
  if (isAxiosError(error)) {
    return (error.response?.data as { message?: string; errorCode?: string })?.message ?? fallback;
  }
  return fallback;
};

export const fetchFavorites = createAsyncThunk<
  FavoriteJob[],
  FetchFavoritesParams | undefined,
  { rejectValue: string }
>('favorites/fetchFavorites', async (params, { rejectWithValue }) => {
  try {
    const requestParams: Record<string, unknown> = {
      fromFavourites: true,
    };

    if (params) {
      if (params.page !== undefined) {
        requestParams.page = params.page;
      }
      if (params.pageSize !== undefined) {
        requestParams.pageSize = params.pageSize;
      }
      if (params.query) {
        requestParams.query = params.query;
      }
      if (params.categoryId !== undefined && params.categoryId !== null) {
        requestParams.categoryId = params.categoryId;
      }
      if (params.experience !== undefined && params.experience !== null) {
        requestParams.experience = params.experience;
      }
      if (params.minPrice !== undefined) {
        requestParams.minPrice = params.minPrice;
      }
      if (params.maxPrice !== undefined) {
        requestParams.maxPrice = params.maxPrice;
      }
      if (params.priceSort) {
        requestParams.priceSort = params.priceSort;
      }
      if (params.experienceSort) {
        requestParams.experienceSort = params.experienceSort;
      }
    }

    const { data } = await api.get('/feed/jobs', { params: requestParams });
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
});

export const addToFavorites = createAsyncThunk<string, string, { rejectValue: string }>(
  'favorites/addToFavorites',
  async (jobId, { rejectWithValue }) => {
    try {
      await api.post('/feed/favourites', { jobId });
      return jobId; // просто возвращаем ID
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
