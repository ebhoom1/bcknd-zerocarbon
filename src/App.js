

import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import UserForm from './pages/User/UserForm';
import AdminDashboard from './pages/Admin/AdminDashboard';
import ProtectedRoute from './components/Protectedroute/ProtectedRoute';
import Formdetails from './components/Admin/Formdetails';
import PlatformConfig from './pages/User/PlatformConfig';
import UserDashboard from './pages/User/UserDashboard';

const App = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Default Route: Redirect based on user type */}
        <Route
          path="/"
          element={
            token ? (
              user?.userType === 'admin' || user?.userType === 'superAdmin' ? (
                <Navigate to="/admin"  />
              ) : (
                <Navigate to="/user"  />
              )
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute allowedRoles={['user']} />}>
        <Route path="/user" element={<UserDashboard />} /> 

          {/* <Route path="/user/form" element={<UserForm />} /> */}
          {/* <Route path="/user/platformconfig" element={<PlatformConfig />} /> */}

        </Route>
        <Route element={<ProtectedRoute allowedRoles={['admin','superAdmin']} />}>
          <Route path="/admin" element={<AdminDashboard />} />
         <Route path="/flowchart" element={<PlatformConfig />} />
         < Route  path='/formdetails/:formId' element={<Formdetails/>}/> 

        </Route>

        {/* Catch-All Route */}
        <Route path="*" element={<div>"Page Not Found..."</div>} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;


