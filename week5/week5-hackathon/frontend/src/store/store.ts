import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import carReducer from './carSlice';
import bidReducer from './bidSlice';
import notificationReducer from './notificationSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    cars: carReducer,
    bids: bidReducer,
    notifications: notificationReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
