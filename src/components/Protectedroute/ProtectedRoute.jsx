// import React from 'react';
// import { Navigate, Outlet } from 'react-router-dom';

// const ProtectedRoute = ({ allowedRoles }) => {
//     const token = localStorage.getItem('token');
//     const user = JSON.parse(localStorage.getItem('user')); // Parse the stored user object
  
//     if (!token || !user) {
//       return <Navigate to="/login" replace />;
//     }
  
//     if (!allowedRoles.includes(user.userType)) {
//       return <Navigate to="/" replace />; // Redirect unauthorized roles to home or another page
//     }
  
//     return <Outlet />;
//   };
  
//   export default ProtectedRoute;


import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.userType)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
