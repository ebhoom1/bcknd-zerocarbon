import React, { useState } from "react";
import "./userform.css";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import Alert from "../../components/Alert/Alert";
import { useDispatch, useSelector } from "react-redux";
import { createUser } from "../../redux/features/user/UserSlice";
import ScopeQstns from "../../assets/data/ScopeQstn.json";
import industryOptions from "../../assets/data/industryOptions.json";
import {
  IconButton,
  Box,
  TextField,
  Button,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Checkbox,
  FormControlLabel,
  ListSubheader,
  MenuItem,
  Select,
  InputLabel,
  Radio,
  RadioGroup,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const UserForm = () => {
  const navigate=useNavigate();
  const [step, setStep] = useState(0);
  const user = useSelector((state) => state.auth.user);

  const dispatch = useDispatch();
  const { successMessage, error, loading } = useSelector((state) => state.user);
  const [showAltFields, setShowAltFields] = useState(false);

  const [formData, setFormData] = useState({
    companyName: "",
    companyAddress: "",
    primaryContact: {
      name: "",
      title: "",
      email: "",
      phone: "",
    },
    altContact: {
      name: "",
      title: "",
      email: "",
      phone: "",
    },
    industrySector: "",
    description: "",
    operationalSites: "",
    totalEmployees: "",
    fiscalYear: "",
    scope1: {
      stationaryCombustion: undefined,
      mobileSources: undefined,
      refrigerationandAirConditioning: undefined,
      processemission: undefined,
    },
    scope2: {
      electricity: undefined,
      steam: undefined,
    },
    scope3: {
      businessTravel: undefined,
      employeeCommuting: undefined,
      upstreamTransportationandDistribution: undefined,
      wasteGeneratedinOperations: undefined,
    },
    upstreamActivities:[],
    downstreamActivities:[],
    dataCollectionMethod: "",
    reportingFrequency: "",
    supportingDocuments: "",
    organizationalBoundaries: "",
    declarationConfirmation: false,
    signatureName: "",
    date: new Date().toISOString().split("T")[0],
  });

  const upstreamOptions = [
    "Purchased Goods and Services",
    "Capital Goods",
    "Fuel- and Energy-Related Activities (not included in Scope 1 or 2)",
    "Upstream Transportation and Distribution",
    "Waste Generated in Operations",
  ];
  
  const downstreamOptions = [
    "Downstream Transportation and Distribution",
    "Processing of Sold Products",
    "Use of Sold Products",
    "End-of-Life Treatment of Sold Products",
    "Downstream Leased Assets",
    "Franchises",
    "Investments",
  ];

  const steps = [
    "Company Info",
    "Organizational Overview",
    "Emissions Profile",
    "Data Management Preferences",
    "System Configuration Preferences",
  ];


    const handleCheckboxChange = (activityType, option) => {
      const updatedActivities = formData[activityType].includes(option)
        ? formData[activityType].filter((item) => item !== option)
        : [...formData[activityType], option];
  
      setFormData({
        ...formData,
        [activityType]: updatedActivities,
      });
    };

  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prevState) => {
      if (name.includes(".")) {
        const [group, field] = name.split(".");
        return {
          ...prevState,
          [group]: {
            ...prevState[group],
            [field]: type === "checkbox" ? checked : value,
          },
        };
      } else {
        return {
          ...prevState,
          [name]: type === "checkbox" ? checked : value,
        };
      }
    });
    console.log(formData.industrySector);
  };

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const handleSubmit = (e) => {
    console.log('heloo')
    e.preventDefault();
    const userId = user?.id; 
    console.log("userid:",userId)
    dispatch(createUser({ formData, userId })); 
  };
  
  const alertMessage = successMessage || error;

  return (
    <Box sx={{ maxWidth: 600, margin: "auto"}}>
      <Typography variant="h4" textAlign="center" gutterBottom>
        Add User
      </Typography>
      <Stepper activeStep={step} alternativeLabel className="fixed-stepper">
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Box sx={{ mt: 4 }}>
        {step === 0 && (
          <Box>
            <Typography variant="h6">Step 1: Company Information</Typography>
            <TextField
              fullWidth
              margin="normal"
              label="Enter your company name."
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Enter Street, city, state, postal code."
              name="companyAddress"
              value={formData.companyAddress}
              onChange={handleChange}
              multiline
              rows={3}
            />
            <Typography variant="subtitle1" sx={{ mt: 2 }}>
              Primary Contact
            </Typography>
            <TextField
              fullWidth
              margin="normal"
              label="Enter contact person’s name"
              name="primaryContact.name"
              value={formData.primaryContact.name}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Enter title (e.g., Sustainability Manager)."
              name="primaryContact.title"
              value={formData.primaryContact.title}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Enter contact email address"
              name="primaryContact.email"
              value={formData.primaryContact.email}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Enter contact phone number."
              name="primaryContact.phone"
              value={formData.primaryContact.phone}
              onChange={handleChange}
            />
            <Typography variant="subtitle1" sx={{ mt: 2 }}>
            Alternative Contact Person (if any) (Optional Section)
            <IconButton
          color="primary"
          onClick={() => setShowAltFields((prev) => !prev)}
        >
          {showAltFields ? <RemoveCircleOutlineIcon /> : <AddCircleOutlineIcon />}
        </IconButton>
            </Typography>
            {showAltFields&&(
              <Box>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Enter contact person’s name"
                  name="altContact.name"
                  value={formData.altContact.name}
                  onChange={handleChange}
                />
                <TextField
                  fullWidth
                  margin="normal"
                  label="Enter title (e.g., Sustainability Manager)."
                  name="altContact.title"
                  value={formData.altContact.title}
                  onChange={handleChange}
                />
                <TextField
                  fullWidth
                  margin="normal"
                  label="Enter contact email address"
                  name="altContact.email"
                  value={formData.altContact.email}
                  onChange={handleChange}
                />
                <TextField
                  fullWidth
                  margin="normal"
                  label="Enter contact phone number."
                  name="altContact.phone"
                  value={formData.altContact.phone}
                  onChange={handleChange}
                />
              </Box>
            )}
          </Box>
        )}

        {step === 1 && (
          <Box>
            <Typography variant="h6">
              Step 2: Organizational Overview
            </Typography>
            <InputLabel>Industry Sector</InputLabel>
            <Select
              name="industrySector"
              value={formData.industrySector}
              onChange={handleChange}
              fullWidth
            >
              {industryOptions.map((category, index) => [
                // Add the category as a non-selectable subheader
                <ListSubheader key={`${index}-header`}>
                  {category.category}
                </ListSubheader>,

                // Map the options to MenuItems
                ...category.options.map((option, i) => (
                  <MenuItem key={`${index}-${i}`} value={option}>
                    {option}
                  </MenuItem>
                )),
              ])}
            </Select>

            <TextField
              fullWidth
              margin="normal"
              label="Provide a summary of your business activities."
              name="description"
              value={formData.description}
              onChange={handleChange}
              multiline
              rows={3}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Enter the number of sites/facilities"
              name="operationalSites"
              value={formData.operationalSites}
              onChange={handleChange}
              type="number"
            />
            <TextField
              fullWidth
              margin="normal"
              label="Enter total employee count"
              name="totalEmployees"
              value={formData.totalEmployees}
              onChange={handleChange}
              type="number"
            />
            <InputLabel>Fiscal Year Calendar</InputLabel>
            <Select
              fullWidth
              margin="normal"
              name="fiscalYear"
              value={formData.fiscalYear}
              onChange={handleChange}
            >
              <MenuItem value="Jan-Dec">Jan-Dec</MenuItem>
              <MenuItem value="Apr-Mar"> Apr-Mar</MenuItem>
              <MenuItem value="Oct-Sep">Oct-Sep</MenuItem>
            </Select>
          </Box>
        )}

        {step === 2 &&
          ScopeQstns.map((qstn, index) => (
            <Box key={index}>
              <Typography variant="h6">Step 3: Emissions Profile</Typography>

              {/* Scope 1 Emissions (Direct Emissions) */}
              <Typography>Scope 1 Emissions (Direct Emissions)</Typography>

              {/* Stationary Combustion */}
              <Typography>{qstn.StationaryCombustion}</Typography>
              <FormControlLabel
                control={
                  <Checkbox
                    name="scope1.stationaryCombustion"
                    checked={formData.scope1.stationaryCombustion===true}
                    onChange={() =>
                      setFormData({
                        ...formData,
                        scope1: {
                          ...formData.scope1,
                          stationaryCombustion:
                            true,
                        },
                      })
                    }
                  />
                }
                label="Yes"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    name="scope1.stationaryCombustion"
                    checked={formData.scope1.stationaryCombustion===false}
                    onChange={() =>
                      setFormData({
                        ...formData,
                        scope1: {
                          ...formData.scope1,
                          stationaryCombustion:
                            false,
                        },
                      })
                    }
                  />
                }
                label="No"
              />

              {/* Mobile Sources */}
              <Typography>{qstn.MobileSources}</Typography>
              <FormControlLabel
                control={
                  <Checkbox
                    name="scope1.mobileSources"
                    checked={formData.scope1.mobileSources===true}
                    onChange={() =>
                      setFormData({
                        ...formData,
                        scope1: {
                          ...formData.scope1,
                          mobileSources: true,
                        },
                      })
                    }
                  />
                }
                label="Yes"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    name="scope1.mobileSources"
                    checked={formData.scope1.mobileSources===false}
                    onChange={() =>
                      setFormData({
                        ...formData,
                        scope1: {
                          ...formData.scope1,
                          mobileSources:false,
                        },
                      })
                    }
                  />
                }
                label="No"
              />

              {/* Refrigeration and Air Conditioning */}
              <Typography>{qstn.RefrigerationAndAirConditioning}</Typography>
              <FormControlLabel
                control={
                  <Checkbox
                    name="scope1.refrigerationandAirConditioning"
                    checked={formData.scope1.refrigerationandAirConditioning===true}
                    onChange={() =>
                      setFormData({
                        ...formData,
                        scope1: {
                          ...formData.scope1,
                          refrigerationandAirConditioning:
                            true,
                        },
                      })
                    }
                  />
                }
                label="Yes"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    name="scope1.refrigerationandAirConditioning"
                    checked={formData.scope1.refrigerationandAirConditioning===false}
                    onChange={() =>
                      setFormData({
                        ...formData,
                        scope1: {
                          ...formData.scope1,
                          refrigerationandAirConditioning:
                            false,
                        },
                      })
                    }
                  />
                }
                label="No"
              />

              {/* Process Emissions */}
              <Typography>{qstn.ProcessEmissions}</Typography>
              <FormControlLabel
                control={
                  <Checkbox
                    name="scope1.processEmission"
                    checked={formData.scope1.processemission===true}
                    onChange={() =>
                      setFormData({
                        ...formData,
                        scope1: {
                          ...formData.scope1,
                          processemission: true,
                        },
                      })
                    }
                  />
                }
                label="Yes"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    name="scope1.processemission"
                    checked={formData.scope1.processemission===false}
                    onChange={() =>
                      setFormData({
                        ...formData,
                        scope1: {
                          ...formData.scope1,
                          processemission: false,
                        },
                      })
                    }
                  />
                }
                label="No"
              />

              {/* Scope 2 Emissions (Indirect Energy Use) */}
              <Typography>Scope 2 Emissions (Indirect Energy Use)</Typography>

              {/* Electricity */}
              <Typography>{qstn.Electricity}</Typography>
              <FormControlLabel
                control={
                  <Checkbox
                    name="scope2.electricity"
                    checked={formData.scope2.electricity===true}
                    onChange={() =>
                      setFormData({
                        ...formData,
                        scope2: {
                          ...formData.scope2,
                          electricity:true,
                        },
                      })
                    }
                  />
                }
                label="Yes"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    name="scope2.electricity"
                    checked={formData.scope2.electricity===false}
                    onChange={() =>
                      setFormData({
                        ...formData,
                        scope2: {
                          ...formData.scope2,
                          electricity:false,
                        },
                      })
                    }
                  />
                }
                label="No"
              />

              {/* Steam */}
              <Typography>{qstn.Steam}</Typography>
              <FormControlLabel
                control={
                  <Checkbox
                    name="scope2.steam"
                    checked={formData.scope2.steam===true}
                    onChange={() =>
                      setFormData({
                        ...formData,
                        scope2: {
                          ...formData.scope2,
                          steam: true,
                        },
                      })
                    }
                  />
                }
                label="Yes"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    name="scope2.steam"
                    checked={formData.scope2.steam===false}
                    onChange={() =>
                      setFormData({
                        ...formData,
                        scope2: {
                          ...formData.scope2,
                          steam: false,
                        },
                      })
                    }
                  />
                }
                label="No"
              />

              {/* Scope 3 Emissions (Other Indirect Emissions) */}
              <Typography>
                Scope 3 Emissions (Other Indirect Emissions)
              </Typography>

              {/* Business Travel */}
              <Typography>{qstn.BusinessTravel}</Typography>
              <FormControlLabel
                control={
                  <Checkbox
                    name="scope3.businessTravel"
                    checked={formData.scope3.businessTravel===true}
                    onChange={() =>
                      setFormData({
                        ...formData,
                        scope3: {
                          ...formData.scope3,
                          businessTravel: true,
                        },
                      })
                    }
                  />
                }
                label="Yes"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    name="scope3.businessTravel"
                    checked={formData.scope3.businessTravel===false}
                    onChange={() =>
                      setFormData({
                        ...formData,
                        scope3: {
                          ...formData.scope3,
                          businessTravel:false,
                        },
                      })
                    }
                  />
                }
                label="No"
              />

              {/* Employee Commuting */}
              <Typography>{qstn.EmployeeCommuting}</Typography>
              <FormControlLabel
                control={
                  <Checkbox
                    name="scope3.employeeCommuting"
                    checked={formData.scope3.employeeCommuting===true}
                    onChange={() =>
                      setFormData({
                        ...formData,
                        scope3: {
                          ...formData.scope3,
                          employeeCommuting: true,
                        },
                      })
                    }
                  />
                }
                label="Yes"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    name="scope3.employeeCommuting"
                    checked={formData.scope3.employeeCommuting===false}
                    onChange={() =>
                      setFormData({
                        ...formData,
                        scope3: {
                          ...formData.scope3,
                          employeeCommuting: false,
                        },
                      })
                    }
                  />
                }
                label="No"
              />

              {/* Upstream Transportation and Distribution */}
              <Typography>
                {qstn.UpstreamTransportationAndDistribution}
              </Typography>
              <FormControlLabel
                control={
                  <Checkbox
                    name="scope3.upstreamTransportationandDistribution"
                    checked={
                      formData.scope3.upstreamTransportationandDistribution===true
                    }
                    onChange={() =>
                      setFormData({
                        ...formData,
                        scope3: {
                          ...formData.scope3,
                          upstreamTransportationandDistribution:
                            true
                        },
                      })
                    }
                  />
                }
                label="Yes"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    name="scope3.upstreamTransportationandDistribution"
                    checked={
                      formData.scope3.upstreamTransportationandDistribution===false
                    }
                    onChange={() =>
                      setFormData({
                        ...formData,
                        scope3: {
                          ...formData.scope3,
                          upstreamTransportationandDistribution:
                           false
                        },
                      })
                    }
                  />
                }
                label="No"
              />

              {/* wasteGeneratedinOperations */}
              <Typography>{qstn.WasteGeneratedInOperations}</Typography>
              <FormControlLabel
                control={
                  <Checkbox
                    name="scope3.wasteGeneratedinOperations"
                    checked={formData.scope3.wasteGeneratedinOperations===true}
                    onChange={() =>
                      setFormData({
                        ...formData,
                        scope3: {
                          ...formData.scope3,
                          wasteGeneratedinOperations:
                           true
                        },
                      })
                    }
                  />
                }
                label="Yes"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    name="scope3.wasteGeneratedinOperations"
                    checked={formData.scope3.wasteGeneratedinOperations===false}
                    onChange={() =>
                      setFormData({
                        ...formData,
                        scope3: {
                          ...formData.scope3,
                          wasteGeneratedinOperations:
                           false
                        },
                      })
                    }
                  />
                }
                label="No"
              />
              {/*multple option selection scope*/}
              <Typography variant="h6">Upstream Activities</Typography>
      {upstreamOptions.map((option) => (
        <FormControlLabel
          key={option}
          control={
            <Checkbox
              checked={formData.upstreamActivities.includes(option)}
              onChange={() => handleCheckboxChange("upstreamActivities", option)}
            />
          }
          label={option}
        />
      ))}

      <Typography variant="h6" sx={{ mt: 3 }}>
        Downstream Activities
      </Typography>
      {downstreamOptions.map((option) => (
        <FormControlLabel
          key={option}
          control={
            <Checkbox
              checked={formData.downstreamActivities.includes(option)}
              onChange={() =>
                handleCheckboxChange("downstreamActivities", option)
              }
            />
          }
          label={option}
        />
      ))}
            </Box>
          ))}

        {step === 3 && (
          <Box>
            <Typography variant="h6">
              Step 4: Data Management Preferences
            </Typography>
            <Typography>Current Data Collection Method</Typography>
            <RadioGroup
              name="dataCollectionMethod"
              value={formData.dataCollectionMethod}
              onChange={handleChange}
            >
              <FormControlLabel
                value="manual"
                control={<Radio />}
                label="Manual Entry"
              />
              <FormControlLabel
                value="automated"
                control={<Radio />}
                label="Automated Systems"
              />
              <FormControlLabel
                value="both"
                control={<Radio />}
                label="Combination of Both"
              />
            </RadioGroup>

            <InputLabel>Preferred Reporting Frequency</InputLabel>
            <Select
              fullWidth
              margin="normal"
              name="reportingFrequency"
              value={formData.reportingFrequency}
              onChange={handleChange}
            >
              <MenuItem value="Real-Time">Real-Time</MenuItem>
              <MenuItem value="Daily">Daily</MenuItem>
              <MenuItem value="Weekly">Weekly</MenuItem>
              <MenuItem value="Monthly">Monthly</MenuItem>
              <MenuItem value="Quarterly">Quarterly</MenuItem>
            </Select>

            <Typography>Do you have supporting documents?</Typography>
            <RadioGroup
              name="supportingDocuments"
              value={formData.supportingDocuments}
              onChange={handleChange}
            >
              <FormControlLabel value="yes" control={<Radio />} label="Yes" />
              <FormControlLabel value="no" control={<Radio />} label="No" />
            </RadioGroup>
          </Box>
        )}

        {step === 4 && (
          <Box>
            <Typography variant="h6">
              Step 5: System Configuration Preferences
            </Typography>
            <TextField
              fullWidth
              margin="normal"
              label="Describe the ownership or operational
              boundaries (e.g., operational control, equity share)."
              name="organizationalBoundaries"
              value={formData.organizationalBoundaries}
              onChange={handleChange}
              multiline
              rows={3}
            />
            <FormControlLabel
              control={
                <Checkbox
                  name="declarationConfirmation"
                  checked={formData.declarationConfirmation}
                  onChange={handleChange}
                />
              }
              label="I confirm that the information provided is accurate and complete to the best of my knowledge"
            />
            <TextField
              fullWidth
              margin="normal"
              label="Enter your full name as a declaration."
              name="signatureName"
              value={formData.signatureName}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />
          </Box>
        )}

        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
          <Button
            variant="contained"
            color="secondary"
            onClick={prevStep}
            disabled={step === 0}
          >
            Back
          </Button>
          {step === steps.length - 1 ? (
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              {loading ? <CircularProgress size={24} /> : "Submit Information"}{" "}
            </Button>
          ) : (
            <Button variant="contained" color="primary" onClick={nextStep}>
              Next
            </Button>
          )}
        </Box>
      </Box>
      {alertMessage && (
        <Alert
          message={alertMessage}
          severity={successMessage ? "success" : "error"}
        />
      )}

      
    </Box>
  );
};

export default UserForm;
