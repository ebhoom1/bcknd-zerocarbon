const FuelCombustion = require('../models/FuelCombustion');
const GWP = require('../models/GWP'); // To fetch GWP values

// Add new Fuel Combustion data with calculations
exports.addFuelCombustion = async (req, res) => {
  try {
    const {
      category, activity, fuel, NCV, CO2, CH4, N2O, unit, 
      fuelDensityLiter, fuelDensityM3, gwpId, assessmentType
    } = req.body;

    // Step 1: Calculate CO2, CH4, N2O per Kg/T
    const CO2_KgT = (NCV * CO2) / 1000;
    const CH4_KgT = (NCV * CH4) / 1000;
    const N2O_KgT = (NCV * N2O) / 1000;

    // Step 2: Fetch GWP value using gwpId and assessmentType
    const gwpData = await GWP.findById(gwpId).lean(); // Fetch GWP document
    if (!gwpData) {
      return res.status(404).json({ message: 'GWP data not found for the given ID' });
    }

    const assessment = gwpData.assessments.find(a => a.name.trim() === assessmentType.trim());
    if (!assessment) {
      return res.status(400).json({ message: `AssessmentType '${assessmentType}' not found` });
    }

    const gwpValue = parseFloat(assessment.value);
    if (isNaN(gwpValue)) {
      return res.status(400).json({ message: 'Invalid GWP value for the given assessmentType' });
    }

    // Step 3: Calculate CO2e using GWP value
    const CO2e = (CO2_KgT * gwpValue) + (CH4_KgT * gwpValue) + (N2O_KgT * gwpValue);

    // Step 4: Calculate densities for Kg/L and Kg/m³
    let CO2_KgL = null, CO2_Kgm3 = null, CH4_KgL = null, CH4_Kgm3 = null, N2O_KgL = null, N2O_Kgm3 = null;

    if (fuelDensityLiter) {
      CO2_KgL = (CO2_KgT * fuelDensityLiter) / 1000;
      CH4_KgL = (CH4_KgT * fuelDensityLiter) / 1000;
      N2O_KgL = (N2O_KgT * fuelDensityLiter) / 1000;
    }

    if (fuelDensityM3) {
      CO2_Kgm3 = (CO2_KgT * fuelDensityM3) / 1000;
      CH4_Kgm3 = (CH4_KgT * fuelDensityM3) / 1000;
      N2O_Kgm3 = (N2O_KgT * fuelDensityM3) / 1000;
    }

    // Step 5: Save all data to the database
    const newEntry = new FuelCombustion({
      category,
      activity,
      fuel,
      NCV,
      CO2,
      CH4,
      N2O,
      unit,
      gwpId,
      assessmentType,
      CO2_KgT,
      CH4_KgT,
      N2O_KgT,
      CO2e,
      fuelDensityLiter,
      fuelDensityM3,
      CO2_KgL,
      CO2_Kgm3,
      CH4_KgL,
      CH4_Kgm3,
      N2O_KgL,
      N2O_Kgm3,
    });

    await newEntry.save();
    res.status(201).json({ message: 'Fuel Combustion data added successfully!', data: newEntry });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Failed to add Fuel Combustion data', error: error.message });
  }
};


// Update Fuel Combustion data and recalculate
exports.updateFuelCombustion = async (req, res) => {
    try {
      const { id } = req.params; // Document ID to update
      const {
        NCV, CO2, CH4, N2O, gwpId, assessmentType,
        fuelDensityLiter, fuelDensityM3
      } = req.body;
  
      // Step 1: Find the existing Fuel Combustion data
      const fuelCombustion = await FuelCombustion.findById(id);
      if (!fuelCombustion) {
        return res.status(404).json({ message: 'Fuel Combustion data not found' });
      }
  
      // Step 2: Update fields if provided in the request
      if (NCV !== undefined) fuelCombustion.NCV = NCV;
      if (CO2 !== undefined) fuelCombustion.CO2 = CO2;
      if (CH4 !== undefined) fuelCombustion.CH4 = CH4;
      if (N2O !== undefined) fuelCombustion.N2O = N2O;
      if (fuelDensityLiter !== undefined) fuelCombustion.fuelDensityLiter = fuelDensityLiter;
      if (fuelDensityM3 !== undefined) fuelCombustion.fuelDensityM3 = fuelDensityM3;
      if (gwpId) fuelCombustion.gwpId = gwpId;
      if (assessmentType) fuelCombustion.assessmentType = assessmentType;
  
      // Step 3: Fetch GWP value using gwpId and assessmentType
      const gwpData = await GWP.findById(fuelCombustion.gwpId).lean();
      if (!gwpData) {
        return res.status(404).json({ message: 'GWP data not found for the provided ID' });
      }
  
      const assessment = gwpData.assessments.find(a => a.name.trim() === fuelCombustion.assessmentType.trim());
      if (!assessment) {
        return res.status(400).json({ message: 'Invalid assessmentType provided or not found in GWP data' });
      }
  
      const gwpValue = parseFloat(assessment.value);
      if (isNaN(gwpValue)) {
        return res.status(400).json({ message: 'Invalid GWP value for the given assessmentType' });
      }
  
      // Step 4: Recalculate dependent values
      const CO2_KgT = (fuelCombustion.NCV * fuelCombustion.CO2) / 1000;
      const CH4_KgT = (fuelCombustion.NCV * fuelCombustion.CH4) / 1000;
      const N2O_KgT = (fuelCombustion.NCV * fuelCombustion.N2O) / 1000;
      const CO2e = (CO2_KgT * gwpValue) + (CH4_KgT * gwpValue) + (N2O_KgT * gwpValue);
  
      let CO2_KgL = null, CO2_Kgm3 = null, CH4_KgL = null, CH4_Kgm3 = null, N2O_KgL = null, N2O_Kgm3 = null;
  
      if (fuelCombustion.fuelDensityLiter) {
        CO2_KgL = (CO2_KgT * fuelCombustion.fuelDensityLiter) / 1000;
        CH4_KgL = (CH4_KgT * fuelCombustion.fuelDensityLiter) / 1000;
        N2O_KgL = (N2O_KgT * fuelCombustion.fuelDensityLiter) / 1000;
      }
  
      if (fuelCombustion.fuelDensityM3) {
        CO2_Kgm3 = (CO2_KgT * fuelCombustion.fuelDensityM3) / 1000;
        CH4_Kgm3 = (CH4_KgT * fuelCombustion.fuelDensityM3) / 1000;
        N2O_Kgm3 = (N2O_KgT * fuelCombustion.fuelDensityM3) / 1000;
      }
  
      // Step 5: Update recalculated values in the document
      fuelCombustion.CO2_KgT = CO2_KgT;
      fuelCombustion.CH4_KgT = CH4_KgT;
      fuelCombustion.N2O_KgT = N2O_KgT;
      fuelCombustion.CO2e = CO2e;
  
      fuelCombustion.CO2_KgL = CO2_KgL;
      fuelCombustion.CO2_Kgm3 = CO2_Kgm3;
      fuelCombustion.CH4_KgL = CH4_KgL;
      fuelCombustion.CH4_Kgm3 = CH4_Kgm3;
      fuelCombustion.N2O_KgL = N2O_KgL;
      fuelCombustion.N2O_Kgm3 = N2O_Kgm3;
  
      // Step 6: Save updated document
      await fuelCombustion.save();
      res.status(200).json({ message: 'Fuel Combustion data updated successfully!', data: fuelCombustion });
    } catch (error) {
      console.error('Error:', error);
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
  