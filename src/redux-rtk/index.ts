import { combineReducers, configureStore } from '@reduxjs/toolkit';

// сюда импортируешь редьюсеры
// import todosReducer from './todos/slice';

export const rootReducer = combineReducers({
  // activePageReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  // middleware: (getDefault) => getDefault().concat(api.middleware), // если потом подключишь RTK Query
});

// типы для хуков
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
