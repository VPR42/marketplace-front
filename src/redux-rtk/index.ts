import { combineReducers, configureStore } from '@reduxjs/toolkit';

import authReducer from './store/auth/authSlice';
import chatsReducer from './store/chats/chatsSlice';
import favoritesReducer from './store/favorites/favoritesSlice';
import servicesReducer from './store/services/servicesSlice';
import utilsReducer from './store/utils/utilsSlice';

export const rootReducer = combineReducers({
  auth: authReducer,
  services: servicesReducer,
  utils: utilsReducer,
  favorites: favoritesReducer,
  chats: chatsReducer,
});

export const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
