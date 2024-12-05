

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import industryOptions from "../../assets/data/industryOptions.json"; // Adjust this path based on your project structure
import {
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  ListSubheader,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";

const Dashboard = () => {
  const navigate = useNavigate();
  const [allForms, setAllForms] = useState([]); // Stores all forms
  const [forms, setForms] = useState([]); // Stores forms to display (filtered or all)
  const [filters, setFilters] = useState({
    companyName: "",
    industrySector: "Industry Sector",
    submissionDate: "",
  });

  // Fetch all forms on component mount
  useEffect(() => {
    const fetchForms = async () => {
      try {
        const response = await axios.get("/api/admin/forms");
        setAllForms(response.data); // Store all forms
        setForms(response.data); // Initialize display with all forms
      } catch (error) {
        console.error("Error fetching forms:", error);
      }
    };
    fetchForms();
  }, []);

  // Handle filter input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  // Apply filters when the "Filter" button is clicked
  const fetchFilteredForms = async () => {
    try {
      const params = new URLSearchParams(filters).toString();
      const response = await axios.get(`/api/admin/forms/filter?${params}`);
      setForms(response.data); // Update table with filtered results
      console.log("Filtered Forms:", response.data);
    } catch (error) {
      console.error("Error fetching filtered forms:", error);
    }
  };

  // Handle table row click
  const handleRowClick = (formId) => {
    navigate(`/formdetails/${formId}`);
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Registered Users
      </Typography>

      {/* Filters Section */}
      <div style={{ marginBottom: "16px" }}>
        <TextField
          label="Company Name"
          name="companyName"
          value={filters.companyName}
          onChange={handleInputChange}
          style={{ marginRight: "8px" }}
        />
        
        {/* Industry Sector Dropdown */}
        <FormControl style={{ marginRight: "8px", minWidth: "200px" }}>
         
          <Select
           name="industrySector"
           value={filters.industrySector}
           onChange={handleInputChange}
           displayEmpty      
          >
            <MenuItem value="">
      <em>None</em>
    </MenuItem>
          <MenuItem value="Industry Sector" disabled>
          Industry Sector
        </MenuItem>
            {industryOptions.map((category, index) => [
              <ListSubheader key={`${index}-header`}>{category.category}</ListSubheader>,
              ...category.options.map((option, i) => (
                <MenuItem key={`${index}-${i}`} value={option}>
                  {option}
                </MenuItem>
              )),
            ])}
          </Select>
        </FormControl>
        

        <TextField
          label="Submission Date"
          name="submissionDate"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={filters.submissionDate}
          onChange={handleInputChange}
          style={{ marginRight: "8px" }}
        />
        
        <Button variant="contained" onClick={fetchFilteredForms}>
          Filter
        </Button>
      </div>

      {/* Table Section */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {forms.length > 0 ? (
              forms.map((form) => (
                <TableRow
                  key={form._id}
                  onClick={() => handleRowClick(form._id)}
                  style={{
                    cursor: "pointer",
                    backgroundColor: form.isRead ? "white" : "#FFF9C4",
                  }}
                >
                  <TableCell>{form.primaryContact.name}</TableCell>
                  <TableCell>{form.primaryContact.email}</TableCell>
                  <TableCell>{form.primaryContact.phone}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  No Form Data Available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Dashboard;


