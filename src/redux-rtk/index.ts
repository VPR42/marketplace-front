import { combineReducers, configureStore } from '@reduxjs/toolkit';

import authReducer from './store/auth/authSlice';
import servicesReducer from './store/services/servicesSlice';
import utilsReducer from './store/utils/utilsSlice';

export const rootReducer = combineReducers({
  auth: authReducer,
  services: servicesReducer,
  utils: utilsReducer,
});

export const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
