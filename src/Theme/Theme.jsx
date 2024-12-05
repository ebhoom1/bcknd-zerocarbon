// // theme.js
// import { createTheme } from '@mui/material/styles';

// const theme = createTheme({
//   palette: {
//     primary: {
//       main: '#4CAF50', // Light green
//       contrastText: '#FFFFFF', // White text for buttons, etc.
//     },
//     secondary: {
//       main: '#FFFFFF', // White for secondary components
//       contrastText: '#4CAF50', // Green text for secondary buttons, etc.
//     },
//     background: {
//       default: '#F0FFF0', // A very light green background
//       paper: '#FFFFFF', // White for card-like components
//     },
//     text: {
//       primary: '#4CAF50', // Green text for primary content
//       secondary: '#8BC34A', // A lighter green for secondary content
//     },
//   },
//   typography: {
//     fontFamily: `'Roboto', 'Arial', sans-serif`, // Optional font choice
//   },
// });

// export default theme;



import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#4CAF50', // Light green
      contrastText: '#FFFFFF', // White text for buttons, etc.
    },
    secondary: {
      main: '#FFFFFF', // White for secondary components
      contrastText: '#4CAF50', // Green text for secondary buttons, etc.
    },
    background: {
      default: '#F9FFFA', // Very light green for general backgrounds
      paper: '#FFFFFF', // White for card-like components
    },
    text: {
      primary: '#333333', // Black for primary content (better readability)
      secondary: '#4CAF50', // Green for secondary content
      disabled: '#A9A9A9', // Gray for disabled elements or less important text
      hint: '#8BC34A', // Subtle green for hints or helper text
    },
  },
  typography: {
    fontFamily: `'Roboto', 'Arial', sans-serif`,
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      color: '#333333', // Black for primary headings
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      color: '#4CAF50', // Green for secondary headings
    },
    body1: {
      fontSize: '1rem',
      fontWeight: 400,
      color: '#333333', // Black for primary body text
    },
    body2: {
      fontSize: '0.875rem',
      fontWeight: 400,
      color: '#8BC34A', // Light green for less prominent body text
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px', // Rounded buttons
          textTransform: 'none', // Prevent all-uppercase text
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF', // White card background
          boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.1)', // Subtle shadow
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          color: '#333333', // Black for table content
          borderColor: '#E0E0E0', // Light gray borders for table cells
        },
        head: {
          backgroundColor: '#F0FFF0', // Light green for table headers
          color: '#4CAF50', // Green for header text
          fontWeight: 'bold',
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        body1: {
          color: '#333333', // Black for better readability
        },
        body2: {
          color: '#8BC34A', // Light green for secondary content
        },
      },
    },
  },
});

export default theme;

