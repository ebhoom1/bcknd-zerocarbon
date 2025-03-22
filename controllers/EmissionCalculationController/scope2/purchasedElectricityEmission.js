// controllers/scope2/PurchasedElectricityEmission.js

const PurchasedElectricityModel = require("../../../models/emissionCalculation/PurchasedElectricityModel");

const getPurchasedElectricityEmission = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is required" });
    }

    const emissions = await PurchasedElectricityModel.find({ userId }).sort({ calculatedAt: -1 }).lean();

    if (!emissions || emissions.length === 0) {
      return res.status(404).json({ success: false, message: "No emission records found for this user." });
    }

    // ✅ Format the response for frontend
    const formatted = emissions.map((item, index) => ({
      serialNo: index + 1,
      electricityConsumptionKWh: item.electricityConsumptionKWh,
      emissionFactor: item.emissionFactor,
      emissionKgCO2e: item.emissionKgCO2e.toFixed(2),
      source: item.source,
    //   calculatedAt: new Date(item.calculatedAt).toLocaleString()
    }));

    return res.status(200).json({
      success: true,
      data: formatted
    });

  } catch (err) {
    console.error("Error fetching purchased electricity emissions:", err.message);
    return res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};

module.exports = { getPurchasedElectricityEmission };
