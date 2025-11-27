import { createAsyncThunk } from '@reduxjs/toolkit';

import { api } from '@/shared/axios.config';

import type { CategoryWithCount, Tag } from './types';

export interface FetchCategoriesParams {
  query?: string | null;
  jobsCountSort?: 'ASC' | 'DESC' | null;
}

export const fetchCategories = createAsyncThunk<CategoryWithCount[], FetchCategoriesParams | void>(
  'utils/fetchCategories',
  async (params) => {
    const { query = null, jobsCountSort = null } = params || {};
    const { data } = await api.get<CategoryWithCount[]>('/feed/categories', {
      params: {
        query: query ?? undefined,
        jobsCountSort: jobsCountSort ?? undefined,
      },
    });
    return data;
  },
);

export const fetchTags = createAsyncThunk<Tag[]>('utils/fetchTags', async () => {
  const { data } = await api.get<Tag[]>('/feed/tags');
  return data;
});
