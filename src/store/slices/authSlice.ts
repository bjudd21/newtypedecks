// Authentication slice for Redux store
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User } from '@prisma/client';

// Types
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Initial state
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// Async thunks
export const loginUser = createAsyncThunk<
  User,
  { email: string; password: string }
>(
  'auth/loginUser',
  async (_credentials: { email: string; password: string }) => {
    // This will be implemented when we add authentication
    throw new Error('Authentication not yet implemented');
  }
);

export const logoutUser = createAsyncThunk<null, void>(
  'auth/logoutUser',
  async () => {
    // This will be implemented when we add authentication
    return null;
  }
);

export const fetchUserProfile = createAsyncThunk<User, string>(
  'auth/fetchUserProfile',
  async (_userId: string) => {
    // This will be implemented when we add authentication
    throw new Error('User profile fetching not yet implemented');
  }
);

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
  },
  // extraReducers will be added when async thunks are implemented
});

export const { clearError, setUser } = authSlice.actions;
export default authSlice.reducer;
