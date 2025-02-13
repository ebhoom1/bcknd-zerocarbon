const { analyseEmissionsReduction } = require("../utils/EmissionsReductionSimulatorGemini");

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
