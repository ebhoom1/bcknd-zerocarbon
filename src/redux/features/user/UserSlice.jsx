import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../../api/axios';


// Async thunk for creating or updating a user
// Async thunk for creating or updating a user
export const createUser = createAsyncThunk('user/create', async ({ formData, userId }, { rejectWithValue }) => { 
  try {
    const response = await axios.post('/api/user/forms', {formData, userId }); // Include userId in the payload
    console.log(response.data.message);
    return response.data;
  } catch (error) {
    console.log(error.response?.data?.message);
    return rejectWithValue(error.response?.data?.message || 'Failed to create user');
  }
});




// User slice
const userSlice = createSlice({
  name: 'user',
  initialState: {
    users: [],
    loading: false,
    error: null,
    successMessage: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users.push(action.payload);
        state.successMessage = action.payload.message;
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.successMessage = null;
      })
      
  },
});

export default userSlice.reducer;
