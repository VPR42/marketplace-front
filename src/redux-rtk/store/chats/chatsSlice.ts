import { createSlice, isAnyOf } from '@reduxjs/toolkit';

import type { ChatMessage, ChatsState } from '@/redux-rtk/store/chats/types';

import { createChat, fetchChatmate, fetchChats, fetchMessages } from './chatsThunks';

const initialState: ChatsState = {
  status: 'idle',
  creating: false,
  lastCreated: null,
  items: [],
  messagesByChat: {},
  chatmates: {},
  currentChatId: null,
  wsConnected: false,
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
    setCurrentChat(state, action) {
      state.currentChatId = action.payload as string | null;
    },
    setWsConnected(state, action) {
      state.wsConnected = action.payload as boolean;
    },
    addMessage(state, action) {
      const message = action.payload as ChatMessage;
      const list = state.messagesByChat[message.chatId] ?? [];
      const newTime = new Date(message.sentAt).getTime();
      const alreadyExists = list.some((m) => {
        const sameAuthor = m.sender === message.sender;
        const sameContent = m.content === message.content;
        const timeDiff = Math.abs(new Date(m.sentAt).getTime() - newTime);
        return sameAuthor && sameContent && timeDiff <= 2000;
      });
      if (!alreadyExists) {
        state.messagesByChat[message.chatId] = [...list, message];
      }
      if (state.items.length) {
        const updatedChatIndex = state.items.findIndex((c) => c.chatId === message.chatId);
        if (updatedChatIndex !== -1) {
          const updatedChat = { ...state.items[updatedChatIndex], lastMessage: message };
          const without = state.items.filter((c) => c.chatId !== message.chatId);
          state.items = [updatedChat, ...without];
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChats.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchChats.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
        if (!state.currentChatId && action.payload.length) {
          state.currentChatId = action.payload[0].chatId;
        }
      })
      .addCase(fetchChats.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'Не удалось получить чаты';
        state.items = [];
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.messagesByChat[action.payload.chatId] = action.payload.messages;
      })
      .addCase(fetchChatmate.fulfilled, (state, action) => {
        state.chatmates[action.payload.chatId] = action.payload.info;
      })
      .addCase(createChat.pending, (state) => {
        state.creating = true;
        state.error = null;
      })
      .addCase(createChat.fulfilled, (state, action) => {
        state.creating = false;
        state.lastCreated = action.payload;
        state.currentChatId = action.payload.chatId;
      })
      .addCase(createChat.rejected, (state, action) => {
        state.creating = false;
        state.error = action.payload as string;
      })
      .addMatcher(isAnyOf(fetchMessages.rejected, fetchChatmate.rejected), (state, action) => {
        state.error = (action.payload as string) ?? 'Ошибка загрузки данных чата';
      });
  },
});

export const { clearChatError, clearLastCreated, setCurrentChat, addMessage, setWsConnected } =
  chatsSlice.actions;
export default chatsSlice.reducer;
