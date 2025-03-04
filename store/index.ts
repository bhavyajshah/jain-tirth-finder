import { configureStore } from '@reduxjs/toolkit';
import tirthsReducer from './tirthsSlice';
import authReducer from './authSlice';

export const store = configureStore({
  reducer: {
    tirths: tirthsReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;