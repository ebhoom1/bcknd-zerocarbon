import React from "react";
import { useSelector } from "react-redux";
import Dashboard from "./Dashboard";
import LeadsTable from './LeadsTable';
import Userdashboard from '../User/Dashboard/DashboardUser'; 
import ProcessFlowChart from '../../components/User/flowchart/ProcessflowChart';
import FlowChart from '../../components/User/platformconfig/ProcessFlow';
import UserForm from '../../pages/User/UserForm';
import pic from '../../assets/images/pic.jpeg';
import { useNavigate} from "react-router-dom";
import { useEffect } from "react";
import {
  Box,
  Typography,
  Avatar,
  IconButton,
} from "@mui/material";
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';

const ContentArea = () => {
  const selectedItem = useSelector((state) => state.sidebar.selectedItem);
  const userType = useSelector((state) => state.auth.userType);
  console.log("userType:",userType);


  // const renderContent = () => {
  //   switch (selectedItem.id) {
  //     case "dashboard":
  //       return <Dashboard />;
  //     case "leads":
  //       return <LeadsTable />;
    
  //     default:
  //       return <Dashboard />;
  //   }
  // };

  const renderContent = () => {
    if (userType === "admin" || userType === "superAdmin") {
      switch (selectedItem.id) {
        case "dashboard":
          return <Dashboard />;
        case "leads":
          return <LeadsTable />;
        default:
          return <Dashboard />;
          
      }
    } else {
      switch (selectedItem.id) {
        case "dashboard":
          return <ProcessFlowChart/>;
        case "hierarchychartuser":
          return <ProcessFlowChart/>;
        case "form":
          return ;
        case "reportsandinsights":
          return ;
        case "support":
          return ;
        case "settings":
          return ;
        default:
          return <ProcessFlowChart/> ;
      }
    }
  };

  return (
    <div style={{ flex: 1, padding: 20, overflow: "auto" }}>
    
      <Box
        sx={{
          mb: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderRadius: 2,
        }}
      >
       
        <Typography variant="h5" fontWeight="bold">
          {selectedItem.label}
        </Typography>

       
        <Box display="flex" alignItems="center" gap={2}>
          <IconButton>
            <NotificationsNoneOutlinedIcon />
          </IconButton>
          <Avatar src={`${pic}`} />
          <Box>
            <Typography fontWeight="bold">Ferra Alexandra</Typography>
            <Typography variant="body2" color="text.secondary">
             {userType==="admin" || userType==="superAdmin"?"Admin":"User"}
            </Typography>
          </Box>
        </Box>
      </Box>

     
      {renderContent()}
    </div>
  );
};

export default ContentArea;
