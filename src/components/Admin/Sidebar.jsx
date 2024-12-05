// import React from "react";
// import { useDispatch } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import DashboardIcon from "@mui/icons-material/Dashboard";
// import PersonIcon from "@mui/icons-material/Person";
// import SettingsIcon from "@mui/icons-material/Settings";
// import ExitToAppIcon from "@mui/icons-material/ExitToApp";
// import { setSelectedItem } from "../../redux/features/sidebar/SidebarSlice";
// import { logout } from "../../redux/features/auth/authSlice";
// import {
//   ListItemIcon,
//   Box,
//   List,
//   ListItem,
//   ListItemButton,
//   ListItemText,
//   Divider,
//   Typography,
// } from "@mui/material";
// import logo from '../../assets/images/logo1.svg';

// const Sidebar = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const sidebarItems = [
//     { id: "dashboard", label: "Dashboard",icon: <DashboardIcon /> },
//     { id: "leads", label: "Leads" , icon: <PersonIcon /> },
//     { id: "settings", label: "Settings", icon: <SettingsIcon />  },
//   ];

//   const handleLogout = () => {
//     // Dispatch logout action to clear Redux store and localStorage
//     dispatch(logout());

//     // Navigate to login page after logout
//     navigate("/login");
//   };

//   return (
//     <Box
//       elevation={3}
//       sx={{
//         width: 250,
//         background: "#fff",
//         boxShadow: "2px 0 5px rgba(0, 0, 0, 0.1)",
//         borderRadius: 3,
//         m: 2,
//         pt: 3, // Padding at the top
//         color: "#272727",
//       }}
//     >
//       {/* Logo Section */}
//       <Box
//         sx={{
//           display: "flex",
//           alignItems: "center",
//         //   justifyContent: "center",
//           mb: 2, // Margin bottom
//           ml:2
//         }}
//       >
//         <img
//           src={`${logo}`} // Replace with your logo path
//           alt="Zero Carbon Logo"
//           style={{ width: 50, height: 50, borderRadius: "50%" }}
//         />
//         <Typography
//           variant="h6"
//           fontWeight="bold"
//           sx={{ ml: 1 }} // Margin left for spacing
//         >
//           Zero Carbon
//         </Typography>
//       </Box>

//       {/* Sidebar Items */}
//       <List>
//         {sidebarItems.map((item) => (
//           <ListItem key={item.id} disablePadding sx={{color:"#272727"}}>
//             <ListItemButton
//               onClick={() =>
//                 dispatch(setSelectedItem({ id: item.id, label: item.label }))
//               }
//               sx={{
//                 borderRadius: 2,
//                 "&:hover": {
//                   backgroundColor: "#4CAF50",
//                   color: "#fff",
//                 },
//                 transition: "background-color 0.3s ease",
//               }}
//             >
//                <ListItemIcon
//                 sx={{
//                   color: "inherit", // Match color with text
//                   minWidth: "40px",
//                 }}
//               >
//                 {item.icon}
//               </ListItemIcon>
//               <ListItemText
//                 primary={item.label}
//                 primaryTypographyProps={{
//                   style: {
//                     color: "white",
//                     fontWeight: "bold", // Make text bold
//                   },
//                 }}
//               />
//             </ListItemButton>
//           </ListItem>
//         ))}

//         {/* Logout Item */}
//         <ListItem disablePadding>
//           <ListItemButton
//             onClick={handleLogout}
//             sx={{
//               borderRadius: 2,
//               "&:hover": {
//                 backgroundColor: "#4CAF50",
//                 color: "#fff",
//               },
//               transition: "background-color 0.3s ease",
//             }}
//           >
//             <ListItemIcon
//               sx={{
//                 color: "inherit", // Match color with text
//                 minWidth: "40px",
//               }}
//             >
//               <ExitToAppIcon />
//             </ListItemIcon>
//             <ListItemText
//               primary="Logout"
//               primaryTypographyProps={{
//                 style: {
//                   color: "white",
//                   fontWeight: "bold", // Make text bold
//                 },
//               }}
//             />
//           </ListItemButton>
//         </ListItem>
//       </List>
//     </Box>
//   );
// };

// export default Sidebar;

import React from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonIcon from "@mui/icons-material/Person";
import SettingsIcon from "@mui/icons-material/Settings";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
import MultilineChartIcon from '@mui/icons-material/MultilineChart';
import ReportIcon from '@mui/icons-material/Report';
import FeedbackIcon from '@mui/icons-material/Feedback';
import BarChartIcon from '@mui/icons-material/BarChart';
import SupportIcon from '@mui/icons-material/Support';
import { setSelectedItem } from "../../redux/features/sidebar/SidebarSlice";
import { logout } from "../../redux/features/auth/authSlice";
import {
  ListItemIcon,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  Typography,
  Button,
} from "@mui/material";
import logo from "../../assets/images/logo1.svg";

