import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../redux/features/auth/authSlice";
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
} from "@mui/material";
import image from '../../src/assets/images/bg.svg'; 
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    contactNumber: "",
    userName: "",
    userType: "",
    address: "",
    companyName: "",
  });

  const dispatch = useDispatch();
  const { loading, error, successMessage } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(registerUser(formData));
  };

  // Navigate to login page if registration is successful
  useEffect(() => {
    if (successMessage) {
      navigate("/login");
    }
  }, [successMessage, navigate]);

  return (
    <Box
      sx={{
        p: 4,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundImage: `url(${image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Box
        sx={{
          width: 600,
          p: 4,
          background: "var(--form-bg)", // Use variable for background
          borderRadius: 2,
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
          backdropFilter: "blur(8px)",
          border: "1px solid var(--form-border)", // Use variable for border
          textAlign: "center",
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{ color: "var(--primary-text)" }}
        >
          Register
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            sx={{
              input: {
                color: "var(--primary-text)", // Input text color
              },
              label: {
                color: "var(--primary-text)", // Label text color
              },
            }}
          />
          <TextField
            label="Contact Number"
            type="number"
            name="contactNumber"
            value={formData.contactNumber}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
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
            label="Username"
            type="text"
            name="userName"
            value={formData.userName}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
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
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
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
            label="User Type"
            name="userType"
            value={formData.userType}
            onChange={handleChange}
            fullWidth
            margin="normal"
            select
            SelectProps={{
              native: true,
            }}
            required
            sx={{
              "& .MuiInputBase-input": {
                color: "var(--primary-text)", // Input text color for select
              },
              "& .MuiInputLabel-root": {
                color: "var(--primary-text)", // Label text color
              },
              "& .MuiSelect-icon": {
                color: "var(--primary-text)", // Dropdown icon color
              },
            }}
          >
            <option value=""></option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </TextField>

          <TextField
            label="Address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            fullWidth
            margin="normal"
            multiline
            rows={4}
            sx={{
              "& .MuiInputBase-input": {
                color: "var(--primary-text)", // Input text color for multiline
              },
              "& .MuiInputLabel-root": {
                color: "var(--primary-text)", // Label text color
              },
            }}
          />

          <TextField
            label="Company Name"
            type="text"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            sx={{
              input: {
                color: "var(--primary-text)",
              },
              label: {
                color: "var(--primary-text)",
              },
            }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading}
            sx={{
              mt: 2,
              backgroundColor: "var(--primary-btn-bg)", // Button background color
              color: "var(--primary-btn-text)", // Button text color
              "&:hover": {
                backgroundColor: "var(--primary-btn-hover-bg)", // Button hover color
              },
            }}
          >
            {loading ? <CircularProgress size={24} /> : "Register"}
          </Button>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" sx={{ color: "var(--primary-text)" }}>
              Already have an account?{" "}
              <a href="/login" style={{ color: "var(--primary-text)" }}>
                Login
              </a>
            </Typography>
          </Box>
          {error && (
            <Typography color="error" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}
          {successMessage && (
            <Typography color="success" sx={{ mt: 2 }}>
              {successMessage}
            </Typography>
          )}
        </form>
      </Box>
    </Box>
  );
};

export default Register;
