// src/redux/features/boundarySlice/BoundarySlice.jsx
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../../api/axios'; // Adjust the path to match your project structure

// Fetch boundaries from the backend
export const fetchBoundaries = createAsyncThunk('boundaries/fetch', async () => {
  const response = await axios.get('/api/user/getBoundariesScope'); // Adjust endpoint as needed
  const { boundaries, scopes } = response.data; // Destructure response

  // Merge scopes into the corresponding boundaries
  const mergedBoundaries = boundaries.map((boundary) => ({
    ...boundary,
    scopes: scopes.filter((scope) => scope.boundaryId === boundary._id),
  }));

  return mergedBoundaries;
});

// Add a new boundary to the backend
export const addBoundary = createAsyncThunk('boundaries/add', async ( boundary, scopes ) => {
 
  const boundaryResponse = await axios.post('/api/user/createBoundaryScope', boundary,scopes);

  return boundaryResponse.data;
});


const boundarySlice = createSlice({
  name: 'boundaries',
  initialState: {
    data: [], // List of boundaries with scopes
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBoundaries.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchBoundaries.fulfilled, (state, action) => {
        state.data = action.payload; // Boundaries with merged scopes
        state.status = 'succeeded';
      })
      .addCase(fetchBoundaries.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      // .addCase(addBoundary.fulfilled, (state, action) => {
      //   state.data.push(action.payload);
      // })
      .addCase(addBoundary.fulfilled, (state, action) => {
        const { boundary, scopes } = action.payload; // Adjust based on API response structure
        const newBoundary = {
          ...boundary,
          scope: [scopes],
        };
        state.data.push(newBoundary); // Optimistically update local boundaries
      });
      
  },
});

export default boundarySlice.reducer;