const Sidebar = () => {
  const userType = useSelector((state) => state.auth.userType);
console.log("userType:",userType);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // const sidebarItems = [
  //   { id: "dashboard", label: "Dashboard", icon: <DashboardIcon /> },
  //   { id: "leads", label: "Leads", icon: <PersonIcon /> },
  //   { label: "Hierarchy Chart", icon: <PersonIcon />,path: "/flowchart"  },
  //   { id: "settings", label: "Settings", icon: <SettingsIcon /> },
  // ];

  const sidebarItems =
  userType === "admin" || userType === "superAdmin"
      ? [
          { id: "dashboard", label: "Dashboard", icon: <DashboardIcon /> },
          { id: "leads", label: "Leads", icon: <PersonIcon /> },
          { id: "hierarchychart", label: "Hierarchy Chart", icon: <MultilineChartIcon />,path: "/flowchart" },
          { id: "settings", label: "Settings", icon: <SettingsIcon /> },
          { id: "feedback", label: "Feedback", icon: <FeedbackIcon /> },
          { id: "report", label: "Report", icon: <ReportIcon /> },
        ]
      : [
          { id: "dashboard", label: "Dashboard", icon: <DashboardIcon /> },
          { id: "hierarchychartuser", label: "Hierarchy Chart", icon: <PersonIcon /> },
          { id: "form", label: "Form", icon: <FormatAlignCenterIcon/> },
          { id: "reportsandinsights", label: "Reports & Insights", icon: <BarChartIcon/> },
          { id: "support", label: "Support", icon: <SupportIcon/> },
          { id: "settings", label: "Settings", icon: <SettingsIcon /> },
        ];

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <Box
      elevation={3}
      sx={{
        width: 280,
        background: "#fff",
        boxShadow: "2px 0 5px rgba(0, 0, 0, 0.1)",
        borderRadius: 5,
        m: 3,
        pt: 3,
        color: "#272727",
      }}
    >
      {/* Logo Section */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          mb: 2,
          ml: 2,
        }}
      >
        <img
          src={`${logo}`}
          alt="Zero Carbon Logo"
          style={{ width: 50, height: 50, borderRadius: "50%" }}
        />
        <Typography variant="h6" fontWeight="bold" sx={{ ml: 1 }}>
          Zero Carbon
        </Typography>
      </Box>

      {/*Sidebar Items*/}
      <List>
        {sidebarItems.map((item) => (
          <ListItem key={item.id} disablePadding>
            <Button
               onClick={() => {
                dispatch(setSelectedItem({ id: item.id, label: item.label }));
                navigate(item.path); // Navigate to the item's path
              }}
              sx={{
                marginLeft:2,
                width: "80%", // Adjust the width to your desired size
                borderRadius: 4,
                backgroundColor: "transparent",
                textTransform: "none",
                color: "#000",
                fontWeight: "bold",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start", 
                padding: "15px 25px",
                "&:hover": {
                  backgroundColor: "#4CAF50",
                  color: "#fff",
                },
                transition: "background-color 0.3s ease",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <ListItemIcon
                  sx={{
                    color: "inherit", // Match text color
                    minWidth: "30px",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <Typography variant="body1">{item.label}</Typography>
              </Box>
            </Button>
          </ListItem>
        ))}

        {/* Logout Item */}
       {/* Logout Item */}
<ListItem disablePadding>
  <Button
    onClick={handleLogout}
    sx={{
      marginLeft: 2,
      width: "80%", // Adjust the width to your desired size
      borderRadius: 4,
      backgroundColor: "transparent",
      textTransform: "none",
      color: "#000",
      fontWeight: "bold",
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-start",
      padding: "15px 25px",
      "&:hover": {
        backgroundColor: "#4CAF50",
        color: "#fff",
      },
      transition: "background-color 0.3s ease",
    }}
  >
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
      }}
    >
      <ListItemIcon
        sx={{
          color: "inherit", // Match text color
          minWidth: "30px",
        }}
      >
        <ExitToAppIcon />
      </ListItemIcon>
      <Typography variant="body1">Logout</Typography>
    </Box>
  </Button>
</ListItem>

      </List>
    </Box>
  );
};

export default Sidebar;
