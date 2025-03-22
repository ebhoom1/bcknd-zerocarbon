const { calculateRenewableImpact } = require("../utils/renewableEnergyCalculateGemini");
const RenewableEnergyCalculation = require("../models/RenewableEnergyCalculation");

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


exports.saveCalculation = async (req, res) => {
  try {
    const newCalculation = new RenewableEnergyCalculation(req.body);
    await newCalculation.save();
    res.status(201).json({ message: "Calculation saved successfully" });
  } catch (error) {
    console.error("Error saving calculation:", error);
    res.status(500).json({ message: "Server error while saving" });
  }
};

exports.getUserCalculations = async (req, res) => {
  try {
    const { userId } = req.params;
    const data = await RenewableEnergyCalculation.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching calculations:", error);
    res.status(500).json({ message: "Server error while fetching" });
  }
};
