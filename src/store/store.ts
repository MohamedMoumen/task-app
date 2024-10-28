// src/store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import tasksReducer from './tasksSlice';
import usersReducer from './userSlice'
import { useReducer } from 'react';

const store = configureStore({
  reducer: {
    tasks: tasksReducer,
    users: usersReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
