
import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "../../api/axios";
import { Typography, Box, Grid, Divider, Button } from "@mui/material";
import html2pdf from 'html2pdf.js'
import './formmDetails.css';

const Formdetails = () => {
  const { formId } = useParams(); // Get the form ID from the route
  const [formDetails, setFormDetails] = useState(null);
  const formRef = useRef(); // Reference for the form content

  useEffect(() => {
    const fetchFormDetails = async () => {
      try {
        const response = await axios.get(`/api/admin/formDetails/${formId}`);
        setFormDetails(response.data.form); // Ensure `form` matches backend response
      } catch (error) {
        console.error("Error fetching form details:", error);
      }
    };
    fetchFormDetails();
  }, [formId]);

  const downloadPDF = () => {
    const formElement = formRef.current;
  
    // Configure the options for html2pdf
    const options = {
      margin: 10, // Add margin to each page
      filename: `Form_${formId}.pdf`, // File name for the PDF
      image: { type: 'png', quality: 1 }, // Set the image type and quality
      html2canvas: { scale: 2 }, // Render the form at a higher scale for better quality
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }, // Set the paper size and orientation
    };
  
    // Use html2pdf to generate the PDF from the form
    html2pdf().from(formElement).set(options).save();
  };
  

  if (!formDetails) {
    return <Typography>Loading...</Typography>;
  }


  return (
    <>
      <Box p={3} ref={formRef} sx={{
    width: '80%', 
    maxWidth: '800px',
    border: "1px solid #e0e0e0",
    borderRadius: "8px",
    backgroundColor: "#fafafa",
    margin: '0 auto', 
  }}>
        <Typography variant="h4" gutterBottom sx={{ textAlign: 'center' }}>
          Form Details
        </Typography>

        {/* Company Information */}
        <Box sx={{ marginBottom: 3 }}>
          <Typography variant="h5" gutterBottom>
            Company Information
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">Company Name:</Typography>
              <Typography>{formDetails.companyName}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">Company Address:</Typography>
              <Typography>{formDetails.companyAddress}</Typography>
            </Grid>
          </Grid>
        </Box>
        <Divider />

        {/* Primary Contact */}
        <Box sx={{ marginBottom: 3, marginTop: 3 }}>
          <Typography variant="h5" gutterBottom>
            Primary Contact
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">Name:</Typography>
              <Typography>{formDetails.primaryContact.name}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">Title:</Typography>
              <Typography>{formDetails.primaryContact.title}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">Email:</Typography>
              <Typography>{formDetails.primaryContact.email}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">Phone:</Typography>
              <Typography>{formDetails.primaryContact.phone}</Typography>
            </Grid>
          </Grid>
        </Box>
        <Divider />
          {/* Alternative Contact */}
     {formDetails.altContact && formDetails.altContact.name && (
      <Box sx={{ marginBottom: 3, marginTop: 3 }}>
        <Typography variant="h5" gutterBottom>
          Alternative Contact
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">Name:</Typography>
            <Typography>{formDetails.altContact.name}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">Title:</Typography>
            <Typography>{formDetails.altContact.title}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">Email:</Typography>
            <Typography>{formDetails.altContact.email}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">Phone:</Typography>
            <Typography>{formDetails.altContact.phone}</Typography>
          </Grid>
        </Grid>
      </Box>
    )}
    <Divider />

 {/* Organizational Overview */}
     <Box sx={{ marginBottom: 3, marginTop: 3 }}>
       <Typography variant="h5" gutterBottom>
         Organizational Overview
       </Typography>
      <Grid container spacing={2}>
         <Grid item xs={12} sm={6}>
           <Typography variant="subtitle1">Industry Sector:</Typography>
           <Typography>{formDetails.industrySector}</Typography>
         </Grid>
         <Grid item xs={12} sm={6}>
           <Typography variant="subtitle1">Description:</Typography>
          <Typography>{formDetails.description}</Typography>
         </Grid>
         <Grid item xs={12} sm={6}>
           <Typography variant="subtitle1">Operational Sites:</Typography>
           <Typography>{formDetails.operationalSites}</Typography>
         </Grid>
         <Grid item xs={12} sm={6}>
           <Typography variant="subtitle1">Total Employees:</Typography>
           <Typography>{formDetails.totalEmployees}</Typography>
        </Grid>
         <Grid item xs={12} sm={6}>
           <Typography variant="subtitle1">Fiscal Year:</Typography>
           <Typography>{formDetails.fiscalYear}</Typography>
         </Grid>
      </Grid>
     </Box>
     <Divider />
        {/* Emissions Profile */}
        <Box sx={{ marginBottom: 3, marginTop: 3 }}>
          <Typography variant="h5" gutterBottom>
            Emissions Profile
          </Typography>

          {/* Scope 1 */}
          <Typography variant="h6" gutterBottom>
            Scope 1 Emissions (Direct)
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography>Stationary Combustion:</Typography>
              <Typography>{formDetails.scope1.stationaryCombustion ? "Yes" : "No"}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography>Mobile Sources:</Typography>
              <Typography>{formDetails.scope1.mobileSources ? "Yes" : "No"}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography>Refrigeration and Air Conditioning:</Typography>
              <Typography>{formDetails.scope1.refrigerationandAirConditioning ? "Yes" : "No"}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography>Process Emissions:</Typography>
              <Typography>{formDetails.scope1.processemission ? "Yes" : "No"}</Typography>
            </Grid>
          </Grid>

          {/* Scope 2 */}
          <Typography variant="h6" gutterBottom sx={{ marginTop: 2 }}>
            Scope 2 Emissions (Indirect Energy Use)
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography>Electricity:</Typography>
              <Typography>{formDetails.scope2.electricity ? "Yes" : "No"}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography>Steam:</Typography>
              <Typography>{formDetails.scope2.steam ? "Yes" : "No"}</Typography>
            </Grid>
          </Grid>

          {/* Scope 3 */}
          <Typography variant="h6" gutterBottom sx={{ marginTop: 2 }}>
            Scope 3 Emissions (Other Indirect)
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography>Business Travel:</Typography>
              <Typography>{formDetails.scope3.businessTravel ? "Yes" : "No"}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography>Employee Commuting:</Typography>
              <Typography>{formDetails.scope3.employeeCommuting ? "Yes" : "No"}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography>Upstream Transportation and Distribution:</Typography>
              <Typography>{formDetails.scope3.upstreamTransportationandDistribution ? "Yes" : "No"}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography>Waste Generated in Operations:</Typography>
              <Typography>{formDetails.scope3.wasteGeneratedinOperations ? "Yes" : "No"}</Typography>
            </Grid>
          </Grid>
        </Box>
        <Divider />

        {/* Declaration */}
        <Box sx={{ marginTop: 3 }}>
          <Typography variant="h5" gutterBottom>
            Declaration
          </Typography>
          <Typography variant="subtitle1">Signature:</Typography>
          <Typography>{formDetails.signatureName}</Typography>
          <Typography variant="subtitle1" sx={{ marginTop: 1 }}>
            Date:
          </Typography>
          <Typography>{new Date(formDetails.date).toLocaleDateString()}</Typography>
        </Box>
      </Box>

      
      <Box
  sx={{
    position: "fixed",
    bottom: "20px",
    right: "20px",
  }}
>
  <Button variant="contained" onClick={downloadPDF}>
    Download as PDF
  </Button>
</Box>
    </>
  );
};

export default Formdetails;
