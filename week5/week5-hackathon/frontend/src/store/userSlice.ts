import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  user: any | null;
  token: string | null;
  isAuthenticated: boolean;
}

const initialState: UserState = {
  user: null,
  token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
  isAuthenticated: typeof window !== 'undefined' ? !!localStorage.getItem('token') : false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loginSuccess(state, action: PayloadAction<{ user: any; token: string }>) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', action.payload.token);
      }
    },
    logout(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
      }
    },
    updateUser(state, action: PayloadAction<any>) {
      state.user = { ...state.user, ...action.payload };
    }
  },
});

export const { loginSuccess, logout, updateUser } = userSlice.actions;
export default userSlice.reducer;
