// controllers/scope2/getPurchasedSteamHeatCoolingEmission.js
const PurchasedSteamHeatCoolingModel = require("../../../models/emissionCalculation/PurchasedSteamHeatCoolingModel");

const getPurchasedSteamHeatCoolingEmission = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is required" });
    }

    const emissions = await PurchasedSteamHeatCoolingModel.find({ userId }).sort({ calculatedAt: -1 }).lean();

    if (!emissions || emissions.length === 0) {
      return res.status(404).json({ success: false, message: "No emission records found for this user." });
    }

    const formatted = emissions.map((item, index) => ({
      serialNo: index + 1,
      month:item.month,
      consumption: item.consumption,
      unit: item.unit,
      emissionFactor: item.emissionFactor,
      considerLosses: item.considerLosses ? "Yes" : "No",
      lossPercent: item.lossPercent,
      totalEmission: item.totalEmission.toFixed(2),
      calculatedAt: new Date(item.calculatedAt).toLocaleString()
    }));

    res.status(200).json({
      success: true,
      data: formatted
    });
  } catch (err) {
    console.error("Error fetching steam/heat/cooling emissions:", err.message);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};

module.exports = { getPurchasedSteamHeatCoolingEmission };
