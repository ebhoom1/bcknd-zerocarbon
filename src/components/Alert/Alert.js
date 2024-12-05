// // src/components/Alert.js
// import React, { useEffect, useState } from 'react';
// import { Snackbar, Alert as MuiAlert } from '@mui/material';

// // Reusable Alert component
// const Alert = ({ message, severity }) => {
//   const [open, setOpen] = useState(true);

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setOpen(false);
//     }, 10000); 
//     return () => clearTimeout(timer); // Cleanup timeout on unmount
//   }, []); // Empty dependency array ensures the effect runs only once after initial render

//   return (
//     <Snackbar
//       open={open}
//       autoHideDuration={10000}
//       anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
//     >
//       <MuiAlert severity={severity} sx={{ width: '100%' }}>
//         {message}
//       </MuiAlert>
//     </Snackbar>
//   );
// };

// export default Alert;


import React, { useEffect, useState } from 'react';
import { Snackbar, Alert as MuiAlert } from '@mui/material';

// Reusable Alert component
const Alert = ({ message, severity }) => {
  const [open, setOpen] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setOpen(false);
    }, 10000); 
    return () => clearTimeout(timer); // Cleanup timeout on unmount
  }, []); 

  const getAlertStyles = (severity) => {
    switch (severity) {
      case 'success':
        return { backgroundColor: '#388E3C', color: '#fff' }; 
      case 'error':
        return { backgroundColor: '#D32F2F', color: '#fff' }; 
      default:
        return {};
    }
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={10000}
      anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
    >
      <MuiAlert
        severity={severity}
        sx={{ width: '100%', ...getAlertStyles(severity) }}
      >
        {message}
      </MuiAlert>
    </Snackbar>
  );
};

export default Alert;
