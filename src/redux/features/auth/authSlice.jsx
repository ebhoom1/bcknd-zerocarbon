import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../../api/axios';


// Retrieve user and token from localStorage
const user = JSON.parse(localStorage.getItem('user')) || null;
const token = localStorage.getItem('token') || null;
const userType = user?.userType || null; // Extract userType from user object

// Async thunk for login
export const loginUser = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const response = await axios.post('/api/auth/login', credentials);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'An unexpected error occurred');
  }
});

// Async thunk for registration
export const registerUser = createAsyncThunk('auth/register', async (userData, { rejectWithValue }) => {
  try {
    const response = await axios.post('/api/auth/register', userData);
    return response.data;
  } catch (error) {
    console.log(error.response?.data?.message);
    return rejectWithValue(error.response?.data?.message || 'Registration failed');
  }
});

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user,
    token,
    userType,
    loading: false,
    error: null,
    successMessage: null, // For registration success messages
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.error = null;
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    },
  },
  extraReducers: (builder) => {
    builder
      // Login reducers
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.userType = action.payload.user.userType; 
        localStorage.setItem('user', JSON.stringify(action.payload.user));
        localStorage.setItem('token', action.payload.token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Register reducers
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message; // Show success message
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },

});

export const { logout } = authSlice.actions;

export default authSlice.reducer;




