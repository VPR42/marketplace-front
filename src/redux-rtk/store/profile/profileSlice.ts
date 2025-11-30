import { createSlice, isAnyOf } from '@reduxjs/toolkit';

import {
  createProfileMasterInfo,
  fetchOwnProfile,
  fetchProfileById,
  updateProfileMasterInfo,
  updateProfileSkills,
  updateProfileUser,
} from './profileThunks';
import type { ProfileState } from './types';

const initialState: ProfileState = {
  data: null,
  isOwner: false,
  status: 'idle',
  updateStatus: 'idle',
  error: null,
  updateError: null,
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setIsOwner(state, action) {
      state.isOwner = action.payload as boolean;
    },
    resetProfileState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOwnProfile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
        state.isOwner = true;
      })
      .addCase(fetchProfileById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
        state.isOwner = false;
      })
      .addCase(createProfileMasterInfo.fulfilled, (state, action) => {
        state.updateStatus = 'succeeded';
        state.data = action.payload;
      })
      .addMatcher(
        isAnyOf(
          updateProfileUser.fulfilled,
          updateProfileMasterInfo.fulfilled,
          updateProfileSkills.fulfilled,
        ),
        (state, action) => {
          state.updateStatus = 'succeeded';
          state.data = action.payload;
        },
      )
      .addMatcher(isAnyOf(fetchOwnProfile.pending, fetchProfileById.pending), (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addMatcher(
        isAnyOf(
          updateProfileUser.pending,
          updateProfileMasterInfo.pending,
          updateProfileSkills.pending,
          createProfileMasterInfo.pending,
        ),
        (state) => {
          state.updateStatus = 'loading';
          state.updateError = null;
        },
      )
      .addMatcher(isAnyOf(fetchOwnProfile.rejected, fetchProfileById.rejected), (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? action.error.message ?? 'Не удалось загрузить профиль';
      })
      .addMatcher(
        isAnyOf(
          updateProfileUser.rejected,
          updateProfileMasterInfo.rejected,
          updateProfileSkills.rejected,
          createProfileMasterInfo.rejected,
        ),
        (state, action) => {
          state.updateStatus = 'failed';
          state.updateError =
            (action.payload as string | undefined) ??
            action.error.message ??
            'Не удалось сохранить профиль';
        },
      );
  },
});

export const { setIsOwner, resetProfileState } = profileSlice.actions;

export default profileSlice.reducer;
