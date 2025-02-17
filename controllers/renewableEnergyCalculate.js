const { calculateRenewableImpact } = require("../utils/renewableEnergyCalculateGemini");

exports.calculateRenewableEnergyImpact = async (req, res) => {
  try {
    const {
      energyConsumption,
      renewablePercentage,
      solarWindFeasibility,
      gridEnergyMix,
      investmentBudget,
      governmentIncentives,
      batteryStoragePlans,
      siteConstraints
    } = req.body;

    const analysedData = await calculateRenewableImpact(
      energyConsumption,
      renewablePercentage,
      solarWindFeasibility,
      gridEnergyMix,
      investmentBudget,
      governmentIncentives,
      batteryStoragePlans,
      siteConstraints
    );

    if (analysedData) {
      console.log("analysedData:",analysedData);
      res.status(200).json({
        message: "Renewable Energy Impact Analysis Completed Successfully",
        analysedData,
      });
    }

  } catch (error) {
    console.error("Error in Renewable Energy Calculation:", error.message);
    res.status(500).json({
      message: "An error occurred while calculating renewable energy impact.",
      error: error.message,
    });
  }
};
