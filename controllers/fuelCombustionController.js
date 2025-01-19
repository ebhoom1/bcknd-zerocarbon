const FuelCombustion = require('../models/FuelCombustion');
const GWP = require('../models/GWP'); // To fetch GWP values

// Add new Fuel Combustion data with calculations
exports.addFuelCombustion = async (req, res) => {
  try {
      const {
          category,
          activity,
          fuel,
          NCV,
          CO2,
          CH4,
          N2O,
          unit,
          fuelDensityLiter,
          fuelDensityM3,
          CO2Formula,
          CH4Formula,
          N2OFormula,
          source,
          reference,
          assessments, // Directly accept assessments from the user
      } = req.body;
      // Save the data as is into the database
      const newEntry = new FuelCombustion({
          category,
          activity,
          fuel,
          NCV,
          CO2,
          CH4,
          N2O,
          unit,
          fuelDensityLiter,
          fuelDensityM3,
          source,
          reference,
          assessments, // Save provided assessments without modification
      });

      await newEntry.save();
      console.log("newEntry:",newEntry);
      res.status(201).json({ message: 'Fuel Combustion data added successfully!', data: newEntry });
  } catch (error) {
      console.error('Error:', error.message);
      res.status(500).json({ message: 'Failed to add Fuel Combustion data', error: error.message });
  }
};

  
  
  


exports.updateFuelCombustion = async (req, res) => {
  try {
      const { id } = req.params; // Document ID to update
      const {
          category,
          activity,
          source,
          reference,
          NCV,
          CO2,
          CH4,
          N2O,
          fuelDensityLiter,
          fuelDensityM3,
          assessments, // Accept assessments directly from the user
      } = req.body;

      // Step 1: Find the existing Fuel Combustion data
      const fuelCombustion = await FuelCombustion.findById(id);
      if (!fuelCombustion) {
          return res.status(404).json({ message: 'Fuel Combustion data not found' });
      }

      // Step 2: Update fields if provided in the request
      if (category !== undefined) fuelCombustion.category = category;
      if (activity !== undefined) fuelCombustion.activity = activity;
      if (source !== undefined) fuelCombustion.source = source;
      if (reference !== undefined) fuelCombustion.reference = reference;
      if (NCV !== undefined) fuelCombustion.NCV = NCV;
      if (CO2 !== undefined) fuelCombustion.CO2 = CO2;
      if (CH4 !== undefined) fuelCombustion.CH4 = CH4;
      if (N2O !== undefined) fuelCombustion.N2O = N2O;
      if (fuelDensityLiter !== undefined) fuelCombustion.fuelDensityLiter = fuelDensityLiter;
      if (fuelDensityM3 !== undefined) fuelCombustion.fuelDensityM3 = fuelDensityM3;
      if (assessments !== undefined) fuelCombustion.assessments = assessments;

      // Step 3: Save updated document
      const updatedFuelCombustion = await fuelCombustion.save();

      res.status(200).json({
          message: 'Fuel Combustion data updated successfully!',
          data: updatedFuelCombustion,
      });
  } catch (error) {
      console.error('Error:', error.message);
      res.status(500).json({ message: 'Failed to update Fuel Combustion data', error: error.message });
  }
};



  

// Get all Fuel Combustion data
exports.getAllFuelCombustion = async (req, res) => {
    try {
      const data = await FuelCombustion.find();
      res.status(200).json({ message: 'All Fuel Combustion data fetched successfully', data });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'Failed to fetch Fuel Combustion data', error: error.message });
    }
  };

// Get Fuel Combustion data by ID
exports.getFuelCombustionById = async (req, res) => {
    try {
      const { id } = req.params;
      const data = await FuelCombustion.findById(id);
      if (!data) {
        return res.status(404).json({ message: 'Fuel Combustion data not found' });
      }
      res.status(200).json({ message: 'Fuel Combustion data fetched successfully', data });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'Failed to fetch Fuel Combustion data', error: error.message });
    }
  };
// Filter Fuel Combustion data based on category, activity, or fuel
exports.filterFuelCombustion = async (req, res) => {
    try {
      const { category, activity, fuel } = req.query;
  
      // Build dynamic filter object based on the query parameters provided
      const filter = {};
      if (category) filter.category = { $regex: category, $options: 'i' }; // Case-insensitive
      if (activity) filter.activity = { $regex: activity, $options: 'i' }; // Case-insensitive
      if (fuel) filter.fuel = { $regex: fuel, $options: 'i' }; // Case-insensitive
  
      // Fetch data based on the filter
      const data = await FuelCombustion.find(filter);
  
      if (data.length === 0) {
        return res.status(404).json({ message: 'No Fuel Combustion data found matching the criteria' });
      }
  
      res.status(200).json({
        message: 'Filtered Fuel Combustion data fetched successfully',
        data,
      });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'Failed to filter Fuel Combustion data', error: error.message });
    }
  };
// Delete Fuel Combustion data by ID
exports.deleteFuelCombustionById = async (req, res) => {
    try {
      const { id } = req.params;
      const deletedData = await FuelCombustion.findByIdAndDelete(id);
      if (!deletedData) {
        return res.status(404).json({ message: 'Fuel Combustion data not found' });
      }
      res.status(200).json({ message: 'Fuel Combustion data deleted successfully', data: deletedData });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'Failed to delete Fuel Combustion data', error: error.message });
    }
  };
  