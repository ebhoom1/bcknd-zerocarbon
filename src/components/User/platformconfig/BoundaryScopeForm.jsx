import React, { useState } from "react";
import { TextField, Button, MenuItem,Box } from "@mui/material";
import { useDispatch } from "react-redux";
import { addBoundary } from "../../../redux/features/boundarySlice/BoundarySlice";
import { fetchBoundaries } from "../../../redux/features/boundarySlice/BoundarySlice";
import categories from "../../../assets/data/categories.json";
import subCategories from "../../../assets/data/subCategories.json";

const BoundaryScopeForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();

  const [boundary, setBoundary] = useState({
    name: "",
    type: "",
    controlApproach: "",
    location: "",
    comments: "",
  });

  const [scope, setScope] = useState({
    scopeType: "",
    category: "",
    subCategory: "",
    units: "",
    emissionFactor: "",
    comments: "",
  });

  const handleBoundaryChange = (e) => {
    const { name, value } = e.target;
    setBoundary({ ...boundary, [name]: value });
  };
  console.log(boundary);
  const handleScopeChange = (e) => {
    const { name, value } = e.target;
    setScope({ ...scope, [name]: value });
  };
  console.log(scope);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const boundaryWithScope = { boundary, scope };
    await dispatch(addBoundary(boundaryWithScope));
    await dispatch(fetchBoundaries());

    setBoundary({
      name: "",
      type: "",
      controlApproach: "",
      location: "",
      comments: "",
    });

    setScope({
      scopeType: "",
      category: "",
      subCategory: "",
      units: "",
      emissionFactor: "",
      comments: "",
    });
    setIsSubmitting(false);
  };

  return (
    <Box
      sx={{
      width: '300px', 
      height: '100vh', 
      backgroundColor: '#fff', 
      
      padding: '16px',  
      boxShadow: 3,  
      borderRadius: '8px',  
      overflow: 'auto',  
    }}
    >
    <form>
      <h3>Boundary Setup</h3>
      <TextField
        name="name"
        label="Boundary Name"
        value={boundary.name}
        onChange={handleBoundaryChange}
        fullWidth
        margin="normal"
      />
      <TextField
        select
        name="type"
        label="Boundary Type"
        value={boundary.type}
        onChange={handleBoundaryChange}
        fullWidth
        margin="normal"
      >
        <MenuItem value="Physical">Physical</MenuItem>
        <MenuItem value="Legal">Legal</MenuItem>
      </TextField>
      <TextField
        select
        name="controlApproach"
        label="Control Approach"
        value={boundary.controlApproach}
        onChange={handleBoundaryChange}
        fullWidth
        margin="normal"
      >
        <MenuItem value="Financial">Financial</MenuItem>
        <MenuItem value="Operational">Operational</MenuItem>
        <MenuItem value="Equity Share">Equity Share</MenuItem>
      </TextField>
      <TextField
        name="location"
        label="Location"
        value={boundary.location}
        onChange={handleBoundaryChange}
        fullWidth
        margin="normal"
      />
      <TextField
        name="comments"
        label="Comments"
        value={boundary.comments}
        onChange={handleBoundaryChange}
        fullWidth
        margin="normal"
        multiline
      />

      <h3>Scope Assignment</h3>
      <TextField
        select
        name="scopeType"
        label="Scope Type"
        value={scope.scopeType}
        onChange={handleScopeChange}
        fullWidth
        margin="normal"
      >
        {Object.keys(categories).map((scope) => (
          <MenuItem key={scope} value={scope}>
            {scope}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        select
        name="category"
        label="Category"
        value={scope.category}
        onChange={handleScopeChange}
        fullWidth
        margin="normal"
        disabled={!scope.scopeType}
      >
        {categories[scope.scopeType]?.map((category) => (
          <MenuItem key={category} value={category}>
            {category}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        select
        name="subCategory"
        label="Subcategory"
        value={scope.subCategory}
        onChange={handleScopeChange}
        fullWidth
        margin="normal"
        disabled={!scope.category}
      >
        {subCategories[scope.category]?.map((subCategory) => (
          <MenuItem key={subCategory} value={subCategory}>
            {subCategory}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        name="units"
        label="Units"
        value={scope.units}
        onChange={handleScopeChange}
        fullWidth
        margin="normal"
      />
      <TextField
        name="emissionFactor"
        label="Emission Factor"
        value={scope.emissionFactor}
        onChange={handleScopeChange}
        fullWidth
        margin="normal"
      />
      <TextField
        name="comments"
        label="Comments"
        value={scope.comments}
        onChange={handleScopeChange}
        fullWidth
        margin="normal"
        multiline
      />

      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        disabled={isSubmitting}
      >
        {isSubmitting ? "Submitting..." : "Submit"}
      </Button>
    </form>
    </Box>
  );
};

export default BoundaryScopeForm;
