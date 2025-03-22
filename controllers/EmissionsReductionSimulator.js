const { analyseEmissionsReduction } = require("../utils/EmissionsReductionSimulatorGemini");
const EmissionsSimulation = require("../models/EmissionsSimulation");


exports.calculateEmissionsReduction = async (req, res) => {
  try {
    const {
      strategyAdjustments,
      energyConsumption,
      fuelUsage,
      buildingEfficiency,
      vehicleFleet,
      wasteManagement,
      carbonCapture,
      financialConstraints,
      policyChanges,
    } = req.body;

    const analysedData = await analyseEmissionsReduction(
      strategyAdjustments,
      energyConsumption,
      fuelUsage,
      buildingEfficiency,
      vehicleFleet,
      wasteManagement,
      carbonCapture,
      financialConstraints,
      policyChanges
    );
console.log("analysedData ")
    if (analysedData) {
      res.status(200).json({
        message: "Emissions Reduction Simulation Completed Successfully",
        analysedData,
      });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      message: "An error occurred while analyzing emissions reduction simulation.",
      error: error.message,
    });
  }
};



exports.saveSimulation = async (req, res) => {
  try {
    const newSimulation = new EmissionsSimulation(req.body);
    await newSimulation.save();
    res.status(201).json({ message: "Simulation saved successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to save simulation" });
  }
};


exports.getSimulationsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const simulations = await EmissionsSimulation.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json(simulations);
  } catch (err) {
    console.error("Error fetching simulations:", err);
    res.status(500).json({ message: "Failed to fetch simulations" });
  }
};