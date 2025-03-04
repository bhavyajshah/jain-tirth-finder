import { configureStore } from '@reduxjs/toolkit';
import tirthsReducer from './tirthsSlice';

export const store = configureStore({
  reducer: {
    tirths: tirthsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;