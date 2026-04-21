import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../lib/axios';

export interface Notification {
  id: string;
  type: 'new_bid' | 'bid_success' | 'bid_ended' | 'system';
  message: string;
  timestamp: string;
  read: boolean;
  carId?: string;
}

interface NotificationState {
  notifications: Notification[];
}

const initialState: NotificationState = {
  notifications: [],
};

export const fetchNotifications = createAsyncThunk(
  'notifications/fetchAll',
  async () => {
    const response = await axiosInstance.get('/notifications');
    return response.data; // Should return array of notifications
  }
);

export const markAllAsReadServer = createAsyncThunk(
  'notifications/markAllRead',
  async () => {
    await axiosInstance.patch('/notifications/read-all');
    return true;
  }
);

export const clearAllServer = createAsyncThunk(
  'notifications/clearAll',
  async () => {
    await axiosInstance.delete('/notifications/clear');
    return true;
  }
);

export const markAsReadServer = createAsyncThunk(
  'notifications/markOneRead',
  async (id: string) => {
    await axiosInstance.patch(`/notifications/${id}/read`);
    return id;
  }
);

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<Omit<Notification, 'id' | 'read' | 'timestamp'>>) => {
      const newNotification: Notification = {
        ...action.payload,
        id: Date.now().toString(),
        read: false,
        timestamp: new Date().toISOString(),
      };
      state.notifications = [newNotification, ...state.notifications].slice(0, 50); // Keep last 50
    },
    markAllAsRead: (state) => {
      state.notifications.forEach(n => n.read = true);
    },
    markAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find(n => n.id === action.payload);
      if (notification) notification.read = true;
    },
    clearAll: (state) => {
      state.notifications = [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchNotifications.fulfilled, (state, action) => {
      // Map backend fields to frontend interface if necessary
      state.notifications = action.payload.map((n: any) => ({
        id: n._id,
        type: n.type,
        message: n.message,
        timestamp: n.createdAt,
        read: n.isRead,
        carId: n.carId
      }));
    });
    builder.addCase(markAllAsReadServer.fulfilled, (state) => {
      state.notifications.forEach(n => n.read = true);
    });
    builder.addCase(clearAllServer.fulfilled, (state) => {
      state.notifications = [];
    });
    builder.addCase(markAsReadServer.fulfilled, (state, action) => {
      const notification = state.notifications.find(n => n.id === action.payload);
      if (notification) notification.read = true;
    });
  },
});

export const { addNotification, markAllAsRead, markAsRead, clearAll } = notificationSlice.actions;
export default notificationSlice.reducer;
