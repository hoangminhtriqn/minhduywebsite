import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, LoginCredentials } from '../../api/types';
import { authService } from '../../api/services/auth';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.error = null;
    },
  },
});

export const { setUser, setLoading, setError, logout } = authSlice.actions;

// Thunk actions
export const login = (credentials: LoginCredentials) => async (dispatch: any) => {
  dispatch(setLoading(true));
  try {
    const user = await authService.login(credentials);
    dispatch(setUser(user));
    return user;
  } catch (error: any) {
    dispatch(setError(error.message));
    throw error;
  } finally {
    dispatch(setLoading(false));
  }
};

export default authSlice.reducer; 