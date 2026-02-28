import { configureStore } from '@reduxjs/toolkit';
import signatureReducer from './features/signatureSlice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      signatures: signatureReducer,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];