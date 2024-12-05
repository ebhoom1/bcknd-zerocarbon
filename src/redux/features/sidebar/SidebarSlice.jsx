// import { createSlice } from "@reduxjs/toolkit";

// const sidebarSlice = createSlice({
//   name: "sidebar",
//   initialState: {
//     selectedItem: "dashboard",
//   },
//   reducers: {
//     setSelectedItem: (state, action) => {
//       state.selectedItem = action.payload;
//     },
//   },
// });

// export const { setSelectedItem } = sidebarSlice.actions;

// export default sidebarSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";

const sidebarSlice = createSlice({
  name: "sidebar",
  initialState: {
    selectedItem: {
      id: "dashboard",
      label: "Dashboard",
    },
  },
  reducers: {
    setSelectedItem: (state, action) => {
      state.selectedItem = action.payload; // payload should be an object like { id, label }
    },
  },
});

export const { setSelectedItem } = sidebarSlice.actions;

export default sidebarSlice.reducer;

