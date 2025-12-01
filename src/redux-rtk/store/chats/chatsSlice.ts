import { createSlice } from '@reduxjs/toolkit';

import type { ChatsState } from '@/redux-rtk/store/chats/types';

import { createChat } from './chatsThunks';

const initialState: ChatsState = {
  creating: false,
  lastCreated: null,
  error: null,
};

export const chatsSlice = createSlice({
  name: 'chats',
  initialState,
  reducers: {
    clearChatError(state) {
      state.error = null;
    },
    clearLastCreated(state) {
      state.lastCreated = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createChat.pending, (state) => {
        state.creating = true;
        state.error = null;
      })
      .addCase(createChat.fulfilled, (state, action) => {
        state.creating = false;
        state.lastCreated = action.payload;
      })
      .addCase(createChat.rejected, (state, action) => {
        state.creating = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearChatError, clearLastCreated } = chatsSlice.actions;
export default chatsSlice.reducer;
