import React, { useState } from "react";
import axios from '../api/axios';
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../redux/features/auth/authSlice";
import {
  Alert,
  Box,
  TextField,
  Button,
  Typography,
  Checkbox,
  FormControlLabel,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import image from '../../src/assets/images/bg.svg'; 

const Login = () => {
  const [alertType, setAlertType] = useState("success");
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Dispatch login action  
    dispatch(loginUser({ email, password })).then((response) => {
      console.log("Response:", response);
      if (response.type === "auth/login/fulfilled") {
        console.log("User Type:", response.payload.user.userType);
        const userType = response.payload.user.userType; // Assuming usertype is returned from backend
        if (userType === "user") {
          navigate("/user"); // Redirect to user form
        } else if (userType === "admin" || userType==="superAdmin") {  
          navigate("/admin"); // Redirect to admin dashboard
        }
      }
    });
  };

  const handleClickOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleForgotPassword = async () => {
    try {
      const response = await axios.post(
       "/api/auth/forgotpassword",
        { email: forgotPasswordEmail }
      );
      if (response.data.success) {
        console.log(response.data);
        setAlertMessage(response.data.message);
        setAlertType("success");
        setAlert(true);
        setTimeout(() => {
          setAlert(false);
        }, 8000);
        setOpenDialog(false);
      }
    } catch (err) {
      console.log(err, "Failed to send email");
      setAlertMessage("Failed to send reset password email");
      setAlertType("error");
      setAlert(true);
      setTimeout(() => {
        setAlert(false);
      }, 8000);
    }
  };


  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        backgroundImage: `url(${image})`,
        backgroundSize: "cover", 
        backgroundRepeat: "no-repeat", 
        backgroundPosition: "center",
      }}
    >
      <Box
        sx={{
          width: 400,
          p: 4,
          background: "var(--form-bg)",
          borderRadius: 2,
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
          backdropFilter: "blur(8px)",
          border: "1px solid var(--form-border)",
          textAlign: "center",
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{ color: "var(--primary-text)" }}
        >
          Login
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Enter your email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            margin="normal"
            sx={{
              input: {
                color: "var(--primary-text)",
              },
              label: {
                color: "var(--primary-text)",
              },
            }}
          />
          <TextField
            label="Enter your password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            margin="normal"
            sx={{
              input: {
                color: "var(--primary-text)",
              },
              label: {
                color: "var(--primary-text)",
              },
            }}
          />
          <FormControlLabel
            control={<Checkbox sx={{ color: "var(--primary-text)" }} />}
            label="Remember me"
            sx={{ alignSelf: "start", mt: 1, color: "var(--primary-text)" }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading}
            sx={{
              mt: 2,
              backgroundColor: "var(--primary-btn-bg)",
              color: "var(--primary-btn-text)",
              "&:hover": {
                backgroundColor: "var(--primary-btn-hover-bg)",
              },
            }}
          >
            {loading ? <CircularProgress size={24} /> : "Log In"}
          </Button>
          {error && (
            <Typography
              color="error"
              sx={{ mt: 2, color: "var(--error-color)" }}
            >
              {error}
            </Typography>
          )}
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" sx={{ color: "var(--primary-text)" }}>
              Don't have an account?{" "}
              <a href="/register" style={{ color: "var(--primary-text)" }}>
                Register
              </a>
            </Typography>
            <Button
              sx={{ color: "var(--primary-text)" }}
              className="forgot-btn"
              variant="text"
              onClick={handleClickOpenDialog}
              fullWidth
            >
              Forgot Password?
            </Button>
            <Dialog open={openDialog} onClose={handleCloseDialog}>
              <DialogTitle>Forgot Password</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Please enter your registered email address. We will send you
                  new Password.
                </DialogContentText>
                <TextField
                  autoFocus
                  margin="dense"
                  id="forgot-password-email"
                  label="Email Address"
                  type="email"
                  fullWidth
                  variant="outlined"
                  value={forgotPasswordEmail}
                  onChange={(e) => setForgotPasswordEmail(e.target.value)}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseDialog}>Cancel</Button>
                <Button onClick={handleForgotPassword}>Submit</Button>
              </DialogActions>
            </Dialog>
            {alert && (
        <div className="addsecalert">
          <Alert severity={alertType}>{alertMessage}</Alert>
        </div>
      )}
          </Box>
        </form>
      </Box>
    </Box>
  );
};

export default Login;
