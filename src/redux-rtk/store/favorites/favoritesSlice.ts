import { createSlice } from '@reduxjs/toolkit';

import { fetchFavorites, addToFavorites, removeFromFavorites } from './favoriteThunks';
import type { FavoritesState } from './types';

const initialState: FavoritesState = {
  items: [],
  status: 'idle',
  error: null,
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFavorites.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchFavorites.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? action.error?.message ?? 'Unknown error';
      })

      .addCase(addToFavorites.rejected, (state, action) => {
        state.error = action.payload ?? action.error?.message ?? 'Failed to add favorite';
      })

      // если удалять из стора еще надо то рассскоментируйте
      // .addCase(removeFromFavorites.fulfilled, (state, action) => {
      //   state.items = state.items.filter((it) => it.id !== action.payload);
      // })

      .addCase(removeFromFavorites.rejected, (state, action) => {
        state.error = action.payload ?? action.error?.message ?? 'Failed to remove favorite';
      });
  },
});

export default favoritesSlice.reducer;
