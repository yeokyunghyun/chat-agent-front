import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type AuthState } from '@/types/auth';

export const initialState: AuthState = {
  loading: false,
  username: '',
  error: undefined,
};

interface LoginPayload {
  username: string;
  password: string;
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, action: PayloadAction<LoginPayload>) {
      state.loading = true;
      state.error = undefined;
    },

    loginSuccess(state, action: PayloadAction<string>) {
      state.username = action.payload;
      state.loading = false;
    },

    loginError(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.loading = false;
    },

    logout(state) {
      state.username = '';
      state.error = undefined;
      state.loading = false;
    },
  },
});

export const { login, loginSuccess, loginError, logout } = authSlice.actions;
export default authSlice.reducer;
