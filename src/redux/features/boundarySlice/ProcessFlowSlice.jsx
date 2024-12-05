// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import axios from '../../../api/axios'; 

// // Fetch process flows from the backend
// export const fetchProcessFlows = createAsyncThunk(
//   'processFlow/fetch',
//   async () => {
//     const response = await axios.get('/api/user/processflow');
//     return response.data;
//   }
// );

// // Save a new process flow to the backend
// export const saveProcessFlow = createAsyncThunk(
//   'processFlow/save',
//   async (processFlowData) => {
//     const response = await axios.post('/api/user/processflow', processFlowData);
//     return response.data;
//   }
// );

// const processFlowSlice = createSlice({
//   name: 'processFlow',
//   initialState: {
//     processFlows: [],
//     status: 'idle',
//     error: null,
//   },
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchProcessFlows.pending, (state) => {
//         state.status = 'loading';
//       })
//       .addCase(fetchProcessFlows.fulfilled, (state, action) => {
//         state.status = 'succeeded';
//         state.processFlows = action.payload;
//       })
//       .addCase(fetchProcessFlows.rejected, (state, action) => {
//         state.status = 'failed';
//         state.error = action.error.message;
//       })
//       .addCase(saveProcessFlow.fulfilled, (state, action) => {
//         // state.processFlows.push(action.payload);
//         state.processFlows = [...state.processFlows, action.payload];
//       });
//   },
// });

// export default processFlowSlice.reducer;


import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../../api/axios'; 

// Fetch process flows from the backend
export const fetchProcessFlows = createAsyncThunk(
  'processFlow/fetch',
  async () => {
    const response = await axios.get('/api/user/processflow');
    return response.data; // Make sure this is an array
  }
);

// Save a new process flow to the backend
export const saveProcessFlow = createAsyncThunk(
  'processFlow/save',
  async (processFlowData) => {
    const response = await axios.post('/api/user/processflow', processFlowData);
    return response.data; // Make sure this is an array
  }
);

const processFlowSlice = createSlice({
  name: 'processFlow',
  initialState: {
    processFlows: [],  // Ensure this is an empty array by default
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProcessFlows.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProcessFlows.fulfilled, (state, action) => {
        state.status = 'succeeded';
        
        // Ensure that the payload is always an array
        if (Array.isArray(action.payload)) {
          state.processFlows = action.payload;
        } else {
          state.processFlows = [];  // If the payload is not an array, default to empty array
        }
      })
      .addCase(fetchProcessFlows.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(saveProcessFlow.fulfilled, (state, action) => {
        // Ensure that processFlows is an array before pushing
        if (Array.isArray(state.processFlows)) {
          state.processFlows = [...state.processFlows, action.payload];
        } else {
          state.processFlows = [action.payload]; // If it's not an array, reset it to an array
        }
      });
  },
});

export default processFlowSlice.reducer;
