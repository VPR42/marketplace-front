import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { RootState } from '../..';
import {
  fetchWhoAmI,
  getStoredToken,
  loginUser,
  logoutUser,
  refreshSession,
  registerUser,
} from './authThunks';
import type { AuthResponse, AuthState } from './types';
import { removeProfileAvatar, uploadProfileAvatar } from '../profile/profileThunks';

const initialToken = getStoredToken();

const initialState: AuthState = {
  user: null,
  token: initialToken,
  isAuthenticated: Boolean(initialToken),
  status: 'idle',
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<AuthResponse['user'] | null>) {
      state.user = action.payload;
      state.isAuthenticated = Boolean(state.token && action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? action.error.message ?? 'Register failed';
      })
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? action.error.message ?? 'Login failed';
      })
      .addCase(refreshSession.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(refreshSession.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(refreshSession.rejected, (state, action) => {
        state.status = 'failed';
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = action.payload ?? action.error.message ?? 'Refresh failed';
      })
      .addCase(fetchWhoAmI.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchWhoAmI.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
        state.isAuthenticated = Boolean(state.token);
      })
      .addCase(fetchWhoAmI.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? action.error.message ?? 'Failed to fetch profile';
      })
      .addCase(logoutUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.status = 'succeeded';
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? action.error.message ?? 'Logout failed';
      })
      .addCase(uploadProfileAvatar.fulfilled, (state, action) => {
        if (state.user) {
          state.user = { ...state.user, avatarPath: action.payload.url };
        }
      })
      .addCase(removeProfileAvatar.fulfilled, (state, action) => {
        if (state.user) {
          state.user = { ...state.user, avatarPath: action.payload.avatarPath };
        }
      });
  },
});

export const { setUser } = authSlice.actions;

export const selectAuthState = (state: RootState) => state.auth;

export default authSlice.reducer;
