import type { RootState } from '@/redux-rtk';

export const selectChatsState = (state: RootState) => state.chats;
export const selectChatError = (state: RootState) => state.chats.error;
