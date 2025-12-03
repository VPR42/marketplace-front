import { createSlice } from '@reduxjs/toolkit';

import { fetchFavorites, addToFavorites, removeFromFavorites } from './favoriteThunks';
import type { FavoritesState } from './types';

const initialState: FavoritesState = {
  items: [],
  filtered: [],
  status: 'idle',
  pageNumber: 0,
  pageSize: 9,
  totalElements: 0,
  error: null,
  filterParams: null,
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    setFiltered(state, action) {
      state.filtered = action.payload;
    },
    setFilterParams(state, action) {
      state.filterParams = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFavorites.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.status = 'succeeded';

        state.filtered = action.payload.content;

        if (!state.items.length) {
          state.items = action.payload.content;
        }

        state.pageNumber = action.payload.pageNumber;
        state.pageSize = action.payload.size;
        state.totalElements = action.payload.totalElements;
      })

      .addCase(fetchFavorites.rejected, (state, action) => {
        state.status = 'failed';
        state.error =
          typeof action.payload === 'string'
            ? action.payload
            : (action.error?.message ?? 'Unknown error');
      })

      .addCase(addToFavorites.rejected, (state, action) => {
        state.error = action.payload ?? action.error?.message ?? 'Failed to add favorite';
      })

      .addCase(removeFromFavorites.rejected, (state, action) => {
        state.error = action.payload ?? action.error?.message ?? 'Failed to remove favorite';
      });
  },
});

export const { setFiltered, setFilterParams } = favoritesSlice.actions;
export default favoritesSlice.reducer;
