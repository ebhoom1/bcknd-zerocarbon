// controllers/scope2/totalEmission.js

const PurchasedElectricityModel = require("../../../models/emissionCalculation/PurchasedElectricityModel");
const PurchasedSteamHeatCoolingModel = require("../../../models/emissionCalculation/PurchasedSteamHeatCoolingModel");

const getTotalScope2Emission = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is required" });
    }

    const electricityEmissions = await PurchasedElectricityModel.find({ userId }).lean();
    const steamEmissions = await PurchasedSteamHeatCoolingModel.find({ userId }).lean();

    const totalElectricityEmission = electricityEmissions.reduce((acc, item) => acc + (item.emissionKgCO2e || 0), 0);
    const totalSteamEmission = steamEmissions.reduce((acc, item) => acc + (item.totalEmission || 0), 0);
    const totalScope2Emission = totalElectricityEmission + totalSteamEmission;

    res.status(200).json({
      success: true,
      data: {
        totalElectricityEmission: totalElectricityEmission.toFixed(2),
        totalSteamEmission: totalSteamEmission.toFixed(2),
        totalScope2Emission: totalScope2Emission.toFixed(2)
      }
    });
  } catch (err) {
    console.error("Total Scope 2 Emission Error:", err.message);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};

module.exports = { getTotalScope2Emission };
