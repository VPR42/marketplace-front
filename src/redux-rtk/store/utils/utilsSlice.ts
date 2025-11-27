import { createSlice } from '@reduxjs/toolkit';

import type { CategoryWithCount, Tag } from './types';
import { fetchCategories, fetchTags } from './utilsThunks';

interface UtilsState {
  categories: CategoryWithCount[];
  tags: Tag[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: UtilsState = {
  categories: [],
  tags: [],
  status: 'idle',
  error: null,
};

const utilsSlice = createSlice({
  name: 'utils',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'Не удалось загрузить категории';
      })
      .addCase(fetchTags.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchTags.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.tags = action.payload;
      })
      .addCase(fetchTags.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'Не удалось загрузить теги';
      });
  },
});

export default utilsSlice.reducer;
