import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import userReducer from './features/user/UserSlice'; 
import sidebarReducer from "./features/sidebar/SidebarSlice";
import dashboardReducer from './features/dashboard/DashboardSlice';
import boundaryReducer from './features/boundarySlice/BoundarySlice';
import processFlowReducer from './features/boundarySlice/ProcessFlowSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer, 
    sidebar: sidebarReducer,
    dashboard: dashboardReducer,
    boundaries:boundaryReducer,
    processFlow: processFlowReducer, 
  },
});













