import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from '../../../api/axios';

// Async thunk to fetch dashboard metrics
export const fetchDashboardMetrics = createAsyncThunk(
  "dashboard/fetchMetrics",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get("/api/admin/dashboard-metrics");
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to fetch metrics");
    }
  }
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: {
    metrics: {
      totalSubmissions: 0,
      pendingActions: 0,
      submissionBreakdown: [],
      recentActivity: [],
    },
    loading: false,
    error: null,
  },
  reducers: {}, // Add reducers if you have other synchronous actions
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardMetrics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardMetrics.fulfilled, (state, action) => {
        state.loading = false;
        state.metrics = action.payload;
      })
      .addCase(fetchDashboardMetrics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default dashboardSlice.reducer;
