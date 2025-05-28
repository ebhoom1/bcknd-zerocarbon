
const MobileCombustionEmission = require("../../models/emissionCalculation/mobileCombustionEmissionModel");
const StationaryCombustionEmission = require("../../models/emissionCalculation/stationaryCombustionEmissionModel");
const IndustrialProcessesEmission = require("../../models/emissionCalculation/industrialProcessesEmissionModel");
const FugitiveEmissionCalculation = require("../../models/emissionCalculation/fugitiveEmissionModel");

const calculateTotalEmissions = async (req, res) => {
  try {
    const { userId } = req.params;

    const monthlyEmissions = {}; // { "Apr-2025": totalCO2e }

    const accumulateCO2e = (records, extractMonth, extractCO2e) => {
      for (const record of records) {
        const month = extractMonth(record);
        const co2e = parseFloat(extractCO2e(record) || 0);
        if (!monthlyEmissions[month]) monthlyEmissions[month] = 0;
        monthlyEmissions[month] += co2e;
      }
    };

    // Scope 1 Sources
    const mobile = await MobileCombustionEmission.find({ userId });
    accumulateCO2e(mobile, r => r.month, r => r.emission?.CO2e);

    const stationary = await StationaryCombustionEmission.find({ userId });
    accumulateCO2e(stationary, r => r.month, r => r.emission?.totalCO2e);

    const industrial = await IndustrialProcessesEmission.find({ userId });
    accumulateCO2e(industrial, r => r.month, r => r.emission?.CO2e);

    const fugitive = await FugitiveEmissionCalculation.find({ userId });
    accumulateCO2e(fugitive, r => r.month, r => r.emission?.CO2e);

    // Round to 3 decimals
    const formatted = {};
    for (const [month, total] of Object.entries(monthlyEmissions)) {
      formatted[month] = parseFloat(total.toFixed(3));
    }

    return res.status(200).json({
      message: "Monthly CO2e emissions calculated successfully",
      monthlyEmissions: formatted,
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports = { calculateTotalEmissions };
