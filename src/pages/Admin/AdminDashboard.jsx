import React from "react";
import Sidebar from "../../components/Admin/Sidebar";
import ContentArea from "../../components/Admin/ContentArea";
import { Box } from "@mui/material";
const AdminDashboard = () => {
  return (
    <Box sx={{ height: "100vh", display: "flex",backgroundColor:"#F5F5F5" }}>
      <Sidebar />
      <ContentArea />
    </Box>
  );
};

export default AdminDashboard;
